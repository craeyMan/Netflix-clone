import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

// 주어진 장르 ID로 인기순 영화 리스트 요청
const fetchGenreMovies = async (genreId) => {
  console.log(`/discover/movie?with_genres=${genreId}`);
  const res = await api.get('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      language: 'ko-KR',
    },
  });
  return res.data;
};

export const useMovieGenreQuery = (genreId) => {
  return useQuery({
    // 장르 ID 기반 캐시 키 구성
    queryKey: ['genre-movies', genreId],

    // 쿼리 함수: 장르별 영화 요청
    queryFn: () => fetchGenreMovies(genreId),

    // genreId가 존재할 때만 실행 (초기 렌더 방지용)
    enabled: !!genreId,
  });
};
