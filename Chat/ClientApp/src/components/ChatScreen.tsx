import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import ChatArea from '../containers/ChatArea';
import ChatHeader from '../containers/ChatHeader';
import { chatScreenBottomContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import LeftPane from './LeftPane';
import MainArea from '../containers/MainArea';

interface ChatScreenProps {
  removedFromThreadHandler(): void;
  setRoomThreadId(roomId: string): void;
  setupRoom(): void;
  isRemoved: boolean;
  hasThreadId: boolean;
}

export default (props: ChatScreenProps): JSX.Element => {
  const { isRemoved, removedFromThreadHandler, hasThreadId } = props;
  const [content, setMainArea] = useState({ contentType: 'welcome', roomTitle: '' });

  // when the screen first loads we want to put focus on the sendbox
  useEffect(() => {
    document.getElementById('sendbox')?.focus();
  }, []);

  // if a user is on the chat screen and they are removed from the chat thread
  // we want to move them to the removedFromThread screen
  useEffect(() => {
    if (isRemoved) {
      removedFromThreadHandler();
    }
  }, [isRemoved, removedFromThreadHandler]);

  const getComponent = () => {
    const items = [];
    if (hasThreadId) {
      items.push(<ChatArea />);
    }
    return (
      <Stack className={chatScreenContainerStyle}>
        <Stack className={chatScreenBottomContainerStyle} horizontal={true}>
          <LeftPane onTabClicked={(tab) => { 
            props.setRoomThreadId("main"); 
            props.setupRoom();
            setMainArea({ ...content, contentType: tab }) }
            } />
          <MainArea contents={content.contentType} roomTitle={content.roomTitle} setMainArea={setMainArea} />
          {items}
        </Stack>
      </Stack>
    );
  
  }

  return getComponent()
};
