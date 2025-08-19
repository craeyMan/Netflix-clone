import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchBox.style.css';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 검색 페이지가 아닐 경우 입력값 초기화
  useEffect(() => {
    if (!location.pathname.startsWith('/movies/search')) {
      setKeyword('');
    }
  }, [location.pathname]);

  useEffect(() => {
    // 입력값이 변경될 때 300ms 후 자동 검색 페이지 이동
    const delay = setTimeout(() => {
      const trimmed = keyword.trim();
      if (trimmed) {
        navigate(`/movies/search?q=${trimmed}`);
      } else if (location.pathname.startsWith('/movies/search')) {
        navigate('/');
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword, navigate, location]);

  return (
    <input
      type="text"
      placeholder="Search"
      className="search-input"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
};

export default SearchBox;