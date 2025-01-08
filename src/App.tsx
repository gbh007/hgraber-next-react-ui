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
import { LabelPresetEditorScreen, LabelPresetsScreen } from "./pages/label-presets";
import { TaskScreen } from "./pages/tasks";
import { CompareBookScreen } from "./pages/compare";
import { UniqueBookPagesScreen } from "./pages/unique-pages";
import { BooksByPageScreen } from "./pages/books-by-page";
import { BookEditorScreen } from "./pages/book-editor";
import { BookRebuilderScreen } from "./pages/book-rebuilder";
import { SelectToCompareScreen } from "./pages/select-to-compare";
import { BookLabelsEditorScreen } from "./pages/book-label-editor";
import { AttributeColorEditorScreen, AttributeColorListScreen } from "./pages/attribute-color";

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
    path: "/menu",
    element: <SimpleWrapper> <MenuWidget /></SimpleWrapper>,
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
  {
    path: "/label/presets",
    element: <SimpleWrapper> <LabelPresetsScreen /></SimpleWrapper>,
  },
  {
    path: "/label/preset/edit/:name",
    element: <SimpleWrapper> <LabelPresetEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/label/preset/edit",
    element: <SimpleWrapper> <LabelPresetEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/tasks",
    element: <SimpleWrapper> <TaskScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:origin/compare/:target",
    element: <SimpleWrapper> <CompareBookScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/unique-pages",
    element: <SimpleWrapper> <UniqueBookPagesScreen /></SimpleWrapper>,
  },
  {
    path: "/deduplicate/:bookID/:page",
    element: <SimpleWrapper> <BooksByPageScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/edit",
    element: <SimpleWrapper> <BookEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/rebuild",
    element: <SimpleWrapper> <BookRebuilderScreen /></SimpleWrapper>,
  },
  {
    path: "/select-to-compare",
    element: <SimpleWrapper> <SelectToCompareScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/labels",
    element: <SimpleWrapper> <BookLabelsEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/attribute/color/list",
    element: <SimpleWrapper> <AttributeColorListScreen /></SimpleWrapper>,
  },
  {
    path: "/attribute/color/edit",
    element: <SimpleWrapper> <AttributeColorEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/attribute/color/edit/:code/:value",
    element: <SimpleWrapper> <AttributeColorEditorScreen /></SimpleWrapper>,
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
        <Link to="/menu">Меню</Link>
      </div>

      <div className="app-body">
        {props.children}
      </div>
    </ >
  )
}


function MenuWidget() {
  return <div>
    <ol>
      <li> <Link to="/">Главная</Link> </li>
      <li> <Link to="/list">Список книг</Link> </li>
      <li> <Link to="/agents">Агенты</Link> </li>
      <li> <Link to="/rpc">RPC</Link> </li>
      <li> <Link to="/tasks">Задачи</Link> </li>
      <li> <Link to="/label/presets">Пресеты меток</Link> </li>
      <li> <Link to="/select-to-compare">Выбрать книги для сравнения</Link> </li>
      <li> <Link to="/attribute/color/list">Цвета аттрибутов</Link> </li>
      <li> <Link to="/settings">Настройки</Link> </li>
    </ol>
  </div>
}

export default App
