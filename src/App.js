import React, { useState } from 'react';
import './App.css';
import InputComponent from './Components/InputComponent';
import DisplayComponent from './Components/DisplayComponent';

function App() {
  const [points, setPoints] = useState(null);

  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setPoints(null);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="App full-page">
      <header className="app-header">
        <h1>Triangle Assignment</h1>
      </header>
      <main className="responsive-grid">
        <section className="panel">
          <InputComponent resetKey={resetKey} onSubmit={(pts) => setPoints(pts)} />
        </section>
        <section className="panel">
          <DisplayComponent points={points || []} onReset={handleReset} />
        </section>
      </main>
    </div>
  );
}

export default App;
