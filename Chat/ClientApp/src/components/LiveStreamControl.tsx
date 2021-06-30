
import { DefaultButton ,Stack } from '@fluentui/react';
import React, { useReducer } from 'react';
import { State } from '../core/reducers';
import { liveStreamButton } from './styles/LiveStreamStyle';
import { LiveStreamControlProps, LiveStreamReducer } from '../core/reducers/LiveStreamReducers';
import { LiveStreamActionType, START_LIVE_STREAM, StartActionResult } from '../core/actions/LiveStreamActions';
import axios, { AxiosResponse } from 'axios';

const startStream = async (roomId: string): Promise<AxiosResponse<StartActionResult>> => {
    return axios.post("/livestream/" + roomId);
};

export const initLiveState: LiveStreamControlProps = {
    currentState: {
        isLive: false,
        ingestUrl: "not yet defined",
        amsUrl: "//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest"
    },
    onStart: async (roomId: string): Promise<StartActionResult> => {
        return (await axios.post("/livestream/" + roomId)).data;
    },
    onStop: async (roomId: string): Promise<void> => {
        return (await axios.delete("/livestream/" + roomId)).data;
    }
};

export default (props: LiveStreamControlProps): JSX.Element => {
    const [LiveStreamState, dispatch] = useReducer(LiveStreamReducer, initLiveState);
    return (
        <div> 
            <DefaultButton className={liveStreamButton} onClick={
                async (): Promise<void> => {
                    let startResult = await startStream("room8");
                    dispatch({ type: 'START_LIVE_STREAM', actionResult: startResult.data });
                }
            }>Start LiveStream</DefaultButton>
            {props.currentState ? props.currentState.ingestUrl : "not set" }
        </div>
    )
  };