import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './NewPostPage.style.css';
import { toast } from 'react-toastify';
import Spinner from '../../Homepage/components/Spinner/Spinner';
import authApi from '../../../utils/authApi';

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthor(decoded.sub);
      } catch (e) {}
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length > 10) {
      toast.error('제목은 10자 이하여야 합니다.');
      return;
    }

    if (content.length > 500) {
      toast.error('내용은 500자 이하여야 합니다.');
      return;
    }

    const newPost = {
      title,
      content,
      author,
      isSecret,
    };

    try {
      setLoading(true);
      await authApi.post('/posts', newPost);
      toast.success('게시글이 등록되었습니다!');
      navigate('/board');
    } catch {
      toast.error('등록 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Container className="new-post-page">
      <h2>새 글 작성</h2>
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
            readOnly
            className="custom-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" style={{ position: 'relative' }}>
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
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

        <Button type="submit" className="outline-red-btn">
          등록
        </Button>
      </Form>
    </Container>
  );
};

export default NewPostPage;
