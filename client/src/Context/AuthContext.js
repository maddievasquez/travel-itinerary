// // Context/AuthContext.js
// import { createContext, useState, useEffect } from "react";
// import Cookie from "../components/cookies";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Check if user is already authenticated on component mount
//   useEffect(() => {
//     const checkAuth = () => {
//       // Check if access token exists in cookies
//       const accessToken = Cookie.getCookie("access");
      
//       if (accessToken) {
//         setIsAuthenticated(true);
//       }
      
//       setIsLoading(false);
//     };
    
//     checkAuth();
//   }, []);

//   // Provide auth state and methods to children
//   const contextData = {
//     isAuthenticated,
//     setIsAuthenticated,
//     isLoading
//   };

//   return (
//     <AuthContext.Provider value={contextData}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;