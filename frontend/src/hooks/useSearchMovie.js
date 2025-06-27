import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 키워드가 있을 경우 검색, 없으면 인기 영화로 대체
const fetchSearchMovie = ({ keyword, page }) => {
  return keyword
    ? api.get(`/search/movie?query=${keyword}&page=${page}`)
    : api.get(`/movie/popular?page=${page}`);
};

export const useSearchMovieQuery = ({ keyword, page }) => {
  return useQuery({
    // 쿼리 키에 keyword와 page 포함, 검색어/페이지별로 캐시 구분
    queryKey: ["movie-search", { keyword, page }],

    // 검색 또는 인기 영화 데이터 요청
    queryFn: () => fetchSearchMovie({ keyword, page }),

    // 응답 중 data만 추출
    select: (result) => result.data,
  });
};
