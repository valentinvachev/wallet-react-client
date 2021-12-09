import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../context/Context';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { appState } = useContext(Context);

    return (
        <Route
            {...rest}
            render={(props) =>
                appState.user.loggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to='/' />
                )
            }
        />
    );
};

export default PrivateRoute;
