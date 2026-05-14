import { useState } from 'react'
import { UserPlus, Phone, MoreVertical, Link2, Smile, Send, Globe, Bookmark } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'

interface Contact {
  id: number
  name: string
  preview: string
  time: string
  unread?: number
  online?: boolean
  initials: string
  avatarColor: string
}

type MessageType = 'text' | 'link'

interface Message {
  id: number
  type: MessageType
  from: 'them' | 'me'
  text?: string
  link?: { title: string; url: string }
  time: string
  seen?: boolean
}

const CONTACTS: Contact[] = [
  {
    id: 1,
    name: 'Sarah Connor',
    preview: 'Sent a link...',
    time: '12:30',
    unread: 2,
    online: true,
    initials: 'SC',
    avatarColor: 'bg-success/20 text-success',
  },
  {
    id: 2,
    name: 'John Smith',
    preview: 'You: Thanks!',
    time: '12:30',
    initials: 'JS',
    avatarColor: 'bg-warning/20 text-warning',
  },
  {
    id: 3,
    name: 'Emma Watson',
    preview: 'You: Thanks!',
    time: '12:30',
    initials: 'EW',
    avatarColor: 'bg-primary/15 text-primary',
  },
  {
    id: 4,
    name: 'Michael Doe',
    preview: 'You: Thanks!',
    time: '12:30',
    initials: 'MD',
    avatarColor: 'bg-danger/10 text-danger',
  },
]

const MESSAGES: Message[] = [
  {
    id: 1,
    type: 'text',
    from: 'them',
    text: "Hey! Have you seen this new design tool? I think it would be perfect for our next project.",
    time: '12:28 PM',
  },
  {
    id: 2,
    type: 'link',
    from: 'them',
    link: { title: 'Mobbin - Mobile Design Patterns', url: 'https://mobbin.com' },
    time: '12:30 PM',
  },
  {
    id: 3,
    type: 'text',
    from: 'me',
    text: "Oh wow, this looks exactly like what we need. Let me save it to the Design Inspiration category right now.",
    time: '12:35 PM',
    seen: true,
  },
]

export default function Messages() {
  const [activeContact, setActiveContact] = useState<Contact>(CONTACTS[0])
  const [inputValue, setInputValue] = useState('')
  const [friendEmail, setFriendEmail] = useState('')

  return (
    <AppLayout>
      <div className="flex h-full overflow-hidden">

        {/* ── Left panel ── */}
        <div className="w-[280px] shrink-0 border-r border-border bg-surface flex flex-col">

          {/* Heading */}
          <div className="px-5 pt-6 pb-5 shrink-0">
            <h1
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-headings)' }}
            >
              Messages
            </h1>
          </div>

          {/* Add friend */}
          <div className="px-4 pb-4 shrink-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5 px-1">
              Add Friend
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-input border border-border rounded-xl focus-within:border-primary transition-colors">
                <svg className="size-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="Friend's email"
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0"
                />
              </div>
              <button
                type="button"
                className="size-10 shrink-0 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                <UserPlus className="size-[18px]" />
              </button>
            </div>
          </div>

          <div className="h-px bg-border shrink-0" />

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {CONTACTS.map((contact) => {
              const isActive = contact.id === activeContact.id
              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setActiveContact(contact)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors cursor-pointer text-left border-b border-border/40 ${
                    isActive ? 'bg-secondary' : 'hover:bg-muted'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`size-11 rounded-full flex items-center justify-center text-sm font-bold ring-2 ${
                      isActive ? 'ring-primary/20' : 'ring-transparent'
                    } ${contact.avatarColor}`}>
                      {contact.initials}
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-success border-2 border-surface" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate mb-1 ${
                      isActive ? 'text-primary' : 'text-foreground'
                    }`} style={{ fontFamily: 'var(--font-headings)' }}>
                      {contact.name}
                    </p>
                    <p className={`text-xs truncate ${
                      isActive ? 'text-primary/70' : 'text-muted-foreground'
                    }`}>{contact.preview}</p>
                  </div>

                  {/* Time + unread badge in right column */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span className="text-[11px] text-muted-foreground">{contact.time}</span>
                    {contact.unread ? (
                      <span className="min-w-[20px] h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {contact.unread}
                      </span>
                    ) : (
                      <span className="h-5" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right panel: chat ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">

          {/* Chat header */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-surface border-b border-border">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <div className={`size-11 rounded-full flex items-center justify-center text-sm font-bold ${activeContact.avatarColor}`}>
                  {activeContact.initials}
                </div>
              </div>
              <div>
                <p className="text-base font-bold text-foreground leading-tight" style={{ fontFamily: 'var(--font-headings)' }}>{activeContact.name}</p>
                {activeContact.online && (
                  <p className="text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-success inline-block" />
                    <span className="text-success">Online</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="size-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                <Phone className="size-4" />
              </button>
              <button type="button" className="size-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                <MoreVertical className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

            {/* Date separator */}
            <div className="flex items-center justify-center my-1">
              <span className="px-4 py-1.5 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                Today
              </span>
            </div>

            {MESSAGES.map((msg) => {
              const isMe = msg.from === 'me'

              /* ── Link card ── */
              if (msg.type === 'link' && msg.link) {
                return (
                  <div key={msg.id} className="flex items-end gap-3">
                    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeContact.avatarColor}`}>
                      {activeContact.initials}
                    </div>
                    <div className="max-w-[340px]">
                      <div className="bg-secondary border border-primary/10 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-4">
                          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Globe className="size-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground leading-snug">{msg.link.title}</p>
                            <a
                              href={msg.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline truncate block mt-0.5"
                            >
                              {msg.link.url}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center border-t border-primary/10">
                          <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                            <Bookmark className="size-3.5" />
                            Save to Category
                          </button>
                          <div className="w-px h-7 bg-primary/10" />
                          <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                            Open Link
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5 px-1">{msg.time}</p>
                    </div>
                  </div>
                )
              }

              /* ── Text bubble ── */
              return (
                <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && (
                    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeContact.avatarColor}`}>
                      {activeContact.initials}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[480px] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-surface border border-border text-foreground rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[11px] text-muted-foreground">{msg.time}</span>
                      {isMe && msg.seen && (
                        <svg className="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l4.5 4.5 9-9M9 12.75l4.5 4.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input bar */}
          <div className="shrink-0 px-6 py-4 bg-background border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 bg-input border border-border rounded-2xl focus-within:border-primary transition-colors">
              <button type="button" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0">
                <Link2 className="size-5" />
              </button>
              <button type="button" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0">
                <Smile className="size-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message or paste a link..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0"
                onKeyDown={(e) => { if (e.key === 'Enter') setInputValue('') }}
              />
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                Send
                <Send className="size-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
