import { StartActionResult, LiveStreamActionType, START_LIVE_STREAM, STOP_LIVE_STREAM } from '../actions/LiveStreamActions';

export interface LiveStreamState {
    isLive: boolean;
    ingestUrl: string;
    amsUrl: string;
}

export interface LiveStreamControlProps {
    currentState: LiveStreamState;
    onStart: (roomId: string) => StartActionResult;
    onStop: (roomId: string) => void;
}

export const LiveStreamReducer = (state: any, action: LiveStreamActionType) => {
    switch (action.type) {
        case START_LIVE_STREAM:
            return {
                ...state,
                liveStream: {
                    isLive: true,
                    ingestUrl: action.actionResult.ingestUrl,
                    amsUrl: action.actionResult.liveOutputUrl
                }
            };
        case STOP_LIVE_STREAM:
            return {
                ...state,
                liveStream: {
                    isLive: false,
                    ingestUrl: "",
                    amsUrl: ""
                }
            };
        default:
            return state;
    }
};