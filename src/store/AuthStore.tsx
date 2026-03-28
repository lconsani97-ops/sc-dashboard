"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  email: string;
  name: string;
  role: string;
  campaign: string;
  password?: string;
  phone?: string;
  recoveryEmail?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
  register: (user: User) => Promise<boolean>;
  changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage on mount
    const storedAuth = localStorage.getItem("sc_campaign_auth");
    const storedUser = localStorage.getItem("sc_campaign_user");
    
    if (storedAuth === "true") {
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser({ email: "lconsani97@gmail.com", name: "Lucas Consani", role: "Deputado Estadual", campaign: "Eleições SC 2026" });
        }
      } else {
        setUser({ email: "lconsani97@gmail.com", name: "Lucas Consani", role: "Deputado Estadual", campaign: "Eleições SC 2026" });
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Route protection logic
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, pass: string, rememberMe: boolean = false) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Get users list
    const usersJson = localStorage.getItem("sc_campaign_users_list");
    let usersList: User[] = [];
    if (usersJson) {
      usersList = JSON.parse(usersJson);
    }

    // Default hardcoded user
    if (email === "lconsani97@gmail.com" && pass === "teste123") {
      const newUser = { email, name: "Lucas Consani", role: "Deputado Estadual", campaign: "Eleições SC 2026" };
      setUser(newUser);
      if (rememberMe) {
        localStorage.setItem("sc_campaign_auth", "true");
      } else {
        sessionStorage.setItem("sc_campaign_auth", "true");
      }
      localStorage.setItem("sc_campaign_user", JSON.stringify(newUser));
      return true;
    }

    // Check registered users
    const foundUser = usersList.find(u => u.email === email && u.password === pass);
    if (foundUser) {
      const userWithoutPass = { ...foundUser };
      delete userWithoutPass.password;
      
      setUser(userWithoutPass);
      if (rememberMe) {
        localStorage.setItem("sc_campaign_auth", "true");
      } else {
        sessionStorage.setItem("sc_campaign_auth", "true");
      }
      localStorage.setItem("sc_campaign_user", JSON.stringify(userWithoutPass));
      return true;
    }

    return false;
  };

  const register = async (newUser: User) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const usersJson = localStorage.getItem("sc_campaign_users_list");
    let usersList: User[] = [];
    if (usersJson) {
      usersList = JSON.parse(usersJson);
    }
    
    // Check if email already exists
    if (usersList.some(u => u.email === newUser.email) || newUser.email === "lconsani97@gmail.com") {
      throw new Error("E-mail já cadastrado.");
    }

    usersList.push(newUser);
    localStorage.setItem("sc_campaign_users_list", JSON.stringify(usersList));
    
    // Auto-login after registration
    return login(newUser.email, newUser.password || "", true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sc_campaign_auth");
    sessionStorage.removeItem("sc_campaign_auth");
    localStorage.removeItem("sc_campaign_user");
    router.push("/login");
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem("sc_campaign_user", JSON.stringify(newUser));
      
      // Update in user list if registered
      const usersJson = localStorage.getItem("sc_campaign_users_list");
      if (usersJson) {
        let usersList: User[] = JSON.parse(usersJson);
        const index = usersList.findIndex(u => u.email === prev.email);
        if (index !== -1) {
          usersList[index] = { ...usersList[index], ...updatedUser };
          localStorage.setItem("sc_campaign_users_list", JSON.stringify(usersList));
        }
      }
      
      return newUser;
    });
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!user) return false;

    // Reject hardcoded user password change for simplicity, or allow it locally
    if (user.email === "lconsani97@gmail.com") {
      if (currentPass !== "teste123") throw new Error("Senha atual incorreta.");
      return true; // Pretend it changed
    }

    const usersJson = localStorage.getItem("sc_campaign_users_list");
    if (!usersJson) return false;
    let usersList: User[] = JSON.parse(usersJson);
    
    const index = usersList.findIndex(u => u.email === user.email);
    if (index === -1) return false;

    if (usersList[index].password !== currentPass) {
      throw new Error("Senha atual incorreta.");
    }

    usersList[index].password = newPass;
    localStorage.setItem("sc_campaign_users_list", JSON.stringify(usersList));
    return true;
  };

  const requestPasswordReset = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === "lconsani97@gmail.com") return true;

    const usersJson = localStorage.getItem("sc_campaign_users_list");
    let usersList: User[] = [];
    if (usersJson) {
      usersList = JSON.parse(usersJson);
    }

    const foundUser = usersList.find(u => u.email === email || u.recoveryEmail === email);
    if (!foundUser) {
      throw new Error("Usuário não encontrado.");
    }

    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateProfile, register, changePassword, requestPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
