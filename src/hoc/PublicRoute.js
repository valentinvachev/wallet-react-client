import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../context/Context';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    const { appState } = useContext(Context);

    return (
        <Route
            {...rest}
            render={(props) =>
                appState.user.loggedIn && restricted ? (
                    <Redirect to='/' />
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

export default PublicRoute;
