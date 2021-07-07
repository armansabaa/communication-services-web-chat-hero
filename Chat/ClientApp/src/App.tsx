import { loadTheme, initializeIcons } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ChatScreen from './containers/ChatScreen';
import RemovedFromThreadScreen from './components/RemovedFromThreadScreen';
import HomeScreen from './containers/HomeScreen';

import { reducer } from './core/reducers/index';
import { getBuildTime, getChatSDKVersion, getEventId } from './utils/utils';

import ConfigurationScreen from './containers/ConfigurationScreen';
import LoginScreen from './components/LoginScreen';
import OrganizerLandingScreen from './containers/OrganizerLandingScreen';

console.info(`Azure Communication Services chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

loadTheme({});
initializeIcons();

const store = createStore(reducer, applyMiddleware(thunk));

export default (): JSX.Element => {
  const [page, setPage] = useState('home');

  const getComponent = () => {
    if (getEventId() && page === 'home') {
      setPage('chatConfiguration');
    }

    if (page === 'home') {
      return <HomeScreen logInPageHandler={() => setPage('organizerLogin')} />;
    } else if (page === 'chatConfiguration') {
      return <ConfigurationScreen joinChatHandler={() => setPage('chat')} />;
    } else if (page === 'organizerLogin') {
      return <LoginScreen loginSuccessfulHandler={() => setPage('organizerLanding')} />
    } else if (page === 'organizerLanding') {
      return <OrganizerLandingScreen backToHomeHandler={() => setPage('home') }/>
    }
    else if (page === 'chat') {
      return (
        <ChatScreen
          removedFromThreadHandler={() => setPage('chat')}
        />
      );
    } else if (page === 'removedFromThread') {
      return <RemovedFromThreadScreen homeHandler={() => (window.location.href = window.location.origin)} />;
    }
  };

  return <Provider store={store}>{getComponent()}</Provider>;
};
