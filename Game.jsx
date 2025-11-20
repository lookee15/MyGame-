import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';
import ObstaclePair from './ObstaclePair';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const OBSTACLE_INTERVAL = 2000;

export default function Game() {
  const [playerX, setPlayerX] = useState(100);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const gameRef = useRef();

  // Handle horizontal movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerX(prev => {
        if (e.key === 'ArrowLeft') return Math.max(prev - 20, 0);
        if (e.key === 'ArrowRight') return Math.min(prev + 20, GAME_WIDTH - 40);
        return prev;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Spawn obstacles
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setObstacles(prev => [...prev, { id, x: GAME_WIDTH, passed: false }]);
    }, OBSTACLE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Move obstacles and check for scoring
  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles(prev =>
        prev
          .map(ob => {
            const newX = ob.x - 2;
            const passed = !ob.passed && newX + 60 < playerX;
            if (passed) setScore(s => s + 1);
            return { ...ob, x: newX, passed: ob.passed || passed };
          })
          .filter(ob => ob.x + 60 > 0)
      );
    }, 20);
    return () => clearInterval(interval);
  }, [playerX]);

  return (
    <div
      className="game"
      ref={gameRef}
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      <div className="score">Score: {score}</div>
      <Player x={playerX} />
      {obstacles.map(ob => (
        <ObstaclePair key={ob.id} x={ob.x} />
      ))}
    </div>
  );
}
