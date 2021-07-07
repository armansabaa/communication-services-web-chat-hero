import { connect } from 'react-redux';

import OrganizerLandingScreen from '../components/OrganizerLandingScreen';
import { AcsRoom } from '../core/actions/EventAction';
import { State } from '../core/reducers';
import { createRoom, getRooms } from '../core/sideEffects';

const mapStateToProps = (state: State) => ({
  rooms: state.event.event?.rooms
});

const mapDispatchToProps = (dispatch: any) => ({
  getRooms: (): Record<string, AcsRoom> => dispatch(getRooms()),
  createRoom: async (roomTitle: string, enableChat: boolean, enableCalling: boolean) => {
    dispatch(createRoom(roomTitle, enableChat, enableCalling));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerLandingScreen);
