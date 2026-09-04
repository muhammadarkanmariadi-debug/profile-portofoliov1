'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, MailOpen, Mail, Send, Reply, User } from 'lucide-react';
import type { ContactMessage } from '@prisma/client';

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error('API Error:', data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      alert('Failed to delete message');
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m));
    } catch (error) {
      alert('Failed to update message status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-8">
      {/* Section Header with Index */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">06</span>
          <span className="text-text-primary font-bold">COMMUNICATIONS & INBOX</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-3 py-1 rounded-full bg-surface border border-border text-text-muted">
            TOTAL: {messages.length}
          </span>
          <span className={`px-3 py-1 rounded-full border ${unreadCount > 0 ? 'bg-primary/10 border-primary/30 text-primary font-bold' : 'bg-surface border-border text-text-muted'}`}>
            UNREAD: {unreadCount}
          </span>
        </div>
      </header>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="p-16 text-center text-text-muted bg-surface border border-border rounded-3xl font-mono text-xs">
            Inbox is empty. When visitors submit contact inquiries, they will appear here in real time.
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                !message.isRead 
                  ? 'bg-surface border-primary/40 shadow-sm' 
                  : 'bg-surface/70 border-border opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm ${!message.isRead ? 'bg-primary text-background' : 'bg-surface-elevated border border-border text-text-muted'}`}>
                    {message.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                      <span>{message.name}</span>
                      {!message.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-[10px] tracking-wider uppercase font-bold">
                          NEW INQUIRY
                        </span>
                      )}
                    </h3>
                    <a 
                      href={`mailto:${message.email}`} 
                      className="font-mono text-xs text-primary hover:underline cursor-target"
                    >
                      {message.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-text-muted">
                    {new Date(message.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`mailto:${message.email}?subject=Re: Inquiry from 4RK4N.DEV Portfolio`}
                      className="p-2 bg-surface-elevated hover:bg-primary hover:text-background border border-border text-text-muted rounded-xl transition-all cursor-target"
                      title="Reply via email"
                    >
                      <Reply size={15} />
                    </a>
                    <button 
                      onClick={() => handleToggleRead(message.id, message.isRead)}
                      className="p-2 bg-surface-elevated hover:bg-surface border border-border text-text-muted hover:text-text-primary rounded-xl transition-all cursor-target"
                      title={message.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {message.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(message.id)}
                      className="p-2 bg-surface-elevated hover:bg-rose-500/20 hover:text-rose-400 border border-border text-text-muted rounded-xl transition-all cursor-target"
                      title="Delete message"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="font-sans text-sm text-text-primary whitespace-pre-wrap leading-relaxed bg-surface-elevated/80 p-5 rounded-2xl border border-border/80">
                {message.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
