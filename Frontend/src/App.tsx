import logo from './assets/images/tikamp_logo.png';
import './App.css';
import PingComponent from './PingComponent.tsx';
import PingAuthComponenet from './PingAuthComponent.tsx';
import { MsalProvider, MsalAuthenticationTemplate  } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from './utils/auth/AuthConfig.tsx';

import './App.css';
import MainDisplay from './components/MainDisplay.tsx';


const App = ({ instance }: any) => {
    return (
        <MsalProvider instance={instance}>
            <MsalAuthenticationTemplate
                interactionType={InteractionType.Redirect} 
                authenticationRequest={loginRequest}
            >
                <PageLayout>
                    <img src={logo} alt="Logo" />
                    <MainDisplay />
                    <PingComponent />
                    <PingAuthComponenet />
                </PageLayout>
            </MsalAuthenticationTemplate>
        </MsalProvider>
    );
};

export default App;