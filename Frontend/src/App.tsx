import { MsalProvider, MsalAuthenticationTemplate  } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from './utils/auth/AuthConfig.tsx';

import './styles/App.css';
import MainDisplay from './components/MainDisplay.tsx';


const App = ({ instance }: any) => {
    return (
        
        <div className="app">
        <MsalProvider instance={instance}>
            <MsalAuthenticationTemplate
                interactionType={InteractionType.Redirect} 
                authenticationRequest={loginRequest}
            >
                <PageLayout>
                    <MainDisplay />
                </PageLayout>
            </MsalAuthenticationTemplate>
        </MsalProvider>
        </div>
    );
};

export default App;