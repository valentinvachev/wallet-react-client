import { useContext, useEffect, useState } from 'react';
import Context from '../../context/Context';
import Footer from '../Footer';
import Header from '../Header';
import Button from '../Button';
import { requester } from '../../utils/requester';
import server from '../../config/server';
import WalletLine from './WalletLine';
import './Wallets.scss';

const Wallets = () => {
    const { appState, changeAppState } = useContext(Context);
    const [inputWalletValue, setInputWalletValue] = useState('');
    const [inputWalletAmount, setInputWalletAmount] = useState(0);
    const [inputWalletValueError, setInputWalletValueError] = useState('');
    const [inputWalletAmountError, setInputWalletAmountError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requester(
                    'GET',
                    `${server}/api/wallets`,
                    null
                );

                changeAppState({
                    wallets: data,
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    const handleNewWallet = async () => {
        if (
            inputWalletValue.trim() !== '' &&
            inputWalletValue.trim().length >= 2 &&
            !appState.wallets.includes(inputWalletValue) &&
            inputWalletAmount >= 0
        ) {
            let data = null;
            try {
                data = await requester('POST', `${server}/api/wallets`, {
                    name: inputWalletValue,
                    balance: inputWalletAmount,
                });
            } catch (e) {
                console.log(e);
            }

            if (data && data.created) {
                changeAppState({
                    wallets: [
                        ...appState.wallets,
                        {
                            id: data.created,
                            name: inputWalletValue,
                            amount: inputWalletAmount,
                        },
                    ],
                });
                setInputWalletValue('');
                setInputWalletAmount(0);
            }
        }

        if (
            inputWalletValue.trim() === '' ||
            inputWalletValue.trim().length < 2
        ) {
            setInputWalletValueError(
                'Invalid wallet name. Name should be at least 2 symbols.'
            );
        } else if (appState.wallets.includes(inputWalletValue)) {
            setInputWalletValueError('Wallet name already exists');
        } else {
            setInputWalletValueError('');
        }

        if (inputWalletAmount < 0) {
            setInputWalletAmountError('Invalid amount');
        } else {
            setInputWalletAmountError('');
        }
    };

    return (
        <>
            <Header />
            <div className='wallets-page'>
                {appState.wallets.length ? (
                    <div className='wallets-page-active-wallets-wrapper'>
                        <h1>Active Wallets</h1>
                        {appState.wallets.map((w) => (
                            <WalletLine wallet={w} key={w.id} withEdit={true} />
                        ))}
                    </div>
                ) : null}
                <div className='wallets-page-new-wallet-wrapper'>
                    <h1>Add New Wallet</h1>
                    <div className='wallets-page-new-wallet'>
                        <label>Wallet Name:</label>
                        <input
                            onChange={(e) =>
                                setInputWalletValue(e.target.value)
                            }
                            value={inputWalletValue}
                            className={`${
                                inputWalletValueError
                                    ? 'input-error-filled'
                                    : ''
                            } input-field`}
                        />
                        <p
                            className={`${
                                inputWalletValueError
                                    ? 'input-error-text-filled'
                                    : ''
                            } input-error-text`}
                        >
                            {inputWalletValueError}
                        </p>
                        <label>Wallet Amount:</label>
                        <input
                            type='number'
                            onChange={(e) =>
                                setInputWalletAmount(e.target.value)
                            }
                            value={inputWalletAmount}
                            className={`${
                                inputWalletAmountError
                                    ? 'input-error-filled'
                                    : ''
                            } input-field`}
                        />
                        <p
                            className={`${
                                inputWalletAmountError
                                    ? 'input-error-text-filled'
                                    : ''
                            } input-error-text`}
                        >
                            {inputWalletAmountError}
                        </p>
                    </div>
                    <Button textContent='Add' onClick={handleNewWallet} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Wallets;
