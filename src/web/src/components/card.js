import React from 'react'

export default class Card extends React.Component {
    render() {
        const {hasPrev, hasNext, side} = this.props;
        const navigationButtons = <>
            <button onClick={this.props.onPrevClick} className={hasPrev ? 'prev' : 'prev disabled'}>Prev</button>
            <button onClick={this.props.onNextClick} className={hasNext ? 'next' : 'next disabled'}>Next</button>
        </>;
        const shuffleButton = <>
            <button onClick={this.props.onShuffleClick} className='shuffle'>Click to try again</button>
        </>;

        return (
            <>
                <div className={'card' + (side === 'answer' ? ' flip' : '')}>
                    <div className='title'>{side}</div>
                    <div className='body'>
                        {this.props[side]}
                    </div>
                    <div className='footer'>
                        <button onClick={event => this.props.onFlipClick(event)} className='flip'>Flip</button>
                    </div>
                </div>
                <div className='card-nav'>
                    {navigationButtons}
                </div>
                {!hasNext && <div className='card-nav'>
                    {shuffleButton}
                </div>}
                <div className='shortcuts'>
                    Press <b>Space</b> to:
                    <ul>
                        <li>If you are looking at the question, flip the current card.</li>
                        <li>If you are looking at the answer, proceed to the next card.</li>
                    </ul>
                </div>
            </>
        );
    }
}
