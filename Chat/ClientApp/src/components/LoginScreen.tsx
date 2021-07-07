import { PrimaryButton, Stack, Spinner, Image, TextField } from '@fluentui/react';
import { ChatIcon } from '@fluentui/react-icons-northstar';
import React, { useEffect, useState } from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';

import { buttonStyle, chatIconStyle, imageStyleProps, inputBoxStyle, inputBoxTextStyle, inputBoxWarningStyle, mainContainerStyle, TextFieldStyleProps, warningStyle } from './styles/ConfigurationScreen.styles';
import {
  labelFontStyle,
  leftPreviewContainerStyle,
  namePreviewStyle,
  rightInputContainerStyle,
  startChatButtonTextStyle
} from './styles/ConfigurationScreen.styles';
import DisplayNameField from './DisplayNameField';
import { ENTER_KEY, MAXIMUM_LENGTH_OF_NAME } from '../constants';
import heroSVG from '../assets/hero.svg';
import { upperStackTokens } from './styles/EndChat.styles';
import { upperStackStyle, headerStyle, imgStyle, containerTokens, eventHeaderTokens } from './styles/HomeScreen.styles';

export interface ConfigurationScreenProps {
  loginSuccessfulHandler(): void;
}

export default (props: ConfigurationScreenProps): JSX.Element => {
  const spinnerLabel = 'Logging in to organizer page...';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');


  const [emptyWarning, setEmptyWarning] = useState(false);

  const [isNameLengthExceedLimit, setNameLengthExceedLimit] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);

  const [isJoining, setIsJoining] = useState(false);

  const onPasswordChange = (event: any) => {
    if (!event.target.value) {
      setEmptyWarning(true);
    }
    setPassword(event.target.value);
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
      }
    }
  };

  const validatePassword = () => {
    if (password !== "ve123*") {
      setIsIncorrectPassword(true);
    } else {
      setIsIncorrectPassword(false);
    }
  }
  // const getEventInfoProp = props.getEventInfo;

  useEffect(() => {
    document.getElementById('🐱')?.focus();
  }, []);

  const imageProps = { src: heroSVG.toString() };
  const headerTitle = 'Log in to room organizer page';

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
            <Stack className={rightInputContainerStyle} >
              <DisplayNameField
                setName={setName}
                setEmptyWarning={setEmptyWarning}
                setNameLengthExceedLimit={setNameLengthExceedLimit}
                validateName={validateName}
                isEmpty={emptyWarning}
                isNameLengthExceedLimit={isNameLengthExceedLimit}
              />
              <div className={labelFontStyle}>Password</div>
              <TextField
                type='password'
                autoComplete="off"
                inputClassName={inputBoxTextStyle}
                ariaLabel="Enter your password"
                borderless={true}
                className={emptyWarning || isNameLengthExceedLimit ? inputBoxWarningStyle : inputBoxStyle}
                id="password"
                placeholder="Enter your password"
                onKeyDown={(ev) => {
                  if (ev.which === ENTER_KEY) {
                    validateName();
                  }
                }}
                onChange={onPasswordChange}
                styles={TextFieldStyleProps}
              />
              {(isIncorrectPassword && (
                  <div role="alert" className={warningStyle}>
                    {' '}
            Password is incorrect{' '}
                  </div>
                ))}
              <div>
                <PrimaryButton
                  id="login"
                  className={buttonStyle}
                  onClick={async () => {
                    await validateName();
                    await validatePassword();
                    if (name.length != 0 && password === "ve123*") {
                      props.loginSuccessfulHandler();
                    }
                  }}
                >
                  <div className={startChatButtonTextStyle}>Log In</div>
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

  return configurationScreen();
};
