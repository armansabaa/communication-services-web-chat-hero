import React, { useEffect, useState } from 'react';
import { streamMainStyle } from './styles/Stream.styles';
import { StreamData } from '../core/actions/LiveStreamActions';
import AzureMediaPlayer from './AzureMediaPlayer';

import axios from 'axios';
export interface LiveStreamControlProps {
  roomId: string;
  liveStreamUrl: string;
  startLiveStream(data: StreamData): Promise<StreamData>;
}

const startStream = async (roomId: string): Promise<StreamData> => {
  return (await axios.get('/livestream/' + roomId)).data;
};

export default (props: LiveStreamControlProps): JSX.Element => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const { startLiveStream, liveStreamUrl } = props;
  const [isStreaming, setIsStreaming] = useState(false);

  async function getLiveStreamURL() {
    while (!isStreaming) {
      await delay(10000);
      let result = await startStream(props.roomId);
      if (result.liveOutputUrl != null) {
        startLiveStream(result);
        setIsStreaming(true);
        break;
      }
    }
  }

  useEffect(() => {
    getLiveStreamURL();
    console.log(props.liveStreamUrl);
  }, []);

  return (
    <div className={streamMainStyle}>
      <div className={streamMainStyle} key={props.liveStreamUrl + props.roomId}>
        <AzureMediaPlayer liveStreamUrl={props.liveStreamUrl}></AzureMediaPlayer>
      </div>
    </div>
  );
};
