// NavigationBar.tsx
import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { loginRequest } from '../utils/auth/AuthConfig';
//import logo from '../assets/images/computas-tikamp-logo-4.png';
import logo from '../assets/images/tikamp_logo.png';
import '../styles/NavigationBar.css'; // <-- Make sure you create/import this

export const NavigationBar = () => {
  const { instance, accounts } = useMsal();

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const userName = accounts.length > 0 ? accounts[0].name : '';
  const tenantId = accounts.length > 0 ? accounts[0].idTokenClaims?.tid : '';
  const isExternal = tenantId !== '945fa749-c3d6-4e3d-a28a-283934e3cabd';

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
      <Container fluid className="navbar-container">
        <div className="logo-container">
          <span role="img" aria-label="emoji1" className="emoji size1">🏃</span>
          <span role="img" aria-label="emoji2" className="emoji size2">💪</span>
          <span role="img" aria-label="emoji3" className="emoji size3">🏋️</span>
          <span role="img" aria-label="emoji4" className="emoji size4">🔥</span>

          <img src={logo} alt="Tikamp Logo" className="center-logo" />

          <span role="img" aria-label="emoji4" className="emoji size4">🔥</span>
          <span role="img" aria-label="emoji3" className="emoji size3">🏋️</span>
          <span role="img" aria-label="emoji2" className="emoji size2">💪</span>
          <span role="img" aria-label="emoji1" className="emoji size1">🏃</span>
        </div>

        <AuthenticatedTemplate>
          <div className="top-right-text">
            Logget inn som:
            <br />
            {userName} {isExternal ? '(Ekstern)' : ''}
          </div>
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <Button onClick={handleLoginRedirect} variant="outline-light">
            Sign in
          </Button>
        </UnauthenticatedTemplate>
      </Container>
    </Navbar>
  );
};
