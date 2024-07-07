import "./App.css";
import Bird from "./bird";
import "./bird.css";
import CONSTANTS from "./CONSTANTS";
import { useDispatch, useSelector } from "react-redux";
import { birdActions, birdState } from "./app.slice";
import { useEffect, useState } from "react";
import ObesticleBlock from "./components/obsticle";
import { getRandomArbitrary } from "./utils";
import jumpSound from "./resources/smb_kick.wav";
import bumpSound from "./resources/smb_bump.wav";

function App() {
  const [birdPosition, setBirdPosition] = useState(0);
  const [obstacles, setObstacles] = useState([
    { position: 0, height: getRandomArbitrary(250, 350) },
  ]);
  const dispatch = useDispatch();
  const { isGameOn, isGameOver, score } = useSelector(birdState);
  const { setGameOn, setScore, setGameOver } = birdActions;

  const handleClick = () => {
    if (!isGameOn) {
      dispatch(setGameOn(true));
    }
    const jump = new Audio(jumpSound);
    jump.play();
    setBirdPosition(birdPosition - CONSTANTS.JUMP);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["Enter"].includes(event.key)) {
        !isGameOver && handleClick();
      }
      if (event.key === " ") {
        pauseGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameOver, isGameOn, birdPosition]);

  const gameOver = () => {
    const bump = new Audio(bumpSound);
    bump.play();

    dispatch(setGameOn(false));
    dispatch(setGameOver(true));
  };

  useEffect(() => {
    if (birdPosition <= obstacles[0].height && obstacles[0].position >= 785) {
      gameOver();
    }
    if (
      birdPosition >= obstacles[0].height + CONSTANTS.OBSTICLE_GAP &&
      obstacles[0].position >= 785
    ) {
      gameOver();
    }
  }, [obstacles, birdPosition, isGameOn]);

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
    let intervalId;
    if (isGameOn) {
      intervalId = setInterval(() => {
        setObstacles((prevObstacles) => {
          let newObstacles = prevObstacles.map((obstacle) => ({
            ...obstacle,
            position: obstacle.position + CONSTANTS.SPEED,
          }));

          // Add a new obstacle when the last obstacle is at a certain position
          if (newObstacles[newObstacles.length - 1].position >= 500) {
            newObstacles.push({
              position: 0,
              height: getRandomArbitrary(250, 350),
            });
          }

          // Remove obstacles that have moved out of the screen
          newObstacles = newObstacles.filter(
            (obstacle) => obstacle.position < 1000
          );

          return newObstacles;
        });
      }, 24);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isGameOn]);

  const pauseGame = () => {
    dispatch(setGameOn(false));
  };

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
        {obstacles.map((obstacle, index) => (
          <div key={index}>
            <div
              style={{
                position: "absolute",
                overflow: "hidden",
                right: obstacle.position,
                top: 0,
              }}
            >
              <ObesticleBlock
                height={obstacle.height}
                key={"top" + index}
                position={"top"}
              />
            </div>
            <div
              style={{
                position: "absolute",
                overflow: "hidden",
                right: obstacle.position,
                bottom: 0,
              }}
            >
              <ObesticleBlock
                height={obstacle.height}
                key={"bottom" + index}
                position={"bottom"}
              />
            </div>
          </div>
        ))}
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
              isGameOver &&
                setObstacles([
                  { position: 0, height: getRandomArbitrary(250, 350) },
                ]);
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
            onClick={pauseGame}
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
