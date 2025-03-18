import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextUIProvider } from '@nextui-org/react'
import Home from './pages/Home'
import ScanResults from './pages/ScanResults'
import GameLibrary from './pages/GameLibrary'
import GameDetails from './pages/GameDetails'
import HardwareScan from './pages/HardwareScan'
import Layout from './components/Layout'

// Create a client for React Query
const queryClient = new QueryClient()

function App() {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/scan" element={<HardwareScan />} />
              <Route path="/results" element={<ScanResults />} />
              <Route path="/games" element={<GameLibrary />} />
              <Route path="/games/:id" element={<GameDetails />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </NextUIProvider>
  )
}

export default App
