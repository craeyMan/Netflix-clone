import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaInfoCircle, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import MovieModal from '../../MovieModal/MovieModal';
import { usePopularMoviesQuery } from '../../../../hooks/usePopularMovies';
import './Banner.style.css';
import Spinner from '../Spinner/Spinner';
import api from '../../../../utils/api';

const Banner = () => {
  const { data, isLoading, isError, error } = usePopularMoviesQuery();
  const [randomMovie, setRandomMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [certification, setCertification] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!data?.results) return;

    // 유튜브 예고편이 있는 무작위 영화 선택
    const fetchValidMovie = async () => {
      const shuffled = [...data.results].sort(() => 0.5 - Math.random());

      for (const movie of shuffled) {
        try {
          const [videosRes, releaseRes] = await Promise.all([
            api.get(`/movie/${movie.id}/videos`, { params: { language: 'ko-KR' } }),
            api.get(`/movie/${movie.id}/release_dates`),
          ]);

          const trailer = videosRes.data.results.find(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
          );

          if (trailer) {
            setRandomMovie(movie);
            setTrailerKey(trailer.key);

            const cert = releaseRes.data.results
              .find(r => r.iso_3166_1 === 'KR')
              ?.release_dates?.[0]?.certification;

            if (cert) setCertification(cert);
            break;
          }
        } catch {}
      }
    };

    fetchValidMovie();
  }, [data]);

  // 유튜브 플레이어 준비되면 음소거 상태 적용
  const handlePlayerReady = (event) => {
    setPlayer(event.target);
    isMuted ? event.target.mute() : event.target.unMute();
  };

  // 음소거 토글 버튼 처리
  const toggleMute = () => {
    if (player) {
      isMuted ? player.unMute() : player.mute();
      setIsMuted(!isMuted);
    }
  };

  if (isLoading || !randomMovie || !trailerKey) return <Spinner />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="banner">
        <YouTube
          videoId={trailerKey}
          className="banner-video"
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              controls: 0,
              mute: 1,
              loop: 1,
              playlist: trailerKey,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={handlePlayerReady}
        />

        <div className="banner-fade-bottom" />

        <div className="banner-content">
          <h1>{randomMovie.title}</h1>
          <div className="left-buttons">
            <button className="banner-play-button"><FaPlay /></button>
            <button className="banner-info-button" onClick={() => setShowModal(true)}>
              <FaInfoCircle /> 상세 정보
            </button>
          </div>
        </div>

        <div className="right-buttons">
          <button className="banner-mute-button" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          {certification && <span className="banner-cert">{certification}+</span>}
        </div>
      </div>

      <MovieModal
        show={showModal}
        onClose={() => setShowModal(false)}
        movie={randomMovie}
      />
    </>
  );
};

export default Banner;
