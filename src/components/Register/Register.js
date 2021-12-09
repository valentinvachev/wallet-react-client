import Button from '../Button';
import { useState } from 'react';
import { regexEmail, regexPassword } from '../../utils/regex';
import { requester } from '../../utils/requester';
import server from '../../config/server';
import './Register.scss';

const Register = ({ closeModal, setIsLoginOpen }) => {
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [username, setUsername] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async () => {
        let emailValid = true;
        let usernameValid = true;
        let passwordMatch = true;
        let confirmPassMatch = true;

        if (!email.match(regexEmail)) {
            setEmailError('Invalid email format');
            emailValid = false;
        } else {
            setEmailError('');
        }

        if (username.trim().length < 2) {
            setUsernameError('Username should be at least 2 symbols');
            usernameValid = false;
        } else {
            setUsernameError('');
        }

        if (!password.match(regexPassword)) {
            setPasswordError(
                'Should be at least 6 symbols with letters and digits'
            );
            passwordMatch = false;
        } else {
            setPasswordError('');
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords does not match');
            confirmPassMatch = false;
        } else {
            setConfirmPasswordError('');
        }

        if (emailValid && usernameValid && passwordMatch && confirmPassMatch) {
            try {
                const data = await requester(
                    'POST',
                    `${server}/api/users/register`,
                    { email, username, password, confirmPassword }
                );

                if (data && data.created) {
                    closeModal();
                    setIsLoginOpen(true);
                }
            } catch (e) {
                setEmailError(e.message);
            }
        }
    };

    return (
        <div className='register-modal'>
            <div className='register-modal-content'>
                <div className='register-modal-close-button'>
                    <p onClick={() => closeModal(false)}>Close</p>
                </div>
                <div className='register-modal-header-wrapper'>
                    <h4 className='register-modal-header'>Register</h4>
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
                <label>Username:</label>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className={`${
                        usernameError ? 'input-error-filled' : ''
                    } input-field`}
                />
                <p
                    className={`${
                        usernameError ? 'input-error-text-filled' : ''
                    } input-error-text`}
                >
                    {usernameError}
                </p>
                <label>Password:</label>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className={`${
                        passwordError ? 'input-error-filled' : ''
                    } input-field`}
                />
                <p
                    className={`${
                        passwordError ? 'input-error-text-filled' : ''
                    } input-error-text`}
                >
                    {passwordError}
                </p>
                <label>Confirm Password:</label>
                <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    className={`${
                        confirmPasswordError ? 'input-error-filled' : ''
                    } input-field`}
                />
                <p
                    className={`${
                        confirmPasswordError ? 'input-error-text-filled' : ''
                    } input-error-text`}
                >
                    {confirmPasswordError}
                </p>

                <Button textContent='Register' onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default Register;
