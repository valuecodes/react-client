import React, { Component } from 'react'

export class CalenderMonth extends Component {
    render() {
        // console.log(this.props);
        return (
            <div className='calenderMonth'>
                <p>{this.props.ticker}</p>
                <p>{this.props.payment+' €'}</p>
            </div>
        )
    }
}

export default CalenderMonth
