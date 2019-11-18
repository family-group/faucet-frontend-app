import React from 'react';
import './FaucetView.css';
import Header from './Header';
import GetCoinsView from './GetCoinsView';

class FaucetView extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedIndex: 0,
        }
        this.selectSeccion = this.selectSeccion.bind(this);
    }

    selectSeccion = (index) => () => {
        this.setState({ selectedIndex: index })
    }

    render() {
        return (
            <div className="container">
                <Header />
                <div className="faucet-view-principal flex-center">
                    <div className="faucet-view-container">
                        <div className="full-width flex">
                            <div className="faucet-view-sections">
                                <div className={`get-coins-section ${this.state.selectedIndex === 0 ? 'active' : ''}`} onClick={this.selectSeccion(0)}>
                                    <p className="full-width">Get Coins</p>
                                </div>
                                <div className={`donate-coins-section flex ${this.state.selectedIndex === 1 ? 'active' : ''}`} onClick={this.selectSeccion(1)}>
                                    <p className="full-width">Donate Coins</p>
                                </div>
                            </div>
                        </div>
                        <div className="panel-content-container full-width flex">
                            {
                                this.state.selectedIndex === 0 ?
                                    <GetCoinsView /> :
                                    (
                                        <div className="donate-section flex wrap full-width">
                                            <p className="address-text">{`Our address is: 0xFe711fa35F0A060dAc55feDB68D52F610532bBC7`}</p>
                                            <p className="thanks-text">Thank you for donating!</p>
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FaucetView;