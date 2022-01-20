import React, { useCallback, useEffect, useRef } from 'react';
import { Renderer } from '../renderer';

export const FractalView: React.FC = () => {
  const rendererRef = useRef<Renderer>(new Renderer());
  const requestRef = useRef<number>();
  const divRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(time => {
    rendererRef.current.render();
    console.log('render');
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);

  useEffect(() => {
    divRef.current?.append(rendererRef.current.glueCanvas.canvas);
  });

  return <div ref={divRef} className="fractal"></div>;
};
