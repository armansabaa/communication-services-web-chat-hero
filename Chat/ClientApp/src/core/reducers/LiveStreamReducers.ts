import { StartActionResult, LiveStreamActionType, START_LIVE_STREAM, STOP_LIVE_STREAM } from '../actions/LiveStreamActions';

export interface LiveStreamState {
    isLive: boolean;
    ingestUrl: string;
    amsUrl: string;
}

export interface LiveStreamControlProps {
    currentState: LiveStreamState;
    onStart: (roomId: string) => Promise<StartActionResult>;
    onStop: (roomId: string) => Promise<void>;
}

export const initLiveState: LiveStreamState = {
    isLive: false,
    ingestUrl: "not yet defined",
    amsUrl: "//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest"
};

export const LiveStreamReducer = (state = initLiveState, action: LiveStreamActionType) => {
    switch (action.type) {
        case START_LIVE_STREAM:
            return {
                ...state,
                isLive: true,
                ingestUrl: action.actionResult.ingestUrl,
                amsUrl: action.actionResult.liveOutputUrl
            };
        case STOP_LIVE_STREAM:
            return {
                ...state,
                isLive: false,
                ingestUrl: "",
                amsUrl: ""
            };
        default:
            return state;
    }
};