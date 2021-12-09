import React, { useContext, useEffect } from 'react';
import server from '../../config/server';
import Context from '../../context/Context';
import { requester } from '../../utils/requester';
import Footer from '../Footer';
import Header from '../Header';
import './Admin.scss';
import RoleHeaderLine from './RoleHeaderLine/RoleHeaderLine';
import RoleLine from './RoleLine/RoleLine';

const Admin = () => {
    const { appState, changeAppState } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requester(
                    'GET',
                    `${server}/api/users`,
                    null
                );

                changeAppState({
                    users: data,
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Header />
            <div className='admin-page'>
                <div className='admin-page-users-wrapper'>
                    <h1>Admin</h1>
                    <div className='admin-section-content-wrapper'>
                        <h2 className='admin-section-heading'>Active users</h2>
                        <div className='admin-section-content admin-section-content-no-gap'>
                            <RoleHeaderLine />
                            {appState.users.map((u, i) => (
                                <RoleLine user={u} key={`${u._id}${i}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Admin;
