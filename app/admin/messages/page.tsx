'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, MailOpen, Mail } from 'lucide-react';
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No messages found.
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-6 border-b border-white/5 transition-colors ${!message.isRead ? 'bg-primary/5' : 'hover:bg-white/[0.02]'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-white flex items-center gap-2">
                      {message.name}
                      {!message.isRead && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    </h3>
                    <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline">{message.email}</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()} {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleRead(message.id, message.isRead)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                        title={message.isRead ? "Mark as unread" : "Mark as read"}
                      >
                        {message.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(message.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  {message.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
