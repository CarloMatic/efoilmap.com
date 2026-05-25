-- Enable authenticated users to delete their own spots, or the admin to delete any spot
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spots' AND policyname = 'Users can delete their own spots or admin can delete'
  ) THEN
    CREATE POLICY "Users can delete their own spots or admin can delete"
      ON public.spots FOR DELETE
      USING (
        auth.role() = 'authenticated' AND (
          auth.uid() = user_id OR
          auth.uid() = created_by OR
          auth.jwt() ->> 'email' = 'callematic@gmail.com'
        )
      );
  END IF;
END $$;
