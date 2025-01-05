import logo from '../assets/images/tikamp_logo.png';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { loginRequest } from '../utils/auth/AuthConfig';

export const NavigationBar = () => {
  const { instance, accounts } = useMsal();

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const userName = accounts.length > 0 ? accounts[0].name : '';
  const tenantId = accounts.length > 0 ? accounts[0].idTokenClaims?.tid : '';
  const isExternal = tenantId !== '945fa749-c3d6-4e3d-a28a-283934e3cabd';

  return (
    <Navbar bg="primary" variant="dark" expand="lg" style={{ height: '60px' }}>
      <Container fluid style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>
            Computas-tikamp
          </span>
          <img src={logo} alt="Logo"
            style={{ height: '60px' }}
          />
        </div>

        <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
          <AuthenticatedTemplate>
            <span>
              Logget inn som {userName} {isExternal ? '(Ekstern)' : ''}
            </span>
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
            <Button onClick={handleLoginRedirect} variant="outline-light">
              Sign in
            </Button>
          </UnauthenticatedTemplate>
        </div>
      </Container>
    </Navbar>
  );
};
