import React, { useEffect, useState } from 'react';
import { streamMainStyle } from './styles/Stream.styles';
import { StreamData } from '../core/actions/LiveStreamActions';

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
  const { startLiveStream } = props;
  const [isStreaming, setIsStreaming] = useState(false);

  async function getLiveStreamURL() {
    await delay(10000);
    let result = await startStream(props.roomId);
    if (result.liveOutputUrl != null) {
      startLiveStream(result);
    }
    let createPlayer = () => {
      var myOptions = {
        autoplay: true,
        controls: true,
        width: '100%',
        height: '100%',
        poster: ''
      };
      let _window: any = window;
      var myPlayer = _window.amp('azuremediaplayer', myOptions);

      return myPlayer;
    };

    let player = createPlayer();

    return () => {
      player.dispose();
    };
  }

  useEffect(() => {
    getLiveStreamURL();
    console.log(props.liveStreamUrl);
  }, []);

  return (
    <div className={streamMainStyle}>
      <video
        id="azuremediaplayer"
        className="azuremediaplayer amp-default-skin"
        autoPlay
        controls
        width="100%"
        height="100%"
        poster="poster.jpg"
        data-setup='{"nativeControlsForTouch": false}'
        key={props.liveStreamUrl}
      >
        <source src={props.liveStreamUrl} type="application/vnd.ms-sstr+xml" />
      </video>
      {props.liveStreamUrl}
    </div>
  );
};
