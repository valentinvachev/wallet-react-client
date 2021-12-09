import React from 'react';

const Context = React.createContext({
    appState: {},
    changeAppState: () => {},
});

export const initialState = {
    user: {
        id: '',
        username: '',
        email: '',
        roles: [],
        loggedIn: window.localStorage.getItem('token_wallet') ? true : false,
    },
    wallets: [],
    walletDetails: {},
    events: [],
    lastFiveTransactions: [],
    walletTransactionsByDate: {
        totalAmount: '',
        transactions: []
    },
    categories: {
        INCOME: [],
        EXPENSE: [],
    },
    users: [],
    totalNetIncome: '',
    categoriesTotals: [],
    quote: {
        text: '',
        author: ''
    }
};

export const ContextProvider = Context.Provider;
export default Context;
