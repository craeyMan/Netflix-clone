import React from 'react';
import Spinner from '../Spinner/Spinner';
import Alert from 'react-bootstrap/Alert';
import { FaPlay, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Top10Slider.style.css';
import { useAuth } from '../../../../context/AuthContext';
import { responsive } from '../../../../constants/responsive';
import { toast } from 'react-toastify';
import { useLike } from '../../../../context/LikeContext';

const Top10Slider = ({ onMovieClick }) => {
  const { isLoggedIn } = useAuth();
  const { top10, likedMap, toggleLike } = useLike();

  if (!top10) return <Spinner />;

  const handleLike = async (movieId) => {
    if (!isLoggedIn) {
      toast.warn('로그인 후 이용 가능합니다.');
      return;
    }
    await toggleLike(movieId);
  };

  return (
    <div className="top10-slider-wrapper">
      <h2 className="top10-title">좋아요 순</h2>
      <Carousel
        responsive={responsive}
        infinite
        arrows
        containerClass="top10-carousel-container"
        itemClass="top10-carousel-item"
      >
        {top10.map((movie, index) => (
          <div key={movie.id} className="movie-card">
            <div className="rank-badge">{index + 1}</div>
            <div
              className="movie-thumbnail"
              style={{
                backgroundImage: `url(https://media.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path})`,
              }}
            ></div>

            <div className="movie-overlay">
              <div className="button-group">
                <FaPlay className="icon" />
                <FaThumbsUp
                  className={`icon ${likedMap[movie.id] ? 'liked' : ''}`}
                  onClick={() => handleLike(movie.id)}
                />
                <FaChevronDown
                  className="icon right-icon"
                  onClick={() => onMovieClick(movie)}
                />
              </div>

              <div className="movie-title">{movie.title}</div>

              <div className="movie-genres">
                {movie.genres?.map((genre, idx) => (
                  <Badge bg="danger" key={idx} className="me-1">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Top10Slider;