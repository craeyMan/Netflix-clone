import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const logoutTimer = useRef(null);
  const navigate = useNavigate();

  const clearExistingTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
  };

  const startLogoutTimer = (exp) => {
    const now = Date.now();
    const timeout = exp * 1000 - now;

    if (timeout > 0) {
      clearExistingTimer();
      logoutTimer.current = setTimeout(() => {
        logout();
        toast.info("로그인 시간이 만료되어 자동 로그아웃되었습니다.");
      }, timeout);
    } else {
      logout();
    }
  };

  const login = (token, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }

    setIsLoggedIn(true);

    try {
      const decoded = jwtDecode(token);
      startLogoutTimer(decoded.exp);
    } catch (e) {
      // JWT 디코딩 실패 시 무시
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearExistingTimer();
    localStorage.setItem("logoutFlag", "true");
    navigate("/");
  };

  const toggleLoginModal = () => {
    setShowLoginModal(prev => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        startLogoutTimer(decoded.exp);
      } catch {
        logout();
      }
    }

    const logoutFlag = localStorage.getItem("logoutFlag");
    if (logoutFlag) {
      toast.success("로그아웃 되었습니다.");
      localStorage.removeItem("logoutFlag");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        showLoginModal,
        toggleLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
