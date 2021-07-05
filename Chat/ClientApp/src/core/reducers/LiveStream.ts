import { LiveStreamActionType as LiveStreamActionTypes, SET_LIVE_STREAM_DATA } from '../actions/LiveStreamActions';

export interface LiveStreamState {
    liveStreamUrl: string |undefined;
}

export const initLiveStreamState = {
    liveStreamUrl: '//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest',
};

export const LiveStreamReducer = (state:LiveStreamState = initLiveStreamState, action: LiveStreamActionTypes):LiveStreamState => {
    switch (action.type) {
        case SET_LIVE_STREAM_DATA:
            return {
                ...state,
                liveStreamUrl: action.streamData.liveOutputUrl
            };
        default:
            return state;
    }
};