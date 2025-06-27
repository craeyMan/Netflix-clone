import React, { useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import LoginModal from './LoginModal/LoginModal';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 

const AuthButton = () => {
  const { isLoggedIn, logout, toggleLoginModal, showLoginModal } = useAuth();
  const navigate = useNavigate(); 

  // 로그인 후 로그인 모달이 열려있다면 자동으로 닫기
  useEffect(() => {
    if (isLoggedIn && showLoginModal) {
      toggleLoginModal();
    }
  }, [isLoggedIn]);

  const handleClick = () => {
    if (isLoggedIn) {
      // 로그아웃 처리 및 홈으로 이동
      logout();
      toast.success('로그아웃 되었습니다.');
      navigate('/');
    } else {
      // 로그인 모달 열기
      toggleLoginModal();
    }
  };

  return (
    <>
      <span
        onClick={handleClick}
        className="nav-login-text"
        style={
          { color: 'white',
            cursor: 'pointer', 
            fontSize: '1rem', 
            padding: '8px 12px' }}
      >
        {isLoggedIn ? '로그아웃' : '로그인'}
      </span>
      {showLoginModal && <LoginModal />}
    </>
  );
};

export default AuthButton;