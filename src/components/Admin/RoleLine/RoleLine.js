import { useContext } from 'react';
import server from '../../../config/server';
import Context from '../../../context/Context';
import { requester } from '../../../utils/requester';
import Button from '../../Button';

const RoleLine = ({ user }) => {
    const { appState, changeAppState } = useContext(Context);

    const handleChange = async () => {
        let data;
        if (user.roles.includes('ADMIN')) {
            data = await requester(
                'PATCH',
                `${server}/api/users/${user.id}?admin=false`,
                null
            );

            if (data.updated) {
                changeAppState({
                    users: [
                        ...appState.users.map((u) => {
                            if (u.id === data.updated) {
                                const user = u;
                                user.roles = user.roles.filter(
                                    (r) => r !== 'ADMIN'
                                );
                                return user;
                            }
                            return u;
                        }),
                    ],
                });
            }
        } else {
            data = await requester(
                'PATCH',
                `${server}/api/users/${user.id}?admin=true`,
                null
            );

            if (data.updated) {
                changeAppState({
                    users: [
                        ...appState.users.map((u) => {
                            if (u.id === data.updated) {
                                const user = u;
                                user.roles = ['ADMIN', ...user.roles];
                                return user;
                            }
                            return u;
                        }),
                    ],
                });
            }
        }
    };

    return (
        <>
            <div className='admin-role-line'>
                <span
                    className='admin-role-line-email 
    admin-role-line-span'
                >
                    {user.email || ''}
                </span>
                <span
                    className='admin-role-line-action 
    admin-role-line-span'
                >
                    {user.roles.join(', ')}
                </span>
                <span
                    className='admin-action-line-action 
    admin-role-line-span'
                >
                    <Button
                        textContent={
                            user.roles.includes('ADMIN')
                                ? 'Remove ADMIN ROLE'
                                : 'Add AMIN ROLE'
                        }
                        onClick={handleChange}
                    />
                </span>
            </div>
        </>
    );
};

export default RoleLine;
