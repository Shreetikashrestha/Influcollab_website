"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '@/lib/cookie';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const initSocket = async () => {
            const token = await getAuthToken();
            if (!token) return;

            const socketInstance = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050', {
                auth: { token },
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5,
            });

            socketInstance.on('connect', () => {
                console.log('✅ Socket connected');
                setIsConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('⚠️ Socket disconnected');
                setIsConnected(false);
            });

            socketInstance.on('connect_error', (error) => {
                console.warn('Socket connection error (this is normal if backend is not running):', error.message);
                setIsConnected(false);
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        };

        const cleanup = initSocket();

        return () => {
            cleanup.then((cleanupFn: any) => cleanupFn && cleanupFn());
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
