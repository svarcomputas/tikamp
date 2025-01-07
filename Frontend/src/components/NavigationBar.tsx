import { useState, useEffect } from 'react';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Navbar, Container } from 'react-bootstrap';
import logo from '../assets/images/tikamp_logo.png';
import '../styles/NavigationBar.css';

export const NavigationBar = () => {
  const { accounts } = useMsal();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const userName = accounts.length > 0 ? accounts[0].name : '';
  const tenantId = accounts.length > 0 ? accounts[0].idTokenClaims?.tid : '';
  const isExternal = tenantId !== '945fa749-c3d6-4e3d-a28a-283934e3cabd';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

        {windowWidth < 600 ? (
          <AuthenticatedTemplate>
            <div className="top-right-text">
                Logget inn som: {userName} {isExternal ? '(Ekstern)' : ''}
            </div>
          </AuthenticatedTemplate>
        ) : (
          <AuthenticatedTemplate>
            <div className="top-right-text">
              Logget inn som:
              <br />
              {userName} {isExternal ? '(Ekstern)' : ''}
            </div>
          </AuthenticatedTemplate>
        )}
      </Container>
    </Navbar>
  );
};
