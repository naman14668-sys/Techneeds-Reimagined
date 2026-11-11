'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function QuizAttempt({ resourceId, onComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('menteeToken');
        const res = await axios.get(
          `https://tn-backend-1.onrender.com/api/m/resources/${resourceId}/quiz`,
          { headers: { 'x-auth-token': token } }
        );
        if (!active) return;
        setQuiz(res.data);
        setAnswers((res.data.questions || []).map((question) => ({
          questionId: question._id || question.id,
          selectedOptionIndex: -1,
        })));
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.error || 'We could not load this quiz.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQuiz();
    return () => { active = false; };
  }, [resourceId]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setAnswers((current) => current.map((answer, index) => (
      index === questionIndex ? { ...answer, selectedOptionIndex: optionIndex } : answer
    )));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (answers.some((answer) => answer.selectedOptionIndex < 0)) {
      setError('Choose an answer for each question before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('menteeToken');
      const res = await axios.post(
        `https://tn-backend-1.onrender.com/api/m/resources/${resourceId}/quiz/submit`,
        { answers },
        { headers: { 'x-auth-token': token } }
      );
      onComplete(res.data.score);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not submit your answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p role="status">Loading quiz…</p>;
  if (!quiz) return <p className="form-error" role="alert">{error || 'This quiz is unavailable.'}</p>;

  return (
    <form className="quiz-attempt form-stack" onSubmit={handleSubmit}>
      <div>
        <h3>{quiz.title}</h3>
        {quiz.description && <p>{quiz.description}</p>}
      </div>
      {(quiz.questions || []).map((question, questionIndex) => (
        <fieldset className="quiz-question" key={question._id || questionIndex}>
          <legend>{questionIndex + 1}. {question.questionText}</legend>
          {(question.options || []).map((option, optionIndex) => (
            <label key={optionIndex}>
              <input
                type="radio"
                name={`question-${questionIndex}`}
                checked={answers[questionIndex]?.selectedOptionIndex === optionIndex}
                onChange={() => handleOptionChange(questionIndex, optionIndex)}
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      ))}
      {error && <span className="form-error" role="alert">{error}</span>}
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit answers'}
      </button>
    </form>
  );
}
