import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment } from 'react';
import Signin from './Sign-in';
import Header from './Header';
import NotFound from './404';
import AuthProvider from './Auth/authProvider';
import { ToastContainer } from 'react-toastify';
export default function App() {
  const pathname = window.location.pathname; // Sử dụng pathname thay vì path
  var flag = true;
  var token = "123";
 
  return (
    <>
   <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            var Layout = Header;          
            if (route.layout) {
              Layout = route.layout;
            } else {
              Layout = Fragment;
            }        
            return <Route key={index} path={route.path} element={<Layout><Page /></Layout>} />;
          })}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            var Layout = Header;          
            // Đảm bảo rằng bạn đã xác thực người dùng ở đây
            if (route.layout) {
              Layout = route.layout;
            } else {
              Layout = Fragment;
            }        
            return <Route key={index} path={route.path} element={
            <AuthProvider>
              <Layout>
                <Page />
              </Layout>
            </AuthProvider> 
            } />;
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
     <ToastContainer />
    </>
  );
}

