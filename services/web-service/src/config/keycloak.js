const keycloakConfig = {
    url: window.location.origin + '/auth',
    realm: 'ai-agent-realm',
    clientId: 'ai-agent-web-client',
    onLoad: 'login-required'
};

export default keycloakConfig; 