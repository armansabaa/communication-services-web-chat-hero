
import { DefaultButton ,Stack } from '@fluentui/react';
import React, { useReducer } from 'react';
import { liveStreamButton } from './styles/LiveStreamStyle';
import { LiveStreamControlProps, LiveStreamReducer, initLiveState } from '../core/reducers/LiveStreamReducers';

export default (props: LiveStreamControlProps): JSX.Element => {
    const [LiveStreamState, dispatch] = useReducer(LiveStreamReducer, initLiveState);
    return (
        <div> 
            <DefaultButton className={liveStreamButton} onClick={
                async (): Promise<void> => {
                    let startResult = await props.onStart("room8");
                    dispatch({ type: 'START_LIVE_STREAM', actionResult: startResult });
                }
            }>Start LiveStream</DefaultButton>
            {props.currentState ? props.currentState.ingestUrl : "not set" }
        </div>
    )
  };