import React, { useCallback, useEffect, useRef } from 'react';
import { usePointerDrag } from 'react-use-pointer-drag';
import { Renderer } from '../renderer';

const renderer = new Renderer();

export const FractalView: React.FC = () => {
  const requestRef = useRef<any>();
  const divRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef([0, 0]);
  const { startDragging } = usePointerDrag<{
    init: number[];
    offset: number[];
  }>((x, y, { init, offset }) => {
    offsetRef.current = [
      offset[0] + ((init[0] - x) * 2) / window.innerWidth / scaleRef.current,
      offset[1] + ((init[1] - y) * 2) / window.innerWidth / scaleRef.current,
    ];
  });

  const animate = useCallback(() => {
    renderer.render(offsetRef.current, scaleRef.current);
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);

  useEffect(() => {
    divRef.current?.append(renderer.glueCanvas.canvas);
  }, []);

  return (
    <div
      ref={divRef}
      onMouseDown={(e: React.MouseEvent) => {
        e.preventDefault();
        startDragging({
          init: [e.clientX, e.clientY],
          offset: offsetRef.current,
        });
      }}
      onTouchStart={(e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (!touch) {
          return;
        }

        startDragging({
          init: [touch.clientX, touch.clientY],
          offset: offsetRef.current,
        });
      }}
      onWheel={(e: React.WheelEvent) => {
        let change = 0;
        if (e.deltaY > 0) {
          change -= 0.1;
        } else {
          change += 0.1;
        }

        scaleRef.current += change;
      }}
      className="fractal"
    ></div>
  );
};
