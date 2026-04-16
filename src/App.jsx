import { useState } from 'react'

export default function App() {
  const [time, setTime] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [results, setResults] = useState([])
  const [cycleLength, setCycleLength] = useState(90)
  const [error, setError] = useState('')
  const [selectedMode, setSelectedMode] = useState('sleepAt')

  //This function calculates wakeup time from user input time
  const sleepAt = () => {
    if (!time) {
      setError('Please select a time first!')
      return
    }
    const parts = time.split(':')
    const [hour, minute] = parts.map(Number)
    generateSleepCycles(hour, minute, 'sleepAt')
  }

  const sleepNow = () => {
    const now = new Date()

    setCurrentTime(now)

    const hour = now.getHours()
    const minute = now.getMinutes()

    generateSleepCycles(hour, minute, 'sleepAt')
  }

  //This function calculates sleep time from wake up time
  const wakeAt = () => {
    if (!time) {
      setError('Please select a time first!')
      return
    }
    const parts = time.split(':')
    const [hour, minute] = parts.map(Number)
    generateSleepCycles(hour, minute, 'wakeAt')
  }

  //This is a helper to calculate and print sleep/ wake times
  const generateSleepCycles = (hour, minute, mode) => {
    setError('')
    const MINUTE = 60000
    const FALL_ASLEEP_DELAY = 15 * MINUTE
    const DIRECTION = mode === 'sleepAt' ? 1 : -1
    const resultsList = []
    const baseTime = new Date()
    baseTime.setHours(hour)
    baseTime.setMinutes(minute)
    baseTime.setSeconds(0)
    const adjustedStartTime = new Date(baseTime.getTime() + FALL_ASLEEP_DELAY * DIRECTION)
    for (let i = 1; i <= 6; i++) {
      const resultTime = new Date(
        adjustedStartTime.getTime() + cycleLength * i * MINUTE * DIRECTION
      )
      const formatted = resultTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      resultsList.push(formatted)
    }
    setResults(resultsList)
  }

  //This is a helper to call either sleepAt or wakeAt
  const handle = () => {
    if (selectedMode === 'sleepAt') {
      sleepAt()
    } else if (selectedMode === 'sleepNow') {
      sleepNow()
    } else if (selectedMode === 'wakeAt') {
      wakeAt()
    }
  }

  //Reset state when choosing another tab
  const resetState = () => {
    setResults([])
    setError('')
    setTime('')
  }

  //Helper to convert time to AM/ PM
  const formatTime = timeStr => {
    if (!timeStr) return ''

    const [hour, minute] = timeStr.split(':').map(Number)

    const date = new Date()
    date.setHours(hour)
    date.setMinutes(minute)

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="nav">
        <h1 className="logo">
          REMify <img src="/remify/favicon.png" alt="logo" />
        </h1>
        <a
          className="nav-right"
          href="https://timothieecantcode.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          About Me
        </a>
      </div>

      <div className="hero">
        <h1>Sleep Cycle Calculator</h1>
        <p className="credit">Built by Timothie Nguyen</p>
        <p>
          Built by a student to improve sleep after long study days. REMify helps you find the best
          time to sleep or wake up using sleep cycles.
        </p>
        <p>Supports 75, 90 (default), and 105-minute cycles.</p>
      </div>

      <div className="option">
        <h1>I want to</h1>
        <div className="mode-group">
          <button
            className={`mode left ${selectedMode === 'sleepAt' ? 'active' : ''}`}
            onClick={() => {
              ;(setSelectedMode('sleepAt'), resetState())
            }}
          >
            Sleep At
          </button>
          <button
            className={`mode middle ${selectedMode === 'sleepNow' ? 'active' : ''}`}
            onClick={() => {
              ;(setSelectedMode('sleepNow'), resetState())
            }}
          >
            Sleep Now
          </button>
          <button
            className={`mode right ${selectedMode === 'wakeAt' ? 'active' : ''}`}
            onClick={() => {
              ;(setSelectedMode('wakeAt'), resetState())
            }}
          >
            Wake Up At
          </button>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <label htmlFor="time">Select time</label>
          {selectedMode !== 'sleepNow' && (
            <input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
          )}
          {selectedMode === 'sleepNow' && (
            <input
              type="time"
              value={`${String(currentTime.getHours()).padStart(2, '0')}:${String(
                currentTime.getMinutes()
              ).padStart(2, '0')}`}
              disabled
            />
          )}
        </div>
        <div className="row">
          <label htmlFor="cycleLength">Select sleep cycle length</label>
          <select
            id="cycleLength"
            value={cycleLength}
            onChange={e => {
              ;(setCycleLength(Number(e.target.value)), setResults([]))
            }}
          >
            <option value="75">75 mins</option>
            <option value="90">90 mins</option>
            <option value="105">105 mins</option>
          </select>
        </div>

        <button className={`calculate ${selectedMode}`} onClick={handle}>
          Calculate
        </button>
        {error && <p>{error}</p>}

        <div className="main"></div>
        {results.length > 0 && (
          <>
            {selectedMode === 'sleepAt' && (
              <p>You want to sleep at {formatTime(time)}, you should wake up at</p>
            )}
            {selectedMode === 'sleepNow' && <p>You want to sleep now, you should wake up at</p>}
            {selectedMode === 'wakeAt' && (
              <p>You want to wake up at {formatTime(time)}, you should sleep at</p>
            )}
          </>
        )}

        <ul className="results">
          {results.map((t, i) => {
            const hours = (cycleLength * (i + 1)) / 60
            const isBest = hours >= 7 && hours <= 9

            return (
              <li key={i} className={isBest ? 'best' : ''}>
                <span className="time">{t} - </span>
                <span className="cycle">cycle {i + 1}</span>
                <span className="hours"> ({hours.toFixed(1)}h)</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
