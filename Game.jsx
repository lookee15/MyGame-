import React, { useState, useEffect } from 'react';
import Player from './Player';
import './Game.css';

export default function Game() {
  const [playerY, setPlayerY] = useState(window.innerHeight - 60);
  const [playerX, setPlayerX] = useState(100);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(window.innerWidth);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleY, setObstacleY] = useState(window.innerHeight - 30 - 100); // default ground
  const [isFloating, setIsFloating] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasScored, setHasScored] = useState(false);

  const gravity = 0.7;
  const jumpStrength = -12;
  const pipeSpeed = 4;
  const pipeWidth = 50;
  const playerSize = 30;
  const groundHeight = 30;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        setVelocity(jumpStrength);
      } else if (e.code === 'ArrowLeft') {
        setPlayerX((x) => Math.max(0, x - 20));
      } else if (e.code === 'ArrowRight') {
        setPlayerX((x) => Math.min(window.innerWidth - playerSize, x + 20));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setVelocity((v) => v + gravity);
      setPlayerY((y) =>
        Math.min(window.innerHeight - playerSize - groundHeight, y + velocity)
      );

      setObstacleX((x) => {
        if (x < -pipeWidth) {
          const isFloat = Math.random() < 0.5;
          const height = Math.floor(Math.random() * 100) + 50;
          const yPos = isFloat
            ? Math.floor(Math.random() * (window.innerHeight - groundHeight - height - 100)) + 50
            : window.innerHeight - groundHeight - height;

          setObstacleHeight(height);
          setObstacleY(yPos);
          setIsFloating(isFloat);
          setHasScored(false);
          return window.innerWidth;
        }

        if (!hasScored && x + pipeWidth < playerX) {
          setScore((prev) => prev + 1);
          setHasScored(true);
        }

        return x - pipeSpeed;
      });

      // Collision detection
      const playerBox = {
        top: playerY,
        bottom: playerY + playerSize,
        left: playerX,
        right: playerX + playerSize,
      };

      const obstacleBox = {
        left: obstacleX,
        right: obstacleX + pipeWidth,
        top: obstacleY,
        bottom: obstacleY + obstacleHeight,
      };

      const overlapX = playerBox.right > obstacleBox.left && playerBox.left < obstacleBox.right;
      const overlapY = playerBox.bottom > obstacleBox.top && playerBox.top < obstacleBox.bottom;

      if (overlapX && overlapY) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [playerY, velocity, obstacleX, obstacleHeight, obstacleY, playerX, hasScored, gameOver]);

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      {!gameOver ? (
        <>
          <Player y={playerY} x={playerX} />
          <div
            className="pipe"
            style={{
              left: `${obstacleX}px`,
              top: `${obstacleY}px`,
              height: `${obstacleHeight}px`,
            }}
          />
        </>
      ) : (
        <>
          <div className="game-over">Game Over</div>
          <button className="restart-button" onClick={() => window.location.reload()}>
            Restart
          </button>
        </>
      )}
      <div className="ground"></div>
    </div>
  );
}