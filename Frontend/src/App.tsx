//import logo from './assets/images/tikamp_logo.png';
import './App.css';
import PingComponent from './PingComponent.tsx';
import PingAuthComponenet from './PingAuthComponent.tsx';


import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { Container, Button } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';
import { IdTokenData } from './components/DataDisplay';
import { loginRequest } from './AuthConfig';

import './styles/App.css';
const MainContent = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };
    return (
        <div className="App">
          <img alt ='Logo'/>
            <AuthenticatedTemplate>
                {activeAccount ? (
                    <Container>
                        <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
                    </Container>
                ) : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Button className="signInButton" onClick={handleRedirect} variant="primary">
                    Sign up
                </Button>
            </UnauthenticatedTemplate>
        </div>
    );
};

const App = ({ instance }: any) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <MainContent />
                <PingComponent />
                <PingAuthComponenet />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;
