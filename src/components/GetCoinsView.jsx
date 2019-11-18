import React from 'react';
import './GetCoinsView.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { isValidAddress, isValidUrl } from '../utils/function';

class GetCoinsView extends React.Component {
    constructor() {
        super();
        this.inputValidated = {
            invalid: false,
            message: false,
            nodeInput: false,
            success: 0
        };
        this.state = {
            ...this.inputValidated
        }
        this.recaptchaRef = React.createRef();
        this.onchange = this.onchange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getInputErrors = this.getInputErrors.bind(this);
        this.recaptchaOnChange = this.recaptchaOnChange.bind(this);
    }

    getInputErrors() {
        if (!this.toAddress && !this.node) {
            return this.inputValidated = {
                invalid: 'invalid',
                message: 'Invalid Address! Please try again',
                nodeInput: 'Node Url can\'t be empty.'
            }
        }
        if (!this.toAddress || !isValidAddress(this.toAddress)) {
            return this.inputValidated = {
                invalid: 'invalid',
                message: 'Invalid Address! Please try again.',
                nodeInput: false
            }
        }
        if (!this.node || !isValidUrl(this.node)) {
            return this.inputValidated = {
                invalid: false,
                message: false,
                nodeInput: 'Invalid Url! Please try again.'
            }
        }
        return false;
    }

    onClick() {
        if (!this.getInputErrors()) {
            this.inputValidated = {
                invalid: false,
                message: false,
                nodeInput: false
            }

            fetch(`http://192.168.1.160:4555/faucet`, {
                method: 'POST',
                body: JSON.stringify({
                    toAddress: this.toAddress,
                    url: this.node
                }),
                headers: {
                    'Content-Type': ' application/json'
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.inputValidated.success = 1;
                }
            }).catch(error => console.error('Error:', error)).finally(() => {
                this.setState(this.inputValidated)
            });
        } else {
            this.setState(this.inputValidated)
        }
    }
    onchange({ target: { name, value } }) {
        this[name] = value;
    }

    recaptchaOnChange(value) {
        this.setState({
            'g-recaptcha-response': value
        })
    }

    render() {
        return (
            <div className="get-coins-content full-width flex-between">
                <div className="get-coins-container">
                    {
                        this.inputValidated.invalid ?
                            <p className="message-result">{this.inputValidated.message}</p> : null
                    }
                    <input className={`address-input ${this.inputValidated.invalid ? this.inputValidated.invalid : ""}`} name="toAddress" placeholder="Insert your address" onChange={this.onchange} />
                    {
                        this.inputValidated.nodeInput ?
                            <p className="node-error">{this.inputValidated.nodeInput}</p> : null
                    }
                    <div className="node-url-container flex-center">
                        <div className="node-url-text">
                            <p>Node Url</p>
                        </div>
                        <input className="node-url-input" name="node" onChange={this.onchange} />
                    </div>
                    <ReCAPTCHA
                        sitekey="6LfSYsMUAAAAALAZ_2jdeIKUkIiNn_biyHddemyu"
                        onChange={this.recaptchaOnChange}
                        ref="recaptcha"
                    />|
                <button className="get-coins-button" onClick={this.onClick}>GET COINS</button>
                </div>
                {
                    this.inputValidated.success === 1 ? (
                        <div className="get-coins-notification success flex-center">
                            <div className="notification-container full-width">
                                <p className="amount-text">We sent 1 coins to address:</p>
                                <p>{this.toAddress}</p>
                                <p className="tx-hash-text">Transaction: 023234234234234234234234234</p>
                            </div>
                        </div>
                    ) : null
                }
            </div >
        )
    }
}

export default GetCoinsView;