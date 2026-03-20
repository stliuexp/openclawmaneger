import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import StartupDetector from './components/StartupDetector'
import Dashboard from './pages/Dashboard'
import Gateway from './pages/Gateway'
import Channels from './pages/Channels'
import Models from './pages/Models'
import Skills from './pages/Skills'
import Agents from './pages/Agents'
import Config from './pages/Config'
import Docs from './pages/Docs'
import Logs from './pages/Logs'
import Settings from './pages/Settings'
import type { SystemInfo } from './lib/types'

function App() {
  const [startupState, setStartupState] = useState<'detecting' | 'ready'>('detecting')
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)

  const handleDetected = (info: SystemInfo) => {
    setSystemInfo(info)
    setStartupState('ready')
  }

  const handleNewInstall = () => {
    // TODO: 实现安装流程
    setStartupState('ready')
  }

  const handleError = (error: string) => {
    console.error('Startup detection error:', error)
  }

  if (startupState === 'detecting') {
    return (
      <StartupDetector
        onDetected={handleDetected}
        onNewInstall={handleNewInstall}
        onError={handleError}
      />
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gateway" element={<Gateway />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/models" element={<Models />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/config" element={<Config />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
