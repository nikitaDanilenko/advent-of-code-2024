import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter, Routes, Route} from "react-router"
import Day01 from "./Solutions/Day01/Day01"
import {paths} from "./Paths"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <BrowserRouter>
    <Routes>
      <Route path={paths.root} element={<App />} />
      <Route path={paths.day01} element={<Day01/>}/>
    </Routes>
  </BrowserRouter>
)
