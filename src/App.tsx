import {
  RouterProvider,
  Link,
  createHashRouter,
} from "react-router-dom";
import { MainScreen } from "./pages/main";


import { PropsWithChildren } from "react";
import { SettingsScreen } from "./pages/settings";
import { RPCScreen } from "./pages/rpc";
import { AgentScreen } from "./pages/agents";
import { ListScreen } from "./pages/list";
import { BookDetailsScreen } from "./pages/details";
import { BookReadScreen } from "./pages/read";

const router = createHashRouter([
  {
    path: "/",
    element: <SimpleWrapper> <MainScreen /></SimpleWrapper>,
  },
  {
    path: "/settings",
    element: <SimpleWrapper> <SettingsScreen /></SimpleWrapper>,
  },
  {
    path: "/rpc",
    element: <SimpleWrapper> <RPCScreen /></SimpleWrapper>,
  },
  {
    path: "/agents",
    element: <SimpleWrapper> <AgentScreen /></SimpleWrapper>,
  },
  {
    path: "/list",
    element: <SimpleWrapper> <ListScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID",
    element: <SimpleWrapper> <BookDetailsScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/read/:page",
    element: <SimpleWrapper> <BookReadScreen /></SimpleWrapper>,
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
        <Link to="/rpc">RPC</Link>
        <Link to="/settings">Настройки</Link>
      </div>

      <div className="app-body">
        {props.children}
      </div>
    </ >
  )
}

export default App
