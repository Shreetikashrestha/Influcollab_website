"use client";

import React from 'react';
import { Phone, Video, X } from 'lucide-react';

interface IncomingCallNotificationProps {
    caller: any;
    callType: 'audio' | 'video';
    onAccept: () => void;
    onReject: () => void;
}

export const IncomingCallNotification = ({
    caller,
    callType,
    onAccept,
    onReject
}: IncomingCallNotificationProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                    {/* Caller Avatar */}
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                            {caller?.profilePicture ? (
                                <img 
                                    src={caller.profilePicture} 
                                    alt={caller.fullName} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <span className="text-white font-bold text-3xl">
                                    {caller?.fullName?.[0] || '?'}
                                </span>
                            )}
                        </div>
                        {/* Pulsing ring animation */}
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-75"></div>
                    </div>

                    {/* Caller Info */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {caller?.fullName || 'Unknown User'}
                    </h3>
                    <p className="text-gray-500 mb-2 flex items-center justify-center gap-2">
                        {callType === 'video' ? (
                            <>
                                <Video className="w-4 h-4" />
                                <span>Incoming Video Call</span>
                            </>
                        ) : (
                            <>
                                <Phone className="w-4 h-4" />
                                <span>Incoming Audio Call</span>
                            </>
                        )}
                    </p>
                    <p className="text-sm text-gray-400 mb-8">
                        {caller?.isInfluencer ? 'Influencer' : 'Brand'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={onReject}
                            className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                        >
                            <X className="w-5 h-5" />
                            Decline
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 animate-pulse"
                        >
                            {callType === 'video' ? (
                                <Video className="w-5 h-5" />
                            ) : (
                                <Phone className="w-5 h-5" />
                            )}
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
