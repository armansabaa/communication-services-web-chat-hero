import { connect } from 'react-redux';
import { State } from '../core/reducers';
import LiveStreamControl, { LiveStreamControlProps } from '../components/LiveStreamControl';
import { StreamData,setStreamActionResult } from '../core/actions/LiveStreamActions'

const mapStateToProps = (state: State, props: LiveStreamControlProps) => ({
    roomId: state.event.roomId,
    ingestUrl: state.liveStream.liveStreamIngestUrl,
});

const mapDispatchToProps = (dispatch: any, props: LiveStreamControlProps) => ({
    startLiveStream: async(data: StreamData) => {  
        dispatch(setStreamActionResult(data));
    },
});

const connector: any = connect(mapStateToProps, mapDispatchToProps);
export default connector(LiveStreamControl);