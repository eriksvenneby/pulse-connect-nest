-- Create loading quotes table
CREATE TABLE public.loading_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loading_quotes ENABLE ROW LEVEL SECURITY;

-- Create policy for everyone to read quotes
CREATE POLICY "Everyone can view active loading quotes" 
ON public.loading_quotes 
FOR SELECT 
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_loading_quotes_updated_at
BEFORE UPDATE ON public.loading_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the first quote
INSERT INTO public.loading_quotes (quote, author) VALUES (
  'Man is least himself when he talks in his own person. Give him a mask, and he will tell you the truth.',
  'Oscar Wilde'
);

-- Insert some additional quotes
INSERT INTO public.loading_quotes (quote, author) VALUES 
('The best way to find out if you can trust somebody is to trust them.', 'Ernest Hemingway'),
('Be yourself; everyone else is already taken.', 'Oscar Wilde'),
('We are all in the gutter, but some of us are looking at the stars.', 'Oscar Wilde'),
('The only way to do great work is to love what you do.', 'Steve Jobs'),
('Life is what happens to you while you''re busy making other plans.', 'John Lennon');