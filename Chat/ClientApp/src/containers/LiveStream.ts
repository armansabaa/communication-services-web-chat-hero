import { connect } from 'react-redux';
import { State } from '../core/reducers';
import LiveStream, { LiveStreamControlProps } from '../components/LiveStream';
import { StreamData,setStreamActionResult } from '../core/actions/LiveStreamActions'

const mapStateToProps = (state: State, props: LiveStreamControlProps) => ({
    roomId: state.event.roomId,
    liveStreamUrl: state.liveStream.liveStreamUrl
});

const mapDispatchToProps = (dispatch: any, props: LiveStreamControlProps) => ({
    startLiveStream: async(data: StreamData) => {  
        console.log(data);
        dispatch(setStreamActionResult(data));
    },
});

const connector: any = connect(mapStateToProps, mapDispatchToProps);
export default connector(LiveStream); 