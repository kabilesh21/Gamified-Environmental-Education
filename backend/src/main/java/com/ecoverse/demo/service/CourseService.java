package com.ecoverse.demo.service;

import com.ecoverse.demo.dto.*;
import com.ecoverse.demo.entity.*;
import com.ecoverse.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizOptionRepository quizOptionRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserLessonProgressRepository userLessonProgressRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private WeeklyMissionService weeklyMissionService;

    public List<CourseResponse> getAllCourses(User user) {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(course -> mapToCourseResponse(course, user, false))
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseDetails(Long courseId, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found!"));
        return mapToCourseResponse(course, user, true);
    }

    @Transactional
    public void enrollInCourse(Long courseId, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found!"));

        if (enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId).isPresent()) {
            return; // Already enrolled
        }

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .enrolledAt(LocalDateTime.now())
                .completed(false)
                .build();

        enrollmentRepository.save(enrollment);
        
        // Mark active login streak/activity
        trackDailyActivity(user);
    }

    @Transactional
    public void completeLesson(Long lessonId, User user) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found!"));

        // Auto enroll in course if not enrolled
        enrollInCourse(lesson.getCourse().getId(), user);

        Optional<UserLessonProgress> progressOpt = userLessonProgressRepository
                .findByUserIdAndLessonId(user.getId(), lessonId);

        if (progressOpt.isPresent()) {
            return; // Already completed
        }

        UserLessonProgress progress = UserLessonProgress.builder()
                .user(user)
                .lesson(lesson)
                .completedAt(LocalDateTime.now())
                .build();

        userLessonProgressRepository.save(progress);

        // Award +10 XP for lesson completion
        achievementService.awardXpAndCheckLevel(user, 10);

        // Award +15 Eco Coins for lesson completion
        user.setCoins(user.getCoins() + 15);
        userRepository.save(user);

        // Update Weekly Mission for MODULE and XP
        weeklyMissionService.incrementProgress(user, "MODULE", 1);
        weeklyMissionService.incrementProgress(user, "XP", 10);

        // Check if 5 lessons completed
        long totalCompletedLessons = userLessonProgressRepository.countByUserId(user.getId());
        if (totalCompletedLessons >= 5) {
            achievementService.unlockAchievement(user, "LESSONS_5");
        }

        trackDailyActivity(user);
    }

    public QuizResponse getQuiz(Long courseId) {
        Quiz quiz = quizRepository.findByCourseId(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found for this course!"));

        List<QuizQuestion> questions = quizQuestionRepository.findByQuizId(quiz.getId());

        List<QuizResponse.QuestionDto> questionDtos = questions.stream()
                .map(q -> {
                    List<QuizResponse.OptionDto> optionDtos = q.getOptions().stream()
                            .map(opt -> QuizResponse.OptionDto.builder()
                                    .id(opt.getId())
                                    .optionText(opt.getOptionText())
                                    .build())
                            .collect(Collectors.toList());

                    return QuizResponse.QuestionDto.builder()
                            .id(q.getId())
                            .questionText(q.getQuestionText())
                            .options(optionDtos)
                            .build();
                })
                .collect(Collectors.toList());

        return QuizResponse.builder()
                .id(quiz.getId())
                .courseId(courseId)
                .courseTitle(quiz.getCourse().getTitle())
                .xpReward(quiz.getXpReward())
                .questions(questionDtos)
                .build();
    }

    @Transactional
    public QuizResultResponse submitQuiz(QuizSubmissionRequest request, User user) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found!"));

        List<QuizQuestion> questions = quizQuestionRepository.findByQuizId(quiz.getId());

        int totalQuestions = questions.size();
        int correctCount = 0;

        // Map request answers for quick lookup
        Map<Long, Long> submissionMap = new HashMap<>();
        if (request.getAnswers() != null) {
            for (QuizSubmissionRequest.Answer ans : request.getAnswers()) {
                submissionMap.put(ans.getQuestionId(), ans.getOptionId());
            }
        }

        for (QuizQuestion question : questions) {
            Long selectedOptionId = submissionMap.get(question.getId());
            if (selectedOptionId != null) {
                // Find option in question options
                boolean isCorrect = question.getOptions().stream()
                        .filter(o -> o.getId().equals(selectedOptionId))
                        .map(QuizOption::isCorrect)
                        .findFirst()
                        .orElse(false);

                if (isCorrect) {
                    correctCount++;
                }
            }
        }

        int score = totalQuestions > 0 ? (correctCount * 100) / totalQuestions : 0;
        boolean passed = score >= 60; // 60% passing mark

        String unlockedBadge = null;
        String certificateId = null;
        int xpEarned = 0;

        if (passed) {
            Enrollment enrollment = enrollmentRepository
                    .findByUserIdAndCourseId(user.getId(), quiz.getCourse().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not enrolled in this course!"));

            if (!enrollment.isCompleted()) {
                enrollment.setCompleted(true);
                enrollment.setCompletedAt(LocalDateTime.now());
                enrollmentRepository.save(enrollment);

                // Earn quiz XP
                xpEarned = quiz.getXpReward();
                achievementService.awardXpAndCheckLevel(user, xpEarned);

                // Earn quiz Eco Coins (+50 Coins)
                user.setCoins(user.getCoins() + 50);
                userRepository.save(user);

                // Update Weekly Mission for QUIZ and XP
                weeklyMissionService.incrementProgress(user, "QUIZ", 1);
                weeklyMissionService.incrementProgress(user, "XP", xpEarned);

                // Generate certificate
                certificateId = UUID.randomUUID().toString().toUpperCase().replaceAll("-", "").substring(0, 10);
                Certificate certificate = Certificate.builder()
                        .certificateId(certificateId)
                        .user(user)
                        .course(quiz.getCourse())
                        .issueDate(LocalDateTime.now())
                        .build();
                certificateRepository.save(certificate);

                // Unlock course badge
                String badgeName = quiz.getCourse().getBadgeReward();
                achievementService.unlockBadge(user, badgeName);
                unlockedBadge = badgeName;

                // Check achievements
                long completedCourses = enrollmentRepository.countByUserIdAndCompletedTrue(user.getId());
                if (completedCourses >= 1) {
                    achievementService.unlockAchievement(user, "FIRST_COURSE_COMPLETE");
                }
                if (completedCourses >= 3) {
                    achievementService.unlockAchievement(user, "COURSES_3");
                }
            }

            if (score == 100) {
                achievementService.unlockAchievement(user, "QUIZ_MASTER");
            }
        }

        trackDailyActivity(user);

        return QuizResultResponse.builder()
                .score(score)
                .passed(passed)
                .correctCount(correctCount)
                .totalCount(totalQuestions)
                .xpEarned(xpEarned)
                .unlockedBadge(unlockedBadge)
                .certificateId(certificateId)
                .build();
    }

    public List<CourseResponse> getRecommendations(User user) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
        
        // 1. If user has no enrollments or is inactive, suggest beginner courses
        if (enrollments.isEmpty()) {
            return courseRepository.findAll().stream()
                    .filter(c -> "Beginner".equalsIgnoreCase(c.getDifficulty()))
                    .limit(2)
                    .map(c -> mapToCourseResponse(c, user, false))
                    .collect(Collectors.toList());
        }

        // 2. If user completed a beginner course, suggest intermediate courses
        boolean completedBeginner = enrollments.stream()
                .filter(Enrollment::isCompleted)
                .anyMatch(e -> "Beginner".equalsIgnoreCase(e.getCourse().getDifficulty()));

        if (completedBeginner) {
            List<Course> intermediate = courseRepository.findAll().stream()
                    .filter(c -> "Intermediate".equalsIgnoreCase(c.getDifficulty()))
                    .collect(Collectors.toList());
            
            // Check which ones are not yet completed
            List<Course> recommended = new ArrayList<>();
            for (Course course : intermediate) {
                boolean alreadyCompleted = enrollments.stream()
                        .anyMatch(e -> e.getCourse().getId().equals(course.getId()) && e.isCompleted());
                if (!alreadyCompleted) {
                    recommended.add(course);
                }
            }

            if (!recommended.isEmpty()) {
                return recommended.stream()
                        .limit(2)
                        .map(c -> mapToCourseResponse(c, user, false))
                        .collect(Collectors.toList());
            }
        }

        // Default fallback: suggest any course not completed
        List<Course> all = courseRepository.findAll();
        List<Course> notCompleted = new ArrayList<>();
        for (Course c : all) {
            boolean done = enrollments.stream()
                    .anyMatch(e -> e.getCourse().getId().equals(c.getId()) && e.isCompleted());
            if (!done) {
                notCompleted.add(c);
            }
        }

        return notCompleted.stream()
                .limit(2)
                .map(c -> mapToCourseResponse(c, user, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public void trackDailyActivity(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        // Unlock First Login achievement on first ever activity
        achievementService.unlockAchievement(user, "FIRST_LOGIN");

        if (lastActive == null) {
            user.setCurrentStreak(1);
            user.setLastActiveDate(today);
            achievementService.awardXpAndCheckLevel(user, 15); // Daily activity reward
        } else if (lastActive.equals(today.minusDays(1))) {
            int newStreak = user.getCurrentStreak() + 1;
            user.setCurrentStreak(newStreak);
            user.setLastActiveDate(today);
            achievementService.awardXpAndCheckLevel(user, 15); // Streak login bonus

            if (newStreak >= 7) {
                achievementService.unlockAchievement(user, "STREAK_7");
            }
        } else if (!lastActive.equals(today)) {
            // Streak broken: reset to 1
            user.setCurrentStreak(1);
            user.setLastActiveDate(today);
            achievementService.awardXpAndCheckLevel(user, 15);
        }

        userRepository.save(user);
    }

    private CourseResponse mapToCourseResponse(Course course, User user, boolean includeLessons) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository
                .findByUserIdAndCourseId(user.getId(), course.getId());

        boolean enrolled = enrollmentOpt.isPresent();
        boolean completed = enrolled && enrollmentOpt.get().isCompleted();
        double progressPercentage = 0.0;
        int completedLessons = 0;

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceAsc(course.getId());
        int totalLessons = lessons.size();

        if (enrolled) {
            completedLessons = (int) userLessonProgressRepository
                    .countByUserIdAndLessonCourseId(user.getId(), course.getId());
            if (totalLessons > 0) {
                progressPercentage = (completedLessons * 100.0) / totalLessons;
            }
        }

        List<LessonResponse> lessonResponses = null;
        if (includeLessons) {
            lessonResponses = lessons.stream()
                    .map(lesson -> {
                        boolean lessonCompleted = userLessonProgressRepository
                                .findByUserIdAndLessonId(user.getId(), lesson.getId())
                                .isPresent();

                        return LessonResponse.builder()
                                .id(lesson.getId())
                                .title(lesson.getTitle())
                                .content(lesson.getContent())
                                .sequence(lesson.getSequence())
                                .completed(lessonCompleted)
                                .build();
                    })
                    .collect(Collectors.toList());
        }

        Optional<Quiz> quizOpt = quizRepository.findByCourseId(course.getId());
        Long quizId = quizOpt.map(Quiz::getId).orElse(null);

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .difficulty(course.getDifficulty())
                .imageUrl(course.getImageUrl())
                .badgeReward(course.getBadgeReward())
                .enrolled(enrolled)
                .completed(completed)
                .progressPercentage(progressPercentage)
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .lessons(lessonResponses)
                .quizId(quizId)
                .build();
    }

    @Transactional
    public void createCourse(CourseCreateRequest request) {
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription() == null || request.getDescription().trim().isEmpty()
                        ? "Learn more about " + request.getTitle() + " and environmental sustainability."
                        : request.getDescription())
                .difficulty(request.getDifficulty() == null ? "Beginner" : request.getDifficulty())
                .imageUrl(request.getImageUrl() == null || request.getImageUrl().trim().isEmpty()
                        ? "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600"
                        : request.getImageUrl())
                .badgeReward(request.getBadgeReward() == null || request.getBadgeReward().trim().isEmpty()
                        ? request.getTitle() + " Pioneer"
                        : request.getBadgeReward())
                .build();

        course = courseRepository.save(course);

        // Save lessons
        int seq = 1;
        if (request.getLessons() != null) {
            for (CourseCreateRequest.LessonCreateDto lessonDto : request.getLessons()) {
                Lesson lesson = Lesson.builder()
                        .title(lessonDto.getTitle())
                        .content(lessonDto.getContent())
                        .sequence(seq++)
                        .course(course)
                        .build();
                lessonRepository.save(lesson);
            }
        }

        // Save Quiz
        if (request.getQuiz() != null) {
            Quiz quiz = Quiz.builder()
                    .course(course)
                    .xpReward(request.getQuiz().getXpReward() == null ? 100 : request.getQuiz().getXpReward())
                    .build();
            quiz = quizRepository.save(quiz);

            if (request.getQuiz().getQuestions() != null) {
                for (CourseCreateRequest.QuestionCreateDto qDto : request.getQuiz().getQuestions()) {
                    QuizQuestion question = QuizQuestion.builder()
                            .questionText(qDto.getQuestionText())
                            .quiz(quiz)
                            .build();
                    question = quizQuestionRepository.save(question);

                    if (qDto.getOptions() != null) {
                        for (CourseCreateRequest.OptionCreateDto oDto : qDto.getOptions()) {
                            QuizOption option = QuizOption.builder()
                                    .optionText(oDto.getOptionText())
                                    .isCorrect(oDto.isCorrect())
                                    .question(question)
                                    .build();
                            quizOptionRepository.save(option);
                        }
                    }
                }
            }
        }
    }

    public Map<String, Object> getQuizForEdit(Long courseId) {
        Quiz quiz = quizRepository.findByCourseId(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found for this course!"));

        List<QuizQuestion> questions = quizQuestionRepository.findByQuizId(quiz.getId());

        List<Map<String, Object>> questionList = new ArrayList<>();
        for (QuizQuestion q : questions) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("questionText", q.getQuestionText());

            List<Map<String, Object>> optionsList = new ArrayList<>();
            for (QuizOption opt : q.getOptions()) {
                Map<String, Object> oMap = new HashMap<>();
                oMap.put("id", opt.getId());
                oMap.put("optionText", opt.getOptionText());
                oMap.put("isCorrect", opt.isCorrect());
                optionsList.add(oMap);
            }
            qMap.put("options", optionsList);
            questionList.add(qMap);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", quiz.getId());
        response.put("courseId", courseId);
        response.put("xpReward", quiz.getXpReward());
        response.put("questions", questionList);
        return response;
    }

    @Transactional
    public void updateCourse(Long courseId, CourseCreateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found!"));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setDifficulty(request.getDifficulty());
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            course.setImageUrl(request.getImageUrl());
        }
        if (request.getBadgeReward() != null && !request.getBadgeReward().trim().isEmpty()) {
            course.setBadgeReward(request.getBadgeReward());
        }
        courseRepository.save(course);

        // Update lessons in place to avoid foreign key constraints
        List<Lesson> existingLessons = lessonRepository.findByCourseIdOrderBySequenceAsc(courseId);
        List<CourseCreateRequest.LessonCreateDto> newLessons = request.getLessons();

        int n = newLessons != null ? newLessons.size() : 0;
        int m = existingLessons.size();

        for (int i = 0; i < Math.max(n, m); i++) {
            if (i < n && i < m) {
                // Update in place
                Lesson lesson = existingLessons.get(i);
                lesson.setTitle(newLessons.get(i).getTitle());
                lesson.setContent(newLessons.get(i).getContent());
                lesson.setSequence(i + 1);
                lessonRepository.save(lesson);
            } else if (i < n) {
                // Create new lesson
                Lesson lesson = Lesson.builder()
                        .title(newLessons.get(i).getTitle())
                        .content(newLessons.get(i).getContent())
                        .sequence(i + 1)
                        .course(course)
                        .build();
                lessonRepository.save(lesson);
            } else {
                // Delete extra lesson
                lessonRepository.delete(existingLessons.get(i));
            }
        }

        // Update Quiz
        if (request.getQuiz() != null) {
            Quiz quiz = quizRepository.findByCourseId(courseId)
                    .orElseGet(() -> quizRepository.save(Quiz.builder().course(course).xpReward(100).build()));
            
            if (request.getQuiz().getXpReward() != null) {
                quiz.setXpReward(request.getQuiz().getXpReward());
                quizRepository.save(quiz);
            }

            List<QuizQuestion> existingQuestions = quizQuestionRepository.findByQuizId(quiz.getId());
            List<CourseCreateRequest.QuestionCreateDto> newQuestions = request.getQuiz().getQuestions();

            int numNewQs = newQuestions != null ? newQuestions.size() : 0;
            int numExistingQs = existingQuestions.size();

            for (int i = 0; i < Math.max(numNewQs, numExistingQs); i++) {
                if (i < numNewQs && i < numExistingQs) {
                    // Update question in place
                    QuizQuestion question = existingQuestions.get(i);
                    question.setQuestionText(newQuestions.get(i).getQuestionText());
                    quizQuestionRepository.save(question);

                    // Update options
                    updateQuizOptions(question, newQuestions.get(i).getOptions());
                } else if (i < numNewQs) {
                    // Create new question
                    QuizQuestion question = QuizQuestion.builder()
                            .questionText(newQuestions.get(i).getQuestionText())
                            .quiz(quiz)
                            .build();
                    question = quizQuestionRepository.save(question);

                    // Create new options
                    if (newQuestions.get(i).getOptions() != null) {
                        for (CourseCreateRequest.OptionCreateDto oDto : newQuestions.get(i).getOptions()) {
                            QuizOption option = QuizOption.builder()
                                    .optionText(oDto.getOptionText())
                                    .isCorrect(oDto.isCorrect())
                                    .question(question)
                                    .build();
                            quizOptionRepository.save(option);
                        }
                    }
                } else {
                    // Delete extra question (which cascades to options)
                    quizQuestionRepository.delete(existingQuestions.get(i));
                }
            }
        }
    }

    private void updateQuizOptions(QuizQuestion question, List<CourseCreateRequest.OptionCreateDto> newOptions) {
        List<QuizOption> existingOptions = question.getOptions();
        int p = newOptions != null ? newOptions.size() : 0;
        int q = existingOptions != null ? existingOptions.size() : 0;

        for (int j = 0; j < Math.max(p, q); j++) {
            if (j < p && j < q) {
                // Update option in place
                QuizOption option = existingOptions.get(j);
                option.setOptionText(newOptions.get(j).getOptionText());
                option.setCorrect(newOptions.get(j).isCorrect());
                quizOptionRepository.save(option);
            } else if (j < p) {
                // Create new option
                QuizOption option = QuizOption.builder()
                        .optionText(newOptions.get(j).getOptionText())
                        .isCorrect(newOptions.get(j).isCorrect())
                        .question(question)
                        .build();
                quizOptionRepository.save(option);
            } else {
                // Delete extra option
                quizOptionRepository.delete(existingOptions.get(j));
            }
        }
    }
}
