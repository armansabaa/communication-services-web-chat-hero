import { connect } from 'react-redux';
import { State } from '../core/reducers';
import axios from 'axios';
import { LiveStreamControlProps } from '../core/reducers/LiveStreamReducers';
import LiveStreamControl from '../components/LiveStreamControl';
import { StartActionResult } from '../core/actions/LiveStreamActions'

const startStreaming = async (roomId: string): Promise<StartActionResult> => {
    return (await axios.post("/livestream/" + roomId)).data;
};

const stopStreaming = async (roomId: string): Promise<void> => {
    return (await axios.delete("/livestream/" + roomId)).data;
};

const mapStateToProps = (state: State, props: LiveStreamControlProps) => ({
    currentState: state.liveStream,
    onStart: startStreaming,
    onStop: stopStreaming
});

const connector: any = connect(mapStateToProps);
export default connector(LiveStreamControl);