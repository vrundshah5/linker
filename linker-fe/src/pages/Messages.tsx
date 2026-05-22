import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, Loader2, ExternalLink, Globe } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useConversations, useMessages, useSendMessage, useMarkRead } from '../hooks/useMessages'
import type { ConversationUser } from '../services/messageService'

const AVATAR_COLORS = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-warning/15 text-warning',
  'bg-danger/10 text-danger',
]

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function avatarColor(userId: string) {
  let hash = 0
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatPreview(conv: ConversationUser) {
  if (!conv.lastMessage) return 'No messages yet'
  const prefix = conv.lastMessage.isFromMe ? 'You: ' : ''
  return `${prefix}${conv.lastMessage.content}`
}

const URL_REGEX = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/i
const URL_IN_TEXT_REGEX = /(https?:\/\/[^\s]+)/g

function isUrl(text: string) {
  return URL_REGEX.test(text.trim())
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

interface LinkCardProps {
  url: string
  isMe: boolean
}

function LinkCard({ url, isMe }: LinkCardProps) {
  const domain = getDomain(url)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-md w-72 ${
        isMe
          ? 'border-primary/30 bg-primary/10 rounded-br-sm'
          : 'border-border bg-surface rounded-bl-sm'
      }`}
    >
      {/* Top banner */}
      <div className={`flex items-center gap-3 px-4 py-3 ${
        isMe ? 'bg-primary/15' : 'bg-muted'
      }`}>
        <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
          isMe ? 'bg-primary/20 text-primary' : 'bg-border text-muted-foreground'
        }`}>
          <Globe className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-wider truncate ${
            isMe ? 'text-primary/70' : 'text-muted-foreground'
          }`}>Link</p>
          <p className={`text-sm font-bold truncate ${
            isMe ? 'text-primary' : 'text-foreground'
          }`}>{domain}</p>
        </div>
      </div>

      {/* URL row */}
      <div className={`flex items-center justify-between gap-2 px-4 py-2.5 ${
        isMe ? 'bg-primary/5' : 'bg-surface'
      }`}>
        <span className={`text-xs truncate ${
          isMe ? 'text-primary/60' : 'text-muted-foreground'
        }`}>{url}</span>
        <span className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
          isMe
            ? 'bg-primary text-primary-foreground group-hover:opacity-90'
            : 'bg-foreground text-background group-hover:opacity-80'
        }`}>
          Open <ExternalLink className="size-3" />
        </span>
      </div>
    </a>
  )
}

function renderContent(text: string, isMe: boolean) {
  if (isUrl(text.trim())) {
    return <LinkCard url={text.trim()} isMe={isMe} />
  }
  // Inline URL linkification inside a text bubble
  const parts = text.split(URL_IN_TEXT_REGEX)
  return (
    <>
      {parts.map((part, i) =>
        URL_IN_TEXT_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 break-all hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

function getMyId(): string {
  try {
    const raw = localStorage.getItem('user')
    if (raw) return (JSON.parse(raw) as { id: string }).id
  } catch {
    // ignore
  }
  return ''
}

export default function Messages() {
  const myId = getMyId()
  const [activeUserId, setActiveUserId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversations = [], isLoading: loadingConvs } = useConversations()
  const { data: messages = [], isLoading: loadingMsgs } = useMessages(activeUserId)
  const { mutate: sendMessage, isPending: sending } = useSendMessage()
  const { mutate: markRead } = useMarkRead()

  const activeConv = conversations.find((c) => c.userId === activeUserId) ?? null

  // Auto-select first conversation
  useEffect(() => {
    if (!activeUserId && conversations.length > 0) {
      setActiveUserId(conversations[0].userId)
    }
  }, [conversations, activeUserId])

  // Mark messages as read when opening a conversation
  useEffect(() => {
    if (activeUserId && activeConv && activeConv.unreadCount > 0) {
      markRead(activeUserId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUserId, activeConv?.unreadCount])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = inputValue.trim()
    if (!text || !activeUserId || sending) return
    sendMessage({ userId: activeUserId, content: text })
    setInputValue('')
  }

  return (
    <AppLayout>
      <div className="flex h-full overflow-hidden">

        {/* ── Left panel: conversations ── */}
        <div className="w-80 shrink-0 border-r border-border bg-surface flex flex-col z-10">
          <div className="p-6 border-b border-border shrink-0">
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-headings)' }}
            >
              Messages
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your accepted connections
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {loadingConvs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-5 text-muted-foreground animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                  <MessageSquare className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">No connections yet</p>
                <p className="text-xs text-muted-foreground">
                  Accept or get a request accepted to start messaging
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.userId === activeUserId
                const color = avatarColor(conv.userId)
                return (
                  <button
                    key={conv.userId}
                    type="button"
                    onClick={() => setActiveUserId(conv.userId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer text-left ${
                      isActive ? 'bg-secondary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`size-10 rounded-full flex items-center justify-center text-sm font-bold ${color}`}
                      >
                        {initials(conv.name)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`text-sm font-bold truncate ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {conv.name}
                        </span>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate block">
                        {formatPreview(conv)}
                      </span>
                    </div>

                    {conv.unreadCount > 0 && (
                      <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right panel: chat ── */}
        {activeConv ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-background">

            {/* Chat header */}
            <div className="h-[72px] shrink-0 flex items-center px-8 bg-surface border-b border-border z-10 gap-4">
              <div
                className={`size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(activeConv.userId)}`}
              >
                {initials(activeConv.name)}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{activeConv.name}</h3>
                <p className="text-xs text-muted-foreground">{activeConv.email}</p>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {loadingMsgs ? (
                <div className="flex items-center justify-center flex-1">
                  <Loader2 className="size-5 text-muted-foreground animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                  <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                    <MessageSquare className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No messages yet</p>
                  <p className="text-xs text-muted-foreground">Say hi to {activeConv.name}!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.fromUserId._id === myId
                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-3 ${isMe ? 'justify-end' : ''}`}
                    >
                      {!isMe && (
                        <div
                          className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(activeConv.userId)}`}
                        >
                          {initials(activeConv.name)}
                        </div>
                      )}

                      <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : ''}`}>
                        {isUrl(msg.content.trim()) ? (
                          <LinkCard url={msg.content.trim()} isMe={isMe} />
                        ) : (
                          <div
                            className={`px-4 py-3 text-sm shadow-sm ${
                              isMe
                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                                : 'bg-surface border border-border text-foreground rounded-2xl rounded-bl-sm'
                            }`}
                          >
                            {renderContent(msg.content, isMe)}
                          </div>
                        )}
                        <span className="text-[11px] text-muted-foreground mt-1 px-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="p-5 bg-surface border-t border-border shrink-0 z-10">
              <div className="flex items-center gap-3 bg-input border border-border rounded-2xl px-4 py-2 shadow-sm focus-within:border-primary transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Message ${activeConv.name}…`}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0 py-1.5"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={!inputValue.trim() || sending}
                  onClick={handleSend}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state when no conversation is selected */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center bg-background">
            {!loadingConvs && (
              <>
                <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
                  <MessageSquare className="size-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Select a conversation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a contact on the left to start chatting
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

