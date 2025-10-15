import React, { useState } from 'react';
import './App.css';
import Quiz from './components/Quiz';
import questions from './data/questions';

function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Quiz Platform</h1>
      </header>

      {!showQuiz ? (
        <button className="start-btn" onClick={() => setShowQuiz(true)}>
          Start Quiz
        </button>
      ) : (
        <Quiz questions={questions} />
      )}

      <footer className="app-footer">
        <p>© 2025 Diksha Jalal | Quiz Platform</p>
      </footer>
    </div>
  );
}

export default App;
