import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import authApi from '../../../utils/authApi';
import './EditPostPage.style.css';
import { toast } from 'react-toastify';
import Spinner from '../../Homepage/components/Spinner/Spinner';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await authApi.get(`/posts/${id}`);
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
        setIsSecret(post.isSecret); // 기존 비밀글 여부 반영
      } catch {
        toast.warn('로그인 후 이용 가능합니다.');
        navigate('/board');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPost = { title, content, author, isSecret };

    try {
      setLoading(true);
      await authApi.put(`/posts/${id}`, updatedPost);
      toast.success('게시글이 수정되었습니다!');
      navigate('/board', { state: { updated: true } }); // 수정 후 목록 새로고침 유도
    } catch {
      toast.error('수정 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Container className="edit-post-page">
      <h2>게시글 수정</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" style={{ position: 'relative' }}>
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={10}
            className="custom-input"
          />
          <div style={{
            position: 'absolute',
            right: '10px',
            bottom: '-20px',
            fontSize: '0.85rem',
            color: '#aaa'
          }}>
            {title.length}/10자
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>작성자</Form.Label>
          <Form.Control
            type="text"
            value={author}
            disabled
            className="custom-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" style={{ position: 'relative' }}>
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={500}
            className="custom-input"
          />
          <div style={{
            position: 'absolute',
            right: '10px',
            bottom: '-20px',
            fontSize: '0.85rem',
            color: '#aaa'
          }}>
            {content.length}/500자
          </div>
        </Form.Group>

        <Form.Group controlId="isSecret" className="mb-3">
          <Form.Check
            type="checkbox"
            label="비밀글입니다."
            checked={isSecret}
            onChange={(e) => setIsSecret(e.target.checked)}
          />
        </Form.Group>

        <Button className="outline-red-btn" type="submit">
          저장하기
        </Button>
      </Form>
    </Container>
  );
};

export default EditPostPage;
