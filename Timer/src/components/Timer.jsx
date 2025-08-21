import { useState, useEffect, useRef } from "react";

function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [logs, setLogs] = useState([]);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  function toggleTimer() {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      startTimeRef.current = Date.now() - elapsedTime;
    }
  }

  function reset() {
    setIsRunning(false);
    setElapsedTime(0);
  }

  function logTime() {
    setLogs([...logs, formatTime()]);
  }

  function formatTime() {
    let minutes = Math.floor((elapsedTime / (60 * 1000)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsRunning(false);
      } else {
        setIsRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [elapsedTime]);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  return (
    <div>
      <h1 data-testid="Timer">{formatTime()}</h1>
      <button data-testid="toggle-button" onClick={toggleTimer}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button data-testid="reset-button" onClick={reset}>
        Reset
      </button>
      <button data-testid="log-button" onClick={logTime}>
        Log Time
      </button>
      <h3>Logged Times:</h3>

      {logs.length > 0 ? (
        <button
          data-testid="delete-logs"
          className="delete"
          onClick={() => setLogs([])}
        >
          delete logs
        </button>
      ) : null}

      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default Timer;
