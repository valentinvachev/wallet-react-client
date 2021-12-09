import server from '../config/server';

export const requester = async (method, url, body) => {
    const serverAddress = server;

    const responseToken = await fetch(
        `${serverAddress}/api/users/token/refreshToken`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem(
                    'token_wallet_refresh'
                )}`,
            },
        }
    );

    if (responseToken.ok) {
        const dataToken = await responseToken.json();
        if (dataToken && dataToken.access_token) {
            window.localStorage.setItem('token_wallet', dataToken.access_token);
            window.localStorage.setItem(
                'token_wallet_refresh',
                dataToken.refresh_token
            );
        }
    }

    const headers = { 'Content-Type': 'application/json' };

    headers['Authorization'] = `Bearer ${window.localStorage.getItem(
        'token_wallet'
    )}`;

    const requestOptions = {
        method: method,
        headers: headers,
    };

    if (method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        const errorToThrow = { code: response.status };
        const data = await response.json();
        errorToThrow.message = data.message;
        throw errorToThrow;
    }

    const data = await response.json();
    return data;
};
