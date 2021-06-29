export const START_LIVE_STREAM = 'START_LIVE_STREAM';
export const LISTEN_LIVE_STREAM = 'LISTEN_LIVE_STREAM';
export const STOP_LIVE_STREAM = 'STOP_LIVE_STREAM';

export interface StartActionResult {
    ingestUrl: string,
    liveOutputUrl: string,
    previewUrl: string
}

export interface StartLiveAction {
    type: typeof START_LIVE_STREAM;
    actionResult: StartActionResult
}

export interface ListenLiveStreamAction {
    type: typeof LISTEN_LIVE_STREAM;
}

export interface StopLiveStreamAction {
    type: typeof STOP_LIVE_STREAM;
}

export type LiveStreamActionType = StartLiveAction | ListenLiveStreamAction | StopLiveStreamAction;