import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import Result from './Result';

const Quiz = ({ questions, onRestart }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = questions[index];

  const handleSelect = (choiceIndex) => {
    setSelected(choiceIndex);
  };

  const handleNext = () => {
    if (selected === null) return; // require selection

    // check correct
    if (selected === current.answer) {
      setScore(prev => prev + 1);
    }

    // reset selection & advance
    setSelected(null);

    if (index + 1 < questions.length) {
      setIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleQuit = () => {
    // show result early
    setCompleted(true);
  };

  if (!questions || questions.length === 0) {
    return <div className="card">No questions available.</div>;
  }

  return (
    <div className="card">
      {!completed ? (
        <>
          <div className="quiz-top">
            <div className="progress">Question {index + 1} / {questions.length}</div>
            <div className="progress small">Score: {score}</div>
          </div>

          <QuestionCard
            question={current.question}
            options={current.options}
            selected={selected}
            onSelect={handleSelect}
          />

          <div className="controls" style={{ marginTop: 8 }}>
            <button className="btn ghost" onClick={handleQuit}>Finish</button>
            <button
              className="btn primary"
              onClick={handleNext}
              disabled={selected === null}
            >
              {index + 1 === questions.length ? 'Submit' : 'Next'}
            </button>
          </div>
        </>
      ) : (
        <Result
          score={score}
          total={questions.length}
          onRestart={onRestart}
        />
      )}
    </div>
  );
};

export default Quiz;
