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
  return await axios.get('/livestream/' + roomId)
  .then(response => {
    if(response.status == 204){
      console.log("LiveStream - No content available");  
    }
    else {
      console.log(response);
    }
    return response.data;
  }).catch (e => {
    console.error("LiveStream - Error: ", e);
    return null;
  })
};

export default (props: LiveStreamControlProps): JSX.Element => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const { startLiveStream, liveStreamUrl } = props;
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);

  async function getLiveStreamURL() {
    while (!isLiveStreaming) {
      let result = await startStream(props.roomId);
      if (result && result.liveOutputUrl) {
        startLiveStream(result);
        setIsLiveStreaming(true);
        break;
      }
      await delay(2000);
    }
  }

  useEffect(() => {
    getLiveStreamURL();
  }, []);

  return (
    <div className={streamMainStyle}>
      <div className={streamMainStyle} key={props.liveStreamUrl + props.roomId}>
        <AzureMediaPlayer isLiveStreaming={isLiveStreaming} liveStreamUrl={props.liveStreamUrl}></AzureMediaPlayer>
      </div>
    </div>
  );
};
