import { connect } from 'react-redux';

import HomeScreen from '../components/HomeScreen';
import { createThread, getEventInformation } from '../core/sideEffects';

const mapStateToProps = () => ({
  createThreadHandler: () => {
    createThread();
  }
});

const mapDispatchToProps = (dispatch: any) => ({
  getEventInfo: async () => { dispatch(getEventInformation("acs_ve_06_07_2021")) },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
