-- FIX USER DELETION ISSUE (Foreign Key Constraints)
-- This script modifies your database to allow deleting users by automatically removing their data.

-- 1. Modify 'conversations' table to cascade delete when a user is deleted
ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;

ALTER TABLE public.conversations
ADD CONSTRAINT conversations_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 2. Modify 'messages' table to cascade delete when a conversation is deleted
-- (This is usually already strict, but good to ensure)
ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;

ALTER TABLE public.messages
ADD CONSTRAINT messages_conversation_id_fkey
FOREIGN KEY (conversation_id)
REFERENCES public.conversations(id)
ON DELETE CASCADE;

-- 3. VERIFY RLS POLICIES FOR DELETION
-- Ensure users can delete their own conversations (optional but good practice)
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;
CREATE POLICY "Users can delete own conversations"
ON public.conversations FOR DELETE
USING (auth.uid() = user_id);
