import React from 'react'
import {connect} from "react-redux";

import Controls from "./controls";

const mapStateToProps = state => {
    const index = state.currentIndex;
    const card = index < state.cards.length ? state.cards[index] : {};

    return Object.assign({
        hasAny: state.cards.length > 0,
    }, card);
};

function fetchJson(url, method, body) {
    return fetch(
        url,
        {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        }
    );
}

const mapDispatchToProps = dispatch => {
    return {
        onNewClick: () => {
            dispatch(dispatch => {
                let question = prompt('What is the question?');
                let answer = question && prompt('What is the answer?');

                if (question && answer) {
                    fetchJson('/cards', 'POST', {
                        question: question,
                        answer: answer
                    }).then(() => {
                        fetchJson('/cards', 'GET', null).then(response => {
                            response.json().then(cards => {
                                dispatch({ type: 'REFRESH_CARDS', cards });
                            });
                        })
                    });
                }
            });
        },
        onEditClick: (id, currentQuestion, currentAnswer) => {
            dispatch(dispatch => {
                let question = prompt('What is the question?', currentQuestion);
                let answer = question && prompt('What is the answer?', currentAnswer);

                if (question && answer) {
                    fetchJson('/cards', 'PATCH', {
                        id: id,
                        question: question,
                        answer: answer
                    }).then(() => {
                        dispatch({ type: 'EDIT_CARD', id, question, answer });
                    });
                }
            });
        },
        onDeleteClick: (id) => {
            dispatch(dispatch => {
                if (!confirm('Are you sure that you want to remove this card?'))
                    return;

                fetchJson('/cards', 'DELETE', { id: id }).then(() => {
                    dispatch({ type: 'REMOVE_CARD', id });
                });
            });
        },
    }
};

const ControlsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Controls);

export default ControlsContainer;
