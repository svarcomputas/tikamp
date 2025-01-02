import logo from './assets/images/tikamp_logo.png';
import './App.css';
import PingComponent from './PingComponent.tsx';
import PingAuthComponenet from './PingAuthComponent.tsx';
import { MsalProvider } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';

import './styles/App.css';


const App = ({ instance }: any) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <img src={logo} alt="Logo" />
                <PingComponent />
                <PingAuthComponenet />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;