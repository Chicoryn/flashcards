const initialState = {
    side: 'question',
    currentIndex: 0,
    cards: [
        {question: 'Akterrunda', answer: 'Bågformen på ett segels akterlik'},
        {question: 'Akterstag', answer: 'Stagar masttoppen akteröver'},
        {question: 'Akterstagad', answer: 'En mast som har en viss lutning akteröver'},
    ]
};

function shuffle(cards) {
    let out = Array.from(cards);

    for (let i = out.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));

        [out[i], out[j]] = [out[j], out[i]];
    }

    return out;
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
        default:
            return state;
    }
}
