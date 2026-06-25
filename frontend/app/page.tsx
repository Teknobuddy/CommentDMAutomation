'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ReelConfig {
  trigger_keyword: string
  dm_message: string
  comment_reply: string
  active: boolean
  delay_seconds: number
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
}

export default function Dashboard() {
  const [reels, setReels] = useState<Reel[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingReel, setEditingReel] = useState<Reel | null>(null)
 const [formData, setFormData] = useState<ReelConfig>({
    trigger_keyword: '',
    dm_message: '',
    comment_reply: '',
    active: true,
    delay_seconds: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

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
    setFormData(reel.config)
  }

  const closeModal = () => {
    setEditingReel(null)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="text-white text-xl font-medium">Loading your reels...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1 rounded-2xl">
              <div className="bg-gray-900 px-8 py-3 rounded-xl">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Instagram DM Automation
                </h1>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-lg">Powered by <span className="text-pink-400 font-semibold">Tejas.algo</span></p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative glass rounded-2xl p-8 text-center border border-white/20">
                <div className="text-5xl font-bold text-white mb-2">{stats.total_reels}</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Total Reels</div>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative glass rounded-2xl p-8 text-center border border-white/20">
                <div className="text-5xl font-bold text-white mb-2">{stats.configured}</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Configured</div>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative glass rounded-2xl p-8 text-center border border-white/20">
                <div className="text-5xl font-bold text-white mb-2">{stats.using_default}</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Using Default</div>
              </div>
            </div>
          </div>
        )}

        {/* Reels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {reels.map((reel) => (
            <div 
              key={reel.id} 
              className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
              onClick={() => openEditModal(reel)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition"></div>
              <div className="relative glass rounded-2xl overflow-hidden border border-white/20">
                <div className="aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                  <img 
                    src={reel.thumbnail_url} 
                    alt="Reel" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {reel.config.active ? (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Active
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-gray-600/80 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      Inactive
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">
                      <p className="text-white text-xs font-medium">Click to configure</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                  <p className="text-white text-sm font-medium truncate mb-2">{reel.caption || 'No caption'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-pink-400 text-xs">🔑</span>
                    <p className="text-white/70 text-xs truncate flex-1">{reel.config.trigger_keyword}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingReel && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={closeModal}>
            <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative glass rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Configure Automation
                  </h2>
                  <button 
                    onClick={closeModal}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">Trigger Keyword</label>
                    <input
                      type="text"
                      value={formData.trigger_keyword}
                      onChange={(e) => setFormData({...formData, trigger_keyword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition"
                      placeholder="e.g., info, guide, help"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">DM Message</label>
                    <textarea
                      value={formData.dm_message}
                      onChange={(e) => setFormData({...formData, dm_message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition h-28 resize-none"
                      placeholder="Message to send via DM when keyword is detected"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">Comment Reply</label>
                    <textarea
                      value={formData.comment_reply}
                      onChange={(e) => setFormData({...formData, comment_reply: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition h-28 resize-none"
                      placeholder="Public reply to the comment"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">Delay (seconds)</label>
                   <input
                      type="number"
                      min={0}
                      value={formData.delay_seconds === 0 ? '' : formData.delay_seconds}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormData({...formData, delay_seconds: val === '' ? 0 : parseInt(val) || 0})
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition"
                      placeholder="0"
                    />
                    <p className="text-white/50 text-xs mt-1.5">How long to wait before sending the reply and DM (0 = instant)</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="w-6 h-6 rounded accent-green-500"
                    />
                    <label className="text-white font-medium">Enable automation for this reel</label>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
