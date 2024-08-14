import React, { useEffect, useRef, useState } from "react";


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    height: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    backgroundColor: "black",
    color: "white",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "20px",
  },
  counter: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  button: {
    marginRight: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "blue",
    color: "white",
  },
  saveButton: {
    backgroundColor: "blue",
    color: "white",
  },
  startButton: {
    backgroundColor: "green",
    color: "white",
  },
  pauseButton: {
    backgroundColor: "red",
    color: "white",
  },
  span: {
    marginRight: "5px",
    color: "white",
    fontSize: "2em",
    padding: "0.4em",
    margin: "2px",
    display: "inline-block",
    borderRadius: "5px",
    fontFamily: "Arial, sans-serif",
    fontSize: "18px",
  },
  input: {
    borderBottom: "1px solid #ccc",
    // borderRadius: "4px",
    // padding: "2px 5px",
    fontSize: "18px",
    outline: "none",
    width: "100%", // Allow input width to adjust dynamically
    display: "inline-block",
    backgroundColor: "black",
    color:"white",
  },
  highlight: {
    backgroundColor: "#5E0CAF",
    borderRadius: "10px",
  },
  normal: {
    backgroundColor: "transparent",
    borderRadius: "0px",
  },
};
const TranscriptHighlighter = (props) => {


 const initialTranscript = props.data;

  const [counter, setCounter] = useState(0);
  const [pointer, setPointer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const refs = useRef([]);
  const intervalId = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [transcript, setTranscript] = useState(initialTranscript);

  useEffect(() => {
    if (isRunning) {
      intervalId.current = setInterval(() => {
        setCounter((prev) => prev + 10);
      }, 10);
    } else if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (pointer < transcript.length) {
      const currentWord = transcript[pointer];

      if (counter > currentWord.start_time) {
        const span = refs.current[pointer];
        if (span) {
          span.style.backgroundColor = "#5E0CAF";
          span.style.borderRadius = "10px";
          span.style.color = "white";
        }
      }

      if (counter >= currentWord.start_time + currentWord.duration) {
        const span = refs.current[pointer];
        if (span) {
          span.style.backgroundColor = "transparent";
          span.style.borderRadius = "0px";
          span.style.color = "white";
        }
        setPointer((prev) => prev + 1);
      }
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      setCounter(0);
      setIsRunning(false);
      setPointer(0);
    }
  }, [counter, pointer]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Function to resize the input field based on its content
  const adjustInputWidth = (el) => {
    if (el) {
      el.style.width = `${Math.max(el.value.length * 10, 20)}px`; // Adjust width dynamically
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.options}>
        <h3 style={styles.counter}>Counter: {(counter / 1000).toFixed(2)}</h3>

        <button
          onClick={handleStartPause}
          disabled={isEditing}
          style={
            isRunning
              ? { ...styles.button, ...styles.pauseButton }
              : { ...styles.button, ...styles.startButton }
          }
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={isRunning}
          style={
            isEditing
              ? { ...styles.button, ...styles.saveButton }
              : { ...styles.button, ...styles.editButton }
          }
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div>
        {transcript.map((item, index) => (
          <span
            key={index}
            ref={(el) => (refs.current[index] = el)}
            style={{
              ...styles.span,
              ...(item.highlighted ? styles.highlight : styles.normal),
            }}
          >
            {isEditing ? (
              <input
                type="text"
                value={item.word}
                onChange={(e) => {
                  const updatedTranscript = [...transcript];
                  updatedTranscript[index].word = e.target.value;
                  setTranscript(updatedTranscript);
                }}
                style={styles.input}
                ref={adjustInputWidth} // Adjust input width dynamically
              />
            ) : (
              item.word
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TranscriptHighlighter;
