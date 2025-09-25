import './App.css'
import Home from './components/Home/Home'
import Adminsection from './components/Admin Section/Adminsection'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Myappointments from './components/My Appointments/Myappointments'
import Userregistration from './components/User Registration/Userregistration'
import Totalappointments from './components/Total Appointments/Totalappointments'
import Userlogin from './components/User Login/Userlogin'
import Doctorlogin from './components/Doctor Login/Doctorlogin'


function App() {

  return (
    <>
    
      <div className="App-continar">
        <BrowserRouter>          
          <Routes>
              <Route path="/" element={<Userregistration/>}/>
              <Route path="/Userlogin" element={<Userlogin/>}/>
              <Route path="/Home" element={<Home/>} />
		        	<Route path="/Adminsection" element={<Adminsection />} />
              <Route path="/Myappointments" element={<Myappointments />} />
              <Route path="/Totalappointments" element={<Totalappointments/>}/>
              <Route path="/Doctorlogin" element={<Doctorlogin/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}


export default App