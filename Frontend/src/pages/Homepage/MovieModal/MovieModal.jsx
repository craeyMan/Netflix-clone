import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './MovieModal.style.css';
import { FaPlay, FaThumbsUp, FaTimes } from 'react-icons/fa';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useLike } from '../../../context/LikeContext';

const MovieModal = ({ show, onClose, handleClose, movie }) => {
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [releaseYear, setReleaseYear] = useState('');
  const [certification, setCertification] = useState('');

  const { isLoggedIn } = useAuth();
  const { likedMap, toggleLike, fetchUserLikes } = useLike();
  const isLiked = likedMap[movie?.id] || false;

  useEffect(() => {
    if (!movie?.id) return;
  
    const fetchData = async () => {
      try {
        const [creditsRes, videoRes, detailRes, releaseDatesRes] = await Promise.all([
          api.get(`/movie/${movie.id}/credits`),
          api.get(`/movie/${movie.id}/videos`),
          api.get(`/movie/${movie.id}`),
          api.get(`/movie/${movie.id}/release_dates`)
        ]);
  
        setCast(creditsRes.data.cast.slice(0, 10));
  
        const trailers = videoRes.data.results.filter(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailerKey(trailers[0]?.key || null);
  
        const date = detailRes.data.release_date;
        if (date) setReleaseYear(date.slice(0, 4));
  
        const kr = releaseDatesRes.data.results.find(r => r.iso_3166_1 === 'KR');
        const krCert = kr?.release_dates?.[0]?.certification;
        if (krCert) setCertification(krCert);
  
      } catch (err) {
        // console 제거 요청 반영
      }
    };
  
    fetchData();
  }, [movie?.id]);

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      toast.warn('로그인 후 이용 가능합니다.');
      return;
    }

    await toggleLike(movie.id);
  };

  if (!movie) return null;

  return (
    <Modal
      key={movie.id}
      show={show}
      onHide={onClose || handleClose}
      size="xl"
      centered
      dialogClassName="netflix-modal"
      contentClassName="netflix-modal-content"
    >
      {trailerKey ? (
        <div className="modal-video-wrapper">
          <iframe
            className="modal-video"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
            title="Movie Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
          <button className="close-btn" onClick={onClose || handleClose}><FaTimes /></button>
        </div>
      ) : (
        <div className="modal-video-wrapper no-trailer">
          <div className="no-video-message">예고편이 존재하지 않습니다.</div>
          <button className="close-btn" onClick={onClose || handleClose}><FaTimes /></button>
        </div>
      )}

      <Modal.Body>
        <h2 className="modal-title">{movie.title}</h2>
        <div className="movie-meta">
          {releaseYear && <span>{releaseYear}</span>}
          {certification && <span>{certification}+</span>}
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
        </div>

        <div className="modal-icons">
          <button className="play-btn"><FaPlay /> Play</button>
          <FaThumbsUp
            className={`icon ${isLiked ? 'liked' : ''}`}
            style={{ fontSize: '1.8rem' }}
            onClick={handleLikeToggle}
          />
        </div>

        <div className="cast-section">
          {cast.map((actor) => (
            <div key={actor.id} className="actor-card">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+Image'
                }
                alt={actor.name}
              />
              <div className="actor-name">{actor.name}</div>
            </div>
          ))}
        </div>

        <p className="modal-overview"><strong>줄거리:</strong> {movie.overview}</p>
        <p className="movie-age"><strong>성인 등급:</strong> {movie.adult ? '19+' : '전체 이용가'}</p>
      </Modal.Body>
    </Modal>
  );
};

export default MovieModal;
