import { createRoot } from 'react-dom/client';
import App from './App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './utils/auth/AuthConfig';
import Axios  from 'axios';
import {setupCache }   from 'axios-cache-interceptor';
import TikampApi from './utils/TikampApi';
import './index.css'

async function main() {
    const msalInstance = new PublicClientApplication(msalConfig);
    var axios = setupCache(Axios);
    var api = new TikampApi(axios)
    await msalInstance.initialize();
  
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }
  
    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload != null) {
        msalInstance.setActiveAccount(event.payload);
      }
    });
  
    const container = document.getElementById('root');
    if (!container) {
      throw new Error('Could not find root element to mount to!');
    }
    const root = createRoot(container);
    root.render(
        <App instance={msalInstance}
              api={api}/>
    );
  }
  
  main().catch((error) => {
    console.error("Error in MSAL initialization:", error);
  });
