import { connect } from 'react-redux';

import OrganizerLandingScreen from '../components/OrganizerLandingScreen';
import { AcsRoom } from '../core/actions/EventAction';
import { createRoom, getEventInformation, getRooms } from '../core/sideEffects';

const mapDispatchToProps = (dispatch: any) => ({
  getRooms: (): Record<string, AcsRoom> => dispatch(getRooms()),
  createRoom: async (roomTitle: string, enableChat: boolean, enableCalling: boolean) => {
    dispatch(createRoom(roomTitle, enableChat, enableCalling));
  },
  getEventInfo: async () => dispatch(getEventInformation("acs_ve_06_07_2021"))
});

export default connect(undefined, mapDispatchToProps)(OrganizerLandingScreen);
