import {
  RouterProvider,
  Link,
  createHashRouter,
} from "react-router-dom";
import { MainScreen } from "./pages/main";


import { PropsWithChildren, useState } from "react";
import { SettingsScreen } from "./pages/settings";
import { RPCScreen } from "./pages/rpc";
import { AgentEditorScreen, AgentListScreen } from "./pages/agents";
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
import { AgentListLink, AttributeColorListLink, AttributeRemapListLink, BookListLink, FSListLink, HProxyListLink, LabelPresetsLink, MainScreenLink, MassloadListLink, MenuLink, ParsingMirrorsLink, RPCLink, SelectToCompareLink, SettingsLink, TasksLink } from "./core/routing";
import { AppTheme, ThemeContext } from "./core/context";
import { FSEditorScreen, FSListScreen } from "./pages/fs";
import { ParsingMirrorEditorScreen, ParsingMirrorsScreen } from "./pages/parsing-mirrors";
import { AttributeRemapListScreen } from "./pages/attribute-remap";
import { HProxyBookScreen } from "./pages/hproxy-book";
import { HProxyListScreen } from "./pages/hproxy-list";
import { MassloadListScreen } from "./features/massload/massload-list-screen";
import { MassloadEditorScreen } from "./features/massload/massload-editor-screen";
import { MassloadViewScreen } from "./features/massload/massload-view-screen";

const router = createHashRouter([
  {
    path: "/",
    element: <SimpleWrapper><MainScreen /></SimpleWrapper>,
  },
  {
    path: "/settings",
    element: <SimpleWrapper><SettingsScreen /></SimpleWrapper>,
  },
  {
    path: "/menu",
    element: <SimpleWrapper><MenuWidget /></SimpleWrapper>,
  },
  {
    path: "/rpc",
    element: <SimpleWrapper><RPCScreen /></SimpleWrapper>,
  },
  {
    path: "/agent/list",
    element: <SimpleWrapper><AgentListScreen /></SimpleWrapper>,
  },
  {
    path: "/agent/edit/:id",
    element: <SimpleWrapper><AgentEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/list",
    element: <SimpleWrapper><ListScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID",
    element: <SimpleWrapper><BookDetailsScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/read/:page",
    element: <SimpleWrapper><BookReadScreen /></SimpleWrapper>,
  },
  {
    path: "/label/presets",
    element: <SimpleWrapper><LabelPresetsScreen /></SimpleWrapper>,
  },
  {
    path: "/label/preset/edit/:name",
    element: <SimpleWrapper><LabelPresetEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/label/preset/edit",
    element: <SimpleWrapper><LabelPresetEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/tasks",
    element: <SimpleWrapper><TaskScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:origin/compare/:target",
    element: <SimpleWrapper><CompareBookScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/unique-pages",
    element: <SimpleWrapper><UniqueBookPagesScreen /></SimpleWrapper>,
  },
  {
    path: "/deduplicate/:bookID/:page",
    element: <SimpleWrapper><BooksByPageScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/edit",
    element: <SimpleWrapper><BookEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/rebuild",
    element: <SimpleWrapper><BookRebuilderScreen /></SimpleWrapper>,
  },
  {
    path: "/select-to-compare",
    element: <SimpleWrapper><SelectToCompareScreen /></SimpleWrapper>,
  },
  {
    path: "/book/:bookID/labels",
    element: <SimpleWrapper><BookLabelsEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/attribute/color/list",
    element: <SimpleWrapper><AttributeColorListScreen /></SimpleWrapper>,
  },
  {
    path: "/attribute/color/edit",
    element: <SimpleWrapper><AttributeColorEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/attribute/color/edit/:code/:value",
    element: <SimpleWrapper><AttributeColorEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/fs/list",
    element: <SimpleWrapper><FSListScreen /></SimpleWrapper>,
  },
  {
    path: "/fs/edit/:id",
    element: <SimpleWrapper><FSEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/parsing/mirrors",
    element: <SimpleWrapper><ParsingMirrorsScreen /></SimpleWrapper>,
  },
  {
    path: "/parsing/mirror/edit/:id",
    element: <SimpleWrapper><ParsingMirrorEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/parsing/mirror/edit",
    element: <SimpleWrapper><ParsingMirrorEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/attribute/remap/list",
    element: <SimpleWrapper><AttributeRemapListScreen /></SimpleWrapper>,
  },
  {
    path: "/hproxy/list",
    element: <SimpleWrapper><HProxyListScreen /></SimpleWrapper>,
  },
  {
    path: "/hproxy/book",
    element: <SimpleWrapper><HProxyBookScreen /></SimpleWrapper>,
  },
  {
    path: "/massload/list",
    element: <SimpleWrapper><MassloadListScreen /></SimpleWrapper>,
  },
  {
    path: "/massload/edit/:id",
    element: <SimpleWrapper><MassloadEditorScreen /></SimpleWrapper>,
  },
  {
    path: "/massload/view/:id",
    element: <SimpleWrapper><MassloadViewScreen /></SimpleWrapper>,
  },
]);

function App() {
  const [theme, setTheme] = useState<AppTheme>(
    localStorage.getItem("theme") == "dark" ? "dark" : "light"
  )

  return (
    <div
      data-theme={theme}
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--app-background)",
        color: "var(--app-color)"
      }}
    >
      <ThemeContext.Provider value={{
        theme: theme,
        setTheme: setTheme,
      }}>
        <RouterProvider router={router} />
      </ThemeContext.Provider>
    </div>
  )
}

function SimpleWrapper(props: PropsWithChildren) {
  return (
    <>
      <div className="app-header">
        <Link to={MainScreenLink()}>Главная</Link>
        <Link to={BookListLink()}>Список книг</Link>
        <Link to={HProxyListLink()}>HProxy</Link>
        <Link to={MenuLink()}>Меню</Link>
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
      <li><Link to={MainScreenLink()}>Главная</Link></li>
      <li><Link to={BookListLink()}>Список книг</Link></li>
      <li><Link to={AgentListLink()}>Агенты</Link></li>
      <li><Link to={RPCLink()}>RPC</Link></li>
      <li><Link to={TasksLink()}>Задачи</Link></li>
      <li><Link to={LabelPresetsLink()}>Пресеты меток</Link></li>
      <li><Link to={SelectToCompareLink()}>Выбрать книги для сравнения</Link></li>
      <li><Link to={AttributeColorListLink()}>Цвета аттрибутов</Link></li>
      <li><Link to={AttributeRemapListLink()}>Ремапинг аттрибутов</Link></li>
      <li><Link to={FSListLink()}>Файловые системы</Link></li>
      <li><Link to={ParsingMirrorsLink()}>Зеркала для парсинга</Link></li>
      <li><Link to={HProxyListLink()}>HProxy</Link></li>
      <li><Link to={MassloadListLink()}>Массовые загрузки</Link></li>
      <li><Link to={SettingsLink()}>Настройки</Link></li>
    </ol>
  </div>
}

export default App
