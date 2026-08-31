import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Cellar from './pages/Cellar'
import Classification from './pages/Classification'
import Decode from './pages/Decode'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Terroir from './pages/Terroir'
import Log from './pages/Log'
import LogDetail from './pages/LogDetail'
import LogEdit from './pages/LogEdit'
import LogNew from './pages/LogNew'
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
          <Route path="/log" element={<Log />} />
          <Route path="/log/new" element={<LogNew />} />
          <Route path="/log/:id/edit" element={<LogEdit />} />
          <Route path="/log/:id" element={<LogDetail />} />
          <Route path="/cellar" element={<Cellar />} />
          <Route path="/vintages" element={<Vintages />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/producers" element={<Producers />} />
          <Route path="/producers/:id" element={<ProducerDetail />} />
          <Route path="/decode" element={<Decode />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/classification" element={<Classification />} />
          <Route path="/learn/terroir" element={<Terroir />} />
        </Routes>
      </main>
    </div>
  )
}
