import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Briefcase,
  Users,
  Search,
  MoreVertical,
  MessageSquare,
  Smile,
  Send,
  Loader2,
  X,
} from 'lucide-react'
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import { useProject, useProjectMessages, useSendProjectMessage } from '../hooks/useProjects'
import { useProfile } from '../hooks/useProfile'

export default function ProjectChat() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)
  const { data: me } = useProfile()
  const { data: messages, isLoading } = useProjectMessages(projectId)
  const { mutate: sendMessage, isPending: sending } = useSendProjectMessage()
  const [input, setInput] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)

  const projectName = project?.name ?? 'Project'
  const memberCount = project?.members.length ?? 0
  const currentUserId = me?._id

  // Close emoji picker when clicking outside
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false)
      }
    }
    if (showEmoji) document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [showEmoji])

  function handleEmojiClick(data: EmojiClickData) {
    setInput((prev) => prev + data.emoji)
    inputRef.current?.focus()
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text || !projectId) return
    sendMessage({ projectId, text })
    setInput('')
    inputRef.current?.focus()
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isDark = document.documentElement.classList.contains('dark')

  return (
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden bg-background">

        {/* Chat header */}
        <div className="h-[88px] bg-surface border-b border-border px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
              <Briefcase className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground leading-tight">{projectName}</h3>
              {/* Clickable member count */}
              <button
                type="button"
                onClick={() => setShowMembers((p) => !p)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-0.5 cursor-pointer"
              >
                <Users className="size-3.5 shrink-0" />
                <span>{memberCount} Member{memberCount !== 1 ? 's' : ''} in this group</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="size-10 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="size-4" />
            </button>
            <button
              type="button"
              className="size-10 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
        </div>

        {/* Members panel (slide-in) */}
        {showMembers && project && (
          <div className="bg-surface border-b border-border px-8 py-4 flex flex-col gap-3 shrink-0 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">Group Members</h4>
              <button
                type="button"
                onClick={() => setShowMembers(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.members.map((m, idx) => {
                const name = m.userId.name ?? 'Member'
                const avatar = m.userId.avatar
                const uid = m.userId._id
                const isOwner = uid === project.ownerId?._id
                return (
                  <div key={uid ?? idx} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                    {avatar ? (
                      <img
                        src={`/avatars/${avatar}.png`}
                        alt={name}
                        className="size-7 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {getInitials(name)}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-foreground capitalize">{name}</span>
                    {isOwner && (
                      <span className="text-[10px] uppercase font-bold text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">Owner</span>
                    )}
                    {m.role === 'admin' && !isOwner && (
                      <span className="text-[10px] uppercase font-bold text-warning/70 bg-warning/10 px-1.5 py-0.5 rounded">Admin</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <MessageSquare className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start a conversation with your team. Messages will appear here.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId._id === currentUserId
              return (
                <div
                  key={msg._id}
                  className={`flex items-end gap-3 max-w-[70%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isMe
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {getInitials(msg.senderId.name)}
                  </div>

                  {/* Bubble */}
                  <div className="flex flex-col gap-1">
                    {!isMe && (
                      <span className="text-xs font-semibold text-muted-foreground ml-1 capitalize">
                        {msg.senderId.name}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-surface border border-border text-foreground rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[11px] text-muted-foreground ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="p-6 bg-surface border-t border-border shrink-0 z-10">
          {/* Emoji picker (floats above input) */}
          {showEmoji && (
            <div ref={emojiRef} className="mb-3">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={isDark ? Theme.DARK : Theme.LIGHT}
                width="100%"
                height={340}
                lazyLoadEmojis
                searchPlaceholder="Search emoji…"
              />
            </div>
          )}

          <div className="flex items-center gap-3 bg-input border border-border rounded-2xl p-2 shadow-sm focus-within:border-primary transition-colors">
            {/* Emoji toggle */}
            <button
              type="button"
              onClick={() => setShowEmoji((p) => !p)}
              className={`size-10 flex items-center justify-center rounded-xl shrink-0 transition-colors cursor-pointer ${
                showEmoji
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary hover:bg-secondary'
              }`}
              aria-label="Toggle emoji picker"
            >
              <Smile className="size-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the team..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 transition-opacity shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send
            </button>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  )
}
