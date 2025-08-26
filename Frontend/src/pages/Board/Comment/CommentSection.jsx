import React, { useEffect, useState } from 'react';
import authApi from '../../../utils/authApi';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import './CommentSection.style.css';
import Spinner from '../../Homepage/components/Spinner/Spinner';

const CommentSection = ({ postId, postTitle, }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const username = decoded?.sub || '';
  const role = decoded?.role || '';
  const isAdmin = role === 'ADMIN';

  // 누구나 댓글 보기, 쓰기 가능
  const canView = true;
  const canWrite = true;

  useEffect(() => {
    if (canView) fetchComments();
  }, [postId, canView]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await authApi.get(`/api/comments/${postId}`);
      setComments(res.data || []);
    } catch (err) {} 
    finally {
      { setLoading(false); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await authApi.post('/api/comments', { postId, content, parentId: null });
      setContent('');
      await fetchComments();
    } catch (err) {} 
    finally { setLoading(false); }
  };

  const handleDelete = async (commentId, commentAuthor) => {
    // 작성자 본인 또는 관리자만 삭제 가능
    if (!isAdmin && username !== commentAuthor) return;

    try {
      setLoading(true);
      await authApi.delete(`/api/comments/${commentId}`);
      await fetchComments();
    } catch (err) {} 
    finally { setLoading(false); }
  };

  return (
    <div className="comment-section">
      <h5 className="comment-title">댓글</h5>

      {loading ? (
        <Spinner />
      ) : comments.length === 0 ? (
        <p className="no-comments">등록된 댓글이 없습니다.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="comment-header">
              <div className="comment-title-in-box">{postTitle}</div>
              {(isAdmin || c.author === username) && (
                <button
                  className="delete-x-btn"
                  onClick={() => handleDelete(c.id, c.author)}
                >
                  ×
                </button>
              )}
            </div>
            <div className="comment-divider"></div>
            <div className="comment-body">
              <div className="comment-content">{c.content}</div>
              <div className="comment-meta">
                <div className="comment-meta-author">작성자: {c.author}</div>
                <div className="comment-meta-date">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleString('ko-KR', { hour12: true })
                    : ''}
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
