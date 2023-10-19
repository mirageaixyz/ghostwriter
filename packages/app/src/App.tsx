import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'


function App() {

  return (
    <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="*" element={<LandingPage/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
  )
}

export default App
