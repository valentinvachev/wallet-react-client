import { useContext, useEffect } from 'react';
import server from '../../config/server';
import Context from '../../context/Context';
import { priceFormatter } from '../../utils/priceFormatter';
import { requester } from '../../utils/requester';
import Footer from '../Footer';
import Header from '../Header';
import WalletLine from '../Wallets/WalletLine';
import Pig from './assets/pig.jpg';
import './Home.scss';

const Home = () => {
    const { appState, changeAppState } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (appState.user.loggedIn) {
                    const dataIncome = await requester(
                        'GET',
                        `${server}/api/wallets?total=true`,
                        null
                    );

                    const dataWallets = await requester(
                        'GET',
                        `${server}/api/wallets`,
                        null
                    );

                    const dataCategories = await requester(
                        'GET',
                        `${server}/api/categories?groupBy=true`,
                        null
                    );

                    changeAppState({
                        wallets: dataWallets,
                        totalNetIncome: dataIncome,
                        categoriesTotals: dataCategories,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [appState.user.loggedIn]);

    return (
        <>
            <Header />
            <div className='home-page'>
                {appState.user.loggedIn ? (
                    <div className='home-page-logged-in'>
                        <div>
                            <h1>
                                Total Net Income:{' '}
                                <span
                                    className={`${
                                        appState.totalNetIncome > 0
                                            ? 'positive-amount'
                                            : 'negative-amount'
                                    } wallet-balance`}
                                >
                                    {priceFormatter(appState.totalNetIncome)}
                                </span>
                            </h1>
                        </div>
                        {appState.wallets.length ? (
                            <div className='home-page-wallet-wrapper'>
                                <h1>Wallets Balance</h1>
                                {appState.wallets.map((w) => (
                                    <WalletLine wallet={w} key={w.id} />
                                ))}
                            </div>
                        ) : null}
                        {appState.categoriesTotals.length ? (
                            <div className='home-page-categories-wrapper'>
                                <h1>Category Performance</h1>
                                {appState.categoriesTotals.filter(
                                    (w) => w.type === 'EXPENSE'
                                ).length ? (
                                    <div className='home-page-categories-expense-wrapper'>
                                        <h2>EXPENSE</h2>
                                        {appState.categoriesTotals
                                            .filter((c) => c.type === 'EXPENSE')
                                            .map((c) => (
                                                <div className='home-page-categories-expense-line'>
                                                    <span className='expense-line-name'>
                                                        {c.name}
                                                    </span>
                                                    <span className='expense-line-amount'>
                                                        -{priceFormatter(c.total)}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                ) : null}
                                {appState.categoriesTotals.filter(
                                    (w) => w.type === 'INCOME'
                                ).length ? (
                                    <div>
                                        <h2>INCOME</h2>
                                        {appState.categoriesTotals
                                            .filter((c) => c.type === 'INCOME')
                                            .map((c) => (
                                                <div className='home-page-categories-income-line'>
                                                    <span className='expense-line-name'>
                                                        {c.name}
                                                    </span>
                                                    <span className='income-line-amount'>
                                                        {priceFormatter(c.total)}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <div className='home-page-not-logged'>
                            <p className='home-page-not-logged-text'>
                                Wallet. Your Way to Start Saving Money.
                            </p>
                        </div>
                        <img src={Pig} className='home-page-not-logged-image' />
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Home;
