import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import Create from "./pages/Create";
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'


function App() {

  return (
    <div className="App">
            <Router>
                <Routes>
                    <Route path="*" element={<LandingPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/create" element={<Create/>}/>
                </Routes>
        </Router>
        </div>
  )
}

export default App
