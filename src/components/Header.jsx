import React from 'react';
// import styles
import './Header.css';
import GpcIcon from '../assets/grandpacoin.png';

class Header extends React.Component {
    render() {
        return (
            <div className="header-container">
                <div className="header-icon">
                    <img alt="grandpadcoin-logo" src={GpcIcon} />
                </div>
            </div>
        )
    }
}

export default Header;
