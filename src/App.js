import "./App.css";
import Bird from "./bird";
import "./bird.css";
import CONSTANTS from "./CONSTANTS";
import { useDispatch, useSelector } from "react-redux";
import { birdActions, birdState } from "./app.slice";
import { useEffect, useState } from "react";

function App() {
  const [birdPosition, setBirdPosition] = useState(0);
  const [obsticlePosition, setObsticlePosition] = useState(0);
  const [topObsticleHeight, setTopObsticleHeight] = useState(300);
  const dispatch = useDispatch();
  const { isGameOn, isGameOver, score } = useSelector(birdState);
  const { setGameOn, setScore, setGameOver } = birdActions;

  const handleClick = () => {
    const { setGameOn, setScore, setGameOver } = birdActions;
    if (!isGameOn) {
      dispatch(setGameOn(true));
    }
    setBirdPosition(birdPosition - CONSTANTS.JUMP);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event.key);
      if ([" ", "Enter"].includes(event.key)) {
        !isGameOver && handleClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameOver, isGameOn, birdPosition]);

  useEffect(() => {
    setTopObsticleHeight(getRandomArbitrary(250, 350));
  }, [score]);

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    if (birdPosition <= topObsticleHeight && obsticlePosition >= 785) {
      dispatch(setGameOn(false));
      dispatch(setGameOver(true));
    }
    if (
      birdPosition >= topObsticleHeight + CONSTANTS.OBSTICLE_GAP &&
      obsticlePosition >= 785
    ) {
      dispatch(setGameOn(false));
      dispatch(setGameOver(true));
    }

    if (birdPosition > 750) {
      dispatch(setGameOn(false));
      dispatch(setGameOver(true));
    }
  }, [obsticlePosition, birdPosition, isGameOn]);

  useEffect(() => {
    let birdDropAction;
    if (birdPosition >= 760 || birdPosition <= 0) {
      setBirdPosition(0);
    }
    birdDropAction = setInterval(() => {
      isGameOn &&
        setBirdPosition((birdPosition) => birdPosition + CONSTANTS.GRAVITY);
    }, 24);

    return () => {
      clearInterval(birdDropAction);
    };
  }, [isGameOn, birdPosition]);

  useEffect(() => {
    let birdDropAction;
    if (obsticlePosition >= 1000) {
      setObsticlePosition(0);
      dispatch(setScore(score + 1));
    }
    birdDropAction = setInterval(() => {
      isGameOn && setObsticlePosition((position) => position + CONSTANTS.SPEED);
    }, 24);

    return () => {
      clearInterval(birdDropAction);
    };
  }, [isGameOn, obsticlePosition]);

  return (
    <div className="App">
      <div
        onClick={() => {
          !isGameOver && handleClick();
        }}
        style={{
          position: "relative",
          overflow: "hidden",
          height: CONSTANTS.WINDOW_HEIGHT,
          width: CONSTANTS.WINDOW_WIDTH,
          background: isGameOver ? "#222" : "aquamarine",
        }}
        className="game-wrapper"
      >
        <div
          style={{ position: "absolute", left: "20px", top: birdPosition }}
          className="bird__body__app"
        >
          <Bird />
        </div>
        <div
          style={{
            position: "absolute",
            overflow: "hidden",
            right: obsticlePosition,
            top: 0,
          }}
        >
          <ObesticleTop height={topObsticleHeight} />
        </div>
        <div
          style={{
            position: "absolute",
            overflow: "hidden",
            right: obsticlePosition,
            bottom: 0,
          }}
        >
          <BottomObsticle height={topObsticleHeight} />
        </div>
      </div>
      <div
        style={{
          border: "1px solid black",
          padding: "100px",
          marginLeft: "30px",
        }}
      >
        <h1>Score: {score}</h1>
        {!isGameOn && (
          <button
            style={{
              width: 130,
              height: 80,
              borderRadius: "100px",
              backgroundColor: "darkblue",
              border: "none",
              cursor: "pointer",
              fontSize: "25px",
              color: "white",
              fontWeight: "700",
            }}
            onClick={() => {
              dispatch(setGameOn(true));
              isGameOver && dispatch(setGameOver(false));
              isGameOver && setBirdPosition(0);
              isGameOver && setObsticlePosition(0);
              isGameOver && dispatch(setScore(0));
            }}
          >
            {isGameOver ? "Start Again" : "start"}
          </button>
        )}
        {isGameOn && (
          <button
            style={{
              width: 130,
              height: 80,
              borderRadius: "100px",
              backgroundColor: "darkviolet",
              fontSize: "25px",
              color: "white",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(setGameOn(false));
            }}
          >
            Pause
          </button>
        )}

        {isGameOver && <h2>Game over 🥺</h2>}
      </div>
    </div>
  );
}

export default App;

const ObesticleTop = ({ height }) => {
  return (
    <div
      style={{
        backgroundColor: "green",
        height: height,
        width: 150,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    ></div>
  );
};

const BottomObsticle = ({ height }) => {
  return (
    <div
      className="bottom__obsticle"
      style={{
        backgroundColor: "green",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: window.innerHeight - height - CONSTANTS.OBSTICLE_GAP,
        width: 150,
      }}
    ></div>
  );
};
