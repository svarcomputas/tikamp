import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Navbar, Button } from 'react-bootstrap';
import { loginRequest } from '../utils/auth/AuthConfig';

export const NavigationBar = () => {
    const { instance, accounts } = useMsal();
    
    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };
    
    // Get the user's name from the accounts array
    const userName = accounts.length > 0 ? accounts[0].name : '';
    return (
        <>
            <Navbar bg="primary" variant="dark" className="navbarStyle">
                <AuthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <span className="navbar-text mr-3">
                            Logged in as: {userName}
                        </span>
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <Button onClick={handleLoginRedirect}>Sign in</Button>
                    </div>
                </UnauthenticatedTemplate>
            </Navbar>
        </>
    );
};