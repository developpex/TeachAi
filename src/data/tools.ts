import { Tool } from '../types';

export const allTools: Tool[] = [
  {
    id: 'rCdMOw9hbAOEl5eoZUyc',
    name: 'Lesson Plan Generator',
    navigation: 'ai-lesson-planner',
    description:
      'Create comprehensive lesson plans in minutes using AI assistance.',
    icon: 'BookOpen',
    category: 'free',
    toolCategory: 'lesson-planning',
    fields: [
      {
        label: 'Subject',
        placeholder: 'e.g., Mathematics',
        type: 'input',
      },
      {
        label: 'Grade Level',
        placeholder: 'Select grade level',
        type: 'select',
        options: [
          'Kindergarten',
          '1st Grade',
          '2nd Grade',
          '3rd Grade',
          '4th Grade',
          '5th Grade',
          '6th Grade',
          '7th Grade',
          '8th Grade',
          '9th Grade',
          '10th Grade',
          '11th Grade',
          '12th Grade',
        ],
      },
      {
        label: 'Topic',
        placeholder: 'e.g., Fractions',
        type: 'input',
      },
      {
        label: 'Learning Objectives',
        placeholder: 'Enter the learning objectives for this lesson...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'kLmNPq8rsTuVwXyZ1234',
    name: 'Parent Communication Assistant',
    navigation: 'ai-parent-communication',
    description:
      'Generate professional updates and reports for parent communication.',
    icon: 'Mail',
    category: 'plus',
    toolCategory: 'administrative',
    fields: [
      {
        label: 'Student Name',
        placeholder: 'e.g., Emma Thompson',
        type: 'input',
      },
      {
        label: 'Report Type',
        placeholder: 'Select report type',
        type: 'select',
        options: [
          'Progress Update',
          'Behavior Report',
          'Achievement Report',
          'Concerns',
          'General Update',
        ],
      },
      {
        label: 'Time Period',
        placeholder: 'e.g., March 2024',
        type: 'input',
      },
      {
        label: 'Message Content',
        placeholder: 'Enter the details you want to communicate...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'aBcDeF5gHiJkLmN6pQr',
    name: 'Classroom Management Assistant',
    navigation: 'ai-classroom-management',
    description: 'Streamline administrative tasks and schedule management.',
    icon: 'Calendar',
    category: 'free',
    toolCategory: 'administrative',
    fields: [
      {
        label: 'Class Name',
        placeholder: 'e.g., Grade 7 Science',
        type: 'input',
      },
      {
        label: 'Task Type',
        placeholder: 'Select task type',
        type: 'select',
        options: [
          'Attendance',
          'Schedule Planning',
          'Resource Management',
          'Event Planning',
          'Task Assignment',
        ],
      },
      {
        label: 'Date Range',
        placeholder: 'Select time period',
        type: 'select',
        options: ['Today', 'This Week', 'This Month', 'Custom Period'],
      },
      {
        label: 'Additional Details',
        placeholder: 'Enter any specific requirements or notes...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'xYz7WvUt8sRqPoNmLkJ',
    name: 'Gamification Tools',
    navigation: 'ai-gamification',
    description:
      'Create educational games and reward systems to boost engagement.',
    icon: 'Trophy',
    category: 'plus',
    toolCategory: 'student-centered',
    fields: [
      {
        label: 'Activity Type',
        placeholder: 'Select activity type',
        type: 'select',
        options: [
          'Quiz Game',
          'Points System',
          'Achievement Badges',
          'Learning Challenge',
          'Team Competition',
        ],
      },
      {
        label: 'Subject',
        placeholder: 'e.g., Geography',
        type: 'input',
      },
      {
        label: 'Grade Level',
        placeholder: 'Select grade level',
        type: 'select',
        options: ['Elementary', 'Middle School', 'High School'],
      },
      {
        label: 'Game Rules',
        placeholder: 'Describe the game rules and reward system...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'hGfDsA9kLpMnBvCxZq',
    name: 'Pronunciation Coach',
    navigation: 'ai-pronounciation-coach',
    description:
      'Provide instant feedback on language pronunciation and phonetics.',
    icon: 'Mic',
    category: 'plus',
    toolCategory: 'subject-specific',
    fields: [
      {
        label: 'Language',
        placeholder: 'Select language',
        type: 'select',
        options: [
          'English',
          'Spanish',
          'French',
          'German',
          'Mandarin',
          'Japanese',
        ],
      },
      {
        label: 'Level',
        placeholder: 'Select proficiency level',
        type: 'select',
        options: ['Beginner', 'Intermediate', 'Advanced'],
      },
      {
        label: 'Focus Area',
        placeholder: 'Select focus area',
        type: 'select',
        options: [
          'Vowel Sounds',
          'Consonants',
          'Word Stress',
          'Intonation',
          'Connected Speech',
        ],
      },
      {
        label: 'Practice Text',
        placeholder: 'Enter the text for pronunciation practice...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'jKlMnO5pQrStUvWxYz',
    name: 'Special Needs Support',
    navigation: 'ai-special-needs-support',
    description:
      'Customize learning materials for students with special educational needs.',
    icon: 'Heart',
    category: 'plus',
    toolCategory: 'student-centered',
    fields: [
      {
        label: 'Student Name',
        placeholder: 'Enter student name',
        type: 'input',
      },
      {
        label: 'Accommodation Type',
        placeholder: 'Select accommodation type',
        type: 'select',
        options: [
          'Visual Aid',
          'Audio Support',
          'Extended Time',
          'Modified Content',
          'Assistive Technology',
        ],
      },
      {
        label: 'Subject Area',
        placeholder: 'e.g., Reading',
        type: 'input',
      },
      {
        label: 'Specific Needs',
        placeholder:
          'Describe the specific learning needs and accommodations required...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'qWeRtY6uIoPaSdFgHj',
    name: 'Virtual Teaching Assistant',
    navigation: 'ai-virtual-teaching',
    description:
      'AI-powered assistant for answering student questions and providing explanations.',
    icon: 'Bot',
    category: 'plus',
    toolCategory: 'student-centered',
    fields: [
      {
        label: 'Subject Area',
        placeholder: 'e.g., Physics',
        type: 'input',
      },
      {
        label: 'Topic',
        placeholder: "e.g., Newton's Laws",
        type: 'input',
      },
      {
        label: 'Question Type',
        placeholder: 'Select question type',
        type: 'select',
        options: [
          'Concept Explanation',
          'Problem Solving',
          'Homework Help',
          'Study Tips',
          'Review',
        ],
      },
      {
        label: 'Student Question',
        placeholder: 'Enter the student question or topic to explain...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'mNbVcX8zLkJhGfDsA9',
    name: 'Assessment Builder',
    navigation: 'ai-assesment-builder',
    description:
      'Create comprehensive assessments with various question types and automated grading.',
    icon: 'ClipboardCheck',
    category: 'plus',
    toolCategory: 'lesson-planning',
    fields: [
      {
        label: 'Assessment Type',
        placeholder: 'Select assessment type',
        type: 'select',
        options: [
          'Quiz',
          'Test',
          'Final Exam',
          'Project Rubric',
          'Performance Task',
        ],
      },
      {
        label: 'Subject',
        placeholder: 'e.g., Biology',
        type: 'input',
      },
      {
        label: 'Grade Level',
        placeholder: 'Select grade level',
        type: 'select',
        options: [
          'Elementary',
          'Middle School',
          'High School',
          'Advanced Placement',
        ],
      },
      {
        label: 'Topics Covered',
        placeholder: 'Enter the topics to be assessed...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'pQrStU7vWxYzAbCdEf',
    name: 'Vocabulary Builder',
    navigation: 'ai-vocabulary-builder',
    description:
      'Generate customized vocabulary lists and interactive learning activities.',
    icon: 'BookText',
    category: 'free',
    toolCategory: 'subject-specific',
    fields: [
      {
        label: 'Subject Area',
        placeholder: 'e.g., Literature, Science, Social Studies',
        type: 'input',
      },
      {
        label: 'Difficulty Level',
        placeholder: 'Select difficulty level',
        type: 'select',
        options: ['Basic', 'Intermediate', 'Advanced', 'Academic'],
      },
      {
        label: 'Number of Words',
        placeholder: 'e.g., 10, 15, 20',
        type: 'input',
      },
      {
        label: 'Context',
        placeholder: 'Provide context or specific text source...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'gHiJkL4mNoPqRsTuVw',
    name: 'Lab Report Generator',
    navigation: 'ai-lab-report-generator',
    description:
      'Create detailed science lab reports with proper formatting and sections.',
    icon: 'TestTube',
    category: 'plus',
    toolCategory: 'subject-specific',
    fields: [
      {
        label: 'Science Subject',
        placeholder: 'Select subject',
        type: 'select',
        options: ['Biology', 'Chemistry', 'Physics', 'Environmental Science'],
      },
      {
        label: 'Experiment Title',
        placeholder: 'e.g., Photosynthesis Rate in Plants',
        type: 'input',
      },
      {
        label: 'Hypothesis',
        placeholder: 'Enter the experiment hypothesis...',
        type: 'textarea',
      },
      {
        label: 'Data Collection',
        placeholder: 'Describe the data collected during the experiment...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'xYzAbC3dEfGhIjKlMn',
    name: 'Math Problem Generator',
    navigation: 'ai-math-problem-generator',
    description:
      'Generate customized math problems with step-by-step solutions.',
    icon: 'Calculator',
    category: 'plus',
    toolCategory: 'subject-specific',
    fields: [
      {
        label: 'Math Topic',
        placeholder: 'Select topic',
        type: 'select',
        options: [
          'Algebra',
          'Geometry',
          'Trigonometry',
          'Calculus',
          'Statistics',
        ],
      },
      {
        label: 'Difficulty',
        placeholder: 'Select difficulty level',
        type: 'select',
        options: ['Basic', 'Intermediate', 'Advanced', 'Challenge'],
      },
      {
        label: 'Number of Problems',
        placeholder: 'e.g., 5, 10, 15',
        type: 'input',
      },
      {
        label: 'Specific Concepts',
        placeholder: 'List specific concepts to focus on...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'oPqRsT2uVwXyZaBcDe',
    name: 'Writing Prompt Generator',
    navigation: 'ai-writing-prompt-generator',
    description:
      'Generate creative and engaging writing prompts for various genres and subjects.',
    icon: 'PenTool',
    category: 'free',
    toolCategory: 'lesson-planning',
    fields: [
      {
        label: 'Writing Type',
        placeholder: 'Select writing type',
        type: 'select',
        options: [
          'Narrative',
          'Expository',
          'Persuasive',
          'Descriptive',
          'Creative',
        ],
      },
      {
        label: 'Grade Level',
        placeholder: 'Select grade level',
        type: 'select',
        options: ['Elementary', 'Middle School', 'High School', 'Advanced'],
      },
      {
        label: 'Theme',
        placeholder: 'e.g., Adventure, Science Fiction, History',
        type: 'input',
      },
      {
        label: 'Additional Requirements',
        placeholder: 'Enter any specific requirements or focus areas...',
        type: 'textarea',
      },
    ],
  },
];
