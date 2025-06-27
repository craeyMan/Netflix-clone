import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

// TMDB에서 평점 높은 영화 목록 요청
const fetchTopRatedMovies = async () => {
  const res = await api.get('/movie/top_rated');
  return res.data;
};

export const useTopRatedMovies = () => {
  return useQuery({
    // 쿼리 결과를 캐시하기 위한 키
    queryKey: ['topRatedMovies'],

    // 평점 높은 영화 API 호출
    queryFn: fetchTopRatedMovies,
  });
};
