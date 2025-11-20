import React from 'react';

export default function Player({ x }) {
  return (
    <div
      className="player"
      style={{
        left: x,
        bottom: 100,
      }}
    />
  );
}