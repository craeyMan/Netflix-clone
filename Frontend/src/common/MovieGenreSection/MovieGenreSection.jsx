import React from 'react';
import { Alert } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MovieCard from '../../common/MovieCard/MovieCard';
import { useMovieGenreQuery } from '../../hooks/useMovieGenreQuery';
import './MovieGenreSection.style.css';
import Spinner from '../../pages/Homepage/components/Spinner/Spinner';
import { responsive } from '../../constants/responsive';

const MovieGenreSection = ({ genreId, title, onMovieClick }) => {
  const { data, isLoading, isError, error } = useMovieGenreQuery(genreId);

  const movies = data?.results;
  const filteredMovies = movies?.filter((movie) => movie.poster_path); // 포스터가 있는 영화만 필터링

  if (isLoading) return <Spinner />;
  if (isError) return <Alert variant="danger">{title} 에러: {error.message}</Alert>;
  if (!filteredMovies || filteredMovies.length === 0) return <p>{title} 영화 없음</p>;

  return (
    <div className="genre-slider-wrapper">
      <h3 className="section-title">{title}</h3>
      <Carousel
        autoPlay
        autoPlaySpeed={3000}
        infinite
        responsive={responsive}
        itemClass="carousel-item-spacing"
        containerClass="carousel-container"
        keyBoardControl // 키보드 화살표로 슬라이드 가능
      >
        {filteredMovies.map((movie, index) => (
          <MovieCard
            key={index}
            movie={movie}
            onMovieClick={onMovieClick} // 영화 클릭 시 상세 모달 열기
          />
        ))}
      </Carousel>
    </div>
  );
};

export default MovieGenreSection;
