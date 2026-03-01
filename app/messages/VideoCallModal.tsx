"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2, Minimize2 } from 'lucide-react';
import SimplePeer from 'simple-peer';
import { useSocket } from '@/context/SocketContext';

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    callType: 'audio' | 'video';
    partner: any;
    conversationId: string;
    currentUserId: string;
    isInitiator: boolean;
}

export const VideoCallModal = ({
    isOpen,
    onClose,
    callType,
    partner,
    conversationId,
    currentUserId,
    isInitiator
}: VideoCallModalProps) => {
    const { socket } = useSocket();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<SimplePeer | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<SimplePeer | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        initializeCall();

        return () => {
            cleanup();
        };
    }, [isOpen]);

    useEffect(() => {
        if (!socket || !isOpen) return;

        socket.on('call_accepted', handleCallAccepted);
        socket.on('call_signal', handleCallSignal);
        socket.on('call_rejected', handleCallRejected);
        socket.on('call_ended', handleCallEnded);

        return () => {
            socket.off('call_accepted', handleCallAccepted);
            socket.off('call_signal', handleCallSignal);
            socket.off('call_rejected', handleCallRejected);
            socket.off('call_ended', handleCallEnded);
        };
    }, [socket, isOpen]);

    const initializeCall = async () => {
        try {
            const constraints = {
                audio: true,
                video: callType === 'video' ? { width: 1280, height: 720 } : false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setLocalStream(stream);

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            if (isInitiator) {
                setCallStatus('ringing');
                createPeer(stream, true);
            } else {
                setCallStatus('connecting');
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Could not access camera/microphone. Please check permissions.');
            onClose();
        }
    };

    const createPeer = (stream: MediaStream, initiator: boolean) => {
        const newPeer = new SimplePeer({
            initiator,
            trickle: false,
            stream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        newPeer.on('signal', (signal) => {
            socket?.emit('call_signal', {
                conversationId,
                signal,
                to: partner._id,
                from: currentUserId,
                callType
            });
        });

        newPeer.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setCallStatus('connected');
        });

        newPeer.on('error', (err) => {
            console.error('Peer error:', err);
        });

        newPeer.on('close', () => {
            handleCallEnded();
        });

        setPeer(newPeer);
        peerRef.current = newPeer;
    };

    const handleCallAccepted = (data: any) => {
        if (data.conversationId === conversationId) {
            setCallStatus('connecting');
        }
    };

    const handleCallSignal = (data: any) => {
        if (data.conversationId !== conversationId) return;

        if (!peerRef.current && localStream) {
            createPeer(localStream, false);
        }

        if (peerRef.current && data.signal) {
            peerRef.current.signal(data.signal);
        }
    };

    const handleCallRejected = (data: any) => {
        if (data.conversationId === conversationId) {
            alert('Call was rejected');
            cleanup();
            onClose();
        }
    };

    const handleCallEnded = () => {
        setCallStatus('ended');
        cleanup();
        setTimeout(() => onClose(), 1000);
    };

    const cleanup = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        setLocalStream(null);
        setRemoteStream(null);
        setPeer(null);
        peerRef.current = null;
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream && callType === 'video') {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        socket?.emit('call_ended', {
            conversationId,
            to: partner._id
        });
        handleCallEnded();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center overflow-hidden border-2 border-white">
                            {partner?.profilePicture ? (
                                <img src={partner.profilePicture} alt={partner.fullName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-lg">{partner?.fullName?.[0] || '?'}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">{partner?.fullName}</h3>
                            <p className="text-white/70 text-sm">
                                {callStatus === 'connecting' && 'Connecting...'}
                                {callStatus === 'ringing' && 'Ringing...'}
                                {callStatus === 'connected' && 'Connected'}
                                {callStatus === 'ended' && 'Call Ended'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-white/10 rounded-lg text-white transition-all"
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative">
                {/* Remote Video (Full Screen) */}
                {callType === 'video' && remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-white/20">
                                {partner?.profilePicture ? (
                                    <img src={partner.profilePicture} alt={partner.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold text-5xl">{partner?.fullName?.[0] || '?'}</span>
                                )}
                            </div>
                            <p className="text-white/70 text-lg">{callType === 'audio' ? 'Audio Call' : 'Waiting for video...'}</p>
                        </div>
                    </div>
                )}

                {/* Local Video (Picture in Picture) */}
                {callType === 'video' && localStream && (
                    <div className="absolute top-20 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-900">
                        {!isVideoOff ? (
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover mirror"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <VideoOff className="w-8 h-8 text-white/50" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all ${
                            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                        } backdrop-blur-sm`}
                    >
                        {isMuted ? (
                            <MicOff className="w-6 h-6 text-white" />
                        ) : (
                            <Mic className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {callType === 'video' && (
                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition-all ${
                                isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                            } backdrop-blur-sm`}
                        >
                            {isVideoOff ? (
                                <VideoOff className="w-6 h-6 text-white" />
                            ) : (
                                <Video className="w-6 h-6 text-white" />
                            )}
                        </button>
                    )}

                    <button
                        onClick={endCall}
                        className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-all shadow-lg"
                    >
                        <PhoneOff className="w-7 h-7 text-white" />
                    </button>
                </div>
            </div>

            <style jsx>{`
                .mirror {
                    transform: scaleX(-1);
                }
            `}</style>
        </div>
    );
};
