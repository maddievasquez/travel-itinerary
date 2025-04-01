// // src/components/auth/PrivateRoute.jsx
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth, } from '../Context/AuthContext';

// export const PrivateRoute = () => {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading) {
//     return <div>Loading...</div>;
//   }
  
//   return isAuthenticated ? <Outlet /> : <Navigate to="/welcome" />;
// };