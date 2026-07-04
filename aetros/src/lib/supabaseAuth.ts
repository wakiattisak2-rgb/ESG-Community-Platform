import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { defaultMember } from '@/data/mockUsers'
import type { UserProfile } from '@/types'

function initialsFromName(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'EX'
  )
}

export async function initSupabaseSession(): Promise<{
  user: UserProfile
  xp: number
  carbonCredits: number
} | null> {
  if (!isSupabaseConfigured() || !supabase) return null

  const { data: sessionData } = await supabase.auth.getSession()
  let session = sessionData.session

  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error || !data.session) {
      console.warn('Supabase anonymous sign-in failed:', error?.message)
      return null
    }
    session = data.session
  }

  const uid = session.user.id

  const { data: existing, error: readError } = await supabase
    .from('profiles')
    .select('display_name, xp, carbon_credits')
    .eq('id', uid)
    .maybeSingle()

  if (readError) {
    console.warn('Supabase profile read failed:', readError.message)
    return null
  }

  if (!existing) {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: uid,
      display_name: defaultMember.displayName,
      locale: 'th',
      xp: 0,
      carbon_credits: 50,
    })
    if (insertError) {
      console.warn('Supabase profile insert failed:', insertError.message)
      return null
    }
  }

  const displayName = existing?.display_name ?? defaultMember.displayName
  const xp = existing?.xp ?? 0
  const carbonCredits = existing?.carbon_credits ?? 50

  return {
    user: {
      id: uid,
      displayName,
      email: session.user.email ?? defaultMember.email,
      role: 'member',
      avatarInitials: initialsFromName(displayName),
    },
    xp,
    carbonCredits,
  }
}
