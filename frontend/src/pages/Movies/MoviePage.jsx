import React, { useState } from 'react';
import MovieGenreSection from '../../common/MovieGenreSection/MovieGenreSection';
import MovieModal from '../Homepage/MovieModal/MovieModal';
import './MoviePage.style.css';

// 장르 ID와 이름 리스트 정의
const genreList = [
  { id: 28, title: '액션' },
  { id: 12, title: '모험' },
  { id: 16, title: '애니메이션' },
  { id: 35, title: '코미디' },
  { id: 80, title: '범죄' },
  { id: 99, title: '다큐멘터리' },
  { id: 18, title: '드라마' },
  { id: 10751, title: '가족' },
  { id: 14, title: '판타지' },
  { id: 36, title: '역사' },
  { id: 27, title: '공포' },
  { id: 10402, title: '음악' },
  { id: 9648, title: '미스터리' },
  { id: 10749, title: '로맨스' },
  { id: 878, title: 'SF' },
  { id: 10770, title: 'TV 영화' },
  { id: 53, title: '스릴러' },
  { id: 10752, title: '전쟁' },
  { id: 37, title: '서부극' },
];

const MoviePage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 영화 클릭 시 모달에 정보 전달
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="movie-page">
      {genreList.map((genre) => (
        <MovieGenreSection
          key={genre.id}
          genreId={genre.id}
          title={genre.title}
          onMovieClick={handleMovieClick}
        />
      ))}

      {selectedMovie && modalOpen && (
        <MovieModal
          show={modalOpen}
          onClose={handleCloseModal}
          handleClose={handleCloseModal}
          movie={selectedMovie}
        />
      )}
    </div>
  );
};

export default MoviePage;
