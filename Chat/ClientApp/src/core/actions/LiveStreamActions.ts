export const SET_LIVE_STREAM_DATA = 'SET_LIVE_STREAM_DATA';
export const LISTEN_LIVE_STREAM = 'LISTEN_LIVE_STREAM';
export const STOP_LIVE_STREAM = 'STOP_LIVE_STREAM';

export interface StreamData {
    ingestUrl: string,
    liveOutputUrl: string,
    previewUrl: string
}

export interface StartLiveAction {
    type: typeof SET_LIVE_STREAM_DATA;
    streamData: StreamData
}

export interface ListenLiveStreamAction {
    type: typeof LISTEN_LIVE_STREAM;
}

export interface StopLiveStreamAction {
    type: typeof STOP_LIVE_STREAM;
}

export type LiveStreamActionType = StartLiveAction | ListenLiveStreamAction | StopLiveStreamAction;

export const setStreamActionResult = (data: StreamData) : StartLiveAction => ({
    type: SET_LIVE_STREAM_DATA,
    streamData: data
});