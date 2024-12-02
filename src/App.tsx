import './App.css'
import './Solutions/Day01/Day01'
import {Link} from "react-router-dom"
import {paths} from "./Paths"

function App() {
  return (
    <main>
      <header>
        <h1>Advent of Code 2024 Solutions in TypeScript</h1>
      </header>
      <section>
        <h2><Link to={paths.day01}>Day 01</Link></h2>
      </section>
      <section>
        <h2><Link to={paths.day02}>Day 02</Link></h2>
      </section>
    </main>
  )
}

export default App
