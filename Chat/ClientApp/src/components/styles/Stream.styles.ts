﻿import { mergeStyles } from '@fluentui/react';

const streamMainStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '500px',
  background: '#d2d0ce',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'space-around',
  flexDirection: 'column',
  alignItems: 'center'
});

const streamTextStyle = mergeStyles({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
})

const streamIconStyle = mergeStyles({
  fontSize: '2rem'
})

export {
  streamMainStyle,
  streamTextStyle,
  streamIconStyle
};
