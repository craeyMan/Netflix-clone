import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 개봉 예정 영화 API 호출 함수
const fetchUpcomingMovies = () => {
  return api.get(`/movie/upcoming`);
};

export const useUpcomingMoviesQuery = () => {
  return useQuery({
    // 캐싱을 위한 쿼리 키
    queryKey: ['movie-upcoming'],

    // 쿼리 실행 시 사용할 API 함수
    queryFn: fetchUpcomingMovies,

    // 응답 객체 중 data만 반환
    select: (result) => result.data,
  });
};
