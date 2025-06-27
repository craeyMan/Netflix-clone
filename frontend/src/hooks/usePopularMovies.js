import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 인기 영화 목록 요청 함수
const fetchPopularMovies = () => {
  return api.get(`/movie/popular`);
};

export const usePopularMoviesQuery = () => {
  return useQuery({
    // 쿼리 키 설정 (캐싱을 위한 식별자)
    queryKey: ['movie-popular'],

    // 인기 영화 요청 API 함수
    queryFn: fetchPopularMovies,

    // 응답 중 data 객체만 선택적으로 반환
    select: (result) => result.data,
  });
};
