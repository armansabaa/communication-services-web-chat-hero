import React, { useEffect } from 'react';
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
  const { startLiveStream } = props;

  async function getLiveStreamURL() {
    let result = await startStream(props.roomId);
    startLiveStream(result);
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
      myPlayer.src([
        {
          src: result.liveOutputUrl ? result.liveOutputUrl : props.liveStreamUrl,
          type: 'application/vnd.ms-sstr+xml'
        }
      ]);

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
      ></video>
    </div>
  );
};
