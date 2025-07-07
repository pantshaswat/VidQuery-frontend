import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import VideoSearchApp from './pages/VideoSearchApp';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
 <Routes>
 <Route path="/" element={<VideoSearchApp />} />
</Routes>    </>
  )
}

export default App
