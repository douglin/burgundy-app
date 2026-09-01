import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Classification from './pages/Classification'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Terroir from './pages/Terroir'
import ProducerDetail from './pages/ProducerDetail'
import Producers from './pages/Producers'
import Quiz from './pages/Quiz'
import Vintages from './pages/Vintages'

export default function App() {
  return (
    <div className="flex flex-col h-dvh bg-[#F5F0E8] text-[#2C1810]">
      <Nav />
      <main className="flex-1 overflow-y-auto min-h-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Home />} />
          <Route path="/vintages" element={<Vintages />} />
          <Route path="/producers" element={<Producers />} />
          <Route path="/producers/:id" element={<ProducerDetail />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/classification" element={<Classification />} />
          <Route path="/learn/terroir" element={<Terroir />} />
          <Route path="/learn/quiz" element={<Quiz />} />
        </Routes>
      </main>
    </div>
  )
}
