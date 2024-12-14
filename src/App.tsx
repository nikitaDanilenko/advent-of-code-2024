import "./App.css"
import { Link } from "react-router-dom"
import lodash from "lodash"
import { dayPath, days, dayText } from "./Paths.ts"

const sections = lodash.range(1, days.length + 1).map(index => {
  return (
    <section>
      <h2>
        <Link to={dayPath(index)}>{dayText(index)}</Link>
      </h2>
    </section>
  )
})

function App() {
  return (
    <main>
      <header>
        <h1>Advent of Code 2024 Solutions in TypeScript</h1>
      </header>
      {...sections}
    </main>
  )
}

export default App
