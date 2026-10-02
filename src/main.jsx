import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/motion.css'
import { enableMotion } from './motion/engine'

// Activates the "hidden until revealed" states (content stays visible if JS fails)
enableMotion()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)