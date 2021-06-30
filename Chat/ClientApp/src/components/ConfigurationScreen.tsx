import { PrimaryButton, Stack, Spinner, Image } from '@fluentui/react';
import { ChatIcon } from '@fluentui/react-icons-northstar';
import React, { useEffect, useState } from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';

import { buttonStyle, chatIconStyle, imageStyleProps, mainContainerStyle } from './styles/ConfigurationScreen.styles';
import {
  labelFontStyle,
  largeAvatarContainerStyle,
  largeAvatarStyle,
  leftPreviewContainerStyle,
  namePreviewStyle,
  responsiveLayoutStyle,
  rightInputContainerStyle,
  smallAvatarContainerStyle,
  smallAvatarStyle,
  startChatButtonTextStyle
} from './styles/ConfigurationScreen.styles';
import { CAT, MOUSE, KOALA, OCTOPUS, MONKEY, FOX, getEventId } from '../utils/utils';
import DisplayNameField from './DisplayNameField';
import { MAXIMUM_LENGTH_OF_NAME } from '../constants';
import heroSVG from '../assets/hero.svg';
import { upperStackTokens } from './styles/EndChat.styles';
import { upperStackStyle, headerStyle, imgStyle, containerTokens, eventHeaderTokens } from './styles/HomeScreen.styles';

export interface ConfigurationScreenProps {
  joinChatHandler(): void;
  setup(displayName: string, emoji: string): void;
  getEventInfo(threadId: string | null): any;
}

export default (props: ConfigurationScreenProps): JSX.Element => {
  const spinnerLabel = 'Joining event...';

  const avatarsList = [CAT, MOUSE, KOALA, OCTOPUS, MONKEY, FOX];
  const [name, setName] = useState('');

  const [emptyWarning, setEmptyWarning] = useState(false);

  const [isNameLengthExceedLimit, setNameLengthExceedLimit] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState(CAT);

  const [isJoining, setIsJoining] = useState(false);

  const { joinChatHandler, setup } = props;

  const onAvatarChange = (newAvatar: string) => {
    setSelectedAvatar(newAvatar);
  };

  const validateName = () => {
    if (!name) {
      setEmptyWarning(true);
      setNameLengthExceedLimit(false);
    } else if (name.length > MAXIMUM_LENGTH_OF_NAME) {
      setEmptyWarning(false);
      setNameLengthExceedLimit(true);
    } else {
      setEmptyWarning(false);
      setNameLengthExceedLimit(false);
      if (!isJoining) {
        setIsJoining(true);
        setup(name, selectedAvatar);
      }
    }
  };

  const getEventInfoProp = props.getEventInfo;

  useEffect(() => {
    const getEvent = async () => {
      await getEventInfoProp(getEventId())
    };
    getEvent();
    document.getElementById('🐱')?.focus();
  }, [getEventInfoProp]);

  const joinChatLoading = () => {
    return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />;
  };

  const imageProps = { src: heroSVG.toString() };
  const headerTitle = 'Virtual Event Hackathon';

  const joinChatArea = () => {
    return (
      <div>
        <Stack horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
          <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={eventHeaderTokens}>
            <Stack className={upperStackStyle} tokens={upperStackTokens}>
              <div tabIndex={0} className={headerStyle}>
                {headerTitle}
              </div>
              powered by ACS
            </Stack>
            <Image
              styles={imageStyleProps}
              alt="Virtual Event"
              className={imgStyle}
              {...imageProps}
            />
          </Stack>

          <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
            <Stack
              className={leftPreviewContainerStyle}
              verticalAlign="center"
              horizontalAlign="center"
              tokens={{ childrenGap: 13 }}>
              <div className={largeAvatarContainerStyle(selectedAvatar)}>
                <div className={largeAvatarStyle}>{selectedAvatar}</div>
              </div>
              <div aria-label="Display name" className={namePreviewStyle(name !== '')}>
                {name !== '' ? name : 'Name'}
              </div>
            </Stack>
            <Stack className={rightInputContainerStyle} tokens={{ childrenGap: 20 }}>
              <div>
                <div className={labelFontStyle}>Avatar</div>
                <FocusZone direction={FocusZoneDirection.horizontal}>
                  <Stack role="list" horizontal={true} tokens={{ childrenGap: 4 }}>
                    {avatarsList.map((avatar, index) => (
                      <div
                        role="listitem"
                        id={avatar}
                        key={index}
                        tabIndex={0}
                        data-is-focusable={true}
                        className={smallAvatarContainerStyle(avatar, selectedAvatar)}
                        onFocus={() => onAvatarChange(avatar)}
                      >
                        <div className={smallAvatarStyle}>{avatar}</div>
                      </div>
                    ))}
                  </Stack>
                </FocusZone>
              </div>
              <DisplayNameField
                setName={setName}
                setEmptyWarning={setEmptyWarning}
                setNameLengthExceedLimit={setNameLengthExceedLimit}
                validateName={validateName}
                isEmpty={emptyWarning}
                isNameLengthExceedLimit={isNameLengthExceedLimit}
              />
              <div>
                <PrimaryButton
                  id="join"
                  className={buttonStyle}
                  onClick={async () => {
                    await validateName();
                    if (emptyWarning === false && isNameLengthExceedLimit === false) {
                      joinChatHandler();
                    }
                  }}
                >
                  <ChatIcon className={chatIconStyle} size="medium" />
                  <div className={startChatButtonTextStyle}>Join event</div>
                </PrimaryButton>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </div>
    );
  };

  const configurationScreen = () => {
    return (
      <Stack className={mainContainerStyle} horizontalAlign="center" verticalAlign="center">
        {joinChatArea()}
      </Stack>
    );
  };

  return isJoining ? joinChatLoading() : configurationScreen();
};
