import App from "./App";
import Home from "./views/Home";
import Play from "./views/Play";
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
        path: "play/:nameShort?",
        element: <Play />,
      },
    ],
  },
];

export default routes;

