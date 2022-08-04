import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import SlotMachine from './pages/slotMachine/slotMachine';
import DashBoard from './pages/dashBoard/dashBoard';

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/" className='link'>
          Home
        </Link>
        <Link to="/slot-machine" className='link'>
          Slot Machine
        </Link>
        <Link to="/dashboard" className='link'>
          DashBoard
        </Link>
        <Routes>
          <Route path="/" element={<></>}/>
          <Route path="/slot-machine" element={<SlotMachine/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
