
export const isAuthenticated = () => {
  const token = localStorage.getItem('fctoken');

  if (!token) {
    return false;
  }

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  const decodedToken = decodeToken(token);
  if (decodedToken && decodedToken.exp > Date.now() / 86400000) {
    return true;
  }

  return false;
};