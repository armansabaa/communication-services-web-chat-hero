import React, { useEffect, useState } from 'react';
import { Checkbox, CompoundButton, DefaultButton, IconButton, IIconProps, IStackTokens, Modal, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { containerTokens, descriptionStyle, eventHeaderTokens, headerStyle, upperStackStyle, upperStackTokens } from './styles/HomeScreen.styles';
import { tilesStackStyles, tilesStackTokens, tileStyle } from './styles/RoomTile.styles';
import { AcsRoom } from '../core/actions/EventAction';
import { useBoolean } from '@fluentui/react-hooks';

export interface OrganizerLandingScreenProps {
  backToHomeHandler(): void;
  createRoom(roomTitle: string, enableChat: boolean, enableCalling: boolean): void;
  rooms: Record<string, AcsRoom> | undefined;
}

const outerStackTokens: IStackTokens = {
  childrenGap: 20,
  padding: 10
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const iconButtonStyles = {
  root: {
    color: 'gainsboro',
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: 'gray',
  },
};

export default (props: OrganizerLandingScreenProps): JSX.Element => {

  const [title, setTitle] = useState('');
  const [enableChat, setEnableChat] = useState(false);
  const [enableCall, setEnableCall] = useState(false);
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

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
      <Stack horizontal horizontalAlign="start" verticalAlign="center" tokens={eventHeaderTokens}>
        <Stack className={upperStackStyle} tokens={upperStackTokens}>
          <div tabIndex={0} className={headerStyle}>
            {"Create new rooms as an organizer"}
          </div>
          powered by ACS
        </Stack>
      </Stack>
      <Stack horizontal horizontalAlign="end" tokens={{
        childrenGap: 10,
        padding: 10
      }}>
        <PrimaryButton text="Add New Room" onClick={showModal} />
        <PrimaryButton
          onClick={(e) => {
            props.backToHomeHandler();
          }}
            text="Back to Home Page" />
      </Stack>
      <Modal
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isModeless={true}
      >
        <Stack horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
          <Stack tokens={outerStackTokens}>
            <TextField label="Room Topic" onChange={onRoomTopicChange} />
            <Checkbox label="Enable Chat" onChange={onEnableChatChange} />
            <Checkbox label="Enable Calling" onChange={onEnableCallChange} />
            <PrimaryButton
              onClick={async (e) => {
                await props.createRoom(title, enableChat, enableCall);
                setTitle("");
                setEnableCall(false);
                setEnableChat(false);
                hideModal();
              }}
              text="Create Room" />
          </Stack>
        </Stack>
      </Modal>

      <Stack horizontal horizontalAlign="space-evenly" styles={tilesStackStyles} tokens={tilesStackTokens}>
        {
          rooms? 
          Object.entries(rooms).map((value) => {
            return <CompoundButton className={tileStyle} >
              <div> {value[1].title} <br />
                <div className={descriptionStyle}> Chat Enabled: {value[1].chatSessionThreadId === null ? "false" : "true"} <br />Call Enabled: {value[1].callingSessionId === null ? "false" : "true"}
                </div>
              </div>
            </CompoundButton>
          }) : null
        }
      </Stack>
      </div>

  );
};
