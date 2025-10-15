import React from 'react';

const Result = ({ score, total, onRestart }) => {
  const percent = Math.round((score / total) * 100);

  let message = 'Good attempt!';
  if (percent >= 80) message = 'Excellent! 🎉';
  else if (percent >= 60) message = 'Nice job!';
  else if (percent >= 40) message = 'Keep practicing!';

  return (
    <div className="result">
      <div className="score">{score} / {total}</div>
      <div style={{ marginTop: 8, fontWeight: 600 }}>{message}</div>
      <div className="small" style={{ marginTop: 6 }}>
        You scored {percent}%
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button className="btn ghost" onClick={onRestart}>Restart Quiz</button>
      </div>
    </div>
  );
};

export default Result;
