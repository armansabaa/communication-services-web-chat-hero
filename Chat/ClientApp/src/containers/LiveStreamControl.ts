import { connect } from 'react-redux';
import { State } from '../core/reducers';
import axios from 'axios';
import { LiveStreamControlProps, LiveStreamState } from '../core/reducers/LiveStreamReducers';
import LiveStreamControl from '../components/LiveStreamControl';
import { StartActionResult, LiveStreamActionType, START_LIVE_STREAM, STOP_LIVE_STREAM } from '../core/actions/LiveStreamActions'

const mapStateToProps = (state: State, props: LiveStreamControlProps) => ({
    currentState: state.liveStream,
    onStart: async (roomId: string): Promise<StartActionResult> => {
        return axios.post("/livestream/" + roomId);
    },
    onStop: async (roomId: string): Promise<void> => {
        return axios.delete("/livestream/" + roomId);
    }
});

const mapDispatchToProps = async (dispatch: any, props: LiveStreamControlProps) => {
    let startResult = await props.onStart("room8");
    return {
        currentState: {
            isLive: true,
            ingestUrl: startResult.ingestUrl,
            amsUrl: startResult.liveOutputUrl
        }
    };
};

const connector: any = connect(mapStateToProps, mapDispatchToProps);
export default connector(LiveStreamControl);