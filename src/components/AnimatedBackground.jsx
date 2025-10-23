import React from "react";
import Particles from "react-tsparticles";

const AnimatedBackground = () => {
  return (
    <Particles
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: { value: "#000000" } },
        fpsLimit: 60,
        particles: {
          number: { value: 120, density: { enable: true, area: 800 } },
          color: { value: "#0ff" },
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: { min: 1, max: 3 } },
          move: { enable: true, speed: 1, direction: "bottom", straight: false },
        },
      }}
    />
  );
};

export default AnimatedBackground;
