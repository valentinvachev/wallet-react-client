import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Context, { initialState } from '../../context/Context';
import Login from '../Login';
import Register from '../Register';
import { ReactComponent as Wallet } from './assets/wallet.svg';
import { ReactComponent as Triangle } from './assets/triangle.svg';
import { useHistory } from 'react-router-dom';
import './Header.scss';

const Header = () => {
    const { appState, changeAppState } = useContext(Context);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMenuLogout, setMenuLogout] = useState(false);
    let history = useHistory();

    const handleLogout = () => {
        window.localStorage.removeItem('token_wallet');
        window.localStorage.removeItem('token_wallet_refresh');
        changeAppState(initialState);
        changeAppState({
            user: {
                ...appState.user,
                loggedIn: false,
            },
        });
        history.push('/');
    };

    const handleLogoClick = () => {
        history.push('/');
    };

    return (
        <header className='header'>
            <div>
                <Wallet className='header-logo' onClick={handleLogoClick} />
            </div>
            {appState.user.loggedIn ? (
                <>
                    <div className='header-profile-wrapper'>
                        <Triangle
                            className='header-triangle'
                            onClick={() => setMenuLogout(!isMenuLogout)}
                        />
                        <div
                            className={`${
                                isMenuLogout
                                    ? 'header-profile-logout-hidden'
                                    : ''
                            } header-profile-logout`}
                        >
                            {appState.user.roles.includes('ADMIN') ? (
                                <Link to='/admin'>Admin</Link>
                            ) : null}
                            <p onClick={handleLogout}>Logout</p>
                        </div>
                        <p>Welcome, {appState.user.username}</p>
                    </div>
                    <div className='header-link-wrapper'>
                        <Link to='/'>Home</Link>
                        <Link to='/transactions'>Transactions</Link>
                        <Link to='/categories'>Categories</Link>
                        <Link to='/wallets'>Wallets</Link>
                        <Link to='/events'>Events</Link>
                    </div>
                </>
            ) : (
                <>
                    <div className='header-link-wrapper'>
                        <span onClick={() => setIsLoginOpen(true)}>Login</span>
                        {isLoginOpen ? (
                            <Login closeModal={setIsLoginOpen} />
                        ) : null}
                        <span onClick={() => setIsRegisterOpen(true)}>
                            Register
                        </span>
                        {isRegisterOpen ? (
                            <Register
                                closeModal={setIsRegisterOpen}
                                setIsLoginOpen={setIsLoginOpen}
                            />
                        ) : null}
                        <Link to='/about'>About</Link>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
