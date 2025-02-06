"use client";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  waveWidth,
  backgroundFill,
  blur = 10,
  waveOpacity = 0.5,
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const [isSafari, setIsSafari] = useState(false);

  const waveSpeed = 0.002;

  const drawWave = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, nt: number) => {
      const waveColors = [
        "rgba(255, 154, 158, 0.5)",
        "rgba(250, 208, 196, 0.5)",
        "rgba(255, 236, 210, 0.5)",
      ];

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    },
    [noise, waveWidth]
  );

  const render = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, nt: number) => {
      ctx.fillStyle = backgroundFill || "rgba(255, 255, 255, 0.1)";
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);
      drawWave(ctx, w, h, nt);
      animationIdRef.current = requestAnimationFrame(() =>
        render(ctx, w, h, nt + waveSpeed)
      );
    },
    [backgroundFill, waveOpacity, drawWave]
  );

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (ctx.canvas.width = window.innerWidth);
    const h = (ctx.canvas.height = window.innerHeight);
    ctx.filter = `blur(${blur}px)`;

    const resizeHandler = () => {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", resizeHandler);
    render(ctx, w, h, 0);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [blur, render]);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden",
        containerClassName
      )}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute inset-0 z-0"
        style={isSafari ? { filter: `blur(${blur}px)` } : {}}
      ></canvas>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
