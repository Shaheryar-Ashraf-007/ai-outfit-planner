import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import CreateOutfit from "./pages/CreateOutfit.jsx";
import ViewOutfit from "./pages/view-outfit/[outfitId]/ViewOutfit.jsx";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element : <Dashboard/>
  },
   {
    path: "/create-outfit",
    element : <CreateOutfit/>
  },
  {
    path: "/view-outfit",
    element : <ViewOutfit/>
  },
  


])

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;