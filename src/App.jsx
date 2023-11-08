// external imports
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

// internal imports
import Dice from "./components/Dice"

export default function App() {
  // state variables
  const [diceNumbers, setDiceNumbers] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [gameTime, setGameTime] = useState(null)

  // useEffects
  useEffect(() => {
    if (tenzies) {
      const endTime = new Date();
      const timeTaken = calculateTimeTaken(startTime, endTime);
      setGameTime(timeTaken);
    }
  }, [tenzies, startTime])

  // function to caculate time taken
  function calculateTimeTaken(start, end) {
    const totalSeconds = Math.floor((end - start) / 1000);
    return {
      minutes: Math.floor(totalSeconds / 60),
      seconds: totalSeconds % 60
    }
  }
  // function to create new dice
  function allNewDice() {
    return Array.from({ length: 10 }, () => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }))
  }

  // function to roll dice
  function rollDice() {
    return diceNumbers.map(dice =>
      dice.isHeld ? dice : { ...dice, value: Math.ceil(Math.random() * 6) }
    )
  }

  // function to check win condition
  function checkWinCondition(dice) {
    return dice.every(dice => dice.isHeld) &&
           new Set(dice.map(d => d.value)).size === 1;
  }

  // function to handle roll dice
  function handleRollDice() {
    if (!tenzies) {
      setStartTime(prev => prev || new Date())
      setDiceNumbers(rollDice)
      setRollCount(prevRollCount => prevRollCount + 1)
    }
  }

  // function to handle a new game (reset all state variables)
  function handleNewGame() {
    setDiceNumbers(allNewDice())
    setTenzies(false)
    setRollCount(0)
    setStartTime(null)
    setGameTime(null)
  }

  // function to hold dice
  function holdDice(id) {
    setDiceNumbers(prevDiceNumbers => prevDiceNumbers.map(dice => 
      dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice
    ))
  }

  useEffect(() => {
    if (checkWinCondition(diceNumbers)) {
      setTenzies(true)
    }
  }, [diceNumbers])

  const diceElements = diceNumbers.map(dice => 
    <Dice key={dice.id} value={dice.value} isHeld={dice.isHeld} holdDice={() => holdDice(dice.id)} />
  )

  return (
     <main>
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        {tenzies && <div className="win-message">You Win!</div>}
        <div className="roll-info">
          <p className="roll-minutes">Number of rolls: {rollCount}</p>
          {gameTime && <p className="roll-minutes">Time Taken: {gameTime.minutes} minutes {gameTime.seconds} seconds</p>}
        </div>
        <div className="dice-container">
          {diceElements}
        </div>
        <button className="roll-dice" onClick={tenzies ? handleNewGame : handleRollDice}>
          {tenzies ? "NEW GAME" : "ROLL"}
        </button>
     </main>
  )
}
