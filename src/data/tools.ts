import { Tool } from '../types';

export const allTools: Tool[] = [
  {
    id: '1',
    name: 'Lesson Plan Generator',
    description: 'Create comprehensive lesson plans in minutes using AI assistance.',
    icon: 'BookOpen',
    category: 'free',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Subject', placeholder: 'e.g., Mathematics' },
      { label: 'Grade Level', placeholder: 'e.g., 6th Grade' },
      { label: 'Topic', placeholder: 'e.g., Fractions' }
    ]
  },
  {
    id: '2',
    name: 'Grading Assistant',
    description: 'Automates grading of quizzes, assignments, and exams with detailed feedback.',
    icon: 'CheckSquare',
    category: 'plus',
    toolCategory: 'administrative',
    fields: [
      { label: 'Assignment Type', placeholder: 'e.g., Quiz, Essay, Exam' },
      { label: 'Subject', placeholder: 'e.g., English Literature' },
      { label: 'Grading Criteria', placeholder: 'e.g., Grammar, Content, Structure' }
    ]
  },
  {
    id: '3',
    name: 'Curriculum Designer',
    description: 'Plan and organize curriculums aligned with educational frameworks.',
    icon: 'Layout',
    category: 'plus',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Educational Framework', placeholder: 'e.g., Common Core, IB' },
      { label: 'Grade Level', placeholder: 'e.g., High School' },
      { label: 'Subject Area', placeholder: 'e.g., Science' },
      { label: 'Duration', placeholder: 'e.g., Semester, Year' }
    ]
  },
  {
    id: '4',
    name: 'Student Progress Tracker',
    description: 'Analyze student performance and generate personalized action plans.',
    icon: 'LineChart',
    category: 'plus',
    toolCategory: 'administrative',
    fields: [
      { label: 'Student Name/ID', placeholder: 'e.g., John Smith' },
      { label: 'Subject', placeholder: 'e.g., Mathematics' },
      { label: 'Time Period', placeholder: 'e.g., Q1 2024' }
    ]
  },
  {
    id: '5',
    name: 'Interactive Quiz Generator',
    description: 'Create engaging quizzes with various question formats and automated grading.',
    icon: 'HelpCircle',
    category: 'free',
    toolCategory: 'student-centered',
    fields: [
      { label: 'Quiz Type', placeholder: 'e.g., Multiple Choice, Fill-in-blanks' },
      { label: 'Topic', placeholder: 'e.g., World War II' },
      { label: 'Difficulty Level', placeholder: 'e.g., Intermediate' },
      { label: 'Number of questions', placeholder: 'e.g., 5' }
    ]
  },
  {
    id: '6',
    name: 'Classroom Engagement Analytics',
    description: 'Track participation and analyze student engagement patterns.',
    icon: 'BarChart2',
    category: 'plus',
    toolCategory: 'administrative',
    fields: [
      { label: 'Class Name', placeholder: 'e.g., Biology 101' },
      { label: 'Time Period', placeholder: 'e.g., Last Week' },
      { label: 'Metrics', placeholder: 'e.g., Participation, Attention' }
    ]
  },
  {
    id: '7',
    name: 'Adaptive Learning Pathways',
    description: 'Create personalized learning paths that adapt to student progress.',
    icon: 'GitBranch',
    category: 'plus',
    toolCategory: 'student-centered',
    fields: [
      { label: 'Student Level', placeholder: 'e.g., Beginner' },
      { label: 'Subject', placeholder: 'e.g., Algebra' },
      { label: 'Learning Goals', placeholder: 'e.g., Master quadratic equations' }
    ]
  },
  {
    id: '8',
    name: 'Question Bank Creator',
    description: 'Generate comprehensive question banks for various subjects and difficulty levels.',
    icon: 'Database',
    category: 'free',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Subject', placeholder: 'e.g., Chemistry' },
      { label: 'Topic', placeholder: 'e.g., Periodic Table' },
      { label: 'Difficulty Range', placeholder: 'e.g., Easy to Medium' }
    ]
  },
  {
    id: '9',
    name: 'Classroom Presentation Builder',
    description: 'Create engaging slide decks with relevant visuals and key points.',
    icon: 'Presentation',
    category: 'free',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Topic', placeholder: 'e.g., Solar System' },
      { label: 'Grade Level', placeholder: 'e.g., 5th Grade' },
      { label: 'Duration', placeholder: 'e.g., 45 minutes' }
    ]
  },
  {
    id: '10',
    name: 'Parent Communication Assistant',
    description: 'Generate professional updates and reports for parent communication.',
    icon: 'Mail',
    category: 'plus',
    toolCategory: 'administrative',
    fields: [
      { label: 'Student Name', placeholder: 'e.g., Emma Thompson' },
      { label: 'Report Type', placeholder: 'e.g., Progress Update' },
      { label: 'Time Period', placeholder: 'e.g., March 2024' }
    ]
  },
  {
    id: '11',
    name: 'Classroom Management Assistant',
    description: 'Streamline administrative tasks and schedule management.',
    icon: 'Calendar',
    category: 'free',
    toolCategory: 'administrative',
    fields: [
      { label: 'Class Name', placeholder: 'e.g., Grade 7 Science' },
      { label: 'Task Type', placeholder: 'e.g., Attendance, Schedule' },
      { label: 'Date Range', placeholder: 'e.g., This Week' }
    ]
  },
  {
    id: '12',
    name: 'Gamification Tools',
    description: 'Create educational games and reward systems to boost engagement.',
    icon: 'Trophy',
    category: 'plus',
    toolCategory: 'student-centered',
    fields: [
      { label: 'Activity Type', placeholder: 'e.g., Quiz Game' },
      { label: 'Subject', placeholder: 'e.g., Geography' },
      { label: 'Reward System', placeholder: 'e.g., Points, Badges' }
    ]
  },
  {
    id: '13',
    name: 'Pronunciation Coach',
    description: 'Provide instant feedback on language pronunciation and phonetics.',
    icon: 'Mic',
    category: 'plus',
    toolCategory: 'subject-specific',
    fields: [
      { label: 'Language', placeholder: 'e.g., Spanish' },
      { label: 'Level', placeholder: 'e.g., Beginner' },
      { label: 'Focus Area', placeholder: 'e.g., Vowel Sounds' }
    ]
  },
  {
    id: '14',
    name: 'Special Needs Support',
    description: 'Customize learning materials for students with special educational needs.',
    icon: 'Heart',
    category: 'plus',
    toolCategory: 'student-centered',
    fields: [
      { label: 'Accommodation Type', placeholder: 'e.g., Visual Aid' },
      { label: 'Subject', placeholder: 'e.g., Reading' },
      { label: 'Special Need', placeholder: 'e.g., Dyslexia' }
    ]
  },
  {
    id: '15',
    name: 'Plagiarism Checker',
    description: 'Analyze student submissions for originality and proper citations.',
    icon: 'Search',
    category: 'plus',
    toolCategory: 'administrative',
    fields: [
      { label: 'Document Type', placeholder: 'e.g., Essay' },
      { label: 'Subject', placeholder: 'e.g., History' },
      { label: 'Citation Style', placeholder: 'e.g., APA, MLA' }
    ]
  },
  {
    id: '16',
    name: 'Virtual Teaching Assistant',
    description: 'AI-powered assistant for answering student questions and providing explanations.',
    icon: 'Bot',
    category: 'enterprise',
    toolCategory: 'student-centered',
    fields: [
      { label: 'Subject Area', placeholder: 'e.g., Physics' },
      { label: 'Grade Level', placeholder: 'e.g., High School' },
      { label: 'Topic', placeholder: 'e.g., Newton\'s Laws' }
    ]
  },
  // New tools with their categories
  {
    id: '17',
    name: 'Differentiation Wizard',
    description: 'Create differentiated learning materials for diverse student needs.',
    icon: 'SplitSquareVertical',
    category: 'plus',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Subject', placeholder: 'e.g., English Literature' },
      { label: 'Learning Levels', placeholder: 'e.g., Basic, Intermediate, Advanced' }
    ]
  },
  {
    id: '18',
    name: 'Rubric Builder',
    description: 'Design comprehensive assessment rubrics with clear criteria.',
    icon: 'TableProperties',
    category: 'free',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Assignment Type', placeholder: 'e.g., Essay, Project' },
      { label: 'Criteria Categories', placeholder: 'e.g., Content, Organization' }
    ]
  },
  {
    id: '19',
    name: 'Study Guide Generator',
    description: 'Create comprehensive study guides and review materials.',
    icon: 'Notebook',
    category: 'free',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Subject', placeholder: 'e.g., Biology' },
      { label: 'Topic', placeholder: 'e.g., Cell Structure' }
    ]
  },
  {
    id: '20',
    name: 'Project Planner',
    description: 'Plan and organize student projects with timelines and milestones.',
    icon: 'Gantt',
    category: 'plus',
    toolCategory: 'lesson-planning',
    fields: [
      { label: 'Project Type', placeholder: 'e.g., Research Project' },
      { label: 'Duration', placeholder: 'e.g., 4 weeks' }
    ]
  }
];