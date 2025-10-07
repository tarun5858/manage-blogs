import { BrowserRouter, Routes, Route,Navigate  } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Manageblogs from "./pages/Manageblogs";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/manage-blogs"
            element={
              <ProtectedRoute>
                {" "}
                <Manageblogs />{" "}
              </ProtectedRoute>
            }
          />
          {/* <Manageblogs /> */}
           <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
