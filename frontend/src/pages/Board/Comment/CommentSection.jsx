import React, { useEffect, useState } from 'react';
import authApi from '../../../utils/authApi';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import './CommentSection.style.css';
import Spinner from '../../Homepage/components/Spinner/Spinner';

const CommentSection = ({ postId, postTitle, postAuthor, isSecret }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const username = decoded?.sub || '';
  const role = decoded?.role || '';
  const isAdmin = role === 'ADMIN';
  const isAuthor = username === postAuthor;

  // 댓글 보기/쓰기 권한 설정
  const canView = !isSecret || isAuthor || isAdmin;
  const canWrite = isAuthor || isAdmin;

  useEffect(() => {
    if (canView) {
      fetchComments(); // 비밀글 조건을 통과한 경우에만 댓글 불러오기
    }
  }, [postId, canView]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await authApi.get(`/api/comments/${postId}`);
      setComments(res.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await authApi.post('/api/comments', {
        postId,
        author: username,
        content,
      });
      setContent('');
      await fetchComments();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setLoading(true);
      await authApi.delete(`/api/comments/${commentId}`);
      await fetchComments();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h5 className="comment-title">댓글</h5>

      {loading ? (
        <Spinner />
      ) : !canView ? (
        <p className="text-muted">비밀글입니다. 댓글을 볼 수 없습니다.</p>
      ) : comments.length === 0 ? (
        isAuthor || isAdmin ? (
          <p className="no-comments">등록된 댓글이 없습니다.</p>
        ) : (
          <p className="no-comments">이 댓글은 작성자와 관리자만 볼 수 있습니다.</p>
        )
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="comment-header">
              <div className="comment-title-in-box">{postTitle}</div>
              <button className="delete-x-btn" onClick={() => handleDelete(c.id)}>×</button>
            </div>
            <div className="comment-divider"></div>
            <div className="comment-body">
              <div className="comment-content">{c.content}</div>
              <div className="comment-meta">
                <div className="comment-meta-author">작성자: {c.author}</div>
                <div className="comment-meta-date">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {canWrite && (
        <Form onSubmit={handleSubmit} className="comment-form mt-4">
          {/*관리자 또는 작성자만 댓글 작성 가능*/}
          <Row className="mb-2">
            <Col>
              <Form.Label className="comment-label">게시글 제목</Form.Label>
              <Form.Control type="text" value={postTitle || ''} readOnly />
            </Col>
            <Col>
              <Form.Label className="comment-label">작성자</Form.Label>
              <Form.Control type="text" value={username} readOnly />
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label className="comment-label">댓글 내용</Form.Label>
            <Form.Control 
              as="textarea"
              rows={4}
              placeholder="댓글을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
            />
            <div className="char-count-outside">{content.length} / 500자</div>
          </Form.Group>
          <Button type="submit" className="outline-red-btn mt-2">댓글 작성</Button>
        </Form>
      )}
    </div>
  );
};

export default CommentSection;
