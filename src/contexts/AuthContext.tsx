import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';
import { authService, type User } from '@services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (phone: string, password: string) => {
    const { user: loggedInUser, error } = await authService.loginWithPhone(phone, password);
    
    if (loggedInUser) {
      setUser(loggedInUser);
      return { success: true, error: null };
    }
    
    return { success: false, error: error || 'Login failed' };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAdmin = authService.isAdmin(user);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
