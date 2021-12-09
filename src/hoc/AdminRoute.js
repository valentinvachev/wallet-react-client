import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../context/Context';

const AdminRoute = ({ component: Component, ...rest }) => {
    const { appState } = useContext(Context);

    return (
        <Route
            {...rest}
            render={(props) =>
                appState.user.roles.includes('ADMIN') ? (
                    <Component {...props} />
                ) : (
                    <Redirect to='/' />
                )
            }
        />
    );
};

export default AdminRoute;
