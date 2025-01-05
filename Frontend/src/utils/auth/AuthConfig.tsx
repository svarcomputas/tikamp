import { LogLevel } from '@azure/msal-browser';
const uri = process.env.REACT_APP_URL;
const redirectUri = process.env.REACT_APP_URL + '/redirect'
 
export const msalConfig = {
    auth: {
        clientId: '2ab7e21e-6172-4bd0-bdf3-c8f7b84333e4',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: redirectUri,
        postLogoutRedirectUri: uri,
        navigateToLoginRequestUrl: false, 
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: any, message: any, containsPii: any) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    scopes: ["api://2ab7e21e-6172-4bd0-bdf3-c8f7b84333e4/access_as_user"],
};