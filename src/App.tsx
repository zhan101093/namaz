import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Layout'
import { Home } from './pages/Home'
import { WhyPray } from './pages/WhyPray'
import { Movements } from './pages/Movements'
import { Duas } from './pages/Duas'
import { Practice } from './pages/Practice'
import { Mistakes } from './pages/Mistakes'
import { Game } from './pages/Game'
import { OrderGame } from './pages/OrderGame'
import { MatchGame } from './pages/MatchGame'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/why" element={<WhyPray />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/duas" element={<Duas />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/game" element={<Game />} />
          <Route path="/order-game" element={<OrderGame />} />
          <Route path="/match-game" element={<MatchGame />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
