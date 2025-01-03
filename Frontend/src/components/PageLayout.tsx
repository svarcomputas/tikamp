import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/auth/AuthConfig.tsx';
import { NavigationBar } from './NavigationBar.tsx';

import { useEffect } from 'react';
import { Cookies } from 'react-cookie';

    
export const PageLayout = (props: any) => {
    const { instance, accounts } = useMsal();
      
    useEffect(() => {
        const cookies = new Cookies();
        if (accounts && accounts.length > 0) {
        const request = {
            scopes: loginRequest.scopes,
            account: accounts[0],
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
    }, [instance, accounts]);
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