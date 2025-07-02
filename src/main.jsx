import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/navbar/navbar.jsx'
import IntroductionSection from './components/body/introduction_section/intro_section.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
    < Navbar/>
    <IntroductionSection/>
    </>
  </StrictMode>,
)
