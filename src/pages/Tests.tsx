import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Brain, Clock, Award, Eye, EyeOff, PlayCircle, CheckCircle2, BarChart, RotateCcw, Zap, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { TokenDisplay } from "@/components/navigation/TokenDisplay";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Tests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [userResponses, setUserResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestsAndResponses = async () => {
      if (!user) return;

      try {
        // Fetch available tests
        const { data: tests, error: testsError } = await supabase
          .from('personality_tests')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (testsError) throw testsError;

        // Fetch user responses
        const { data: responses, error: responsesError } = await supabase
          .from('user_test_responses')
          .select('*')
          .eq('user_id', user.id);

        if (responsesError) throw responsesError;

        setAvailableTests(tests || []);
        setUserResponses(responses || []);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestsAndResponses();
  }, [user]);

  const getTestProgress = (testId: string) => {
    const response = userResponses.find(r => r.test_id === testId);
    return response ? 100 : 0;
  };

  const isTestCompleted = (testId: string) => {
    return userResponses.some(r => r.test_id === testId);
  };

  const handleStartTest = (testId: string) => {
    navigate(`/take-test/${testId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading tests...</div>
      </div>
    );
  }

  const completedTests = userResponses.length;
  const totalTests = availableTests.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Personality Tests</h1>
          <div className="text-muted-foreground text-sm">Discover your authentic self</div>
        </div>

        <TokenDisplay />
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progress Overview */}
        <Card className="p-6 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent">Your Progress</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{completedTests}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{totalTests}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Overall Progress</span>
              <span>{totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0}%</span>
            </div>
            <Progress value={totalTests > 0 ? (completedTests / totalTests) * 100 : 0} className="w-full" />
          </div>
        </Card>

        {/* Quick Action */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {completedTests === 0 
                ? "Ready to get started? Take your first personality test to begin browsing matches."
                : "Discover more about yourself with additional personality tests."
              }
            </p>
            {availableTests.length > 0 && (
              <Button 
                className="w-full" 
                onClick={() => {
                  const firstIncompleteTest = availableTests.find(test => !isTestCompleted(test.id));
                  if (firstIncompleteTest) {
                    handleStartTest(firstIncompleteTest.id);
                  }
                }}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {completedTests === 0 ? "Start First Test" : "Continue Testing"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Tests List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent">Available Tests</h2>
          
          {availableTests.map((test) => {
            const completed = isTestCompleted(test.id);
            const progress = getTestProgress(test.id);
            const questionCount = Array.isArray(test.questions) ? test.questions.length : 0;
            
            return (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{test.category}</Badge>
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{test.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{test.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                          {questionCount} questions
                        </span>
                        <span className="text-sm font-medium">
                          {progress}%
                        </span>
                      </div>
                      
                      <Progress value={progress} className="mb-4" />
                      
                      <div className="flex gap-2">
                        {completed ? (
                          <>
                            <Button variant="outline" size="sm">
                              <BarChart className="mr-2 h-4 w-4" />
                              View Results
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartTest(test.id)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Retake
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleStartTest(test.id)}
                          >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Start Test
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}