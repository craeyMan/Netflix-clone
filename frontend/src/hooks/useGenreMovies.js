import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const useGenreMoviesQuery = (genreId) => {
  return useQuery({
    // 장르 ID를 기반으로 쿼리 캐시 키 구성
    queryKey: ['genre-movies', genreId],

    // 장르별 인기순 영화 데이터를 TMDB API에서 조회
    queryFn: async () => {
      const res = await api.get(`/discover/movie`, {
        params: {
          with_genres: genreId,
          sort_by: 'popularity.desc', 
        },
      });
      return res.data;
    },
  });
};
