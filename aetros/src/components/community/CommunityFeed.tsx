import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowUp, MessageCircle, Share2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import type { EsgTopic } from '@/types'

export function CommunityFeed() {
  const { t } = useTranslation('community')
  const { t: tc } = useTranslation('common')
  const {
    feedPosts,
    selectedTopic,
    upvotePost,
    canPostExpert,
    createPost,
    canModerate,
    approvePost,
    rejectPost,
  } = useAppStore()
  const [newPost, setNewPost] = useState('')
  const [postTopic, setPostTopic] = useState<EsgTopic>('environment')

  const filtered = feedPosts.filter(
    (p) =>
      (selectedTopic === 'all' || p.topic === selectedTopic) &&
      (p.status === 'approved' || canModerate())
  )

  const pendingPosts = feedPosts.filter((p) => p.status === 'pending')

  const handlePost = () => {
    if (!newPost.trim()) return
    createPost(newPost.trim(), postTopic)
    setNewPost('')
  }

  return (
    <div className="space-y-6">
      {canModerate() && pendingPosts.length > 0 && (
        <GlassCard className="border-aurora-neon/30">
          <h3 className="font-display text-lg text-aurora-neon mb-4">{t('moderatorPanel')}</h3>
          <div className="space-y-3">
            {pendingPosts.map((post) => (
              <div key={post.id} className="p-3 bg-space-black rounded-lg border border-glass-border">
                <p className="text-cosmic-smoke text-sm mb-2">{post.content}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approvePost(post.id)}>{t('approve')}</Button>
                  <Button size="sm" variant="ghost" onClick={() => rejectPost(post.id)}>{t('reject')}</Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {canPostExpert() && (
        <GlassCard>
          <h3 className="font-display text-lg text-pure-white mb-3">{t('createPost')}</h3>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={t('postPlaceholder')}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-space-black border border-glass-border text-cosmic-smoke focus:border-aurora-neon/50 focus:outline-none resize-none mb-3"
          />
          <div className="flex flex-wrap gap-2 mb-3">
            {(['environment', 'social', 'governance'] as const).map((topic) => (
              <button
                key={topic}
                onClick={() => setPostTopic(topic)}
                className={`px-3 py-1 rounded-full text-xs font-mono cursor-pointer border ${
                  postTopic === topic
                    ? 'bg-aurora-neon/20 text-aurora-neon border-aurora-neon/40'
                    : 'bg-transparent text-cosmic-dim border-glass-border'
                }`}
              >
                {tc(`topics.${topic}`)}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={handlePost}>{t('submitPost')}</Button>
        </GlassCard>
      )}

      <div className="space-y-4">
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard hover={false}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-pure-white font-medium">{post.authorName}</span>
                    {post.organization && (
                      <Badge variant="muted">{post.organization}</Badge>
                    )}
                    <Badge variant="muted">{tc(`topics.${post.topic}`)}</Badge>
                  </div>
                  <span className="text-cosmic-faint text-xs font-mono">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-cosmic-smoke mb-4 leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => upvotePost(post.id)}
                  className={`flex items-center gap-1.5 text-sm bg-transparent border-none cursor-pointer transition-colors ${
                    post.hasUpvoted ? 'text-aurora-neon' : 'text-cosmic-dim hover:text-aurora-neon'
                  }`}
                >
                  <ArrowUp size={16} className={post.hasUpvoted ? 'drop-shadow-[0_0_6px_#00FF66]' : ''} />
                  {post.upvotes}
                </motion.button>
                <span className="flex items-center gap-1.5 text-cosmic-dim text-sm">
                  <MessageCircle size={16} /> {post.comments}
                </span>
                <button className="flex items-center gap-1.5 text-cosmic-dim text-sm bg-transparent border-none cursor-pointer hover:text-aurora-neon">
                  <Share2 size={16} /> {t('share')}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
