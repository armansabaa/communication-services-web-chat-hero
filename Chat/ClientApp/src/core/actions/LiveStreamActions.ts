export const SET_LIVE_STREAM_DATA = 'SET_LIVE_STREAM_DATA';

export interface StreamData {
    ingestUrl: string,
    liveOutputUrl: string,
    previewUrl: string
}
export type LiveStreamActionType = StartLiveAction;
export interface StartLiveAction {
    type: typeof SET_LIVE_STREAM_DATA;
    streamData: StreamData
}

export const setStreamActionResult = (data: StreamData): StartLiveAction => ({
    type: SET_LIVE_STREAM_DATA,
    streamData: data
});