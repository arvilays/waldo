import App from "./App";
import Home from "./views/Home";
import Play from "./views/Play";
import Leaderboard from "./views/Leaderboard";
import ErrorPage from "./views/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "play/:slug?",
        element: <Play />,
      },
      {
        path: "leaderboard/:slug?",
        element: <Leaderboard />,
      },
    ],
  },
];

export default routes;

