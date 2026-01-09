-- Run this SQL in your Supabase Dashboard -> SQL Editor

-- Add is_pinned column if it doesn't exist
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- Add is_archived column if it doesn't exist
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Optional: Create an index for performance if you have many conversations
CREATE INDEX IF NOT EXISTS idx_conversations_user_archived 
ON public.conversations(user_id, is_archived);
