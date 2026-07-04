import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { mockPersonas } from '@/data/mockUsers'
import type { UserProfile } from '@/types'

export function SimpleLoginModal() {
  const { t } = useTranslation('auth')
  const { t: tc } = useTranslation('common')
  const { showLoginModal, setShowLoginModal, login } = useAppStore()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handlePersonaLogin = (persona: UserProfile) => {
    login(persona)
  }

  const handleCustomLogin = () => {
    if (!displayName.trim()) {
      setError(t('required'))
      return
    }
    const initials = displayName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    login({
      id: `user-${Date.now()}`,
      displayName: displayName.trim(),
      email: email.trim() || 'guest@aetros.io',
      role: 'member',
      avatarInitials: initials || 'U',
    })
    setDisplayName('')
    setEmail('')
    setError('')
  }

  return (
    <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title={t('title')}>
      <p className="text-cosmic-dim text-sm mb-6">{t('subtitle')}</p>

      <div className="mb-6">
        <p className="font-mono text-xs text-aurora-neon uppercase tracking-wider mb-3">
          {t('selectPersona')}
        </p>
        <div className="grid grid-cols-1 gap-2">
          {mockPersonas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handlePersonaLogin(persona)}
              className="flex items-center justify-between p-3 rounded-lg border border-glass-border bg-space-elevated hover:border-aurora-neon/40 transition-all cursor-pointer text-left"
            >
              <div>
                <div className="text-pure-white text-sm">{persona.displayName}</div>
                <div className="text-cosmic-faint text-xs">{persona.email}</div>
              </div>
              <span className="font-mono text-xs text-aurora-neon">
                {tc(`roles.${persona.role}`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-glass-border pt-4">
        <p className="font-mono text-xs text-cosmic-dim uppercase tracking-wider mb-3">
          {t('customLogin')}
        </p>
        <div className="space-y-3">
          <input
            type="text"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setError('') }}
            placeholder={t('displayName')}
            className="w-full px-4 py-2.5 rounded-lg bg-space-black border border-glass-border text-cosmic-smoke focus:border-aurora-neon/50 focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            className="w-full px-4 py-2.5 rounded-lg bg-space-black border border-glass-border text-cosmic-smoke focus:border-aurora-neon/50 focus:outline-none"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button className="w-full" onClick={handleCustomLogin}>
            {t('enter')} ➔
          </Button>
        </div>
      </div>
    </Modal>
  )
}
