import React, { useState, useEffect, useReducer, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import * as Api from './api';
import { loginReducer, searchReducer } from './reducer';
import Header from './components/Header';
import LoginForm from './components/user/LoginForm';
import Network from './components/user/Network';
import RegisterForm from './components/user/RegisterForm';
import Portfolio from './components/Portfolio';
import Bookmark from './components/user/Bookmark';
import GoogleLoading from './components/common/GoogleLoading';

export const UserStateContext = createContext(null);
export const DispatchContext = createContext(null);
export const SearchContext = createContext(null);
export const BookmarkListContext = createContext(null);

function App() {
  const [userState, userDispatch] = useReducer(loginReducer, {
    user: null,
  });
  const [bookmarklist, setBookmarklist] = useState(null);

  const [searchState, searchDispatch] = useReducer(searchReducer, {
    category: 'all',
    search: '',
  });

  const [isFetchCompleted, setIsFetchCompleted] = useState(false);
  const fetchCurrentUser = async () => {
    try {
      // 이전에 발급받은 토큰이 있다면, 이를 가지고 유저 정보를 받아옴.
      const res = await Api.get('user/current');
      const currentUser = res.data;

      // userDispatch 함수를 통해 로그인 성공 상태로 만듦.
      userDispatch({
        type: 'LOGIN_SUCCESS',
        payload: currentUser,
      });

      console.log('%c sessionStorage에 토큰 있음.', 'color: #d93d1a;');
    } catch {
      console.log('%c SessionStorage에 토큰 없음.', 'color: #d93d1a;');
    }
    setIsFetchCompleted(true);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (!isFetchCompleted) {
    return <Spinner animation='border' variant='primary' />;
  }

  return (
    <DispatchContext.Provider value={{ userDispatch, searchDispatch }}>
      <UserStateContext.Provider value={userState}>
        <SearchContext.Provider value={searchState}>
          <BookmarkListContext.Provider
            value={{ bookmarklist, setBookmarklist }}
          >
            <Router>
              <Header />
              <Routes>
                <Route path='/' exact element={<Portfolio />} />
                <Route path='/login' element={<LoginForm />} />
                <Route path='/test' element={<GoogleLoading />} />
                <Route path='/register' element={<RegisterForm />} />
                <Route path='/users/:userId' element={<Portfolio />} />
                <Route path='/network' element={<Network />} />
                <Route path='/bookmark' element={<Bookmark />} />
                <Route path='*' element={<Portfolio />} />
              </Routes>
            </Router>
          </BookmarkListContext.Provider>
        </SearchContext.Provider>
      </UserStateContext.Provider>
    </DispatchContext.Provider>
  );
}

export default App;
