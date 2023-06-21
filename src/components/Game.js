import React, { useState, useEffect } from "react";
import "./Game.css";
import {
  BOARD_SIZE,
  FRAME_RATE,
  INITIAL_SNAKE_LENGTH,
} from "../utils/Constants";
import { handleSnakeMove } from "../utils/Features";

const Game = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE_LENGTH);
  const [food, setFood] = useState(generateFoodPosition());
  const [direction, setDirection] = useState("left");
  const [gameOver, setGameOver] = useState(false);

  function generateFoodPosition() {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  }

  function handleKeyDown(event) {
    const keyCode = event.keyCode;
    const isArrowKey = [37, 38, 39, 40].includes(keyCode);

    if (isArrowKey) {
      const oppositeDirection = {
        37: "left",
        38: "up",
        39: "right",
        40: "down",
      };

      const newDirection = oppositeDirection[keyCode];
      const isOppositeDirection = newDirection === direction;

      if (!isOppositeDirection) {
        setDirection(newDirection);
      }
    }
  }

  function moveSnake() {
    if (gameOver) return;

    const [head] = snake;
    const newHead = { ...head };

    switch (direction) {
      case "down":
        newHead.y = (newHead.y + 1) % BOARD_SIZE;
        break;
      case "up":
        newHead.y = (newHead.y - 1 + BOARD_SIZE) % BOARD_SIZE;
        break;
      case "right":
        newHead.x = (newHead.x + 1) % BOARD_SIZE;
        break;
      case "left":
        newHead.x = (newHead.x - 1 + BOARD_SIZE) % BOARD_SIZE;
        break;
      default:
        break;
    }

    const newSnake = [newHead, ...snake.slice(0, -1)];
    setSnake(newSnake);
  }

  function checkCollision() {
    const [head] = snake;
    const isSnakeCollision = snake.some(
      (segment, index) =>
        index !== 0 && segment.x === head.x && segment.y === head.y
    );

    // if (head.y > BOARD_SIZE) {
    //   console.log(true);
    // }

    const isWallCollision =
      (head.x === 0 && head.y < 20) || head.y === 0 || console.log(head);
    if (isSnakeCollision || isWallCollision) {
      setGameOver(true);
      console.log("Game over", true, head);
    }
  }

  function checkFoodCollision() {
    const [head] = snake;
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFoodPosition());
      setSnake((prevSnake) => [...prevSnake, {}]);
    }
  }

  useEffect(() => {
    const gameLoop = setInterval(() => {
      moveSnake();
      checkCollision();
      checkFoodCollision();
    }, FRAME_RATE);

    return () => {
      clearInterval(gameLoop);
    };
  }, [snake]);

  function renderBoard() {
    return Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => {
        const isSnakeCell = snake.some(
          (segment) => segment.x === col && segment.y === row
        );
        const isFoodCell = food.x === col && food.y === row;
        const cellClass = `cell${isSnakeCell ? " snake" : ""}${
          isFoodCell ? " food" : ""
        }`;

        return <div className={cellClass} key={`${col}-${row}`} />;
      })
    ).flat();
  }

  function restartGame() {
    setSnake([{ x: 0, y: BOARD_SIZE - 1 }]);
    setFood(generateFoodPosition());
    setDirection("right");
    setGameOver(false);
  }

  function handleKeyPress() {
    if (gameOver) {
      restartGame();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="game-container" tabIndex="0" onKeyDown={handleKeyDown}>
      <div className="game-board">{renderBoard()}</div>
      {gameOver && (
        <div className="game-over">
          <h1>Game Over</h1>
          <button>Press Here to restart</button>
        </div>
      )}
    </div>
  );
};

export default Game;
