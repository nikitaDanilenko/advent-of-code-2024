import ReactDOM from "react-dom/client"
import App from "./App"
import { HashRouter, Route, Routes } from "react-router-dom"
import { dayPath, days, rootPath } from "./Paths"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const routes = days.map((Day, index) => {
  return <Route path={dayPath(index + 1)} element={<Day />} />
})

root.render(
  <HashRouter>
    <Routes>
      <Route path={rootPath}>
        <Route index element={<App />} />
        {...routes}
      </Route>
    </Routes>
  </HashRouter>
)
