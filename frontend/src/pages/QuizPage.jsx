import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import EcoBackground from '../components/EcoBackground';
import { HelpCircle, Award, Trophy, Play, ArrowRight, ArrowLeft, RefreshCw, Star, XCircle, CheckCircle } from 'lucide-react';

export default function QuizPage() {
  const { id } = useParams(); // Course ID
  const navigate = useNavigate();
  const { refreshUserData } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // { questionId: optionId }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // QuizResultResponse
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}/quiz`);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to load quiz details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    // Prepare answers payload
    const answersList = Object.keys(selectedOptions).map((qId) => ({
      questionId: parseInt(qId, 10),
      optionId: selectedOptions[qId],
    }));

    try {
      const res = await axios.post('/api/quizzes/submit', {
        quizId: quiz.id,
        answers: answersList,
      });
      setResult(res.data);
      await refreshUserData(); // Sync XP and achievements
    } catch (err) {
      console.error("Failed to submit quiz", err);
      setError(err.response?.data?.message || 'Failed to submit quiz answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedOptions({});
    setCurrentIdx(0);
    setResult(null);
  };

  if (loading || !quiz) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Quiz Module...</div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const activeQuestion = questions[currentIdx];
  const allAnswered = Object.keys(selectedOptions).length === questions.length;

  return (
    <div style={styles.quizWrapper}>
      <EcoBackground />

      <AnimatePresence mode="wait">
        {!result ? (
          // Quiz Playing Screen
          <motion.div
            key="quiz-play"
            style={styles.card}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header / Tracker */}
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.tag}>Course Assessment</span>
                <h2 style={styles.courseTitle}>{quiz.courseTitle} Quiz</h2>
              </div>
              <div style={styles.tracker}>
                Question {currentIdx + 1} of {questions.length}
              </div>
            </div>

            {/* Progress indicator */}
            <div style={styles.trackerBarContainer}>
              <div
                style={{
                  ...styles.trackerBar,
                  width: `${((currentIdx + 1) * 100) / questions.length}%`,
                }}
              />
            </div>

            {error && (
              <div style={styles.errorAlert}>
                <span>{error}</span>
              </div>
            )}

            {/* Question Title */}
            {activeQuestion && (
              <div style={styles.questionSection}>
                <h3 style={styles.questionText}>{activeQuestion.questionText}</h3>
                
                {/* Options List */}
                <div style={styles.optionsList}>
                  {activeQuestion.options?.map((option) => {
                    const isSelected = selectedOptions[activeQuestion.id] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleOptionSelect(activeQuestion.id, option.id)}
                        style={{
                          ...styles.optionRow,
                          borderColor: isSelected ? '#8B6B4A' : '#EADBCE',
                          backgroundColor: isSelected ? '#F8F5F1' : '#FFFFFF',
                          fontWeight: isSelected ? '700' : '500',
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div style={{
                          ...styles.radioCircle,
                          borderColor: isSelected ? '#8B6B4A' : '#A39387',
                          backgroundColor: isSelected ? '#8B6B4A' : 'transparent',
                        }}>
                          {isSelected && <div style={styles.radioDot} />}
                        </div>
                        <span style={styles.optionText}>{option.optionText}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={styles.navRow}>
              <button
                onClick={handlePrev}
                style={styles.navBtn}
                disabled={currentIdx === 0}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  style={styles.navBtn}
                  disabled={!selectedOptions[activeQuestion?.id]}
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  className="btn btn-secondary"
                  style={styles.submitBtn}
                  disabled={!allAnswered || submitting}
                  whileHover={{ scale: 1.02 }}
                >
                  {submitting ? 'Evaluating...' : 'Submit Answers'}
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          // Quiz Result Screen Overlay
          <motion.div
            key="quiz-result"
            style={styles.card}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div style={styles.resultHeader}>
              {result.passed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  style={styles.successIconWrapper}
                >
                  <Trophy size={60} color="#FFFFFF" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.failIconWrapper}
                >
                  <XCircle size={60} color="#FFFFFF" />
                </motion.div>
              )}
              
              <h2 style={styles.resultTitle}>{result.passed ? 'Congratulations!' : 'Try Again!'}</h2>
              <p style={styles.resultDesc}>
                {result.passed
                  ? 'You passed the assessment and mastered this course module!'
                  : 'You did not reach the passing mark of 60%. Review the syllabus and try again.'}
              </p>
            </div>

            {/* Score Showcase */}
            <div style={styles.scoreBoard}>
              <div style={styles.scoreBlock}>
                <span style={styles.scoreVal}>{result.score}%</span>
                <span style={styles.scoreLabel}>Total Score</span>
              </div>
              <div style={styles.scoreBlock}>
                <span style={styles.scoreVal}>{result.correctCount} / {result.totalCount}</span>
                <span style={styles.scoreLabel}>Correct Answers</span>
              </div>
            </div>

            {/* Rewards Card */}
            {result.passed && (
              <motion.div
                style={styles.rewardsCard}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 style={styles.rewardsTitle}>Rewards Unlocked</h4>
                <div style={styles.rewardsList}>
                  {result.xpEarned > 0 && (
                    <div style={styles.rewardItem}>
                      <Star size={18} color="#7FB77E" fill="#7FB77E" />
                      <span>+{result.xpEarned} XP Awarded</span>
                    </div>
                  )}
                  {result.unlockedBadge && (
                    <div style={styles.rewardItem}>
                      <Award size={18} color="#C3AED6" fill="#C3AED6" />
                      <span>Unlocked Badge: <strong>{result.unlockedBadge}</strong></span>
                    </div>
                  )}
                  {result.certificateId && (
                    <div style={styles.rewardItem}>
                      <CheckCircle size={18} color="#A67C52" fill="#A67C52" />
                      <span>Completion Certificate Generated</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div style={styles.resultFooter}>
              {result.passed ? (
                <div style={styles.resultActions}>
                  <button
                    onClick={() => navigate('/courses')}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Back to Courses
                  </button>
                  {result.certificateId && (
                    <button
                      onClick={() => navigate('/certificates')}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      View Certificates
                    </button>
                  )}
                </div>
              ) : (
                <div style={styles.resultActions}>
                  <button
                    onClick={handleRetry}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <RefreshCw size={16} />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={() => navigate(`/courses/${quiz.courseId}`)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Review Lessons
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  quizWrapper: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 0',
  },
  loading: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #EADBCE',
    padding: '40px',
    width: '100%',
    maxWidth: '560px',
    boxShadow: '0 16px 40px rgba(139, 107, 74, 0.12)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  tag: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#7FB77E',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  courseTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#8B6B4A',
    marginTop: '4px',
  },
  tracker: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#6E5C50',
    backgroundColor: '#F8F5F1',
    padding: '6px 12px',
    borderRadius: '10px',
    border: '1px solid #EADBCE',
  },
  trackerBarContainer: {
    width: '100%',
    height: '6px',
    backgroundColor: '#F8F5F1',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '32px',
    border: '1px solid #EADBCE',
  },
  trackerBar: {
    height: '100%',
    backgroundColor: '#8B6B4A',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  questionSection: {
    marginBottom: '36px',
  },
  questionText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2D241E',
    marginBottom: '24px',
    lineHeight: '1.4',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionRow: {
    width: '100%',
    border: '2px solid #EADBCE',
    borderRadius: '14px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  radioCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #A39387',
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: '0.95rem',
    color: '#6E5C50',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #F8F5F1',
    paddingTop: '24px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#A67C52',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.95rem',
    padding: '10px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    ':disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    }
  },
  submitBtn: {
    padding: '12px 28px',
  },
  resultHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px',
  },
  successIconWrapper: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#7FB77E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 24px rgba(127, 183, 126, 0.5)',
    marginBottom: '16px',
  },
  failIconWrapper: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#E74C3C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 24px rgba(231, 76, 60, 0.4)',
    marginBottom: '16px',
  },
  resultTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#8B6B4A',
    marginBottom: '8px',
  },
  resultDesc: {
    fontSize: '0.95rem',
    color: '#6E5C50',
    lineHeight: '1.45',
    maxWidth: '400px',
  },
  scoreBoard: {
    display: 'flex',
    backgroundColor: '#F8F5F1',
    borderRadius: '16px',
    border: '1px solid #EADBCE',
    padding: '18px',
    marginBottom: '24px',
  },
  scoreBlock: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #EADBCE',
    ':last-child': {
      borderRight: 'none',
    }
  },
  scoreVal: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#8B6B4A',
  },
  scoreLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#A39387',
    textTransform: 'uppercase',
  },
  rewardsCard: {
    border: '1px solid #EADBCE',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '32px',
    backgroundColor: '#FFFFFF',
  },
  rewardsTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#8B6B4A',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  rewardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  rewardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    color: '#6E5C50',
  },
  resultFooter: {
    borderTop: '1px solid #F8F5F1',
    paddingTop: '24px',
  },
  resultActions: {
    display: 'flex',
    gap: '16px',
  },
  errorAlert: {
    backgroundColor: '#FDE8E8',
    border: '1px solid #F8B4B4',
    color: '#9B1C1C',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
};
