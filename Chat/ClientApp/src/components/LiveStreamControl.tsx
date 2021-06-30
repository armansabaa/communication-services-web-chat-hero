import { DefaultButton, Stack } from '@fluentui/react';
import React, { useReducer, useState } from 'react';
import { State } from '../core/reducers';
import { liveStreamButton } from './styles/LiveStreamStyle';
import { LiveStreamReducer } from '../core/reducers/LiveStreamReducers';
import { LiveStreamActionType, SET_LIVE_STREAM_DATA, StreamData } from '../core/actions/LiveStreamActions';
import axios, { AxiosResponse } from 'axios';

export interface LiveStreamControlProps {
  roomId: string;
  ingestUrl: string;
  startLiveStream(data: StreamData): Promise<void>;
}

const startStream = async (roomId: string): Promise<StreamData> => {
  return (await axios.post('/livestream/' + roomId)).data;
};

const stopStream = async (roomId: string): Promise<void> => {
  return (await axios.delete('/livestream/' + roomId)).data;
};

export default (props: LiveStreamControlProps): JSX.Element => {
  const [isFetchingStreamData, setIsFetchingStreamData] = useState(false);

  return (
    <div>
      <DefaultButton
        className={liveStreamButton}
        onClick={async (): Promise<void> => {
          let startStreamActionResult = await startStream(props.roomId);
          props.startLiveStream(startStreamActionResult);
        }}
      >
        Start LiveStream
      </DefaultButton>
      {props.ingestUrl ? props.ingestUrl : 'not set'}
    </div>
  );
};
