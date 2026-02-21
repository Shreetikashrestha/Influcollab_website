"use client";

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Check, Filter, X, User, Mail, MessageSquare, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/lib/api/notification';
import { updateApplicationStatus } from '@/lib/api/application';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useSocket } from '@/context/SocketContext';
import axiosInstance from '@/lib/api/axios';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState<any>(null);
    const [applicationDetails, setApplicationDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [processingAction, setProcessingAction] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_notification', (notification: any) => {
            setNotifications(prev => [notification, ...prev]);
        });

        return () => {
            socket.off('new_notification');
        };
    }, [socket]);

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Notification deleted");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleViewDetails = async (notification: any) => {
        setSelectedNotification(notification);
        
        // Mark as read when viewing
        if (!notification.isRead) {
            handleMarkRead(notification._id);
        }

        // If it's an application notification, fetch application details
        if (notification.type === 'application' && notification.metadata?.applicationId) {
            setLoadingDetails(true);
            try {
                console.log('Fetching application:', notification.metadata.applicationId);
                const response = await axiosInstance.get(`/api/applications/${notification.metadata.applicationId}`);
                console.log('Application response:', response.data);
                
                if (response.data.success) {
                    setApplicationDetails(response.data.application);
                } else {
                    toast.error(response.data.message || 'Failed to load application details');
                }
            } catch (error: any) {
                console.error('Application fetch error:', error);
                console.error('Error response:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to load application details';
                toast.error(errorMessage);
            } finally {
                setLoadingDetails(false);
            }
        }
    };

    const handleApplicationAction = async (applicationId: string, status: 'accepted' | 'rejected') => {
        setProcessingAction(true);
        try {
            await updateApplicationStatus(applicationId, status);
            toast.success(`Application ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
            
            // Update application details
            if (applicationDetails) {
                setApplicationDetails({ ...applicationDetails, status });
            }
            
            // Close modal after action
            setTimeout(() => {
                setSelectedNotification(null);
                setApplicationDetails(null);
            }, 1500);
        } catch (error: any) {
            toast.error(error.message || `Failed to ${status === 'accepted' ? 'accept' : 'reject'} application`);
        } finally {
            setProcessingAction(false);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'urgent') return n.priority === 'urgent' || n.priority === 'high';
        return true;
    });

    const getIcon = (priority: string) => {
        switch (priority) {
            case 'urgent': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'high': return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'medium': return <Info className="w-5 h-5 text-blue-500" />;
            default: return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-500">Stay updated with your latest activities</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleMarkAllRead}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                    >
                        <Check className="w-4 h-4 mr-2" /> Mark all read
                    </button>
                    <div className="bg-white border border-gray-200 rounded-xl flex overflow-hidden p-1 shadow-sm">
                        {['all', 'unread', 'urgent'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No notifications match your filter</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredNotifications.map((n) => (
                        <div
                            key={n._id}
                            className={`group relative bg-white p-5 rounded-2xl border transition-all hover:shadow-md ${!n.isRead ? 'border-blue-200 shadow-sm shadow-blue-50' : 'border-gray-100'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-xl bg-gray-50`}>
                                    {getIcon(n.priority)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-sm font-bold truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                            {format(new Date(n.createdAt), 'MMM d, HH:mm')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{n.message}</p>
                                    <div className="flex items-center space-x-3">
                                        {!n.isRead && (
                                            <button
                                                onClick={() => handleMarkRead(n._id)}
                                                className="text-xs text-blue-600 font-bold hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        {n.type === 'application' && n.metadata?.applicationId && (
                                            <button
                                                onClick={() => handleViewDetails(n)}
                                                className="text-xs text-purple-600 font-bold hover:underline"
                                            >
                                                View & Respond
                                            </button>
                                        )}
                                        {n.link && n.type !== 'application' && (
                                            <a href={n.link} className="text-xs text-gray-800 font-bold hover:underline">
                                                View details
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(n._id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all rounded-lg"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Details Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-3xl">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Application Details</h2>
                                <p className="text-sm text-gray-500 mt-1">{selectedNotification.title}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedNotification(null);
                                    setApplicationDetails(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {loadingDetails ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : applicationDetails ? (
                                <div className="space-y-6">
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                                            applicationDetails.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                            applicationDetails.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {applicationDetails.status}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            Applied {format(new Date(applicationDetails.createdAt), 'MMM d, yyyy')}
                                        </span>
                                    </div>

                                    {/* Influencer Info */}
                                    <div className="bg-gray-50 rounded-2xl p-5">
                                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">Influencer Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Full Name</p>
                                                    <p className="text-sm font-bold text-gray-900">{applicationDetails.influencerId?.fullName || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                                    <p className="text-sm font-bold text-gray-900">{applicationDetails.influencerId?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campaign Info */}
                                    <div className="bg-blue-50 rounded-2xl p-5">
                                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">Campaign</h3>
                                        <p className="text-base font-bold text-gray-900">{applicationDetails.campaignId?.title || 'N/A'}</p>
                                    </div>

                                    {/* Proposal Message */}
                                    {applicationDetails.proposalMessage && (
                                        <div className="bg-purple-50 rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <MessageSquare className="w-5 h-5 text-purple-600" />
                                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Proposal Message</h3>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">{applicationDetails.proposalMessage}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {applicationDetails.status === 'pending' && (
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => handleApplicationAction(applicationDetails._id, 'accepted')}
                                                disabled={processingAction}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                                            >
                                                <ThumbsUp className="w-5 h-5" />
                                                {processingAction ? 'Processing...' : 'Accept Application'}
                                            </button>
                                            <button
                                                onClick={() => handleApplicationAction(applicationDetails._id, 'rejected')}
                                                disabled={processingAction}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200"
                                            >
                                                <ThumbsDown className="w-5 h-5" />
                                                {processingAction ? 'Processing...' : 'Reject Application'}
                                            </button>
                                        </div>
                                    )}

                                    {applicationDetails.status !== 'pending' && (
                                        <div className="bg-gray-50 rounded-2xl p-5 text-center">
                                            <p className="text-sm text-gray-600 font-medium">
                                                This application has already been {applicationDetails.status}.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <X className="w-8 h-8 text-red-500" />
                                    </div>
                                    <p className="text-gray-900 font-bold mb-2">Failed to load application details</p>
                                    <p className="text-gray-500 text-sm">Please check the console for more information or try again.</p>
                                    <button
                                        onClick={() => handleViewDetails(selectedNotification)}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
