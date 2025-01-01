import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../utils/auth/AuthConfig.tsx';
import { NavigationBar } from './NavigationBar.tsx';

import { InteractionStatus } from "@azure/msal-browser";

    
export const PageLayout = (props: any) => {
    const { instance, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };

    if (inProgress === InteractionStatus.None && !isAuthenticated) {
        handleRedirect();
    }
    return (
        <>
            <NavigationBar />
            <br />
            <h5>
                <center>Velkommen til computas-tikamp</center>
            </h5>
            <br />
            {props.children}
            <br />
        </>
    );
}