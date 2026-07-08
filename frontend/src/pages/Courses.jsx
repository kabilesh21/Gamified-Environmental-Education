import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion as motionElement } from 'framer-motion';
import { BookOpen, Award, CheckCircle2, Plus, Trash2, ArrowLeft, ArrowRight, Upload, Loader2, Save, Edit3 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Courses() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Wizard States
  const [showWizard, setShowWizard] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: 'Explore the fascinating world of environmental sustainability with our interactive modules.',
    difficulty: 'Beginner',
    numModules: 1,
    imageUrl: '',
    badgeReward: '',
    lessons: [],
    numQuestions: 1,
    questions: []
  });

  const isStaffOrAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_STAFF');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCourseForm(prev => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      console.error("Failed to upload file", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = async (course) => {
    try {
      setLoading(true);
      // Fetch full course details (lessons)
      const courseRes = await axios.get(`/api/courses/${course.id}`);
      const courseData = courseRes.data;

      // Fetch quiz details (with correct answers)
      const quizRes = await axios.get(`/api/courses/${course.id}/quiz/edit`);
      const quizData = quizRes.data;

      // Map to form state
      setCourseForm({
        title: courseData.title || '',
        description: courseData.description || '',
        difficulty: courseData.difficulty || 'Beginner',
        numModules: courseData.lessons ? courseData.lessons.length : 1,
        imageUrl: courseData.imageUrl || '',
        badgeReward: courseData.badgeReward || '',
        lessons: courseData.lessons ? courseData.lessons.map(l => ({ title: l.title, content: l.content })) : [],
        numQuestions: quizData.questions ? quizData.questions.length : 1,
        questions: quizData.questions ? quizData.questions.map(q => ({
          questionText: q.questionText,
          options: q.options.map(o => ({ optionText: o.optionText, isCorrect: o.isCorrect }))
        })) : []
      });

      setIsEditMode(true);
      setEditCourseId(course.id);
      setStep(1);
      setShowWizard(true);
    } catch (err) {
      console.error("Failed to load course details for editing", err);
      alert("Error loading course details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep1 = () => {
    if (!courseForm.title.trim()) {
      alert("Please enter a course name");
      return;
    }

    const count = Math.max(1, parseInt(courseForm.numModules) || 1);
    const updatedLessons = Array.from({ length: count }, (_, i) => {
      return courseForm.lessons[i] || { title: `Module ${i + 1}: `, content: '' };
    });

    setCourseForm(prev => ({
      ...prev,
      lessons: updatedLessons
    }));
    setStep(2);
  };

  const handleNextStep2 = () => {
    for (let i = 0; i < courseForm.lessons.length; i++) {
      if (!courseForm.lessons[i].title.trim() || !courseForm.lessons[i].content.trim()) {
        alert(`Please fill in both title and content for Module ${i + 1}`);
        return;
      }
    }

    const count = Math.max(1, parseInt(courseForm.numQuestions) || 1);
    const updatedQuestions = Array.from({ length: count }, (_, i) => {
      return courseForm.questions[i] || {
        questionText: '',
        options: [
          { optionText: '', isCorrect: true },
          { optionText: '', isCorrect: false }
        ]
      };
    });

    setCourseForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
    setStep(3);
  };

  const handleQuestionCountChange = (count) => {
    const cleanCount = Math.max(1, parseInt(count) || 1);
    setCourseForm(prev => {
      const updatedQuestions = Array.from({ length: cleanCount }, (_, i) => {
        return prev.questions[i] || {
          questionText: '',
          options: [
            { optionText: '', isCorrect: true },
            { optionText: '', isCorrect: false }
          ]
        };
      });
      return { ...prev, numQuestions: cleanCount, questions: updatedQuestions };
    });
  };

  const handleAddOption = (qIdx) => {
    setCourseForm(prev => {
      const updatedQs = [...prev.questions];
      updatedQs[qIdx].options.push({ optionText: '', isCorrect: false });
      return { ...prev, questions: updatedQs };
    });
  };

  const handleRemoveOption = (qIdx, oIdx) => {
    setCourseForm(prev => {
      const updatedQs = [...prev.questions];
      if (updatedQs[qIdx].options.length > 2) {
        updatedQs[qIdx].options.splice(oIdx, 1);
      } else {
        alert("Each question must have at least 2 options.");
      }
      return { ...prev, questions: updatedQs };
    });
  };

  const handleOptionCorrectToggle = (qIdx, oIdx) => {
    setCourseForm(prev => {
      const updatedQs = [...prev.questions];
      updatedQs[qIdx].options = updatedQs[qIdx].options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oIdx
      }));
      return { ...prev, questions: updatedQs };
    });
  };

  const handleCancel = () => {
    setShowWizard(false);
    setIsEditMode(false);
    setEditCourseId(null);
    setStep(1);
    setCourseForm({
      title: '',
      description: 'Explore the fascinating world of environmental sustainability with our interactive modules.',
      difficulty: 'Beginner',
      numModules: 1,
      imageUrl: '',
      badgeReward: '',
      lessons: [],
      numQuestions: 1,
      questions: []
    });
  };

  const handleSubmit = async () => {
    // Validate Step 3
    for (let i = 0; i < courseForm.questions.length; i++) {
      const q = courseForm.questions[i];
      if (!q.questionText.trim()) {
        alert(`Please fill in the text for Question ${i + 1}`);
        return;
      }
      let correctCount = 0;
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].optionText.trim()) {
          alert(`Please fill in option ${j + 1} text for Question ${i + 1}`);
          return;
        }
        if (q.options[j].isCorrect) {
          correctCount++;
        }
      }
      if (correctCount !== 1) {
        alert(`Question ${i + 1} must have exactly one correct answer. Please toggle correctness for options.`);
        return;
      }
    }

    try {
      const payload = {
        title: courseForm.title,
        description: courseForm.description,
        difficulty: courseForm.difficulty,
        imageUrl: courseForm.imageUrl,
        badgeReward: courseForm.badgeReward,
        lessons: courseForm.lessons,
        quiz: {
          xpReward: 100,
          questions: courseForm.questions
        }
      };

      if (isEditMode) {
        await axios.put(`/api/courses/${editCourseId}`, payload);
        alert("Course updated successfully!");
      } else {
        await axios.post('/api/courses', payload);
        alert("Course created successfully!");
      }

      setShowWizard(false);
      setIsEditMode(false);
      setEditCourseId(null);
      setStep(1);
      setCourseForm({
        title: '',
        description: 'Explore the fascinating world of environmental sustainability with our interactive modules.',
        difficulty: 'Beginner',
        numModules: 1,
        imageUrl: '',
        badgeReward: '',
        lessons: [],
        numQuestions: 1,
        questions: []
      });
      fetchCourses();
    } catch (err) {
      console.error("Failed to save course", err);
      alert("Error saving course. Please check fields and try again.");
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Courses...</div>
      </div>
    );
  }

  if (showWizard) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>{isEditMode ? "Edit Eco Course" : "Create Eco Course"}</h1>
          <p style={styles.subtitle}>{isEditMode ? "Modify course parameters, manuals, and evaluation choices." : "Construct a new educational course, lessons, and quizzes for all Greenizo users."}</p>
        </div>

        <div style={styles.wizardCard}>
          {/* Step Indicator */}
          <div style={styles.stepHeader}>
            <div style={styles.stepNodeRow}>
              <div style={styles.stepNode(step >= 1)}>1</div>
              <span style={styles.stepLabel(step >= 1)}>Course Details</span>
            </div>
            <div style={styles.stepDivider} />
            <div style={styles.stepNodeRow}>
              <div style={styles.stepNode(step >= 2)}>2</div>
              <span style={styles.stepLabel(step >= 2)}>Modules Setup</span>
            </div>
            <div style={styles.stepDivider} />
            <div style={styles.stepNodeRow}>
              <div style={styles.stepNode(step >= 3)}>3</div>
              <span style={styles.stepLabel(step >= 3)}>Quiz Config</span>
            </div>
          </div>

          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <motionElement.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={styles.sectionTitle}>Step 1: Course Information</h3>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Course Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Energy Basics"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description *</label>
                <textarea
                  rows={3}
                  placeholder="Provide an attractive and informative description of the course..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  style={styles.formTextarea}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Difficulty</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                    style={styles.formSelect}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Number of Modules *</label>
                  <input
                    type="number"
                    min={1}
                    value={courseForm.numModules}
                    onChange={(e) => setCourseForm({ ...courseForm, numModules: parseInt(e.target.value) || 1 })}
                    style={styles.formInput}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Badge Reward Unlocked</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Pioneer (blank generates '[Course] Pioneer')"
                  value={courseForm.badgeReward}
                  onChange={(e) => setCourseForm({ ...courseForm, badgeReward: e.target.value })}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Course Thumbnail Picture Upload *</label>
                <div style={styles.uploadRow}>
                  <label style={styles.uploadBtn}>
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span>{uploading ? "Uploading..." : "Choose File"}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                  <input
                    type="text"
                    placeholder="Or enter direct image URL..."
                    value={courseForm.imageUrl}
                    onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                    style={{ ...styles.formInput, flex: 1 }}
                  />
                </div>
                {courseForm.imageUrl && (
                  <div style={styles.imgPreviewWrapper}>
                    <img src={courseForm.imageUrl} alt="Preview" style={styles.imgPreview} />
                    <span style={styles.previewTag}>Thumbnail Live Preview</span>
                  </div>
                )}
              </div>

              <div style={styles.actionsRow}>
                <button onClick={handleCancel} className="btn btn-ghost" style={styles.btnCancel}>
                  Cancel
                </button>
                <button onClick={handleNextStep1} className="btn btn-primary" style={styles.btnNext}>
                  Configure Modules <ArrowRight size={16} />
                </button>
              </div>
            </motionElement.div>
          )}

          {/* STEP 2: LESSONS (MODULES) */}
          {step === 2 && (
            <motionElement.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={styles.sectionTitle}>Step 2: Enter Module Details Manually</h3>
              <p style={styles.sectionSub}>Please write the educational content for each module below.</p>

              {courseForm.lessons.map((lesson, idx) => (
                <div key={idx} style={styles.moduleBox}>
                  <h4 style={styles.moduleHeader}>Module {idx + 1}</h4>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Module Title *</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => {
                        const updated = [...courseForm.lessons];
                        updated[idx].title = e.target.value;
                        setCourseForm({ ...courseForm, lessons: updated });
                      }}
                      placeholder="e.g. Photovoltaics Concept"
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Educational Content *</label>
                    <textarea
                      rows={5}
                      value={lesson.content}
                      onChange={(e) => {
                        const updated = [...courseForm.lessons];
                        updated[idx].content = e.target.value;
                        setCourseForm({ ...courseForm, lessons: updated });
                      }}
                      placeholder="Write rich, educational and green content to inform users..."
                      style={styles.formTextarea}
                    />
                  </div>
                </div>
              ))}

              <div style={styles.actionsRow}>
                <button onClick={() => setStep(1)} className="btn btn-ghost" style={styles.btnCancel}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleNextStep2} className="btn btn-primary" style={styles.btnNext}>
                  Configure Quiz <ArrowRight size={16} />
                </button>
              </div>
            </motionElement.div>
          )}

          {/* STEP 3: QUIZ CONFIG */}
          {step === 3 && (
            <motionElement.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={styles.sectionTitle}>Step 3: Setup Quiz Questions</h3>
              <p style={styles.sectionSub}>Configure the evaluation questions for this course. Click the correct badge next to the right option.</p>

              <div style={{ ...styles.formGroup, maxWidth: '300px', marginBottom: '24px' }}>
                <label style={styles.formLabel}>Number of Quiz Questions</label>
                <input
                  type="number"
                  min={1}
                  value={courseForm.numQuestions}
                  onChange={(e) => handleQuestionCountChange(e.target.value)}
                  style={styles.formInput}
                />
              </div>

              {courseForm.questions.map((q, qIdx) => (
                <div key={qIdx} style={styles.moduleBox}>
                  <h4 style={styles.moduleHeader}>Question {qIdx + 1}</h4>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Question Text *</label>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => {
                        const updated = [...courseForm.questions];
                        updated[qIdx].questionText = e.target.value;
                        setCourseForm({ ...courseForm, questions: updated });
                      }}
                      placeholder="e.g. Which of these is a clean energy source?"
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={styles.formLabel}>Option Choices (Toggle to select correct answer)</label>
                      <button
                        onClick={() => handleAddOption(qIdx)}
                        style={styles.addOptBtn}
                        type="button"
                      >
                        <Plus size={12} /> Add Option
                      </button>
                    </div>

                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} style={styles.optionRow}>
                        <button
                          type="button"
                          onClick={() => handleOptionCorrectToggle(qIdx, oIdx)}
                          style={styles.correctBtn(opt.isCorrect)}
                        >
                          {opt.isCorrect ? "✓ Correct Answer" : "Mark Correct"}
                        </button>
                        <input
                          type="text"
                          value={opt.optionText}
                          onChange={(e) => {
                            const updated = [...courseForm.questions];
                            updated[qIdx].options[oIdx].optionText = e.target.value;
                            setCourseForm({ ...courseForm, questions: updated });
                          }}
                          placeholder={`Option ${oIdx + 1} text...`}
                          style={{ ...styles.formInput, flex: 1 }}
                        />
                        {q.options.length > 2 && (
                          <button
                            onClick={() => handleRemoveOption(qIdx, oIdx)}
                            style={styles.removeOptBtn}
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={styles.actionsRow}>
                <button onClick={() => setStep(2)} className="btn btn-ghost" style={styles.btnCancel}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleSubmit} className="btn btn-primary" style={{ ...styles.btnNext, backgroundColor: '#7FB77E' }}>
                  <Save size={16} /> {isEditMode ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </motionElement.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Eco Learning Courses</h1>
          <p style={styles.subtitle}>Unlock environmental knowledge modules, earn points, and earn certification badges!</p>
        </div>
        {isStaffOrAdmin && (
          <button
            onClick={() => {
              setIsEditMode(false);
              setEditCourseId(null);
              setShowWizard(true);
            }}
            className="btn btn-primary"
            style={{
              backgroundColor: '#7FB77E',
              borderColor: '#7FB77E',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            <span>Add Course</span>
          </button>
        )}
      </div>

      <div style={styles.grid}>
        {courses.map((course, idx) => (
          <motionElement.div
            key={course.id}
            style={styles.card}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            whileHover={{
              rotateY: 10,
              rotateX: -5,
              perspective: 1000,
              y: -8,
              scale: 1.03,
              boxShadow: "0 20px 40px rgba(139, 107, 74, 0.2)",
            }}
          >
            {/* Image section with completion overlay */}
            <div style={styles.imageWrapper}>
              <img 
                src={course.imageUrl && course.imageUrl.trim() ? course.imageUrl : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600'} 
                alt={course.title} 
                style={styles.image} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600';
                }}
              />
              {course.completed && (
                <div style={styles.completedOverlay}>
                  <CheckCircle2 size={36} color="#FFFFFF" />
                  <span style={styles.completedTag}>Completed</span>
                </div>
              )}
            </div>

            <div style={styles.infoWrapper}>
              <div style={styles.badgeRow}>
                <span className={`difficulty-badge difficulty-${course.difficulty.toLowerCase()}`}>
                  {course.difficulty}
                </span>
                {course.completed && (
                  <span style={styles.badgeRewardTag}>
                    <Award size={14} />
                    <span>{course.badgeReward}</span>
                  </span>
                )}
              </div>

              <h3 style={styles.courseTitle}>{course.title}</h3>
              <p style={styles.courseDesc}>{course.description}</p>

              {/* Progress Bar Container */}
              {course.enrolled && (
                <div style={styles.progressSection}>
                  <div style={styles.progressTextRow}>
                    <span style={styles.progressLabel}>Course Progress</span>
                    <span style={styles.progressPercent}>{Math.round(course.progressPercentage)}%</span>
                  </div>
                  <div style={styles.progressBarWrapper}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${course.progressPercentage}%`,
                        backgroundColor: course.completed ? '#7FB77E' : '#A67C52',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Actions row */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="btn btn-primary"
                  style={{
                    ...styles.btnAction,
                    flex: 1,
                    backgroundColor: course.completed ? '#7FB77E' : '#8B6B4A',
                  }}
                >
                  <BookOpen size={18} />
                  <span>
                    {course.completed
                      ? 'Review'
                      : course.enrolled
                      ? 'Resume'
                      : 'Start'}
                  </span>
                </button>
                {isStaffOrAdmin && (
                  <button
                    onClick={() => handleEditClick(course)}
                    style={styles.btnEditAction}
                    title="Edit Course details, pictures, and quizzes"
                  >
                    <Edit3 size={16} style={{ marginRight: '4px' }} />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          </motionElement.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '40px',
  },
  loading: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: '8px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#8B6B4A',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6E5C50',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
    transition: 'all 0.3s ease',
  },
  imageWrapper: {
    position: 'relative',
    height: '160px',
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(127, 183, 126, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  completedTag: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  infoWrapper: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  badgeRewardTag: {
    backgroundColor: 'rgba(195, 174, 214, 0.25)',
    color: '#7b5999',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  courseTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2D241E',
    marginBottom: '10px',
  },
  courseDesc: {
    fontSize: '0.88rem',
    color: '#6E5C50',
    lineHeight: '1.5',
    marginBottom: '20px',
    flex: 1,
  },
  progressSection: {
    marginBottom: '20px',
  },
  progressTextRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#A39387',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  progressLabel: {
    color: '#6E5C50',
  },
  progressPercent: {
    color: '#8B6B4A',
  },
  progressBarWrapper: {
    height: '8px',
    backgroundColor: '#F8F5F1',
    borderRadius: '4px',
    border: '1px solid #EADBCE',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },
  btnAction: {
    width: '100%',
    padding: '12px',
  },

  // WIZARD STYLES (DARK PREMIUM CONFIGURATION)
  wizardCard: {
    backgroundColor: '#18241b', // Deep Evergreen Dark
    border: '1px solid rgba(127,183,126,0.25)',
    borderRadius: '24px',
    padding: '36px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
    maxWidth: '850px',
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto 40px auto',
  },
  stepHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid rgba(127,183,126,0.15)',
    paddingBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  stepNodeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  stepNode: (active) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: active ? '#7FB77E' : 'rgba(255,255,255,0.05)',
    color: active ? '#18241b' : '#A3C9A8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '0.9rem',
    border: active ? 'none' : '1px solid rgba(127,183,126,0.2)',
    transition: 'all 0.3s ease',
  }),
  stepLabel: (active) => ({
    fontSize: '0.9rem',
    fontWeight: '800',
    color: active ? '#FFFFFF' : '#88A08C',
  }),
  stepDivider: {
    flex: 1,
    height: '2px',
    backgroundColor: 'rgba(127,183,126,0.2)',
    minWidth: '30px',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#7FB77E',
    marginBottom: '8px',
  },
  sectionSub: {
    fontSize: '0.9rem',
    color: '#A3C9A8',
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#A3C9A8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  formInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(127,183,126,0.3)',
    fontSize: '0.95rem',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.05)',
    outline: 'none',
    transition: 'all 0.2s',
  },
  formTextarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(127,183,126,0.3)',
    fontSize: '0.95rem',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: '120px',
    resize: 'vertical',
    outline: 'none',
    transition: 'all 0.2s',
  },
  formSelect: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(127,183,126,0.3)',
    fontSize: '0.95rem',
    color: '#FFFFFF',
    backgroundColor: '#1b2a1f',
    outline: 'none',
  },
  uploadRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    width: '100%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px dashed rgba(127,183,126,0.4)',
    color: '#7FB77E',
    padding: '12px 18px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  imgPreviewWrapper: {
    position: 'relative',
    marginTop: '15px',
    width: '150px',
    height: '100px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(127,183,126,0.3)',
  },
  imgPreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  previewTag: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#FFF',
    fontSize: '0.65rem',
    padding: '2px 0',
  },
  moduleBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(127,183,126,0.15)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  moduleHeader: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#7FB77E',
    marginBottom: '16px',
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
    width: '100%',
  },
  correctBtn: (isCorrect) => ({
    padding: '10px 16px',
    borderRadius: '10px',
    border: isCorrect ? 'none' : '1px solid rgba(127,183,126,0.3)',
    backgroundColor: isCorrect ? '#7FB77E' : 'rgba(255,255,255,0.05)',
    color: isCorrect ? '#18241b' : '#A3C9A8',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  }),
  addOptBtn: {
    border: 'none',
    backgroundColor: 'rgba(127,183,126,0.15)',
    color: '#7FB77E',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  removeOptBtn: {
    border: 'none',
    backgroundColor: 'rgba(235,94,40,0.15)',
    color: '#EB5E28',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
  },
  btnCancel: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '700',
    color: '#A3C9A8',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnNext: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  btnEditAction: {
    padding: '12px 16px',
    backgroundColor: '#1b2e22',
    border: '1px solid #7FB77E',
    color: '#7FB77E',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  }
};
