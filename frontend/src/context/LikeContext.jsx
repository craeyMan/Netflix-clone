import React, { createContext, useContext, useEffect, useState } from 'react';
import authApi from '../utils/authApi';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [likedMap, setLikedMap] = useState({});
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
    }
    fetchTop10();
  }, [isLoggedIn]);

  const fetchTop10 = async () => {
    try {
      const res = await authApi.get('/likes/top10');
      const movieDetails = await Promise.all(
        res.data.map(async (item) => {
          const detail = await api.get(`/movie/${item.movieId}`);
          return detail.data;
        })
      );
      setTop10(movieDetails);
    } catch (err) {
      // console 제거 요청 반영
    }
  };

  const toggleLike = async (movieId) => {
    try {
      const isLiked = likedMap[movieId];
      if (isLiked) {
        await authApi.delete(`/likes/${movieId}`);
      } else {
        await authApi.post('/likes', { movieId });
      }
      setLikedMap((prev) => ({ ...prev, [movieId]: !isLiked }));
      await fetchTop10();
    } catch (err) {
      // console 제거 요청 반영
    }
  };

  return (
    <LikeContext.Provider value={{ likedMap, toggleLike, top10 }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
