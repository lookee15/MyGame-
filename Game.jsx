import React, { useState, useEffect } from 'react';
import Player from './Player';
import './Game.css';

export default function Game() {
  const [playerY, setPlayerY] = useState(window.innerHeight - 60);
  const [playerX, setPlayerX] = useState(100);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(window.innerWidth);
  const [obstacleFromTop, setObstacleFromTop] = useState(true);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasScored, setHasScored] = useState(false);

  const gravity = 0.7;
  const jumpStrength = -12;
  const pipeSpeed = 4;
  const pipeWidth = 50;
  const playerSize = 30;

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
      setPlayerY((y) => Math.min(window.innerHeight - playerSize, y + velocity));

      setObstacleX((x) => {
        if (x < -pipeWidth) {
          setObstacleHeight(Math.floor(Math.random() * 200) + 50);
          setObstacleFromTop(Math.random() < 0.5);
          setHasScored(false);
          return window.innerWidth;
        }

        if (!hasScored && x + pipeWidth < playerX) {
          setScore((prev) => prev + 1);
          setHasScored(true);
        }

        return x - pipeSpeed;
      });

      const playerBox = {
        top: playerY,
        bottom: playerY + playerSize,
        left: playerX,
        right: playerX + playerSize,
      };

      const obstacleBox = {
        left: obstacleX,
        right: obstacleX + pipeWidth,
        top: obstacleFromTop ? 0 : window.innerHeight - obstacleHeight,
        bottom: obstacleFromTop ? obstacleHeight : window.innerHeight,
      };

      const overlapX = playerBox.right > obstacleBox.left && playerBox.left < obstacleBox.right;
      const overlapY = playerBox.bottom > obstacleBox.top && playerBox.top < obstacleBox.bottom;

      if (overlapX && overlapY) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [playerY, velocity, obstacleX, obstacleHeight, obstacleFromTop, playerX, hasScored, gameOver]);

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
              height: `${obstacleHeight}px`,
              top: obstacleFromTop ? '0px' : 'auto',
              bottom: obstacleFromTop ? 'auto' : '0px',
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