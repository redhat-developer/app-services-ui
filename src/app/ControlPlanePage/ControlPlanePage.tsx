// @ts-ignore
import { OpenshiftStreamsFederated } from 'mkUiFrontend/OpenshiftStreams';
import React, {useContext, useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import {InsightsContext} from "@app/utils/insights";

export const ControlPlanePage = () => {

    const [token, setToken] = useState('');

    const insights = useContext(InsightsContext);

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
