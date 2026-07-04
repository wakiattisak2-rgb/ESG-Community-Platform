-- Enable realtime on action_logs + log_action RPC for dashboard

ALTER TABLE public.action_logs REPLICA IDENTITY FULL;

-- Add to realtime publication (safe if already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'action_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.action_logs;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.log_action(
  p_user_id uuid,
  p_action_type text,
  p_note text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_xp integer;
  v_cc integer;
  v_log action_logs%ROWTYPE;
  v_profile profiles%ROWTYPE;
BEGIN
  v_xp := CASE p_action_type
    WHEN 'ev-transport' THEN 50
    WHEN 'recycling' THEN 30
    WHEN 'tree-volunteer' THEN 100
    WHEN 'energy-save' THEN 20
    WHEN 'water-save' THEN 15
    WHEN 'plant-based' THEN 25
    WHEN 'zero-waste' THEN 40
    WHEN 'green-commute' THEN 35
    ELSE 0
  END;

  v_cc := CASE p_action_type
    WHEN 'ev-transport' THEN 10
    WHEN 'recycling' THEN 5
    WHEN 'tree-volunteer' THEN 20
    WHEN 'energy-save' THEN 3
    WHEN 'water-save' THEN 3
    WHEN 'plant-based' THEN 5
    WHEN 'zero-waste' THEN 8
    WHEN 'green-commute' THEN 7
    ELSE 0
  END;

  IF v_xp = 0 THEN
    RAISE EXCEPTION 'Unknown action type: %', p_action_type;
  END IF;

  INSERT INTO action_logs (user_id, action_type, xp_earned, carbon_credits, note)
  VALUES (p_user_id, p_action_type, v_xp, v_cc, p_note)
  RETURNING * INTO v_log;

  UPDATE profiles
  SET xp = xp + v_xp,
      carbon_credits = carbon_credits + v_cc,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING * INTO v_profile;

  RETURN jsonb_build_object(
    'log', row_to_json(v_log),
    'profile', row_to_json(v_profile)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_action(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_action(uuid, text, text) TO anon;
