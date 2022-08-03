import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import SlotMachine from './pages/slotMachine/slotMachine';

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">
          Home
        </Link>
        <Link to="/slot-machine">
          Slot Machine
        </Link>
        <Routes>
          <Route path="/" element={<></>}/>
          <Route path="/slot-machine" element={<SlotMachine/>}/>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
