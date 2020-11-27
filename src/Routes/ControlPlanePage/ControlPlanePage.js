import { OpenshiftStreamsFederated } from 'mkUiFrontend/OpenshiftStreams';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

export const ControlPlanePage = () => {

    const [token, setToken] = useState('');

    useEffect(() => {
        insights.chrome.auth.getToken().then(t => setToken(t));
    }, []);

    const history = useHistory();

    const onConnectInstance = async (event) => {
        if (event.id === undefined) {
            throw new Error();
        }

        history.push(`/kafkas/${event.id}`);
    };

    return (
        <OpenshiftStreamsFederated token={token} onConnectToInstance={onConnectInstance}/>
    );
};
