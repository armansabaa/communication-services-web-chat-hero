import { LiveStreamActionType as LiveStreamActionTypes, SET_LIVE_STREAM_DATA } from '../actions/LiveStreamActions';

export interface LiveStreamState {
    liveStreamUrl: string |undefined;
}

const initLiveStreamState = {
    liveStreamUrl: 'https://watchartymediaservice-usea.streaming.media.azure.net/98a40988-e897-4cf1-830f-8436b47784d7/startingSoon.ism/manifest',
};

export const LiveStreamReducer = (state:LiveStreamState = initLiveStreamState, action: LiveStreamActionTypes) => {
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