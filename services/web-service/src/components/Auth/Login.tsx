import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handleLogin } from '../../auth/keycloak';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const navigate = useNavigate();

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <p>Redirecting to Keycloak login page...</p>
    </div>
  );
};

export default Login;