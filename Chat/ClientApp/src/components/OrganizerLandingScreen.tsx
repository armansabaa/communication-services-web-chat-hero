import React, { useEffect, useState } from 'react';
import { Checkbox, CompoundButton, DefaultButton, IStackTokens, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { containerTokens, descriptionStyle, eventHeaderTokens, headerStyle, upperStackStyle, upperStackTokens } from './styles/HomeScreen.styles';
import { tilesStackStyles, tilesStackTokens, tileStyle } from './styles/RoomTile.styles';
import { AcsRoom } from '../core/actions/EventAction';

export interface OrganizerLandingScreenProps {
  backToHomeHandler(): void;
  createRoom(roomTitle: string, enableChat: boolean, enableCalling: boolean): void;
  getRooms(): Record<string, AcsRoom>;
  rooms: Record<string, AcsRoom>;
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
    if (event.target.value) {
      setEnableChat(event.target.checked);
    }
  };

  const onEnableCallChange = (event: any) => {
    if (event.target.value) {
      setEnableCall(event.target.checked);
    }
  };

  const rooms = props.rooms;
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

      <Stack horizontal horizontalAlign="space-evenly" styles={tilesStackStyles} tokens={tilesStackTokens}>
        {
          Object.entries(rooms).map((value) => {
            return <CompoundButton className={tileStyle} >
              <div> {value[1].title} <br />
                <div className={descriptionStyle}> Chat Enabled: {value[1].chatSessionThreadId === null ? "false" : "true"} <br />Call Enabled: {value[1].callingSessionId === null ? "false" : "true"}
                </div>
              </div>
            </CompoundButton>
          })
        }
      </Stack>
      </div>

  );
};
