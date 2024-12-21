import React, { useEffect } from 'react';
import keycloak from '../../auth/keycloak';

const Register: React.FC = () => {

  useEffect(() => {
    keycloak.register();
  }, []);

  return (
    <div>
      <h1>Register</h1>
      <p>Redirecting to Keycloak registration page...</p>
    </div>
  );
};

export default Register;