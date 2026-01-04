import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Quiz() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("learnix_token");

  // States
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const [quizStarted, setQuizStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Fetch all quizzes for this video
  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/admin/quizzes/video/${videoId}`)
      .then((res) => {
        const quizList = Array.isArray(res.data) ? res.data : [res.data];
        setQuizzes(quizList); // Show ALL questions
        setLoading(false);
        setAnswers({});
      })
      .catch((err) => {
        console.error("Quiz error:", err);
        // Try single quiz endpoint as fallback
        axios
          .get(`http://localhost:5001/api/admin/quizzes/${videoId}`)
          .then((res) => {
            setQuizzes([res.data]);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      });
  }, [videoId]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || submitted || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentQuestion = quizzes[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== undefined;
  const answerKey = currentQuestion?.correct_option;

  const handleAnswerChange = (option) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Calculate correct answers
    let correct = 0;
    quizzes.forEach((quiz, idx) => {
      if (answers[idx] === quiz.correct_option) {
        correct++;
      }
    });

    setCorrectCount(correct);
    setSubmitted(true);
    setShowResults(true);

    // Update progress if passed (>= 70%)
    const passPercentage = (correct / quizzes.length) * 100;
    if (passPercentage >= 70) {
      try {
        await axios.post(
          "http://localhost:5001/api/progress/complete",
          { videoId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ Quiz passed! Progress updated");
      } catch (err) {
        console.error("Progress update error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-28 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-300 border-t-teal-600 mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="pt-28 text-center">
        <p className="text-red-600 text-lg">No quizzes available for this video</p>
      </div>
    );
  }

  // Results View
  if (showResults) {
    const passPercentage = (correctCount / quizzes.length) * 100;
    const passed = passPercentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pt-28 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            {passed ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-4xl font-bold text-green-600 mb-4">Quiz Passed!</h1>
                <p className="text-xl text-gray-700 mb-8">
                  You scored <span className="font-bold text-green-600">{correctCount}/{quizzes.length}</span> ({passPercentage.toFixed(1)}%)
                </p>
                <p className="text-gray-600 mb-8">
                  Excellent work! Your progress has been updated. Move on to the next lesson.
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">📚</div>
                <h1 className="text-4xl font-bold text-orange-600 mb-4">Keep Practicing</h1>
                <p className="text-xl text-gray-700 mb-8">
                  You scored <span className="font-bold text-orange-600">{correctCount}/{quizzes.length}</span> ({passPercentage.toFixed(1)}%)
                </p>
                <p className="text-gray-600 mb-8">
                  You need 70% to pass. Review the material and try again!
                </p>
              </>
            )}

            {/* Detailed Results */}
            <div className="mb-8 text-left max-h-64 overflow-y-auto bg-slate-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Detailed Results:</h3>
              {quizzes.map((quiz, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === quiz.correct_option;
                return (
                  <div key={idx} className="mb-4 p-3 border border-gray-200 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">Q{idx + 1}: {quiz.question}</p>
                    <p className={`text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {isCorrect ? "✓" : "✗"} Your answer: {userAnswer || "Not answered"}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600">
                        Correct answer: {quiz.correct_option}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              {!passed && (
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setSubmitted(false);
                    setShowResults(false);
                    setTimeLeft(600);
                    setQuizStarted(false);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">📝 Video Quiz</h1>
            <div className={`text-lg font-bold px-4 py-2 rounded-lg ${
              timeLeft < 60 
                ? "bg-red-100 text-red-700" 
                : "bg-teal-100 text-teal-700"
            }`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-gray-700">
              Question {currentQuestionIndex + 1} of {quizzes.length}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {!quizStarted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to take the quiz?</h2>
              <p className="text-gray-600 mb-8">
                You have {quizzes.length} questions and 10 minutes to complete the quiz.
              </p>
              <p className="text-gray-600 mb-8">
                You need 70% to pass and mark this video as complete.
              </p>
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-12 rounded-lg transition-all text-lg"
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentQuestion?.question}
                </h2>

                {/* Options */}
                <div className="space-y-4">
                  {[
                    currentQuestion?.option_a,
                    currentQuestion?.option_b,
                    currentQuestion?.option_c,
                    currentQuestion?.option_d,
                  ].map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[currentQuestionIndex] === option
                          ? "border-teal-600 bg-teal-50"
                          : "border-gray-300 hover:border-teal-300 bg-white"
                      } ${
                        submitted && option === answerKey
                          ? "border-green-600 bg-green-50"
                          : ""
                      } ${
                        submitted && 
                        answers[currentQuestionIndex] === option && 
                        answers[currentQuestionIndex] !== answerKey
                          ? "border-red-600 bg-red-50"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        onChange={() => handleAnswerChange(option)}
                        disabled={submitted}
                        className="w-4 h-4 text-teal-600 cursor-pointer"
                      />
                      <span className="ml-4 text-gray-900 font-medium flex-1">{option}</span>
                      {submitted && option === answerKey && (
                        <span className="ml-4 text-green-600 font-bold">✓</span>
                      )}
                      {submitted && 
                        answers[currentQuestionIndex] === option && 
                        answers[currentQuestionIndex] !== answerKey && (
                          <span className="ml-4 text-red-600 font-bold">✗</span>
                        )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-2 px-6 rounded-lg transition-all"
                >
                  ← Previous
                </button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {quizzes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-10 h-10 rounded-full font-bold transition-all ${
                        idx === currentQuestionIndex
                          ? "bg-teal-600 text-white"
                          : answers[idx]
                          ? "bg-teal-200 text-teal-800 hover:bg-teal-300"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      title={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === quizzes.length - 1}
                  className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-2 px-6 rounded-lg transition-all"
                >
                  Next →
                </button>
              </div>

              {/* Submit Button */}
              {currentQuestionIndex === quizzes.length - 1 && (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full mt-8 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
                >
                  Submit Quiz
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
