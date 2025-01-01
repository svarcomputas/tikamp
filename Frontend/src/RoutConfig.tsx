import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import AuthCallback from './AuthCallback';

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: <App />,
    children: [
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      }
    ]
}]);

export default router