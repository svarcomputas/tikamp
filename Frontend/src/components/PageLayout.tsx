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
            cookies.set("access_token", response.accessToken, { path: "/" });
            })
            .catch((error: any) => {
            console.error("Silent token acquisition failed:", error);
            });
        }
    }, [instance, accounts]);
    return (
        <div className="app">
            <NavigationBar />
            <br />
            {props.children}
            <br />
        </div>
    );
}