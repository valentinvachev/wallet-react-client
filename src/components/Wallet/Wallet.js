import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import server from '../../config/server';
import Context from '../../context/Context';
import { requester } from '../../utils/requester';
import Button from '../Button';
import Footer from '../Footer';
import Header from '../Header';
import './Wallet.scss';
import { priceFormatter } from '../../utils/priceFormatter';

const Wallet = () => {
    const { appState, changeAppState } = useContext(Context);
    const [isReportRequested, setReportRequested] = useState(false);
    const [isFirstDateSelected, setFirstDateSelected] = useState(false);
    const [isSecondDateSelected, setSecondDateDateSelected] = useState(false);
    const [reportStartDate, setReportStartDate] = useState(new Date());
    const [reportEndDate, setReportEndDate] = useState(reportStartDate);
    const [isReportOpen, setReportOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requester(
                    'GET',
                    `${server}/api/wallets/${location.pathname.split('/')[2]}`,
                    null
                );

                changeAppState({
                    walletDetails: {
                        ...data,
                        transactionWalletViewModelList:
                            data.transactionWalletViewModelList.map((t) => ({
                                ...t,
                                amount:
                                    t.type === 'EXPENSE'
                                        ? t.amount * -1
                                        : t.amount,
                            })),
                    },
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    const handleReportRequest = () => {
        if (isReportRequested) {
            setReportStartDate(new Date());
            setFirstDateSelected(false);
            setSecondDateDateSelected(false);
        } else {
            setReportOpen(false);
        }

        setReportRequested(!isReportRequested);
    };

    const handleFirstDateSelected = (value) => {
        setFirstDateSelected(true);
        setReportEndDate(value);
        setReportStartDate(value);
    };

    const handleSecondDateSelected = (value) => {
        setSecondDateDateSelected(true);
        setReportEndDate(value);
    };

    const handleSubmitRequest = async () => {
        try {
            const data = await requester(
                'GET',
                `${server}/api/wallets/${
                    location.pathname.split('/')[2]
                }?startDate=${new Date(
                    reportStartDate.getTime() -
                        reportStartDate.getTimezoneOffset() * 60000
                ).toISOString()}&endDate=${new Date(
                    reportEndDate.getTime() -
                        reportEndDate.getTimezoneOffset() * 60000
                ).toISOString()}`,
                null
            );

            if (data && data.transactionWalletViewModelList) {
                setReportOpen(true);
                handleReportRequest();

                changeAppState({
                    walletTransactionsByDate: {
                        totalAmount: data.totalAmount,
                        transactions: data.transactionWalletViewModelList.map(
                            (t) => ({
                                ...t,
                                amount:
                                    t.type === 'EXPENSE'
                                        ? t.amount * -1
                                        : t.amount,
                            })
                        ),
                    },
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    console.log(appState);

    return (
        <>
            <Header />
            <div className='wallet-page'>
                <div className='wallet-page-balance'>
                    <h1 className='wallet-balance'>Balance:</h1>
                    <span>{` `}</span>
                    <span
                        className={`${
                            appState.walletDetails.balance > 0
                                ? 'positive-amount'
                                : 'negative-amount'
                        } wallet-balance`}
                    >
                        {priceFormatter(appState.walletDetails.balance)}
                    </span>
                </div>
                {appState.walletDetails.transactionWalletViewModelList &&
                appState.walletDetails.transactionWalletViewModelList.length ? (
                    <div className='wallet-page-transactions-wrapper'>
                        <h1>Transactions</h1>
                        <div className='wallet-page-transactions-inner'>
                            {appState.walletDetails
                                .transactionWalletViewModelList &&
                                appState.walletDetails.transactionWalletViewModelList.map(
                                    (t) => (
                                        <div
                                            key={t.id}
                                            className='wallet-page-transaction'
                                        >
                                            <span
                                                className={`${
                                                    t.amount < 0
                                                        ? 'wallet-page-transaction-amount-red'
                                                        : ''
                                                } wallet-page-transaction-amount`}
                                            >
                                                {priceFormatter(t.amount)}
                                            </span>
                                            <span className='wallet-page-transaction-name'>
                                                {t.name}
                                            </span>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                ) : null}
                <div className='wallet-page-report-generator'>
                    <h1>Find Transactions</h1>
                    <Button
                        textContent={
                            isReportRequested
                                ? 'Close Report'
                                : 'Generate Report'
                        }
                        onClick={handleReportRequest}
                    />
                    {isSecondDateSelected ? (
                        <div className='submit-report-wrapper'>
                            <p>{`Report Start Date: ${
                                new Date(
                                    reportStartDate.getTime() -
                                        reportStartDate.getTimezoneOffset() *
                                            60000
                                )
                                    .toISOString()
                                    .split('T')[0]
                            }`}</p>
                            <p>{`Report End Date: ${
                                new Date(
                                    reportEndDate.getTime() -
                                        reportEndDate.getTimezoneOffset() *
                                            60000
                                )
                                    .toISOString()
                                    .split('T')[0]
                            }`}</p>
                            <Button
                                textContent='Submit Report'
                                onClick={handleSubmitRequest}
                            />
                        </div>
                    ) : (
                        <>
                            {isReportRequested && !isFirstDateSelected ? (
                                <div>
                                    <label>Report Start Date:</label>
                                    <div>
                                        <Calendar
                                            onChange={handleFirstDateSelected}
                                            value={reportStartDate}
                                            locale='en'
                                        />
                                    </div>
                                </div>
                            ) : null}
                            {isReportRequested && isFirstDateSelected ? (
                                <div>
                                    <label>Report End Date:</label>
                                    <div>
                                        <Calendar
                                            onChange={handleSecondDateSelected}
                                            value={reportEndDate}
                                            locale='en'
                                            minDate={reportStartDate}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
                {isReportOpen ? (
                    <div>
                        <h1>Report Transactions</h1>
                        <div className='wallet-page-transactions-wrapper'>
                            <h2 className='wallet-balance-report-total'>
                                Total Amount:
                                <span
                                    className={`${
                                        appState.walletTransactionsByDate.totalAmount > 0
                                            ? 'positive-amount'
                                            : 'negative-amount'
                                    } wallet-balance`}
                                >
                                    {
                                        priceFormatter(appState.walletTransactionsByDate
                                            .totalAmount)
                                    }
                                </span>
                            </h2>
                            <div className='wallet-page-transactions-inner'>
                                {appState.walletTransactionsByDate
                                    .transactions &&
                                    appState.walletTransactionsByDate.transactions.map(
                                        (t) => (
                                            <div
                                                key={t.id}
                                                className='wallet-page-transaction'
                                            >
                                                <span
                                                    className={`${
                                                        t.amount < 0
                                                            ? 'wallet-page-transaction-amount-red'
                                                            : ''
                                                    } wallet-page-transaction-amount`}
                                                >
                                                    {priceFormatter(t.amount)}
                                                </span>
                                                <span className='wallet-page-transaction-name'>
                                                    {t.name}
                                                </span>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <Footer />
        </>
    );
};

export default Wallet;
