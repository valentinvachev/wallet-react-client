import { useContext, useEffect, useState } from 'react';
import server from '../../config/server';
import Context from '../../context/Context';
import { priceFormatter } from '../../utils/priceFormatter';
import { requester } from '../../utils/requester';
import Button from '../Button';
import DropDown from '../DropDown';
import Footer from '../Footer';
import Header from '../Header';
import './Transactions.scss';

const Transactions = () => {
    const { appState, changeAppState } = useContext(Context);
    const [transactionNameError, setTransactionNameError] = useState('');
    const [transactionAmountError, setTransactionAmountError] = useState('');
    const [transactionName, setTransactionName] = useState('');
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionCategoryParent, setTransactionCategoryParent] =
        useState('');
    const [transactionCategory, setTransactionCategory] = useState();
    const [transactionWallet, setTransactionWallet] = useState('');
    const [transactionEvent, setTransactionEvent] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataTransactions = await requester(
                    'GET',
                    `${server}/api/transactions?last=true`,
                    null
                );

                const dataWallets = await requester(
                    'GET',
                    `${server}/api/wallets`,
                    null
                );

                const dataEvents = await requester(
                    'GET',
                    `${server}/api/events?active=true`,
                    null
                );

                const dataCategories = await requester(
                    'GET',
                    `${server}/api/categories`,
                    null
                );

                setTransactionCategoryParent(
                    Object.keys(dataCategories)[0] || ''
                );
                setTransactionCategory(
                    Object.keys(dataCategories).length
                        ? dataCategories[Object.keys(dataCategories)[0]][0]
                              ?.name
                        : ''
                );

                setTransactionWallet(
                    dataWallets.length ? dataWallets[0]?.name : ''
                );

                changeAppState({
                    lastFiveTransactions: dataTransactions.map((t) => ({
                        ...t,
                        date: t.createdAt.split('T')[0],
                        amount:
                            t.categoryType === 'EXPENSE'
                                ? t.amount * -1
                                : t.amount,
                    })),
                    wallets: dataWallets,
                    events: dataEvents,
                    categories: {
                        INCOME: dataCategories['INCOME'],
                        EXPENSE: dataCategories['EXPENSE'],
                    },
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    const handleTransactionParentChange = (value) => {
        setTransactionCategory(appState.categories[value][0].name);
        setTransactionCategoryParent(value);
    };

    const handleNewTransaction = async () => {
        if (
            transactionName &&
            transactionAmount > 0 &&
            transactionCategoryParent &&
            transactionCategory &&
            transactionWallet
        ) {
            const data = await requester('POST', `${server}/api/transactions`, {
                name: transactionName,
                amount: transactionAmount,
                event:
                    transactionEvent === ''
                        ? undefined
                        : appState.events.find(
                              (e) => e.name === transactionEvent
                          ).id,
                category: appState.categories[transactionCategoryParent].find(
                    (e) => e.name === transactionCategory
                ).id,
                wallet: appState.wallets.find(
                    (e) => e.name === transactionWallet
                ).id,
            });

            if (data && data.created) {
                changeAppState({
                    lastFiveTransactions: [
                        {
                            id: data.created,
                            date: new Date().toISOString().split('T')[0],
                            wallet: transactionWallet,
                            amount:
                                transactionCategoryParent === 'EXPENSE'
                                    ? transactionAmount * -1
                                    : transactionAmount,
                            name: transactionName,
                        },
                        ...appState.lastFiveTransactions.slice(0, 4),
                    ],
                });

                setTransactionName('');
                setTransactionAmount('');
            }
        }

        if (!transactionName) {
            setTransactionNameError('Invalid name');
        } else {
            setTransactionNameError('');
        }

        if (transactionAmount <= 0) {
            setTransactionAmountError('Invalid amount');
        } else {
            setTransactionAmountError('');
        }
    };

    return (
        <>
            <Header />
            <div className='transactions-page'>
                {appState.lastFiveTransactions.length ? (
                    <div className='transactions-page-last'>
                        <h1>Last Transactions</h1>
                        {appState.lastFiveTransactions.map((t) => (
                            <div
                                key={t.id}
                                className='transaction-page-last-transaction'
                            >
                                <span className='last-transaction-date'>
                                    {t.date}
                                </span>
                                <span
                                    className={`${
                                        t.amount < 0
                                            ? 'last-transaction-amount-red'
                                            : ''
                                    } last-transaction-amount`}
                                >
                                    {priceFormatter(t.amount)}
                                </span>
                                <span className='last-transaction-name'>
                                    {t.name}
                                </span>
                                <span className='last-transaction-wallet'>
                                    {t.wallet}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : null}
                <div className='transactions-page-new-wrapper'>
                    <h1>New Transaction</h1>
                    {appState.wallets.length &&
                    appState.categories['INCOME'].length &&
                    appState.categories['EXPENSE'].length ? (
                        <>
                            <div className='transaction-page-new'>
                                <label>Name:</label>
                                <input
                                    onChange={(e) =>
                                        setTransactionName(e.target.value)
                                    }
                                    value={transactionName}
                                    className={`${
                                        transactionNameError
                                            ? 'input-error-filled'
                                            : ''
                                    } input-field`}
                                />
                                <p
                                    className={`${
                                        transactionNameError
                                            ? 'input-error-text-filled'
                                            : ''
                                    } input-error-text`}
                                >
                                    {transactionNameError}
                                </p>
                                <label>Category Type:</label>
                                <DropDown
                                    data={Object.keys(appState.categories)}
                                    selected={transactionCategoryParent}
                                    handleChange={handleTransactionParentChange}
                                />
                                <label>Category:</label>
                                <DropDown
                                    data={
                                        transactionCategoryParent
                                            ? appState.categories[
                                                  transactionCategoryParent
                                              ].map((v) => v.name)
                                            : []
                                    }
                                    selected={transactionCategory}
                                    handleChange={setTransactionCategory}
                                />
                                <label>Amount:</label>
                                <input
                                    type='number'
                                    min='0'
                                    onChange={(e) =>
                                        setTransactionAmount(e.target.value)
                                    }
                                    value={transactionAmount}
                                    className={`${
                                        transactionAmountError
                                            ? 'input-error-filled'
                                            : ''
                                    } input-field`}
                                />
                                <p
                                    className={`${
                                        transactionAmountError
                                            ? 'input-error-text-filled'
                                            : ''
                                    } input-error-text`}
                                >
                                    {transactionAmountError}
                                </p>
                                <label>Wallet:</label>
                                <DropDown
                                    data={appState.wallets.map((v) => v.name)}
                                    selected={transactionWallet}
                                    handleChange={setTransactionWallet}
                                />
                                {appState.events.length ? (
                                    <>
                                        <label>Event:</label>
                                        <DropDown
                                            data={[
                                                '',
                                                ...appState.events.map(
                                                    (v) => v.name
                                                ),
                                            ]}
                                            selected={transactionEvent}
                                            handleChange={setTransactionEvent}
                                        />
                                    </>
                                ) : null}
                            </div>
                            <Button
                                textContent='Add'
                                onClick={handleNewTransaction}
                            />
                        </>
                    ) : (
                        <p>
                            Before adding а new transaction you must add at
                            least one Wallet, Expense Category And Income
                            Category
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Transactions;
