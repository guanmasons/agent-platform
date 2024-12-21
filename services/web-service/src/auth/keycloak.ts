import Keycloak from 'keycloak-js';
import { KEYCLOAK_URL, KEYCLOAK_REALM, APP_CLIENT_ID } from '../config';

const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: APP_CLIENT_ID,
});

export const initializeKeycloak = () => {
  return keycloak.init({
    onLoad: 'check-sso', // or 'login-required' to force login at initialization
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  });
};

export const handleLogin = () => {
  keycloak.login();
};

export const handleLogout = () => {
  keycloak.logout();
};

export const getAccessToken = () => {
    return keycloak.token;
  };

export default keycloak;