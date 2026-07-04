import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ActionLog } from '@/types'
import { getActionById } from '@/data/mockActions'

export interface LogActionResult {
  log: ActionLog
  xp: number
  carbonCredits: number
}

function mapActionsLogRow(row: Record<string, unknown>): ActionLog {
  return {
    id: String(row.id),
    actionType: String(row.action_type),
    xpEarned: Number(row.xp_awarded ?? row.xp_earned),
    carbonCredits: Number(row.credits_awarded ?? row.carbon_credits),
    note: row.note ? String(row.note) : undefined,
    createdAt: String(row.created_at),
  }
}

export async function logActionRpc(
  userId: string,
  actionTypeId: string,
  note?: string
): Promise<LogActionResult | null> {
  if (!isSupabaseConfigured() || !supabase) return null

  const action = getActionById(actionTypeId)
  if (!action) return null

  const { data, error } = await supabase.rpc('log_action', {
    p_action_type: actionTypeId,
    p_xp: action.xp,
    p_credits: action.carbonCredits,
    p_note: note ?? null,
  })

  if (error) throw error

  const row = data as Record<string, unknown>

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('xp, carbon_credits')
    .eq('id', userId)
    .single()

  if (profileError) throw profileError

  return {
    log: mapActionsLogRow(row),
    xp: Number(profile.xp),
    carbonCredits: Number(profile.carbon_credits),
  }
}

export function subscribeActionLogs(
  userId: string,
  onInsert: (log: ActionLog) => void
): (() => void) | null {
  if (!isSupabaseConfigured() || !supabase) return null

  const channel = supabase
    .channel(`actions_log:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'actions_log',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onInsert(mapActionsLogRow(payload.new as Record<string, unknown>))
      }
    )
    .subscribe()

  return () => {
    if (supabase) supabase.removeChannel(channel)
  }
}

export function createLocalLog(actionTypeId: string, note?: string): LogActionResult | null {
  const action = getActionById(actionTypeId)
  if (!action) return null

  const log: ActionLog = {
    id: `log-${Date.now()}`,
    actionType: actionTypeId,
    xpEarned: action.xp,
    carbonCredits: action.carbonCredits,
    note,
    createdAt: new Date().toISOString(),
  }

  return {
    log,
    xp: action.xp,
    carbonCredits: action.carbonCredits,
  }
}
