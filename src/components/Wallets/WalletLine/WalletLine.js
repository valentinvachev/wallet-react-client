import { ReactComponent as Wallet } from './assets/wallet.svg';
import { ReactComponent as Remove } from './assets/remove.svg';
import { ReactComponent as Edit } from './assets/edit.svg';
import Context from '../../../context/Context';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../Button';
import { requester } from '../../../utils/requester';
import server from '../../../config/server';
import './WalletLine.scss';
import { priceFormatter } from '../../../utils/priceFormatter';

const WalletLine = ({ wallet, withEdit }) => {
    const { appState, changeAppState } = useContext(Context);
    const [inputWalletEditName, setInputWalletEditName] = useState(wallet.name);
    const [inputWalletEditNameError, setInputWalletEditNameError] =
        useState('');
    const [isOpenEdit, setOpenEdit] = useState(false);

    const handleRemove = async (wallet) => {
        try {
            const data = await requester(
                'DELETE',
                `${server}/api/wallets/${wallet.id}`,
                null
            );

            if (data && data.deleted) {
                changeAppState({
                    wallets: appState.wallets.filter(
                        (w) => Number(w.id) !== Number(wallet.id)
                    ),
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleEditWalletName = async () => {
        if (
            inputWalletEditName.trim() === '' ||
            inputWalletEditName.trim().length < 2
        ) {
            setInputWalletEditNameError(
                'Invalid wallet name. Name should be at least 2 symbols.'
            );
        } else {
            let data = null;
            try {
                data = await requester(
                    'PATCH',
                    `${server}/api/wallets/${wallet.id}`,
                    {
                        name: inputWalletEditName,
                    }
                );
            } catch (e) {
                console.log(e);
            }

            if (data && data.edited) {
                const walletsNew = appState.wallets.map((w) => {
                    if (Number(w.id) === Number(data.edited)) {
                        w.name = inputWalletEditName;
                    }
                    return w;
                });

                changeAppState({
                    wallets: [...walletsNew],
                });

                setInputWalletEditNameError('');
                setOpenEdit(false);
            }
        }
    };

    return (
        <>
            <div className='wallets-page-active-wallet'>
                {withEdit ? (
                    <>
                        <span
                            className='wallets-page-edit-wallet'
                            onClick={() => {
                                setOpenEdit(!isOpenEdit);
                            }}
                        >
                            <Edit />
                        </span>
                        <span
                            className='wallets-page-remove-wallet'
                            onClick={() => handleRemove(wallet)}
                        >
                            <Remove />
                        </span>
                    </>
                ) : null}
                <Link to={`wallet/${wallet.id}`}>
                    <Wallet className='wallets-page-wallet-icon' />{' '}
                </Link>
                <Link
                    className='wallets-page-wallet-name'
                    to={`wallet/${wallet.id}`}
                >
                    {wallet.name}
                </Link>
                {!withEdit ? (
                    <span
                        className={`${
                            wallet.balance > 0
                                ? 'positive-amount'
                                : 'negative-amount'
                        } wallet-line-wallet-balance`}
                    >
                        {priceFormatter(wallet.balance)}
                    </span>
                ) : null}
            </div>
            {isOpenEdit ? (
                <div className='wallets-page-edit-wallet-wrapper'>
                    <label>Name:</label>
                    <input
                        onChange={(e) => setInputWalletEditName(e.target.value)}
                        value={inputWalletEditName}
                        className={`${
                            inputWalletEditNameError ? 'input-error-filled' : ''
                        } input-field`}
                    />
                    <p
                        className={`${
                            inputWalletEditNameError
                                ? 'input-error-text-filled'
                                : ''
                        } input-error-text`}
                    >
                        {inputWalletEditNameError}
                    </p>
                    <Button
                        textContent='Submit'
                        onClick={handleEditWalletName}
                    />
                </div>
            ) : null}
        </>
    );
};

export default WalletLine;
