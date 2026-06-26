'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const DM_CHAR_LIMIT = 1000

interface ReelConfig {
  trigger_keywords: string[]
  dm_message: string
  comment_reply: string
  active: boolean
  delay_seconds: number
  show_follow_button: boolean
}

interface Reel {
  id: string
  thumbnail_url: string
  permalink: string
  caption: string
  config: ReelConfig
}

interface Stats {
  total_reels: number
  configured: number
  using_default: number
  active_count: number
}

const THEMES = {
  light: {
    bg: '#F7F5F1', surface: '#FFFFFF', surface2: '#ECE9E2', ink: '#1C1B19',
    inkSoft: '#5B564C', muted: '#8C8579', line: '#E6E2D8', accent: '#D4572A',
    accentSoft: '#FBEAE2', success: '#2F6F4E', successSoft: '#E8F0EA',
    danger: '#A32D2D',
  },
  dark: {
    bg: '#15140F', surface: '#1D1B15', surface2: '#242118', ink: '#F3F0E8',
    inkSoft: '#B8B2A2', muted: '#7A7464', line: '#322E24', accent: '#E8884F',
    accentSoft: '#2E2117', success: '#6FA98C', successSoft: '#1B2620',
    danger: '#E2837F',
  }
}

export default function Dashboard() {
  const [reels, setReels] = useState<Reel[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingReel, setEditingReel] = useState<Reel | null>(null)
  const [keywordInput, setKeywordInput] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ReelConfig>({
    trigger_keywords: [],
    dm_message: '',
    comment_reply: '',
    active: true,
    delay_seconds: 0,
    show_follow_button: true
  })

  const t = THEMES[theme]

  useEffect(() => {
    const saved = window.localStorage.getItem('dashboard-theme')
    if (saved === 'light' || saved === 'dark') setTheme(saved)
    fetchData()
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    window.localStorage.setItem('dashboard-theme', next)
  }

  const fetchData = async () => {
    try {
      const [reelsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/reels`),
        axios.get(`${API_URL}/api/stats`)
      ])
      setReels(reelsRes.data.reels)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (reel: Reel) => {
    setEditingReel(reel)
    setFormData({
      trigger_keywords: reel.config.trigger_keywords || [],
      dm_message: reel.config.dm_message || '',
      comment_reply: reel.config.comment_reply || '',
      active: reel.config.active ?? false,
      delay_seconds: reel.config.delay_seconds || 0,
      show_follow_button: reel.config.show_follow_button ?? true
    })
    setKeywordInput('')
  }

  const closeModal = () => {
    setEditingReel(null)
    setKeywordInput('')
  }

  const addKeyword = () => {
    const word = keywordInput.trim().toLowerCase()
    if (word && !formData.trigger_keywords.includes(word)) {
      setFormData({ ...formData, trigger_keywords: [...formData.trigger_keywords, word] })
    }
    setKeywordInput('')
  }

  const removeKeyword = (word: string) => {
    setFormData({ ...formData, trigger_keywords: formData.trigger_keywords.filter(k => k !== word) })
  }

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword()
    }
  }

  const handleSave = async () => {
    if (!editingReel) return
    try {
      await axios.put(`${API_URL}/api/reels/${editingReel.id}`, formData)
      await fetchData()
      closeModal()
    } catch (error) {
      console.error('Failed to update reel:', error)
    }
  }

  // Quick toggle directly from the card, without opening the modal.
  // Sends the reel's existing config unchanged, with only `active` flipped.
  const quickToggleActive = async (e: React.MouseEvent, reel: Reel) => {
    e.stopPropagation()
    setTogglingId(reel.id)
    const updated: ReelConfig = {
      trigger_keywords: reel.config.trigger_keywords || [],
      dm_message: reel.config.dm_message || '',
      comment_reply: reel.config.comment_reply || '',
      active: !reel.config.active,
      delay_seconds: reel.config.delay_seconds || 0,
      show_follow_button: reel.config.show_follow_button ?? true
    }
    try {
      await axios.put(`${API_URL}/api/reels/${reel.id}`, updated)
      await fetchData()
    } catch (error) {
      console.error('Failed to toggle reel:', error)
    } finally {
      setTogglingId(null)
    }
  }

  const charCount = formData.dm_message.length
  const charsOver = charCount > DM_CHAR_LIMIT

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: `3px solid ${t.line}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          <div style={{ color: t.inkSoft, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Loading your reels...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg, transition: 'background 0.2s' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '48px 32px', fontFamily: 'Inter, sans-serif', color: t.ink }}>

        <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '40px', paddingBottom: '24px', borderBottom: `1px solid ${t.line}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '30px', letterSpacing: '-0.01em', margin: 0 }}>Reel automations</h1>
            <span style={{ fontSize: '13px', color: t.muted, fontFamily: 'JetBrains Mono, monospace' }}>tekno_buddy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '13px', color: t.inkSoft, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.success, display: 'inline-block' }}></span>
              Connected · webhook live
            </div>
            <div
              onClick={toggleTheme}
              role="button"
              title="Toggle light / dark theme"
              style={{
                width: '52px', height: '28px', borderRadius: '14px', background: t.surface2,
                border: `1px solid ${t.line}`, position: 'relative', cursor: 'pointer', flexShrink: 0
              }}
            >
              <div style={{
                position: 'absolute', top: '2px', left: theme === 'dark' ? '26px' : '2px',
                width: '22px', height: '22px', borderRadius: '50%', background: t.accent,
                transition: 'left 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px'
              }}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </div>
          </div>
        </header>

        {stats && (
          <div style={{ display: 'flex', gap: '1px', background: t.line, border: `1px solid ${t.line}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '40px' }}>
            <div style={{ flex: 1, background: t.surface, padding: '20px 24px' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 500, lineHeight: 1 }}>{stats.total_reels}</div>
              <div style={{ fontSize: '12px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '6px' }}>Total reels</div>
            </div>
            <div style={{ flex: 1, background: t.surface, padding: '20px 24px' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 500, lineHeight: 1 }}>{stats.configured}</div>
              <div style={{ fontSize: '12px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '6px' }}>Configured</div>
            </div>
           <div style={{ flex: 1, background: t.surface, padding: '20px 24px' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 500, lineHeight: 1 }}>{stats.active_count}</div>
              <div style={{ fontSize: '12px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '6px' }}>Active</div>
            </div>
          </div>
        )}

        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: t.muted, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Reels
          <span style={{ flex: 1, height: '1px', background: t.line }}></span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => openEditModal(reel)}
              style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.line)}
            >
              <div style={{ aspectRatio: '9/16', position: 'relative', background: t.surface2 }}>
                <img src={reel.thumbnail_url} alt="Reel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                <div style={{
                  position: 'absolute', top: '10px', right: '10px', fontSize: '11px', fontWeight: 500,
                  padding: '4px 9px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px',
                  background: reel.config.active ? t.successSoft : t.surface2,
                  color: reel.config.active ? t.success : t.muted
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }}></span>
                  {reel.config.active ? 'Active' : 'Inactive'}
                </div>

                <div
                  onClick={(e) => quickToggleActive(e, reel)}
                  role="button"
                  title={reel.config.active ? 'Turn off' : 'Turn on'}
                  style={{
                    position: 'absolute', top: '10px', left: '10px',
                    width: '38px', height: '22px', borderRadius: '11px',
                    background: reel.config.active ? t.success : 'rgba(0,0,0,0.35)',
                    cursor: 'pointer', opacity: togglingId === reel.id ? 0.5 : 1,
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '2px', left: reel.config.active ? '18px' : '2px',
                    width: '18px', height: '18px', borderRadius: '50%', background: '#FFFFFF',
                    transition: 'left 0.15s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}></div>
                </div>
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ fontSize: '13px', color: t.inkSoft, marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {reel.caption || 'No caption'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(reel.config.trigger_keywords || []).slice(0, 3).map((kw) => (
                    <span key={kw} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', background: t.accentSoft, color: t.accent, padding: '4px 10px 4px 8px', borderRadius: '6px', fontWeight: 500 }}>
                      <span style={{ opacity: 0.6 }}>#</span>{kw}
                    </span>
                  ))}
                  {(reel.config.trigger_keywords || []).length === 0 && (
                    <span style={{ fontSize: '12px', color: t.muted }}>No keyword set</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {editingReel && (
          <div
            onClick={closeModal}
            style={{ position: 'fixed', inset: 0, background: theme === 'light' ? 'rgba(28,27,25,0.35)' : 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 50 }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ background: t.surface, borderRadius: '14px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', border: `1px solid ${t.line}` }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 600, margin: 0 }}>Configure automation</h2>
                <span onClick={closeModal} style={{ color: t.muted, fontSize: '18px', cursor: 'pointer' }}>&times;</span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: t.inkSoft, marginBottom: '8px' }}>Trigger keywords</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {formData.trigger_keywords.map((kw) => (
                    <span key={kw} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', background: t.accentSoft, color: t.accent, padding: '5px 8px 5px 10px', borderRadius: '6px', fontWeight: 500 }}>
                      #{kw}
                      <span onClick={() => removeKeyword(kw)} style={{ cursor: 'pointer', opacity: 0.6, fontSize: '13px' }}>&times;</span>
                    </span>
                  ))}
                </div>
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  onBlur={addKeyword}
                  placeholder="Type a keyword and press Enter"
                  style={{ width: '100%', border: `1px solid ${t.line}`, borderRadius: '8px', padding: '11px 13px', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: t.bg, color: t.ink, boxSizing: 'border-box' }}
                />
                <div style={{ fontSize: '12px', color: t.muted, marginTop: '6px' }}>Any one of these words triggers the automation. Press Enter or comma to add each one.</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: t.inkSoft }}>DM message</label>
                  <span style={{ fontSize: '12px', color: charsOver ? t.danger : t.muted, fontFamily: 'JetBrains Mono, monospace' }}>{charCount} / {DM_CHAR_LIMIT}</span>
                </div>
                <textarea
                  value={formData.dm_message}
                  onChange={(e) => setFormData({ ...formData, dm_message: e.target.value })}
                  rows={3}
                  placeholder="Message to send via DM when keyword is detected"
                  style={{ width: '100%', border: `1px solid ${charsOver ? t.danger : t.line}`, borderRadius: '8px', padding: '11px 13px', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: t.bg, color: t.ink, resize: 'none', boxSizing: 'border-box' }}
                />
                {charsOver && (
                  <div style={{ fontSize: '12px', color: t.danger, marginTop: '6px' }}>This is over Instagram's 1,000 character limit for DMs and may fail to send.</div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: t.inkSoft, marginBottom: '8px' }}>Comment reply</label>
                <textarea
                  value={formData.comment_reply}
                  onChange={(e) => setFormData({ ...formData, comment_reply: e.target.value })}
                  rows={2}
                  placeholder="Public reply to the comment"
                  style={{ width: '100%', border: `1px solid ${t.line}`, borderRadius: '8px', padding: '11px 13px', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: t.bg, color: t.ink, resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: t.inkSoft, marginBottom: '8px' }}>Delay (seconds)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.delay_seconds === 0 ? '' : formData.delay_seconds}
                  onChange={(e) => {
                    const val = e.target.value
                    setFormData({ ...formData, delay_seconds: val === '' ? 0 : parseInt(val) || 0 })
                  }}
                  placeholder="0"
                  style={{ width: '100%', border: `1px solid ${t.line}`, borderRadius: '8px', padding: '11px 13px', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: t.bg, color: t.ink, boxSizing: 'border-box' }}
                />
                <div style={{ fontSize: '12px', color: t.muted, marginTop: '6px' }}>How long to wait before sending the reply and DM. 0 sends instantly.</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: t.bg, borderRadius: '8px', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: t.accent }}
                />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Enable automation for this reel</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: t.bg, borderRadius: '8px', marginBottom: '24px' }}>
                <input
                  type="checkbox"
                  checked={formData.show_follow_button}
                  onChange={(e) => setFormData({ ...formData, show_follow_button: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: t.accent }}
                />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Include a "Follow me" button in the DM</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div onClick={handleSave} style={{ flex: 1, padding: '13px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textAlign: 'center', cursor: 'pointer', background: t.ink, color: t.bg, border: `1px solid ${t.ink}` }}>
                  Save changes
                </div>
                <div onClick={closeModal} style={{ flex: 1, padding: '13px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textAlign: 'center', cursor: 'pointer', background: 'transparent', color: t.inkSoft, border: `1px solid ${t.line}` }}>
                  Cancel
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
