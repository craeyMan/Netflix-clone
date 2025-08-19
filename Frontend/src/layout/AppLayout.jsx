import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchBox from '../pages/Homepage/components/Search/SearchBox';
import AuthButton from '../pages/Homepage/components/Auth/AuthButton';

const AppLayout = () => {
  return (
    <div className="main">
      <Navbar expand="lg" bg="black" variant="black">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
              alt="Netflix Logo"
              style={{ height: '30px' }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link as={Link} to="/movies" className="text-white">영화</Nav.Link>
              <Nav.Link as={Link} to="/board" className="text-white">게시판</Nav.Link>
            </Nav>
            <div className="d-flex">
              <SearchBox />
              <AuthButton />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default AppLayout;
