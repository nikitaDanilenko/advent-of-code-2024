import ReactDOM from 'react-dom/client'
import App from './App'
import {HashRouter, Route, Routes} from "react-router-dom"
import {paths} from "./Paths"
import Day01 from "./Solutions/Day01/Day01"
import Day02 from "./Solutions/Day02/Day02.tsx";
import Day03 from "./Solutions/Day03/Day03.tsx";
import Day04 from "./Solutions/Day04/Day04.tsx";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <HashRouter>
    <Routes>
      <Route path={paths.root}>
        <Route index element={<App/>}/>
        <Route path={paths.day01} element={<Day01/>}/>
        <Route path={paths.day02} element={<Day02/>}/>
        <Route path={paths.day03} element={<Day03/>}/>
        <Route path={paths.day04} element={<Day04/>}/>
      </Route>
    </Routes>
  </HashRouter>
)
