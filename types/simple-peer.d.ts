declare module 'simple-peer' {
    import { EventEmitter } from 'events';

    namespace SimplePeer {
        interface Options {
            initiator?: boolean;
            channelConfig?: RTCDataChannelInit;
            channelName?: string;
            config?: RTCConfiguration;
            offerOptions?: RTCOfferOptions;
            answerOptions?: RTCAnswerOptions;
            sdpTransform?: (sdp: string) => string;
            stream?: MediaStream;
            streams?: MediaStream[];
            trickle?: boolean;
            allowHalfTrickle?: boolean;
            wrtc?: any;
            objectMode?: boolean;
        }

        interface SignalData {
            type?: 'offer' | 'answer' | 'pranswer' | 'rollback';
            sdp?: string;
            candidate?: RTCIceCandidateInit;
        }
    }

    class SimplePeer extends EventEmitter {
        constructor(opts?: SimplePeer.Options);
        signal(data: SimplePeer.SignalData | string): void;
        send(data: any): void;
        addStream(stream: MediaStream): void;
        removeStream(stream: MediaStream): void;
        addTrack(track: MediaStreamTrack, stream: MediaStream): void;
        removeTrack(track: MediaStreamTrack, stream: MediaStream): void;
        replaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack, stream: MediaStream): void;
        destroy(err?: Error): void;
        on(event: 'signal', listener: (data: SimplePeer.SignalData) => void): this;
        on(event: 'stream', listener: (stream: MediaStream) => void): this;
        on(event: 'data', listener: (data: any) => void): this;
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: () => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: string, listener: Function): this;
    }

    export = SimplePeer;
}
