import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../../utils/authApi';

const BoardContext = createContext();

// 커스텀 훅으로 BoardContext 접근
export const useBoard = () => useContext(BoardContext);

export const BoardProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    const res = await authApi.get('/posts');
    setPosts(res.data);
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 전체 게시글 로드
    fetchPosts();
  }, []);

  // 게시글 등록 후 목록 새로고침
  const addPost = async (post) => {
    await authApi.post('/posts', post);
    fetchPosts();
  };

  // ID로 게시글 찾기
  const getPostById = (id) => posts.find((p) => p.id === parseInt(id));

  return (
    <BoardContext.Provider value={{ posts, getPostById, addPost }}>
      {children}
    </BoardContext.Provider>
  );
};
