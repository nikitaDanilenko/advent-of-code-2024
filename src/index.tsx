import ReactDOM from 'react-dom/client'
import App from './App'
import {HashRouter, Route, Routes} from "react-router-dom"
import {paths} from "./Paths"
import Day01 from "./Solutions/Day01/Day01"
import Day02 from "./Solutions/Day01/Day02";
import Day03 from "./Solutions/Day01/Day03";

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
      </Route>
    </Routes>
  </HashRouter>
)
