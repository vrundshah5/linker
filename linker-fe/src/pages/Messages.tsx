import { useState } from 'react'
import { UserPlus, Phone, MoreVertical, Link2, Smile, Send, Globe, BookmarkPlus, CheckCheck, Mail } from 'lucide-react'
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
        <div className="w-80 shrink-0 border-r border-border bg-surface flex flex-col z-10">

          {/* Header + Add friend */}
          <div className="p-6 border-b border-border shrink-0">
            <h1 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-headings)' }}>
              Messages
            </h1>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Add Friend
              </label>
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-input border border-border rounded-xl focus-within:border-primary transition-colors text-sm min-w-0">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="Friend's email"
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                  />
                </div>
                <button
                  type="button"
                  className="size-9 shrink-0 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <UserPlus className="size-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {CONTACTS.map((contact) => {
              const isActive = contact.id === activeContact.id
              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setActiveContact(contact)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer text-left ${
                    isActive ? 'bg-secondary' : 'hover:bg-muted'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`size-10 rounded-full flex items-center justify-center text-sm font-bold ${contact.avatarColor}`}>
                      {contact.initials}
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success border-2 border-surface" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {contact.name}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">{contact.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate block">{contact.preview}</span>
                  </div>

                  {/* Unread badge */}
                  {contact.unread ? (
                    <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                      {contact.unread}
                    </div>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right panel: chat ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fcfcfc]">

          {/* Chat header */}
          <div className="h-[88px] shrink-0 flex items-center justify-between px-8 bg-surface border-b border-border z-10">
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${activeContact.avatarColor}`}>
                {activeContact.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{activeContact.name}</h3>
                {activeContact.online && (
                  <div className="flex items-center gap-1.5 text-sm text-success font-medium">
                    <span className="size-2 rounded-full bg-success" />
                    Online
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="size-10 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer">
                <Phone className="size-[18px]" />
              </button>
              <button type="button" className="size-10 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer">
                <MoreVertical className="size-[18px]" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

            {/* Date separator */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-border rounded-lg text-xs font-bold text-muted-foreground">
                Today
              </span>
            </div>

            {MESSAGES.map((msg) => {
              const isMe = msg.from === 'me'

              /* ── Link card ── */
              if (msg.type === 'link' && msg.link) {
                return (
                  <div key={msg.id} className="flex items-start gap-4">
                    {/* Invisible spacer to align with text bubble above */}
                    <div className="size-8 rounded-full shrink-0 opacity-0" />
                    <div className="max-w-[70%] w-[400px]">
                      <div className="bg-surface border border-border rounded-2xl rounded-tl-sm shadow-sm overflow-hidden mb-1">
                        {/* Link preview header */}
                        <div className="p-4 bg-secondary/50 border-b border-border flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Globe className="size-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-foreground truncate">{msg.link.title}</h4>
                            <a
                              href={msg.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary truncate hover:underline block mt-0.5"
                            >
                              {msg.link.url}
                            </a>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="px-4 py-3 flex items-center justify-between bg-surface">
                          <button type="button" className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
                            <BookmarkPlus className="size-3.5" />
                            Save to Category
                          </button>
                          <button type="button" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            Open Link
                          </button>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">{msg.time}</span>
                    </div>
                  </div>
                )
              }

              /* ── Text bubble ── */
              return (
                <div key={msg.id} className={`flex items-start gap-4 ${isMe ? 'justify-end' : ''}`}>
                  {!isMe && (
                    <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeContact.avatarColor}`}>
                      {activeContact.initials}
                    </div>
                  )}

                  <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : ''}`}>
                    <div className={`p-4 shadow-sm text-sm mb-1 ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                        : 'bg-surface border border-border text-foreground rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 text-xs text-muted-foreground ${isMe ? 'mr-1' : 'ml-1'}`}>
                      {msg.time}
                      {isMe && msg.seen && (
                        <CheckCheck className="size-3.5 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input bar */}
          <div className="p-6 bg-surface border-t border-border shrink-0 z-10">
            <div className="flex items-center gap-3 bg-input border border-border rounded-2xl p-2 shadow-sm">
              <button type="button" className="size-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl shrink-0 transition-colors cursor-pointer">
                <Link2 className="size-5" />
              </button>
              <button type="button" className="size-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl shrink-0 transition-colors cursor-pointer">
                <Smile className="size-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message or paste a link..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0 px-2"
                onKeyDown={(e) => { if (e.key === 'Enter') setInputValue('') }}
              />
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                Send
                <Send className="size-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}

