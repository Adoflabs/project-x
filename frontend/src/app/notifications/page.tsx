'use client';

import { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'alert',
      title: 'New High-Risk Alert',
      message: 'Marcus Reid has been flagged as high flight risk',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'config',
      title: 'Formula Change Approved',
      message: 'Your requested weight adjustment for Engineering team has been approved',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'feedback',
      title: 'Peer Feedback Due Soon',
      message: '3 pending reviews due in 2 days',
      time: '1 day ago',
      read: false,
    },
    {
      id: '4',
      type: 'score',
      title: 'Monthly Scores Calculated',
      message: 'March 2026 scores are now available',
      time: '2 days ago',
      read: true,
    },
    {
      id: '5',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on March 10, 2026 at 2:00 AM',
      time: '3 days ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    if (confirm('Clear all notifications?')) {
      setNotifications([]);
    }
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return 'Alert';
      case 'config':
        return 'Config';
      case 'feedback':
        return 'Feedback';
      case 'score':
        return 'Score';
      case 'system':
        return 'System';
      default:
        return 'Notice';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
          <p className="text-text-secondary">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
          <button 
            onClick={handleClearAll}
            className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => !notification.read && handleMarkRead(notification.id)}
            className={`glass-card p-4 hover:bg-white/[0.06] transition-colors cursor-pointer ${
              !notification.read ? 'border-l-4 border-white/30' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-sm font-semibold text-text-primary shrink-0 w-16">{getIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full bg-white/50" />
                    )}
                  </h3>
                  <span className="text-xs text-text-muted whitespace-nowrap">{notification.time}</span>
                </div>
                <p className="text-sm text-text-secondary">{notification.message}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(notification.id);
                }}
                className="p-1 rounded hover:bg-white/[0.08] text-text-muted hover:text-text-secondary transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (when no notifications) */}
      {notifications.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No notifications</h3>
          <p className="text-sm text-text-muted">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
