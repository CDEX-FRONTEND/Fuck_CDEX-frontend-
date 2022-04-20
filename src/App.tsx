import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import NotFound from './pages/notfound';
import Profile from './pages/profile';
import { Login } from './pages/login';
import Home from './pages/home';
import Otc from './pages/otc';
import Stock from './pages/stock';
import Advertisement from './pages/advertisement';
import Actives from './pages/actives';
import History from './pages/history';
import Admin from './pages/admin';
import KnowledgeCenter from './pages/knowledge-center';
import KnowledgeCenterPopularItem from './pages/knowledge-center/popular/[id]';
import Agreements from './pages/agreements';
import SellerProfile from './pages/seller-profile';
import Confirmation from './pages/confirmation';
import Trade from './pages/trade';
import { useAuth } from './hooks/useAuth';
import { RequireAuth } from './components/AuthProvider/RequireAuth';
import useAppSelector from './hooks/useAppSelector';
import { selectUser } from './store/userSlice';
import { AppDispatch, RootState } from './store';
import useAppDispatch from './hooks/useAppDispatch';
import { getAdvertisementSellerInfo } from './store/otcSlice';
import usePopup from './hooks/usePopup';
import { AlertPopup } from './components/AlertPopup';
import { Typography, Box } from '@mui/material';

const App = () => {
  const { setToken, login, loginState, setLoginState, setAuthenticated } = useAuth();
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      login();
    } else {
      setLoginState('not logged');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = useAppSelector(selectUser);
  const dispatch: AppDispatch = useAppDispatch();
  const { setPopup } = usePopup();
  const sellerInfo = useAppSelector(
    (state: RootState) => state.otc.advertisementSellerInfo
  );
  useEffect(() => {
    if (user) {
      dispatch(getAdvertisementSellerInfo(user.id));
    }
  }, [user]);

  useEffect(() => {
    /**
     * если профиль был заблокирован, выводим модалку и оповещаем юзера об этом, чтобы
     * он мог вылогиниться т.к сайтом он пользоваться больше не сможет.
     */
    if (user && sellerInfo && sellerInfo.userId === user.id && sellerInfo.isBanned) {
      setPopup(
        <AlertPopup
          title="Внимание!"
          closeable={false}
          onClose={() => {}}
          positiveButton="Выйти"
          onPositiveButtonClick={() => {
            setPopup(null)
            localStorage.removeItem('token');
            setAuthenticated(false)
          }}
        >
          Ваш аккаунт был заблокирован.
        </AlertPopup>
      );
    }
  }, [sellerInfo]);

  return (
    <>
      {loginState !== 'wait' && (
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/login/:referral" component={Login} />
            <Route exact path="/profile">
              <RequireAuth>
                <Profile />
              </RequireAuth>
            </Route>
            <Route path="/otc">
              <RequireAuth>
                <Otc />
              </RequireAuth>
            </Route>
            <Route exact path="/stock">
              <RequireAuth>
                <Stock />
              </RequireAuth>
            </Route>
            <Route exact path="/advertisement/:id">
              <RequireAuth>
                <Advertisement />
              </RequireAuth>
            </Route>
            <Route exact path="/trade/:id">
              <RequireAuth>
                <Trade />
              </RequireAuth>
            </Route>
            <Route exact path="/advertisement/seller-profile/:userId">
              <RequireAuth>
                <SellerProfile />
              </RequireAuth>
            </Route>
            <Route exact path="/actives">
              <RequireAuth>
                <Actives />
              </RequireAuth>
            </Route>
            <Route exact path="/history">
              <RequireAuth>
                <History />
              </RequireAuth>
            </Route>
            <Route exact path="/agreements" component={Agreements} />
            <Route path="/admin" component={Admin}>
              <RequireAuth>
                <Admin />
              </RequireAuth>
            </Route>
            <Route exact path="/knowledge-center/popular/:id">
              <RequireAuth>
                <KnowledgeCenterPopularItem />
              </RequireAuth>
            </Route>
            <Route path="/knowledge-center">
              <RequireAuth>
                <KnowledgeCenter />
              </RequireAuth>
            </Route>
            <Route exact path="/confirm-email" component={Confirmation} />
            <Route exact path="*">
              <NotFound />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
};

export default App;
