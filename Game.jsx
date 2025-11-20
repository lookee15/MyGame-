import React, { useState, useEffect } from 'react';
import Player from './Player';
import ObstaclePair from './ObstaclePair';
import './Game.css';

export default function Game() {
  const [playerY, setPlayerY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(600);
  const [gapTop, setGapTop] = useState(150);
  const [gameOver, setGameOver] = useState(false);

  const gravity = 0.7;
  const jumpStrength = -10;
  const pipeSpeed = 3;
  const pipeWidth = 50;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        setVelocity(jumpStrength);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setVelocity((v) => v + gravity);
      setPlayerY((y) => y + velocity);
      setObstacleX((x) => {
        if (x < -pipeWidth) {
          setGapTop(Math.floor(Math.random() * 300) + 50);
          return 600;
        }
        return x - pipeSpeed;
      });

      // Collision detection
      const playerBox = { top: playerY, bottom: playerY + 30 };
      const pipeBox = {
        left: obstacleX,
        right: obstacleX + pipeWidth,
        gapTop,
        gapBottom: gapTop + 150,
      };

      const withinX = pipeBox.left < 130 && pipeBox.right > 100;
      const hitTop = playerBox.top < pipeBox.gapTop;
      const hitBottom = playerBox.bottom > pipeBox.gapBottom;

      if (withinX && (hitTop || hitBottom)) {
        setGameOver(true);
      }

      if (playerY > window.innerHeight || playerY < 0) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [playerY, velocity, obstacleX, gapTop, gameOver]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#87CEEB' }}>
      {!gameOver ? (
        <>
          <Player y={playerY} />
          <ObstaclePair x={obstacleX} gapTop={gapTop} />
        </>
      ) : (
        <h1 style={{ position: 'absolute', top: '40%', left: '40%', fontSize: '3rem', color: 'black' }}>
          Game Over
        </h1>
      )}
    </div>
  );
}