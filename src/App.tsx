import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextUIProvider } from '@nextui-org/react'
import Home from './pages/Home'
import ScanResults from './pages/ScanResults'
import GameLibrary from './pages/GameLibrary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Create a client for React Query
const queryClient = new QueryClient()

function App() {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto flex-grow px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<ScanResults />} />
                <Route path="/games" element={<GameLibrary />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </QueryClientProvider>
    </NextUIProvider>
  )
}

export default App
