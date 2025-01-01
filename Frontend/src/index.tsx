import { createRoot } from 'react-dom/client';
import App from './App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './utils/auth/AuthConfig';

const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getActiveAccount());
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload != null) {
        const account = event.payload;
        msalInstance.setActiveAccount(account);
    }
});

const container = document.getElementById('root');
if (!container) {
  throw new Error('Could not find root element to mount to!');
}

const root = createRoot(container);
root.render(
    <App instance={msalInstance}/>
);