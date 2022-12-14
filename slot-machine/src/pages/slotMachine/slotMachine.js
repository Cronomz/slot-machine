import './slotMachine.css';
import Loading from '../loading/loading';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useFrame } from "react-three-fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'

function SlotMachine() {
  const slotTexture = useLoader(TextureLoader, "https://res.cloudinary.com/rmarcello/image/upload/v1433512041/slot-machine_orizontal_ygxsnm.png");
  const slotRef1 = useRef();
  const slotRef2 = useRef();
  const slotRef3 = useRef();
  const slotRef4 = useRef();
  const slotRef5 = useRef();
  const [money, setMoney] = useState(1000);
  const [moneyBet, setMoneyBet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [winText, setWinText] = useState("");
  const [curSpin, setCurSpin] = useState([Math.random()*2*Math.PI, Math.random()*2*Math.PI, Math.random()*2*Math.PI, Math.random()*2*Math.PI, Math.random()*2*Math.PI])
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bonusGame, setBonusGame] = useState(false);

  const bonus = 10
  var isSpinning = false;
  var spins = [false, false, false, false, false]

  useEffect( () => {
    if (slotRef5.current != null) {
      setLoading(false);  
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000)

    console.log(bonusGame, gamesPlayed)
    if (!bonusGame && (gamesPlayed+1) % 10 == 0) {
      setBonusGame(true);
      setMoneyBet(10)
    }

    if (bonusGame && gamesPlayed+1 % 10 != 0) {
      setBonusGame(false);
    }

  },[money, moneyBet, loading, winText, gamesPlayed])

  function BoxContainer() {
    return (
      <mesh scale={[2,3,1]}> 
        <boxBufferGeometry attach="geometry"/>
        <meshLambertMaterial attach="material" color="brown"/>
      </mesh>)
  }

  function CylinderHandle() {
    return (
      <mesh position={[1, 1.2, 0.3]} scale={[0.2, 1.5, 0.2]} onClick={spin}>
        <cylinderBufferGeometry attach="geometry"></cylinderBufferGeometry>
        <meshLambertMaterial attach="material" color="white"></meshLambertMaterial>
      </mesh>
    )
  }

  function spin() {
    isSpinning = true
    setTimeout( () => {
      isSpinning = false
    },1000)
  }

  function spinCheck() {
    let stillSpining = false
    for (let x in spins) {
      if (spins[x] != false) {
        stillSpining = true
      }
    }
    if (!stillSpining) {
      let result = [
        6 - Math.floor((slotRef1.current.rotation.x % (2*Math.PI)) / (2*Math.PI/7)),
        6 - Math.floor((slotRef2.current.rotation.x % (2*Math.PI)) / (2*Math.PI/7)),
        6 - Math.floor((slotRef3.current.rotation.x % (2*Math.PI)) / (2*Math.PI/7)),
        6 - Math.floor((slotRef4.current.rotation.x % (2*Math.PI)) / (2*Math.PI/7)),
        6 - Math.floor((slotRef5.current.rotation.x % (2*Math.PI)) / (2*Math.PI/7))
      ]
      console.log("Game " + gamesPlayed + ": " + result)
      setGamesPlayed(gamesPlayed + 1)
      let winning = 0
      if (result[0] == 2 && result[1] == 3 && result [2] == 4 && result[3] == 5 && result [4] == 6) {
        //ultra win
        winning = moneyBet*5
        setWinText("Ultra Win!!\n$" + winning)
        setTimeout(() => {
          setWinText("")
        }, 2000)
      } else if (result[0] == result[1] && result[2] == result[3] && result[3] == result[4]) {
        //super win
        winning = moneyBet*4
        setWinText("Super Win!!\n$" + winning)
        setTimeout(() => {
          setWinText("")
        }, 2000)
      } else if (result[0] == result[1] && result[1] == result[2] && result[2] == result[3] && result[3] == result[4]) {
        //mega win
        winning = moneyBet*3
        setWinText("Mega Win!!\n$" + winning)
        setTimeout(() => {
          setWinText("")
        }, 2000)
      } else if (result[0] == 6 & result[1] == 6) {
        //big win
        winning = moneyBet*2
        setWinText("Big Win!!\n$" + winning)
        setTimeout(() => {
          setWinText("")
        }, 2000)
      } else if (result[4] == 6) {
        //win
        winning = moneyBet
        setWinText("Win!!\n$" + winning)
        setTimeout(() => {
          setWinText("")
        }, 2000)
      }
      if (bonusGame) {
        setMoney(money + winning)  
      } else {
        setMoney(money - moneyBet + winning)
      }
    }
  }

  function CylinderSlot(props) {
    let startTime = 0
    let currentTime = 0
    useFrame(({ clock }) => {
      if (isSpinning && !spins[props.number]) {
        spins[props.number] = true 
        let time = Math.random()*10000
          setTimeout( () => {
            spins[props.number] = false
            spinCheck();
          }, time)
         
      }
      if (spins[props.number]) {
        if (startTime <= 0) {
          startTime = clock.getElapsedTime() 
          currentTime = startTime - props.slotRef.current.rotation.x; 
        }
        props.slotRef.current.rotation.x = (clock.getElapsedTime() - currentTime)*6
        let tempCurSpin = curSpin
        tempCurSpin[props.number] = props.slotRef.current.rotation.x
        setCurSpin(tempCurSpin)
      }
      
    })
    return (
      <mesh ref={props.slotRef} position={props.position} scale={[0.3, 0.3, 0.3]} rotation={[props.spin, 0, Math.PI/2]}>
        <cylinderBufferGeometry attach="geometry"></cylinderBufferGeometry>
        <meshLambertMaterial map={slotTexture}></meshLambertMaterial>
      </mesh>
    )
  }


  return (
    <div className="container">
      {loading? (
        <Loading/>
      ): (
        <>
        <div className='money'>
          Your Money:
          ${money}
        </div>
        <Canvas className='canvas'>
          <spotLight position={[10, 15, 10]} angle={0.3}/>
          <BoxContainer/>
          <CylinderHandle/>
          <CylinderSlot position={[-0.7, 0, 0.5]} slotRef={slotRef1} spin={curSpin[0]} number={0}/>
          <CylinderSlot position={[-0.35, 0, 0.5]} slotRef={slotRef2} spin={curSpin[1]} number={1}/>
          <CylinderSlot position={[0, 0, 0.5]} slotRef={slotRef3} spin={curSpin[2]} number={2}/>
          <CylinderSlot position={[0.35, 0, 0.5]} slotRef={slotRef4} spin={curSpin[3]} number={3}/>
          <CylinderSlot position={[0.7, 0, 0.5]} slotRef={slotRef5} spin={curSpin[4]} number={4}/>
        
        </Canvas>

        <div className='winningText'>
          {winText}
        </div>

        <div className='betContainer'>
          <div className='betAmount'>
            Money Bet: ${moneyBet}
          </div>
          <div className='changeBet'>
            <div className='addBet' onClick={() => {if (moneyBet < money && !isSpinning) {setMoneyBet(moneyBet+1)}}}>
              +1
            </div>
            <div className='reduceBet' onClick={() => {if (moneyBet > 0 && !isSpinning) {setMoneyBet(moneyBet-1)}}}>
              -1
            </div>
          </div>
        </div>

        <div className='rulesContainer'>
          <div className='rules'>
            Rules <br/>
            1. Win = the 5th slot is a 6 <br/>
            2. Big Win = the 1st and 2nd slot is a 6 <br/>
            3. Mega Win = all the slot has the same number <br/>
            4. Super Win = 1st and 2nd slot the same and 3rd, 4th, and 5th slot the same <br/>
            5. Ultra Win = 2, 3, 4, 5, 6 <br/>
            6. After every 10th bet, bonus $10 bet without subtracting your money <br/>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default SlotMachine;
