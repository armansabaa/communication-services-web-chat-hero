import React, { useEffect, useState } from 'react';
import { Checkbox, IStackTokens, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { containerTokens, eventHeaderTokens, headerStyle, upperStackStyle, upperStackTokens } from './styles/HomeScreen.styles';

export interface OrganizerLandingScreenProps {
  backToHomeHandler(): void;
  createRoom(roomTitle: string, enableChat: boolean, enableCalling: boolean): void;
  getEventInfo(): void;
}

const outerStackTokens: IStackTokens = {
  childrenGap: 20,
  padding: 10
};

export default (props: OrganizerLandingScreenProps): JSX.Element => {

  const [title, setTitle] = useState('');
  const [enableChat, setEnableChat] = useState(false);
  const [enableCall, setEnableCall] = useState(false);

  const onRoomTopicChange = (event: any) => {
    if (event.target.value) {
      setTitle(event.target.value);
    }
  };

  const onEnableChatChange = (event: any) => {
    if (event.target.value && event.target.value == 'on') {
      setEnableChat(true);
    } else {
      setEnableChat(false);
    }
  };

  const onEnableCallChange = (event: any) => {
    if (event.target.value && event.target.value == 'on') {
      setEnableCall(true);
    } else {
      setEnableCall(false);

    }
  };

  return (
    <div>
      <Stack horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
        <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={eventHeaderTokens}>
          <Stack className={upperStackStyle} tokens={upperStackTokens}>
            <div tabIndex={0} className={headerStyle}>
              {"Create new rooms as an organizer"}
            </div>
              powered by ACS
            </Stack>
        </Stack>
      <Stack tokens={outerStackTokens}>
          <TextField label="Room Topic" onChange={onRoomTopicChange}/>
          <Checkbox label="Enable Chat" onChange={onEnableChatChange}/>
          <Checkbox label="Enable Calling" onChange={onEnableCallChange}/>
          <PrimaryButton
            onClick={async (e) => {
              await props.getEventInfo();
              await props.createRoom(title, enableChat, enableCall);
            }}
            text="Create Room" />
          <PrimaryButton
            onClick={(e) => {
              props.backToHomeHandler();
            }}
            text="Back to Home Page" />
        </Stack>
      </Stack>
      </div>

  );
};
