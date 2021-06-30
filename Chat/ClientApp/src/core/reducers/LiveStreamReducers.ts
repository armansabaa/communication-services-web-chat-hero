import { LiveStreamActionType as LiveStreamActionTypes, SET_LIVE_STREAM_DATA } from '../actions/LiveStreamActions';

export interface LiveStreamState {
    liveStreamIngestUrl: string | undefined;
    amsUrl: string;
}

const initLiveStreamState: LiveStreamState = {
    liveStreamIngestUrl: undefined,
    amsUrl: 'ams_url'
};

export const LiveStreamReducer = (state = initLiveStreamState, action: LiveStreamActionTypes) => {
    switch (action.type) {
        case SET_LIVE_STREAM_DATA:
            return {
                ...state,
                liveStreamIngestUrl: action.streamData.ingestUrl,
                amsUrl: action.streamData.liveOutputUrl
            };
        default:
            return state;
    }
};