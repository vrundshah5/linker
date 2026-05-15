import { useRef, useState } from 'react'
import {
  Briefcase,
  Users,
  Search,
  MoreVertical,
  PlusCircle,
  PenTool,
  CheckCheck,
  Paperclip,
  Smile,
  Send,
} from 'lucide-react'
import ProjectLayout from '../components/layouts/ProjectLayout'

interface Message {
  id: number
  type: 'system' | 'received' | 'link-card' | 'sent'
  senderName?: string
  senderAvatar?: string
  text?: string
  time?: string
  // link card
  cardTitle?: string
  cardUrl?: string
  cardUrlLabel?: string
}

const MESSAGES: Message[] = [
  {
    id: 1,
    type: 'system',
    text: 'Jason Doe created the project Acme Corp Redesign.',
  },
  {
    id: 2,
    type: 'received',
    senderName: 'Sarah Connor',
    text: 'Hey team! I just uploaded the initial brand guidelines to the resources tab. Let me know what you think.',
    time: '10:15 AM',
  },
  {
    id: 3,
    type: 'link-card',
    senderName: 'Sarah Connor',
    cardTitle: 'Acme Corp Brand Guidelines v2.1',
    cardUrl: 'https://brandfolder.com/acme',
    cardUrlLabel: 'brandfolder.com/acme',
    time: '10:15 AM',
  },
  {
    id: 4,
    type: 'sent',
    text: 'Looks solid, Sarah. I will review it before the client meeting tomorrow.',
    time: '10:22 AM',
  },
]

function SenderAvatar({ visible = true }: { visible?: boolean }) {
  return (
    <div
      className={`size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary ${
        visible ? '' : 'opacity-0 pointer-events-none'
      }`}
    >
      SC
    </div>
  )
}

export default function ProjectChat() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <ProjectLayout>
      <div className="h-full flex flex-col overflow-hidden bg-[#fcfcfc]">

        {/* Chat header */}
        <div className="h-[88px] bg-surface border-b border-border px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-warning text-white flex items-center justify-center shadow-sm shrink-0">
              <Briefcase className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground leading-tight">Acme Corp Redesign</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <Users className="size-3.5 shrink-0" />
                <span>5 Members in this group</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="size-10 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors"
            >
              <Search className="size-4" />
            </button>
            <button
              type="button"
              className="size-10 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

          {/* Date separator */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-border rounded-lg text-xs font-bold text-muted-foreground">
              Today
            </span>
          </div>

          {MESSAGES.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-secondary/50 text-primary text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                    <PlusCircle className="size-3.5 shrink-0" />
                    <span>{msg.text}</span>
                  </div>
                </div>
              )
            }

            if (msg.type === 'received') {
              return (
                <div key={msg.id} className="flex items-start gap-4">
                  <SenderAvatar />
                  <div className="max-w-[70%]">
                    <span className="text-xs font-bold text-foreground ml-1 mb-1 block">
                      {msg.senderName}
                    </span>
                    <div className="bg-surface border border-border p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-foreground mb-1">
                      {msg.text}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">{msg.time}</span>
                  </div>
                </div>
              )
            }

            if (msg.type === 'link-card') {
              return (
                <div key={msg.id} className="flex items-start gap-4">
                  <SenderAvatar visible={false} />
                  <div className="w-[400px] max-w-[70%]">
                    <div className="bg-surface border border-border rounded-2xl rounded-tl-sm shadow-sm overflow-hidden mb-1">
                      {/* Card header */}
                      <div className="p-4 bg-secondary/50 border-b border-border flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <PenTool className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">{msg.cardTitle}</h4>
                          <a
                            href={msg.cardUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary truncate hover:underline block"
                          >
                            {msg.cardUrlLabel}
                          </a>
                        </div>
                      </div>
                      {/* Card footer */}
                      <div className="px-4 py-3 bg-surface">
                        <a
                          href={msg.cardUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Open Resource
                        </a>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">{msg.time}</span>
                  </div>
                </div>
              )
            }

            if (msg.type === 'sent') {
              return (
                <div key={msg.id} className="flex items-start gap-4 justify-end">
                  <div className="max-w-[70%] flex flex-col items-end">
                    <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm mb-1">
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
                      {msg.time}
                      <CheckCheck className="size-3.5 text-primary" />
                    </div>
                  </div>
                </div>
              )
            }

            return null
          })}
        </div>

        {/* Input bar */}
        <div className="p-6 bg-surface border-t border-border shrink-0 z-10">
          <div className="flex items-center gap-3 bg-input border border-border rounded-2xl p-2 shadow-sm">
            <button
              type="button"
              className="size-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl shrink-0 transition-colors"
            >
              <Paperclip className="size-5" />
            </button>
            <button
              type="button"
              className="size-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl shrink-0 transition-colors"
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
                if (e.key === 'Enter' && input.trim()) setInput('')
              }}
            />
            <button
              type="button"
              onClick={() => setInput('')}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 transition-opacity shrink-0"
            >
              Send
              <Send className="size-4" />
            </button>
          </div>
        </div>

      </div>
    </ProjectLayout>
  )
}
