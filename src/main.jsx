import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Root from "./routes/root";
import HomePage from "./components/homepage";
import About from "./routes/about";
import Game from "./routes/game";

const router = createBrowserRouter([
  {
    path: "/",
    element: < Root/>,
    children:[
      {
        index:true,
        element: <HomePage />
      },
      {
        path:'/about',
        element: <About />,
      },
      {
        path: '/game',
        element : <Game />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
