import './App.css'
import {Link} from "react-router-dom"
import lodash from "lodash";

const implementedUpTo: number = 4

const sections = lodash.range(1, implementedUpTo + 1).map((index) => {
    const padIndex = index.toString().padStart(2, "0")
    return <section>
      <h2><Link to={`day${padIndex}`}>Day {padIndex}</Link></h2>
    </section>
  }
)

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
