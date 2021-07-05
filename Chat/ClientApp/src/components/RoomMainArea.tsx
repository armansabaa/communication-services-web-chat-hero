import { CallAgent, CallEndReason } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ActionButton, FontIcon, IIconProps, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import GroupCall from '../containers/GroupCall';
import { TokenResponse } from '../containers/RoomMainArea';
import LiveStream from '../containers/LiveStream';
import { staticAreaStyle } from './styles/ChatScreen.styles';
import { backButtonStyle, calendarIconStyle, headerTextStyle, roomMainAreaStackStyles,  timeIconStyle, callAreaStyle } from './styles/RoomMainArea.styles';

const backIcon: IIconProps = { iconName: 'Back' };

export interface RoomMainAreaProps {
  roomTitle: string;
  userId: string;
  displayName: string;
  callAgent: CallAgent;
  liveStream: LiveStreamState;
  setupRoom(): void;
  setRoomId(roomId: string): void;
  setRoomThreadId(roomId: string): void;
  backToChatScreenHander(): void;
  removeChatParticipantById: (userId: string) => Promise<void>;
  getToken(): Promise<TokenResponse>;
  createCallAgent(tokenCredential: AzureCommunicationTokenCredential, displayName: string): Promise<CallAgent>;
  registerToCallEvents(
    userId: string,
    callAgent: CallAgent,
    endCallHandler: (reason: CallEndReason) => void
  ): Promise<void>;
  joinGroup(callAgent: CallAgent, groupId: string): Promise<void>;
  callEndedHandler: (reason: CallEndReason) => void;
  setGroup(groupId: string): void;
  setupCallClient(unsupportedStateHandler: () => void): Promise<void>;
  registerDevices(): Promise<void>;
  roomId: string;
  callId: string;
}

export default (props: RoomMainAreaProps): JSX.Element => {
  const {
    setupRoom,
    setRoomThreadId,
    backToChatScreenHander,
    removeChatParticipantById,
    setGroup,
    callId,
    setupCallClient,
    callAgent,
    roomId,
    setRoomId,
    liveStream
  } = props;

  useEffect(() => {
    setRoomThreadId(roomId);
    setupRoom();
  }, []);

  const backButtonHandler = () => {
    removeChatParticipantById(props.userId);
    setRoomId('main');
    setRoomThreadId('main');
    setupRoom();
    backToChatScreenHander(); //does this do anything?
  };

  const unsupportedCallingHandler = () => {
    setIsCallingSupported(false);
  };

  useEffect(() => {
    setUpAndJoinCall();
  }, []);

  const [localVideoStream, setLocalVideoStream] = useState(undefined);
  const [isCallingSupported, setIsCallingSupported] = useState(true);
  const [isOnCall, setIsOnCall] = useState(false);
  const [isJoiningCall, setIsJoiningCall] = useState(false);

  async function setUpAndJoinCall() {
    await setupCallClient(unsupportedCallingHandler);

    setIsJoiningCall(true);
    let curCallAgent = callAgent;

    if (!curCallAgent) {
      await props.registerDevices();
      //1. Retrieve a token
      const { tokenCredential, userId } = await props.getToken();
      //2. Initialize the call agent
      curCallAgent = await props.createCallAgent(tokenCredential, props.displayName);
      //3. Register for calling events
      props.registerToCallEvents(userId, curCallAgent, props.callEndedHandler);
    }

    //4. Join the call
    await props.joinGroup(curCallAgent, callId);
    setGroup(callId);
    setIsOnCall(true);
    setIsJoiningCall(false);
  }

  function getCallComponent() {
    if (!callId || !isCallingSupported) {
      return;
    }

    if (isOnCall) {
      return (
        <GroupCall
          endCallHandler={(): void => setIsOnCall(false)}
          groupId={callId}
          screenWidth={250}
          localVideoStream={localVideoStream}
          setLocalVideoStream={setLocalVideoStream}
        />
      );
    } else if (isJoiningCall) {
      return <Spinner label="Joining call..." ariaLive="assertive" labelPosition="top" />;
    }
  }

  return (
    <div className={staticAreaStyle}>
      <ActionButton className={backButtonStyle} iconProps={backIcon} onClick={backButtonHandler}>
        Back to all rooms
      </ActionButton>
      <h1>{props.roomTitle}</h1>
      <Stack styles={roomMainAreaStackStyles}>
        <h3 className={headerTextStyle}>
          <FontIcon aria-label="Calendar" iconName="Calendar" className={calendarIconStyle} />
          June 9th, 2021
        </h3>
        <h3 className={headerTextStyle}>
          <FontIcon aria-label="DateTime" iconName="DateTime" className={timeIconStyle} />
          08:00AM - 12:00PM PST (UTC - 8:00)
        </h3>
      </Stack>
      <LiveStream />
      <div className={callAreaStyle}>{getCallComponent()}</div>
    </div>
  );
};
