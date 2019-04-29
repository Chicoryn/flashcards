import React from 'react'

export default class Controls extends React.Component {
    render() {
        const {hasAny} = this.props;
        const {id, question, answer} = this.props;

        return (
            <div className='controls'>
                <button className='toggle'>&#9776;</button>
                <ul className='dropdown'>
                    <li onClick={() => this.props.onEditClick(id, question, answer)} className={hasAny ? '' : 'disabled'}>
                        <span className='edit-icon'>&#9998;</span>
                        Edit
                    </li>
                    <li onClick={() => this.props.onDeleteClick(id)} className={hasAny ? '' : 'disabled'}>
                        <span className='delete-icon'>&times;</span>
                        Delete
                    </li>
                    <li className='separator' />
                    <li onClick={() => this.props.onNewClick()}>
                        <span className='new-icon'>+</span>
                        Add New
                    </li>
                </ul>
            </div>
        );
    }
}
