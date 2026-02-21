"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { fetchNotifications, fetchUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/api/notification';
import { format } from 'date-fns';
import Link from 'next/link';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';

export const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_notification', (notification: any) => {
            setNotifications(prev => [notification, ...prev].slice(0, 10));
            setUnreadCount(prev => prev + 1);
            toast.info(notification.title);
        });

        return () => {
            socket.off('new_notification');
        };
    }, [socket]);

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            if (data.success) {
                setNotifications(data.notifications.slice(0, 10));
            }
        } catch (error: any) {
            console.error(error.message);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const data = await fetchUnreadNotificationCount();
            if (data.success) {
                setUnreadCount(data.count);
            }
        } catch (error: any) {
            console.error(error.message);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Mark all as read
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-400 text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{notification.title}</h4>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {format(new Date(notification.createdAt), 'MMM d')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                                            <div className="flex items-center space-x-3">
                                                {notification.link && notification.type !== 'application' && (
                                                    <Link
                                                        href={notification.link}
                                                        className="text-[10px] text-blue-600 font-bold hover:underline flex items-center"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            handleMarkAsRead(notification._id);
                                                        }}
                                                    >
                                                        View <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                                    </Link>
                                                )}
                                                {notification.type === 'application' && notification.metadata?.applicationId && (
                                                    <Link
                                                        href="/notifications"
                                                        className="text-[10px] text-purple-600 font-bold hover:underline flex items-center"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            handleMarkAsRead(notification._id);
                                                        }}
                                                    >
                                                        View & Respond <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                                    </Link>
                                                )}
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="text-[10px] text-gray-400 hover:text-blue-600 font-medium"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Link
                            href="/notifications"
                            className="block p-4 bg-gray-50 text-center text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            View all notifications
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};
