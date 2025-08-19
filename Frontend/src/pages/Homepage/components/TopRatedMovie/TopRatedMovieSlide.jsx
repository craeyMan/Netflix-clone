import React from 'react';
import { useTopRatedMovies } from '../../../../hooks/useTopRatedMovies';
import MovieSlider from '../../../../common/MovieSlider/MovieSlider';
import Alert from 'react-bootstrap/Alert';
import Spinner from '../Spinner/Spinner';
import { responsive } from '../../../../constants/responsive';

const TopRatedMovieSlide = ({ onMovieClick }) => {
  // 평점 높은 영화 목록을 가져오는 커스텀 훅
  const { data, isLoading, isError, error } = useTopRatedMovies();

  // 로딩 중이면 스피너 표시
  if (isLoading) return <Spinner />;

  // 오류 발생 시 경고창 출력
  if (isError) return <Alert variant="danger">{error.message}</Alert>;

  return (
    <MovieSlider
      title="평점 높은 영화"
      movies={data?.results}
      onMovieClick={onMovieClick} 
      responsive={responsive}
    />
  );
};

export default TopRatedMovieSlide;
