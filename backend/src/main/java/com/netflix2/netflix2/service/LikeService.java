package com.netflix2.netflix2.service;

import com.netflix2.netflix2.dto.LikeDTO;
import com.netflix2.netflix2.entity.Like;
import com.netflix2.netflix2.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;

    public List<LikeDTO> getTop10LikedMovies() {
    	return likeRepository.findTop10ByMovieIdGroupByCount();
    }

    public void addLike(String userId, String movieId) {
        if (!likeRepository.existsByUserIdAndMovieId(userId, movieId)) {
            likeRepository.save(new Like(null, userId, movieId));
        }
    }

    @Transactional
    public void removeLike(String userId, String movieId) {
        likeRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    public boolean isLiked(String userId, String movieId) {
        return likeRepository.existsByUserIdAndMovieId(userId, movieId);
    }
}
