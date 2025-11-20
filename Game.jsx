import React, { useState, useEffect } from 'react';
import Player from './Player';
import './Game.css';

export default function Game() {
  const groundHeight = 30;
  const playerSize = 30;

  const [playerY, setPlayerY] = useState(window.innerHeight - groundHeight - playerSize);
  const [playerX, setPlayerX] = useState(100);
  const [velocity, setVelocity] = useState(0);

  const [obstacleX, setObstacleX] = useState(window.innerWidth);
  const [gapTop, setGapTop] = useState(150);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasScored, setHasScored] = useState(false);

  // Ground timer
  const [groundTime, setGroundTime] = useState(0);
  const [dangerCountdown, setDangerCountdown] = useState(null);

  const gravity = 0.7;
  const jumpStrength = -12;
  const pipeSpeed = 4;
  const pipeWidth = 50;
  const gapHeight = 150;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        setVelocity(jumpStrength);
        setGroundTime(0);
        setDangerCountdown(null);
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

      // Ground timer
      if (playerY >= window.innerHeight - playerSize - groundHeight) {
        setGroundTime((t) => t + 0.02);
      } else {
        setGroundTime(0);
        setDangerCountdown(null);
      }

      if (groundTime >= 5 && groundTime < 10) {
        setDangerCountdown(Math.ceil(10 - groundTime));
      }
      if (groundTime >= 10) {
        setGameOver(true);
      }

      // Obstacle movement
      setObstacleX((x) => {
        if (x < -pipeWidth) {
          setGapTop(Math.floor(Math.random() * (window.innerHeight - groundHeight - gapHeight - 100)) + 50);
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

      const topPipeBox = {
        left: obstacleX,
        right: obstacleX + pipeWidth,
        top: 0,
        bottom: gapTop,
      };

      const bottomPipeBox = {
        left: obstacleX,
        right: obstacleX + pipeWidth,
        top: gapTop + gapHeight,
        bottom: window.innerHeight - groundHeight,
      };

      const overlapX = playerBox.right > topPipeBox.left && playerBox.left < topPipeBox.right;
      const hitTop = playerBox.top < topPipeBox.bottom;
      const hitBottom = playerBox.bottom > bottomPipeBox.top;

      if (overlapX && (hitTop || hitBottom)) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [playerY, velocity, obstacleX, gapTop, playerX, hasScored, gameOver, groundTime]);

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      {dangerCountdown && (
        <div className="danger-countdown">Jump! {dangerCountdown}</div>
      )}
      {!gameOver ? (
        <>
          <Player y={playerY} x={playerX} />
          {
          /* Top pipe */
          }
          <div
            className="pipe pipe-top"
            style={{
              left: `${obstacleX}px`,
              height: `${gapTop}px`,
            }}
          />
          {
          /* Bottom pipe */
          }
          <div
            className="pipe pipe-bottom"
            style={{
              left: `${obstacleX}px`,
              top: `${gapTop + gapHeight}px`,
              height: `${window.innerHeight - groundHeight - (gapTop + gapHeight)}px`,
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
      <div
        className="ground"
        style={{
          backgroundColor: groundTime >= 5 ? 'red' : 'green',
        }}
      ></div>
    </div>
  );
}