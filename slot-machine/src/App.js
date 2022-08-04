import './App.css';
import { useState } from 'react';
import SlotMachine from './pages/slotMachine/slotMachine';
import DashBoard from './pages/dashBoard/dashBoard';

function App() {
  const [curPage, setCurPage] = useState("slot")

  return (
    <div>
      <div className='app'>
        <div onClick={() => {setCurPage("slot")}} className='link'>
          Slot Machine
        </div>
        <div onClick={() => {setCurPage("dash")}} className='link'>
          DashBoard
        </div>
      </div>
        {curPage=="slot"? (
          <SlotMachine/>
        ) : (<DashBoard/>)}
      
    </div>
  );
}

export default App;
