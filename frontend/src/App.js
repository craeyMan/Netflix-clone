import './App.css';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from './layout/AppLayout';
import Homepage from './pages/Homepage/Homepage';
import MoviePage from './pages/Movies/MoviePage';
import SearchPage from './pages/SearchPage/SearchPage';
import BoardPage from './pages/Board/BoardPage/BoardPage';
import NewPostPage from './pages/Board/NewPostPage/NewPostPage';
import PostDetailPage from './pages/Board/PostDetailPage/PostDetailPage';
import EditPostPage from './pages/Board/EditPostPage/EditPostPage';
import SignupPage from './pages/Homepage/components/Auth/SignupPage/SignupPage';
import LogoutPage from './pages/Homepage/components/Auth/Logout/LogoutPage';
import Footer from './pages/Homepage/components/Footer/Footer';

import { AuthProvider } from './context/AuthContext';
import { BoardProvider } from './pages/Board/BoardContext';
import { LikeProvider } from './context/LikeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BoardProvider>
        <LikeProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Homepage />} />
              <Route path="movies">
                <Route index element={<MoviePage />} />
                <Route path="search" element={<SearchPage />} />
              </Route>
              <Route path="board">
                <Route index element={<BoardPage />} />
                <Route path="new" element={<NewPostPage />} />
                <Route path=":id" element={<PostDetailPage />} />
                <Route path="edit/:id" element={<EditPostPage />} />
              </Route>
            </Route>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
          <Footer />
          </LikeProvider>
        </BoardProvider>
      </AuthProvider>
      <ToastContainer position="top-center" autoClose={2000} />
    </QueryClientProvider>
  );
}

export default App;
