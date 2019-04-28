import React from 'react'
import {connect} from "react-redux";

import Card from "./card";

const mapStateToProps = state => {
    const index = state.currentIndex;
    const card = index < state.cards.length ? state.cards[index] : {};

    return Object.assign({
        hasPrev: index > 0,
        hasNext: index < state.cards.length - 1,
        side: state.side
    }, card);
};

const mapDispatchToProps = dispatch => {
    return {
        onNextClick: () => { dispatch({ type: 'NEXT_CARD' }); },
        onPrevClick: () => { dispatch({ type: 'PREV_CARD' }); },
        onShuffleClick: () => { dispatch({ type: 'SHUFFLE_CARDS' }); },
        onFlipClick: () => { dispatch({ type: 'FLIP_CARD' }); }
    }
};

const CardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Card);

export default CardContainer;
