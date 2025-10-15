import React from 'react';

const QuestionCard = ({ question, options, selected, onSelect }) => {
  return (
    <div>
      <div className="question">{question}</div>
      <div className="choices">
        {options.map((opt, idx) => {
          const selectedClass = selected === idx ? ' selected' : '';
          return (
            <div
              key={idx}
              className={`choice${selectedClass}`}
              onClick={() => onSelect(idx)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') onSelect(idx); }}
            >
              {opt}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
