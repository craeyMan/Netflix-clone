import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 장르 목록 데이터를 요청하는 함수
const fetchMovieGenre = () => {
  return api.get(`/genre/movie/list`);
};

export const useMovieGenreQuery = () => {
  return useQuery({
    queryKey: ["movie-genre"],

    // 장르 목록 API 호출
    queryFn: fetchMovieGenre,

    // API 응답 중 장르 목록만 선택적으로 반환
    select: (result) => result.data.genres,

    // 5분 동안 데이터 신선하게 유지 (캐싱)
    staleTime: 300000,
  });
};
