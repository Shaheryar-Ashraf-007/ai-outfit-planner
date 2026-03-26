import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import CreateOutfit from "./pages/CreateOutfit.jsx";
import ViewOutfit from "./pages/view-outfit/[outfitId]/ViewOutfit.jsx";
import LoginPage from "./components/Login.jsx";
import SignupPage from "./components/Signup.jsx";
import Navbar from "./components/Navbar.jsx";

function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/create-outfit", element: <CreateOutfit /> },
      { path: "/view-outfit", element: <ViewOutfit /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}