import { connect } from 'react-redux';
import { State } from '../core/reducers';
import axios from 'axios';
import { LiveStreamControlProps } from '../core/reducers/LiveStreamReducers';
import LiveStreamControl from '../components/LiveStreamControl';
import { StartActionResult } from '../core/actions/LiveStreamActions'

const mapStateToProps = (state: State, props: LiveStreamControlProps) => ({
    currentState: state.liveStream,
    onStart: async (roomId: string): Promise<StartActionResult> => {
        return (await axios.post("/livestream/" + roomId)).data;
    },
    onStop: async (roomId: string): Promise<void> => {
        return (await axios.delete("/livestream/" + roomId)).data;
    }
});

const mapDispatchToProps = async (dispatch: any, props: LiveStreamControlProps) => {
   
};

const connector: any = connect(mapStateToProps, mapDispatchToProps);
export default connector(LiveStreamControl);