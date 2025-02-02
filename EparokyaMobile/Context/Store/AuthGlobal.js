import React from "react";

export default React.createContext();

// import React, { createContext, useState } from 'react';

// const AuthGlobal = createContext();

// const AuthProvider = ({ children }) => {
//   const [userProfile, setUserProfile] = useState(null);

//   return (
//     <AuthGlobal.Provider value={{ userProfile, setUserProfile }}>
//       {children}
//     </AuthGlobal.Provider>
//   );
// };

// export { AuthProvider, AuthGlobal };