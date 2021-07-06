import React, { useEffect } from 'react';
import { Checkbox, IStackTokens, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { containerTokens, eventHeaderTokens, headerStyle, upperStackStyle, upperStackTokens } from './styles/HomeScreen.styles';

export interface OrganizerLandingScreenProps {
  backToHomeHandler(): void;
}

const outerStackTokens: IStackTokens = {
  childrenGap: 20,
  padding: 10
};

export default (props: OrganizerLandingScreenProps): JSX.Element => {
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
        <TextField label="Room Topic" />
        <Checkbox label="Enable Chat" />
        <Checkbox label="Enable Calling" />
        <PrimaryButton onClick={(e) => {
        }} text="Create Room" />
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
