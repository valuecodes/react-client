import React, { Component } from 'react';
import { Buttons } from './buttons/Buttons';
import { Search } from './search/Search';
import { Stats } from './stats/Stats'

export class NavBar extends Component {
    render() {
        return (
            <div className='navBar'>
                <Buttons/>
                <Search addTicker={this.props.addTicker}/>
                <Stats/>
            </div>
        )
    }
}

export default NavBar
