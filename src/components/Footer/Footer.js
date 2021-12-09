import { useContext, useEffect } from 'react';
import server from '../../config/server';
import Context from '../../context/Context';
import { requester } from '../../utils/requester';
import './Footer.scss';

const Footer = () => {
    const { appState, changeAppState } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requester(
                    'GET',
                    `${server}/api/quotes?main=true`,
                    null
                );

                changeAppState({
                    quote: data,
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [appState.user.loggedIn]);

    return (
        <footer className='footer'>
            <div className='footer-text-wrapper'>
                <p>{appState.quote.text}</p>
                <p>{appState.quote.author}</p>
            </div>
        </footer>
    );
};

export default Footer;
