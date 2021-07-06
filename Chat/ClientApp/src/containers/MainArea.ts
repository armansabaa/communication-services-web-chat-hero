import { connect } from 'react-redux';

import MainArea from '../components/MainArea';
import { AcsRoom, setRoomId } from '../core/actions/EventAction';
import { createRoom, getRooms, resetMessages } from '../core/sideEffects';

const mapDispatchToProps = (dispatch: any) => ({
  resetMessages: () => {
    dispatch(resetMessages());
  },
  getRooms: (): Record<string, AcsRoom> => dispatch(getRooms()),
  setActiveRoom: (roomId: string) => {
    dispatch(setRoomId(roomId));
  },
  createRoom: () => {
    dispatch(createRoom());
  }
});

export default connect(undefined, mapDispatchToProps)(MainArea);
