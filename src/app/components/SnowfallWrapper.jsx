"use client";
import Snowfall from 'react-snowfall';

export default function SnowfallWrapper() {
  return (
    <Snowfall
      color="#ffffff"
      snowflakeCount={100}
      speed={[0.5, 1.5]}
      wind={[-0.5, 0.5]}
      radius={[0.5, 3]}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  );
}

