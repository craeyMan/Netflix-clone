import React from 'react';
import './MovieSlider.style.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MovieCard from '../MovieCard/MovieCard';

const MovieSlider = ({ title, movies, responsive, onMovieClick }) => {
  if (!Array.isArray(movies)) {
    return null; // 영화 데이터가 배열이 아닐 경우 렌더링 중단
  }

  return (
    <div className="movie-slider-wrapper">
      <h3>{title}</h3>
      <Carousel
        autoPlay
        autoPlaySpeed={3000}
        infinite
        ssr // 서버 사이드 랜더링 최적화
        responsive={responsive} // 반응형 설정 (외부에서 props로 전달됨)
        centerMode={false}
        partialVisible={false}
        keyBoardControl // 키보드 화살표로 이동 가능
        minimumTouchDrag={80}
        itemClass="movie-slider p-1"
        containerClass="carousel-container"
      >
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} onMovieClick={onMovieClick} />
        ))}
      </Carousel>
    </div>
  );
};

export default MovieSlider;
