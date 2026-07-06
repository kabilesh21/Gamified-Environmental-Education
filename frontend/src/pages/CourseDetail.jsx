import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import EcoBackground from '../components/EcoBackground';
import { BookOpen, CheckCircle2, ChevronRight, Lock, Play, GraduationCap, Check } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUserData } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showCheckEffect, setShowCheckEffect] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      // Refresh course info
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data);

      // Auto-enroll if not enrolled
      if (!res.data.enrolled) {
        await axios.post(`/api/courses/${id}/enroll`);
        const enrolledRes = await axios.get(`/api/courses/${id}`);
        setCourse(enrolledRes.data);
      }
    } catch (err) {
      console.error("Failed to load course details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (index) => {
    setActiveLessonIdx(index);
    setShowCheckEffect(false);
  };

  const handleCompleteLesson = async (lessonId) => {
    if (completing) return;
    setCompleting(true);
    setShowCheckEffect(false);

    try {
      await axios.post(`/api/lessons/${lessonId}/complete`);
      setShowCheckEffect(true);
      await refreshUserData(); // refresh XP stats
      
      // Reload course details to refresh checkmarks and progress percentage
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to complete lesson", err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading || !course) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Course Player...</div>
      </div>
    );
  }

  const activeLesson = course.lessons?.[activeLessonIdx];
  const allLessonsCompleted = course.completedLessons === course.totalLessons;

  return (
    <div style={styles.playerContainer}>
      <EcoBackground />

      {/* Header bar */}
      <div style={styles.playerHeader}>
        <div>
          <span className={`difficulty-badge difficulty-${course.difficulty.toLowerCase()}`}>
            {course.difficulty}
          </span>
          <h2 style={styles.courseTitle}>{course.title}</h2>
        </div>
        <div style={styles.progressCounter}>
          <span>Progress: <strong>{course.completedLessons} / {course.totalLessons}</strong> Lessons</span>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBar, width: `${course.progressPercentage}%` }} />
          </div>
        </div>
      </div>

      <div style={styles.contentLayout}>
        {/* Left Side: Lesson Drawer */}
        <div style={styles.lessonSidebar}>
          <h3 style={styles.sidebarTitle}>Course Syllabus</h3>
          <div style={styles.lessonList}>
            {course.lessons?.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonSelect(idx)}
                style={{
                  ...styles.lessonRow,
                  backgroundColor: idx === activeLessonIdx ? '#F8F5F1' : '#FFFFFF',
                  borderColor: idx === activeLessonIdx ? '#8B6B4A' : '#EADBCE',
                }}
              >
                {lesson.completed ? (
                  <CheckCircle2 size={18} color="#7FB77E" style={styles.statusIcon} />
                ) : (
                  <Play size={16} color={idx === activeLessonIdx ? '#8B6B4A' : '#A39387'} style={styles.statusIcon} />
                )}
                <div style={styles.lessonMeta}>
                  <span style={styles.lessonNum}>Lesson {lesson.sequence}</span>
                  <span style={{
                    ...styles.lessonRowTitle,
                    fontWeight: idx === activeLessonIdx ? '700' : '500',
                  }}>{lesson.title}</span>
                </div>
              </button>
            ))}

            {/* Quiz Unlock Button in Sidebar */}
            <div style={styles.sidebarFooter}>
              {allLessonsCompleted ? (
                <motion.button
                  onClick={() => navigate(`/courses/${course.id}/quiz`)}
                  className="btn btn-secondary"
                  style={styles.quizBtn}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <GraduationCap size={18} />
                  <span>Start Course Quiz</span>
                </motion.button>
              ) : (
                <div style={styles.quizLockedState}>
                  <Lock size={16} />
                  <span>Quiz locks until all lessons complete</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Lesson Panel */}
        <div style={styles.lessonPanel}>
          {activeLesson ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                style={styles.panelContent}
              >
                <span style={styles.sequenceTag}>Module {activeLesson.sequence}</span>
                <h1 style={styles.lessonTitle}>{activeLesson.title}</h1>
                
                <hr style={styles.divider} />
                
                <div style={styles.textContent}>
                  {activeLesson.content.split('\n').map((para, i) => (
                    <p key={i} style={styles.paragraph}>{para}</p>
                  ))}
                </div>

                <div style={styles.panelFooter}>
                  {activeLesson.completed ? (
                    <div style={styles.completedConfirm}>
                      <CheckCircle2 size={20} />
                      <span>You completed this lesson!</span>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <motion.button
                        onClick={() => handleCompleteLesson(activeLesson.id)}
                        className="btn btn-primary"
                        style={styles.completeBtn}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={completing}
                      >
                        {completing ? 'Saving...' : 'Mark as Completed (+10 XP)'}
                      </motion.button>

                      {/* Floating glowing green check mark popup */}
                      <AnimatePresence>
                        {showCheckEffect && (
                          <motion.div
                            style={styles.checkPopup}
                            initial={{ scale: 0, opacity: 0, y: 0 }}
                            animate={{ scale: 1.5, opacity: 1, y: -40 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Check size={36} color="#FFFFFF" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  {/* Shortcut to next lesson */}
                  {activeLessonIdx < course.lessons.length - 1 && (
                    <button
                      onClick={() => handleLessonSelect(activeLessonIdx + 1)}
                      style={styles.nextLessonLink}
                    >
                      <span>Next Lesson</span>
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div style={styles.emptyPanel}>Select a lesson from the sidebar to begin learning.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  playerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  loading: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #EADBCE',
    padding: '24px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  courseTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#8B6B4A',
    marginTop: '4px',
  },
  progressCounter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '200px',
  },
  progressBarBg: {
    width: '100%',
    height: '8px',
    backgroundColor: '#F8F5F1',
    borderRadius: '4px',
    border: '1px solid #EADBCE',
    overflow: 'hidden',
    marginTop: '6px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7FB77E',
    borderRadius: '4px',
  },
  contentLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },
  lessonSidebar: {
    width: '320px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.02)',
  },
  sidebarTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#8B6B4A',
    marginBottom: '16px',
  },
  lessonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  lessonRow: {
    width: '100%',
    border: '1px solid #EADBCE',
    borderRadius: '12px',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  statusIcon: {
    marginRight: '12px',
    flexShrink: 0,
  },
  lessonMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  lessonNum: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#A39387',
    textTransform: 'uppercase',
  },
  lessonRowTitle: {
    fontSize: '0.88rem',
    color: '#2D241E',
    marginTop: '2px',
    lineHeight: '1.25',
  },
  sidebarFooter: {
    marginTop: '20px',
    borderTop: '1px solid #F8F5F1',
    paddingTop: '20px',
  },
  quizBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '0.9rem',
  },
  quizLockedState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#A39387',
    backgroundColor: '#F8F5F1',
    padding: '12px',
    borderRadius: '12px',
    border: '1.5px dashed #EADBCE',
  },
  lessonPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    minHeight: '460px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.02)',
  },
  panelContent: {
    padding: '40px',
  },
  sequenceTag: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#7FB77E',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  lessonTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#2D241E',
    marginTop: '6px',
    lineHeight: '1.2',
  },
  divider: {
    border: 'none',
    borderBottom: '1.5px solid #F8F5F1',
    margin: '24px 0',
  },
  textContent: {
    marginBottom: '36px',
  },
  paragraph: {
    fontSize: '1.05rem',
    color: '#6E5C50',
    lineHeight: '1.65',
    marginBottom: '16px',
  },
  panelFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #F8F5F1',
    paddingTop: '28px',
  },
  completeBtn: {
    padding: '12px 28px',
  },
  completedConfirm: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#7FB77E',
    fontWeight: '700',
    fontSize: '1rem',
  },
  nextLessonLink: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#A67C52',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  emptyPanel: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#A39387',
    fontWeight: '600',
  },
  checkPopup: {
    position: 'absolute',
    left: '50px',
    top: '0px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#7FB77E',
    boxShadow: '0 0 20px rgba(127, 183, 126, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
};
