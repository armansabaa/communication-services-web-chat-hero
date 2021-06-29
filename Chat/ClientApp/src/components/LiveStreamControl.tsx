
import { DefaultButton ,Stack } from '@fluentui/react';
import React, { useReducer} from 'react';
import { liveStreamButton, tilesStackStyles, tilesStackTokens } from './styles/LiveStreamStyle';
import { LiveStreamReducer, LiveStreamState, LiveStreamControlProps } from '../core/reducers/LiveStreamReducers';

export const initLiveState: LiveStreamState = {
    isLive: false,
    ingestUrl: "not yet defined",
    amsUrl: "//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest"
};

export default (props: LiveStreamControlProps): JSX.Element => {
    const [LiveStreamState,dispatch] = useReducer(LiveStreamReducer, initLiveState);
    return (
        <div> 
            <DefaultButton className={liveStreamButton} onClick={
                async (): Promise<void> => {
                    props.onStart("room8");
                }
            }>Start LiveStream</DefaultButton>
            {props.currentState.ingestUrl}
        </div>
        
    )
  };