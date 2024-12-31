import { useRouter } from "vue-router";

export function useLogout() {
  const logout = () => {
    const router = useRouter()
    
    localStorage.removeItem('user');
    localStorage.removeItem('fctoken');
    localStorage.removeItem('customerId');
    router.push({ path: `/login` });
  }

  return {
    logout
  }
}