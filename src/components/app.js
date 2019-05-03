import React from 'react'
import {connect} from "react-redux";

import CardContainer from './card_container'
import ControlsContainer from './controls_container'

class App_ extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(event) {
        if (event.keyCode === 32)
            this.props.onNextOrFlipCard();
    };

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    render() {
        return <>
            <ControlsContainer />
            <CardContainer />
        </>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onNextOrFlipCard: () => { dispatch({ type: 'FLIP_OR_NEXT_CARD' }); },
    }
};

const App = connect(
    _state => { return {}; },
    mapDispatchToProps
)(App_);

export default App;