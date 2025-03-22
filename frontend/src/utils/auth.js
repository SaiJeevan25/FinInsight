
// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists
  };
  
  // Get the token
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Get the current user
  export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };
  
  // Add token to request headers
  export const authHeader = () => {
    const token = getToken();
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  };
  
  // Logout user
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page or update the app state
    window.location.href = '/login';
  };
  
  // Authentication hook for protected routes (typically used with react-router)
  export const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      if (!isAuthenticated()) {
        // Redirect to login but remember where they were trying to go
        navigate('/login', { state: { from: location.pathname } });
      }
    }, [navigate, location]);
  
    return isAuthenticated() ? children : null;
  };