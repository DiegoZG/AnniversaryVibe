import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from "tsparticles-slim";
import type { Engine, ISourceOptions, Container } from "tsparticles-engine";
import { AnimationType } from '../types';

interface ParticleEffectsProps {
  type: AnimationType;
}

const ParticleEffects: React.FC<ParticleEffectsProps> = ({ type }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    console.log("Particles container loaded:", container);
  }, []);

  const getOptions = (): ISourceOptions => {
    return {
      fullScreen: { enable: false },
      particles: {
        color: {
          value: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]
        },
        move: {
          direction: "bottom",
          enable: true,
          random: true,
          straight: false,
          speed: 3
        },
        number: {
          value: 100,
          density: {
            enable: true,
            area: 800
          }
        },
        opacity: {
          value: 0.7,
          random: true
        },
        shape: {
          type: ["circle", "square", "triangle"]
        },
        size: {
          value: { min: 3, max: 6 }
        },
        wobble: {
          enable: true,
          distance: 10,
          speed: 10
        }
      },
      detectRetina: true,
      emitters: [
        {
          direction: "top",
          rate: {
            quantity: 5,
            delay: 0.15
          },
          position: {
            x: 0,
            y: 100
          },
          size: {
            width: 100,
            height: 0
          }
        },
        {
          direction: "top",
          rate: {
            quantity: 5,
            delay: 0.15
          },
          position: {
            x: 100,
            y: 100
          },
          size: {
            width: 100,
            height: 0
          }
        }
      ]
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <Particles
        id={`tsparticles-${type}`}
        init={particlesInit}
        loaded={particlesLoaded}
        options={getOptions()}
        className="w-full h-full absolute inset-0"
      />
    </div>
  );
};

export default ParticleEffects;