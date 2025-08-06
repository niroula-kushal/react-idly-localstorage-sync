import { useEffect, useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'
// import './styles.css'
//

const storageKey = 'last_active';
const timeoutInMs = 10_000;

export default function App() {
  const [state, setState] = useState<string>('Active')
  const [count, setCount] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(0)

  const onIdle = () => {
    setState('Idle')
  }

  const onActive = () => {
    setState('Active')
  }

  const onAction = () => {
    setCount(count + 1)
    localStorage.setItem(storageKey, new Date().toISOString())
  }

  const { getRemainingTime, start } = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: timeoutInMs,
    throttle: 500,
    startManually: true,
  })

  const startTracking = () => {
    // Get from localstorage and check against current time for time diff > 10 seconds
    const lastActive = localStorage.getItem(storageKey)
    if (lastActive) {
      const lastActiveDate = new Date(lastActive)
      const timeDiff = Math.abs(new Date().getTime() - lastActiveDate.getTime())
      if (timeDiff > timeoutInMs) {
        alert(`Last active > ${timeoutInMs / 1000} seconds. Resetting`);
        localStorage.removeItem(storageKey);
      }
    }
    start()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <>
      <h1>React Idle Timer</h1>
      <h2>useIdleTimer</h2>
      <br />
      <p>Current State: {state}</p>
      <p>Action Events: {count}</p>
      <p>{remaining} seconds remaining</p>
      <button onClick={startTracking}>
        Start
      </button>
    </>
  )
}
