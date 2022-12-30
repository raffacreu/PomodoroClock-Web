import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const periodTime = 60 * 25
  const longTime = 60 * 10
  const shortTime = 60 * 5
  
  const [ customTime, setCustomTime ] = useState(0)
  const [ baseTime, setBaseTime ] = useState(periodTime)
  const [ timer, setTimer ] = useState(baseTime)
  const [ timeLeft, setTimeLeft ] = useState(format(baseTime * 1000, 'mm:ss'))
  const [ start, setStart ] = useState(false)
  const [ storedTimeout, setStoredTimeout] = useState(null)

  useEffect(() => {
    if(timer == 0 ){
    (function notifyMe() {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");

      } else if (Notification.permission === "granted") {
        const notification = new Notification("Seu tempo acabou, descanse um pouco.");

      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification("Seu tempo acabou, descanse um pouco.");
          }
        });
      }
    })()}
  },[timer])

  useEffect(() => {
    if (start && timer >= 0 ) {
      setStoredTimeout(setTimeout(() => {
        setTimer(timer - 1)
        setTimeLeft(format(timer * 1000, 'mm:ss'))
      }, 1000))
    } else {
      clearTimeout(storedTimeout)
    }
  }, [timer, start])

  useEffect(() => {
    resetTime()
  }, [baseTime])

  useEffect(() => {
    if(customTime > 0) {
    let seconds = customTime * 60
    if(customTime == 60) --seconds
    setBaseTime(seconds) 
  }
  }, [customTime])

  function resetTime() {
    setStart(false)
    setTimer(baseTime)
    setTimeLeft(format(baseTime * 1000, 'mm:ss'))
  }

  return (
    <>
      <Head>
        <title>Pomodoro: {timeLeft}</title>
        <meta name="description" content="Desenvolvido por raffacreu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>Hello world</h1>
        <button onClick={() => setBaseTime(periodTime)}>25</button>
        <button onClick={() => setBaseTime(longTime)}>10</button>
        <button onClick={() => setBaseTime(shortTime)}>5</button>
        <input type="number" min={0} max={60} onChange={e => setCustomTime(e.target.value)} value={customTime} />
        <hr />
        <span>{timeLeft}</span>
        <hr />
        <button onClick={() => setStart(true)}>Começar</button>
        <button onClick={() => setStart(false)}>Pausar</button>
        <button onClick={() => resetTime()}>Reiniciar</button>
      </div>
    </>
  )
}
