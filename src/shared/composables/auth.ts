export const isAuthenticated = () => {
  const token = localStorage.getItem('fctoken');
  return token !== null;
};