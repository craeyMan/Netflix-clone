package com.netflix2.netflix2.service;

import com.netflix2.netflix2.entity.Comment;
import com.netflix2.netflix2.entity.Post;
import com.netflix2.netflix2.repository.CommentRepository;
import com.netflix2.netflix2.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public List<Comment> getVisibleComments(Long postId, String currentUser, boolean isAdmin) {
        Post post = postRepository.findById(postId).orElseThrow();
        
        if (post.isSecret() && !isAdmin && !currentUser.equals(post.getAuthor())) {
            return List.of();
        }
        
        if (post.isSecret()) {
        	return commentRepository.findVisibleComments(post, currentUser);
        } else {
        	return commentRepository.findByPostOrderByCreatedAtAsc(post);
        }
    }

    public Comment createCommentWithDetails(Post post,
                                             String author,
                                             String content,
                                             String visibleTo,
                                             Long parentId,
                                             String role) {
        Comment.CommentBuilder builder = Comment.builder()
                .post(post)
                .author(author)
                .content(content)
                .visibleTo(visibleTo)
                .role(role);

        if (parentId != null) {
            Comment parent = commentRepository.findById(parentId).orElseThrow();
            builder.parent(parent);
        }

        return commentRepository.save(builder.build());
    }

    public void deleteComment(Long commentId, String currentUser, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

        if (!isAdmin && !comment.getAuthor().equals(currentUser)) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다.");
        }

        commentRepository.deleteById(commentId);
    }
}
