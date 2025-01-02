import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../utils/auth/AuthConfig.tsx';
import { NavigationBar } from './NavigationBar.tsx';

import { InteractionStatus } from "@azure/msal-browser";
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';

    
export const PageLayout = (props: any) => {
    const { instance, inProgress, accounts } = useMsal();
    const cookies = new Cookies();
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
      
    useEffect(() => {
        // If the user is signed in (accounts.length > 0),
        // acquire an access token silently
        if (accounts && accounts.length > 0) {
        const request = {
            scopes: loginRequest.scopes, // Or your actual scope
            account: accounts[0], // The active account
        };
    
        instance.acquireTokenSilent(request)
            .then((response: any) => {
            // Store the access token in a cookie
            cookies.set("access_token", response.accessToken, { path: "/" });
            console.log("Token set in cookie:", response.accessToken);
            })
            .catch((error: any) => {
            console.error("Silent token acquisition failed:", error);
            });
        }
    }, [instance, accounts, cookies]);
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