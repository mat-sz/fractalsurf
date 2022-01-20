import React from 'react';
import './App.scss';
import { FractalView } from './components/FractalView';

export const App: React.FC = () => {
  return (
    <div className="App">
      <FractalView />
    </div>
  );
};
