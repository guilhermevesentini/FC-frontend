import router from "../router";


export function useLogout() {
  const logout = () => {    
    localStorage.removeItem('user');
    localStorage.removeItem('fctoken');
    localStorage.removeItem('customerId');
    router.push({ path: `/login` });
  }

  return {
    logout
  }
}