-- Create personality tests table
CREATE TABLE public.personality_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  scoring_rules JSONB NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create user test responses table
CREATE TABLE public.user_test_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_id UUID NOT NULL REFERENCES public.personality_tests(id),
  responses JSONB NOT NULL,
  score JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, test_id)
);

-- Enable RLS
ALTER TABLE public.personality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_test_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for personality_tests
CREATE POLICY "Everyone can view active personality tests" 
ON public.personality_tests 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for user_test_responses
CREATE POLICY "Users can view their own test responses" 
ON public.user_test_responses 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own test responses" 
ON public.user_test_responses 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own test responses" 
ON public.user_test_responses 
FOR UPDATE 
USING (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_personality_tests_updated_at
BEFORE UPDATE ON public.personality_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample personality test
INSERT INTO public.personality_tests (title, description, questions, scoring_rules, category) VALUES (
  'Big Five Personality Test',
  'Discover your personality across five major dimensions',
  '[
    {
      "id": 1,
      "question": "I am outgoing and sociable",
      "type": "scale",
      "options": [
        {"value": 1, "label": "Strongly Disagree"},
        {"value": 2, "label": "Disagree"},
        {"value": 3, "label": "Neutral"},
        {"value": 4, "label": "Agree"},
        {"value": 5, "label": "Strongly Agree"}
      ],
      "dimension": "extraversion"
    },
    {
      "id": 2,
      "question": "I am reserved and quiet",
      "type": "scale",
      "options": [
        {"value": 1, "label": "Strongly Disagree"},
        {"value": 2, "label": "Disagree"},
        {"value": 3, "label": "Neutral"},
        {"value": 4, "label": "Agree"},
        {"value": 5, "label": "Strongly Agree"}
      ],
      "dimension": "extraversion",
      "reverse": true
    },
    {
      "id": 3,
      "question": "I am helpful and unselfish with others",
      "type": "scale",
      "options": [
        {"value": 1, "label": "Strongly Disagree"},
        {"value": 2, "label": "Disagree"},
        {"value": 3, "label": "Neutral"},
        {"value": 4, "label": "Agree"},
        {"value": 5, "label": "Strongly Agree"}
      ],
      "dimension": "agreeableness"
    },
    {
      "id": 4,
      "question": "I do a thorough job",
      "type": "scale",
      "options": [
        {"value": 1, "label": "Strongly Disagree"},
        {"value": 2, "label": "Disagree"},
        {"value": 3, "label": "Neutral"},
        {"value": 4, "label": "Agree"},
        {"value": 5, "label": "Strongly Agree"}
      ],
      "dimension": "conscientiousness"
    },
    {
      "id": 5,
      "question": "I am relaxed and handle stress well",
      "type": "scale",
      "options": [
        {"value": 1, "label": "Strongly Disagree"},
        {"value": 2, "label": "Disagree"},
        {"value": 3, "label": "Neutral"},
        {"value": 4, "label": "Agree"},
        {"value": 5, "label": "Strongly Agree"}
      ],
      "dimension": "neuroticism",
      "reverse": true
    }
  ]',
  '{
    "dimensions": {
      "extraversion": {"min": 0, "max": 10},
      "agreeableness": {"min": 0, "max": 10},
      "conscientiousness": {"min": 0, "max": 10},
      "neuroticism": {"min": 0, "max": 10},
      "openness": {"min": 0, "max": 10}
    }
  }',
  'personality'
);

-- Create function to check if user has completed at least one test
CREATE OR REPLACE FUNCTION public.user_has_completed_test(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.user_test_responses 
    WHERE user_id = user_uuid
  );
$$;