import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  question: string;
  type: string;
  options: Array<{
    value: number;
    label: string;
  }>;
  dimension: string;
  reverse?: boolean;
}

interface PersonalityTest {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  scoring_rules: any;
  category: string;
}

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState<PersonalityTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) {
        // If no specific test ID, fetch the first available test
        const { data, error } = await supabase
          .from('personality_tests')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching test:', error);
          toast.error('Failed to load test');
          navigate('/tests');
          return;
        }
        
        setTest({
          ...data,
          questions: data.questions as unknown as Question[],
          scoring_rules: data.scoring_rules
        });
      } else {
        const { data, error } = await supabase
          .from('personality_tests')
          .select('*')
          .eq('id', testId)
          .single();
        
        if (error) {
          console.error('Error fetching test:', error);
          toast.error('Failed to load test');
          navigate('/tests');
          return;
        }
        
        setTest({
          ...data,
          questions: data.questions as unknown as Question[],
          scoring_rules: data.scoring_rules
        });
      }
      
      setLoading(false);
    };

    fetchTest();
  }, [testId, navigate]);

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (!test || currentQuestion >= test.questions.length - 1) return;
    setCurrentQuestion(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion <= 0) return;
    setCurrentQuestion(prev => prev - 1);
  };

  const calculateScore = () => {
    if (!test) return {};
    
    const scores: Record<string, number> = {};
    const dimensions = Object.keys(test.scoring_rules.dimensions);
    
    // Initialize scores
    dimensions.forEach(dim => {
      scores[dim] = 0;
    });
    
    // Calculate scores based on responses
    test.questions.forEach(question => {
      const response = responses[question.id];
      if (response !== undefined) {
        const score = question.reverse ? (6 - response) : response;
        scores[question.dimension] = (scores[question.dimension] || 0) + score;
      }
    });
    
    return scores;
  };

  const handleSubmit = async () => {
    if (!test || !user) return;
    
    // Check if all questions are answered
    const unansweredQuestions = test.questions.filter(q => responses[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const score = calculateScore();
      
      const { error } = await supabase
        .from('user_test_responses')
        .upsert({
          user_id: user.id,
          test_id: test.id,
          responses: responses,
          score: score
        });
      
      if (error) throw error;
      
      toast.success('Test completed successfully!');
      navigate('/tests');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading test...</div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Test not found</div>
      </div>
    );
  }

  const currentQuestionData = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const isLastQuestion = currentQuestion === test.questions.length - 1;
  const currentResponse = responses[currentQuestionData.id];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tests')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tests
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{test.title}</span>
            <span>Question {currentQuestion + 1} of {test.questions.length}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestionData.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={currentResponse?.toString() || ""}
              onValueChange={(value) => handleResponseChange(currentQuestionData.id, value)}
            >
              {currentQuestionData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`option-${option.value}`}
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!currentResponse || submitting}
              className="flex items-center gap-2"
            >
              {submitting ? 'Submitting...' : 'Complete Test'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentResponse}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;