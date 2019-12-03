import React from 'react';
import './GetCoinsView.css';
import { url } from '../globals';
import ReCAPTCHA from 'react-google-recaptcha';
import { isValidAddress, isValidUrl } from '../utils/function';

class GetCoinsView extends React.Component {
    constructor() {
        super();
        this.inputValidated = {
            invalid: false,
            message: false,
            nodeInput: false,
            blackList: false,
            messageError: '',
            success: 0
        };
        this.state = {
            recaptchaResponse: false,
            ...this.inputValidated
        }
        this.onchange = this.onchange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getInputErrors = this.getInputErrors.bind(this);
        this.recaptchaOnChange = this.recaptchaOnChange.bind(this);
    }

    getInputErrors() {
        if (!isValidAddress(this.toAddress) && !isValidUrl(this.node)) {
            return this.inputValidated = {
                invalid: 'invalid',
                message: 'Invalid Address! Please try again.',
                nodeInput: 'Invalid Url! Please try again.'
            }
        }
        if (!isValidAddress(this.toAddress) && isValidUrl(this.node)) {
            return this.inputValidated = {
                invalid: 'invalid',
                message: 'Invalid Address! Please try again.',
                nodeInput: false
            }
        }

        if (isValidAddress(this.toAddress) && !isValidUrl(this.node)) {
            return this.inputValidated = {
                invalid: false,
                nodeInput: 'Invalid Url! Please try again.'
            }
        }

        return false;
    }

    onClick() {
        if (!this.getInputErrors() && this.state.recaptchaResponse) {
            this.inputValidated = {
                invalid: false,
                message: false,
                nodeInput: false,
            }

            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    toAddress: this.toAddress,
                    url: this.node
                }),
                headers: {
                    'Content-Type': ' application/json'
                }
            }).then(async (response) => {

                if (response.status === 200) {
                    this.inputValidated.success = 1;
                    let data = await response.json();
                    this.inputValidated.txHash = data.txHash
                    this.setState({ ...this.state, ...this.inputValidated });
                }

                this.inputValidated.blackList = true

                this.inputValidated.messageError = await response.json();
                this.setState({ ...this.state, ...this.inputValidated });

            }).catch(error => { }).finally(() => {
                this.setState({ ...this.state, ...this.inputValidated })
            });
        } else {
            this.setState({ ...this.state, ...this.inputValidated })
        }
    }
    onchange({ target: { name, value } }) {
        this[name] = value;
    }

    recaptchaOnChange(value) {
        this.setState({
            recaptchaResponse: value,
            ...this.inputValidated
        })
    }

    render() {
        return (
            <div className="get-coins-content full-width flex-between">
                <div className="get-coins-container">
                    {
                        this.inputValidated.blackList === true ?
                            <p className="blacklist-message">{this.inputValidated.messageError}</p> : null
                    }
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
                    <div>
                        <ReCAPTCHA
                            sitekey="6LfSYsMUAAAAALAZ_2jdeIKUkIiNn_biyHddemyu"
                            onChange={this.recaptchaOnChange}
                            ref="recaptcha"
                        />
                    </div>
                    <button className="get-coins-button" onClick={this.onClick}>GET COINS</button>
                </div>
                {
                    this.inputValidated.success === 1 ? (
                        <div className="get-coins-notification success flex-center">
                            <div className="notification-container full-width">
                                <p className="amount-text">We sent 1 grandPaCoin to address:</p>
                                <p>{this.toAddress}</p>
                                <p className="tx-hash-text">{`Transaction: 0x${this.inputValidated.txHash} `}</p>
                            </div>
                        </div>
                    ) : null
                }
            </div >
        )
    }
}

export default GetCoinsView;