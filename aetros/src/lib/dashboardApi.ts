import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ActionLog } from '@/types'
import { getActionById } from '@/data/mockActions'

export interface LogActionResult {
  log: ActionLog
  xp: number
  carbonCredits: number
}

function mapRow(row: Record<string, unknown>): ActionLog {
  return {
    id: String(row.id),
    actionType: String(row.action_type),
    xpEarned: Number(row.xp_earned),
    carbonCredits: Number(row.carbon_credits),
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

  const { data, error } = await supabase.rpc('log_action', {
    p_user_id: userId,
    p_action_type: actionTypeId,
    p_note: note ?? null,
  })

  if (error) throw error

  const payload = data as {
    log: Record<string, unknown>
    profile: { xp: number; carbon_credits: number }
  }

  return {
    log: mapRow(payload.log),
    xp: payload.profile.xp,
    carbonCredits: payload.profile.carbon_credits,
  }
}

export function subscribeActionLogs(
  userId: string,
  onInsert: (log: ActionLog) => void
): (() => void) | null {
  if (!isSupabaseConfigured() || !supabase) return null

  const channel = supabase
    .channel(`action_logs:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'action_logs',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onInsert(mapRow(payload.new as Record<string, unknown>))
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
