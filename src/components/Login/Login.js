import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import server from '../../config/server';
import Context from '../../context/Context';
import { regexEmail } from '../../utils/regex';
import { requester } from '../../utils/requester';
import Button from '../Button';
import './Login.scss';

const Login = ({ closeModal }) => {
    const { appState, changeAppState } = useContext(Context);
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();


    const handleSubmit = async () => {
        let emailValid = true;

        if (!email.match(regexEmail)) {
            setEmailError('Invalid email format');
            emailValid = false;
        } else {
            setEmailError('');
        }

        if (emailValid) {
            try {
                const response = await fetch(`${server}/login`, {
                    method: 'POST',
                    body: new URLSearchParams({
                        email: email,
                        password: password,
                    }),
                });

                if (!response.ok) {
                    throw { message: 'User does not exist' };
                }

                const data = await response.json();

                if (data.access_token) {
                    window.localStorage.setItem(
                        'token_wallet',
                        data.access_token
                    );

                    window.localStorage.setItem(
                        'token_wallet_refresh',
                        data.refresh_token
                    );

                    const dataUser = await requester(
                        'GET',
                        `${server}/api/users/info`,
                        null
                    );

                    changeAppState({
                        user: {
                            ...appState.user,
                            username: dataUser.username,
                            id: dataUser.id,
                            email: email,
                            loggedIn: true,
                            roles: dataUser.roles
                        },
                    });

                    closeModal();
                    history.push('/');
                }
            } catch (e) {
                setEmailError(e.message);
            }
        }
    };

    return (
        <div className='login-modal'>
            <div className='login-modal-content'>
                <div className='login-modal-close-button'>
                    <p onClick={() => closeModal(false)}>Close</p>
                </div>
                <div className='login-modal-header-wrapper'>
                    <h4 className='login-modal-header'>Login</h4>
                </div>
                <label>Email:</label>
                <input
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className={`${
                        emailError ? 'input-error-filled' : ''
                    } input-field`}
                />
                <p
                    className={`${
                        emailError ? 'input-error-text-filled' : ''
                    } input-error-text`}
                >
                    {emailError}
                </p>
                <label>Password:</label>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />

                <Button textContent='Login' onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default Login;
