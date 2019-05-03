export const initialState = {
    side: 'question',
    currentIndex: 0,
    cards: []
};

export function shuffle(cards) {
    let out = Array.from(cards);

    for (let i = out.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));

        [out[i], out[j]] = [out[j], out[i]];
    }

    return out;
}

export function reorderTo(cards, ids) {
    ids = ids.filter(id => cards.findIndex(card => card.id === id) >= 0);

    for (let i = 0; i < ids.length; ++i) {
        let j = cards.findIndex(card => card.id === ids[i]);

        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
}

export function flashApp(state = initialState, action) {
    switch (action.type) {
        case 'FLIP_OR_NEXT_CARD':
            if (state.side === 'question') {
                return Object.assign({}, state, {
                    side: 'answer'
                });
            } else if (state.currentIndex < state.cards.length - 1) {
                return Object.assign({}, state, {
                    side: 'question',
                    currentIndex: state.currentIndex + 1
                });
            } else {
                return state;
            }
        case 'NEXT_CARD':
            return Object.assign({}, state, {
                side: 'question',
                currentIndex: Math.min(state.cards.length - 1, state.currentIndex + 1)
            });
        case 'PREV_CARD':
            return Object.assign({}, state, {
                side: 'question',
                currentIndex: Math.max(0, state.currentIndex - 1)
            });
        case 'SHUFFLE_CARDS':
            return Object.assign({}, state, {
                side: 'question',
                currentIndex: 0,
                cards: shuffle(state.cards)
            });
        case 'FLIP_CARD':
            return Object.assign({}, state, {
                side: state.side === 'question' ? 'answer' : 'question'
            });
        case 'REFRESH_CARDS':
            return Object.assign({}, state, {
                currentIndex: Math.min(state.currentIndex, action.cards.length - 1),
                cards: reorderTo(action.cards, state.cards.map(card => card.id))
            });
        case 'EDIT_CARD':
            return Object.assign({}, state, {
                cards: state.cards.map(card => {
                    if (card.id === action.id) {
                        return {
                            id: card.id,
                            question: action.question,
                            answer: action.answer
                        };
                    } else {
                        return card;
                    }
                })
            });
        case 'REMOVE_CARD':
            return Object.assign({}, state, {
                currentIndex: Math.min(state.currentIndex, state.cards.length - 2),
                cards: state.cards.filter(card => card.id !== action.id)
            });
        default:
            return state;
    }
}
