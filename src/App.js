import Home from './components/Home';
import Wallets from './components/Wallets';
import { ContextProvider, initialState } from './context/Context';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import Transactions from './components/Transactions/Transactions';
import Events from './components/Events/Events';
import Wallet from './components/Wallet/Wallet';
import Categories from './components/Categories';
import server from './config/server';
import { requester } from './utils/requester';
import PrivateRoute from './hoc/PrivateRoute';
import AdminRoute from './hoc/AdminRoute';
import Admin from './components/Admin';
import './App.scss';
import About from './components/About';


function App() {
    const [stateValue, setStateValue] = useState(initialState);

    useEffect(() => {
        const fetchData = async () => {
            if (stateValue.user.loggedIn && !stateValue.user.id) {
                const dataUser = await requester(
                    'GET',
                    `${server}/api/users/info`,
                    null
                );

                changeAppState({
                    user: {
                        ...stateValue.user,
                        username: dataUser.username,
                        id: dataUser.id,
                        email: dataUser.email,
                        loggedIn: true,
                        roles: dataUser.roles
                    },
                });
            }
        };
        fetchData();
    }, []);

    const changeAppState = useCallback((newState) => {
        setStateValue((oldState) => {
            return {
                ...oldState,
                ...newState,
            };
        });
    }, []);

    return (
        <BrowserRouter>
            <ContextProvider
                value={{
                    appState: stateValue,
                    changeAppState,
                }}
            >
                <div className='App'>
                    <Switch>
                        <Route path={'/'} exact component={Home} />
                        <Route path={'/about'} exact component={About} />
                        <AdminRoute path={'/admin'} exact component={Admin} />
                        <PrivateRoute path={'/wallets'} component={Wallets} />
                        <PrivateRoute
                            path={'/transactions'}
                            component={Transactions}
                        />

                        <PrivateRoute path={'/events'} component={Events} />
                        <PrivateRoute path={'/wallet/:id'} component={Wallet} />
                        <PrivateRoute
                            path={'/categories'}
                            component={Categories}
                        />
                    </Switch>
                </div>
            </ContextProvider>
        </BrowserRouter>
    );
}

export default App;
