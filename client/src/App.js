// import logo from "./logo.svg";
// import "./App.css";
// import Navbar from "./components/Navbar";
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Homescreen from "./screens/Homescreen";
// import Bookingscreen from "./screens/Bookingscreen"; 
// import Registerscreen from "./screens/Registerscreen";
// import Loginscreen from "./screens/Loginscreen";
// import ProfileScreen from "./screens/ProfileScreen";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <div className="App">
//       <Navbar />
//       <BrowserRouter>
//         <Routes>
       
//           <Route path="/home" element={<Homescreen />} />
//           <Route path="/book/:roomid/:fromdate/:todate" element={<Bookingscreen />} /> {/* Add route for Bookingscreen */}
//           <Route path='/register' element={<Registerscreen />} />
//           <Route path='/login' element={<Loginscreen />} />
//           <Route path='/profile' element={<ProfileScreen />} /> {/* Correct route for ProfileScreen */}
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;



import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import styles from './App.module.css'; // Import CSS Module
import AdminScreen from './screens/AdminScreen';  // Adjust the path as needed
import LandingScreen from "./screens/LandingScreen";

function App() {
  return (
    <div className={styles.App}>
      <Navbar />
      <BrowserRouter>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Homescreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:roomid/:fromdate/:todate"
            element={
              <ProtectedRoute>
                <Bookingscreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminScreen />
              </ProtectedRoute>
            }
          />
            <Route
            path="/"
            element={
              
                <LandingScreen />
              
            }
          />

          {/* Public Routes */}
          <Route path="/register" element={<Registerscreen />} />
          <Route path="/login" element={<Loginscreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
