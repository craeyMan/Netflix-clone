import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useSearchMovieQuery } from '../../hooks/useSearchMovie';
import MovieCard from '../../common/MovieCard/MovieCard';
import MovieModal from '../Homepage/MovieModal/MovieModal';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './SearchPage.style.css';
import { responsive } from '../../constants/responsive';

const SearchPage = () => {
  const [query] = useSearchParams();
  const keyword = query.get('q');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useSearchMovieQuery({ keyword, page });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 검색어가 변경되면 페이지와 모달 상태 초기화
  useEffect(() => {
    setPage(1);
    setSelectedMovie(null);
    setModalOpen(false);
  }, [keyword]);

  const handlePageClick = ({ selected }) => setPage(selected + 1);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  if (!keyword) return <Alert variant="warning">검색어를 입력해주세요.</Alert>;
  if (isLoading)
    return (
      <div className="loading-overlay">
        <Spinner animation="border" variant="danger" className="center-spinner" />
      </div>
    );
  if (isError) return <Alert variant="danger">{error.message}</Alert>;

  const movies = data?.results?.filter((m) => m.poster_path);

  return (
    <Container className="mt-5">
      <h2>검색 결과: "{keyword}"</h2>

      {movies?.length > 0 ? (
        <Carousel
          responsive={responsive}
          autoPlay={false}
          infinite={false}
          arrows
          itemClass="carousel-item-padding"
          containerClass="carousel-container"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onMovieClick={handleMovieClick} />
          ))}
        </Carousel>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}

      <ReactPaginate
        previousLabel="‹"
        nextLabel="›"
        breakLabel="..."
        onPageChange={handlePageClick}
        pageCount={Math.min(data?.total_pages || 0, 20)}
        forcePage={page - 1}
        containerClassName="pagination justify-content-center mt-4"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
      />

      {selectedMovie && modalOpen && (
        <MovieModal
          show={modalOpen}
          onClose={handleCloseModal}
          movie={selectedMovie}
        />
      )}
    </Container>
  );
};

export default SearchPage;
