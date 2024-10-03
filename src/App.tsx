import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import { MainScreen } from "./pages/main";


import { PropsWithChildren } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SimpleWrapper> <MainScreen /></SimpleWrapper>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </ >
  )
}

function SimpleWrapper(props: PropsWithChildren) {

  return (
    <>
      <div className="app-header">
        <Link to="/">Главная</Link>
        <Link to="/list">Список книг</Link>
        <Link to="/agents">Агенты</Link>
        <Link to="/settings">Настройки</Link>
      </div>

      <div className="app-body">
        {props.children}
      </div>
    </ >
  )
}

export default App
