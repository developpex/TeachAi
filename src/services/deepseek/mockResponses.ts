const lessonPlanResponses = [
  `Here's your lesson plan for today:

1. Learning Objectives:
   - Understand key concepts
   - Apply knowledge in practice
   - Develop critical thinking skills

2. Activities:
   - Opening discussion (10 mins)
   - Group work (20 mins)
   - Individual practice (15 mins)
   - Class presentation (15 mins)

3. Assessment:
   - Group participation
   - Individual worksheets
   - Exit tickets`,
  `Lesson Plan: Introduction to [Topic]

Duration: 50 minutes

Objectives:
- Students will be able to identify main concepts
- Students will demonstrate understanding through practice
- Students will collaborate with peers

Materials Needed:
- Worksheets
- Digital presentation
- Activity supplies

Assessment Strategy:
- Formative assessment through Q&A
- Group project evaluation
- Individual reflection`
];

const parentCommunicationResponses = [
  `Dear Parent/Guardian,

I wanted to update you on [Student]'s progress in class. They have shown excellent participation and engagement with our recent topics. Their homework completion has been consistent, and they actively contribute to class discussions.

Areas of strength:
- Critical thinking
- Collaboration with peers
- Assignment completion

Areas for growth:
- Time management
- Detailed explanations

Please feel free to reach out if you have any questions.

Best regards,
[Teacher Name]`,
  `Progress Update

Student: [Name]
Period: [Number]
Subject: [Subject]

Achievements:
- Completed all assignments on time
- Showed improvement in group work
- Demonstrated leadership qualities

Recommendations:
- Continue practicing at home
- Participate more in class discussions
- Review feedback on assignments

Please contact me if you would like to discuss further.`
];

const classroomManagementResponses = [
  `Classroom Management Plan:

1. Daily Schedule:
   - Morning routine
   - Core subjects
   - Specials/Electives
   - Breaks and transitions

2. Behavior Management:
   - Positive reinforcement system
   - Clear expectations
   - Consistent consequences

3. Communication Strategy:
   - Daily updates
   - Weekly newsletters
   - Parent conferences`,
  `Classroom Organization:

Physical Layout:
- Flexible seating options
- Learning centers
- Technology station
- Reading corner

Materials Management:
- Supply stations
- Assignment collection system
- Digital resource access

Schedule:
- Posted daily agenda
- Transition signals
- Emergency procedures`
];

export function getRandomResponse(prompt: string): string {
  // Convert prompt to lowercase for easier matching
  const promptLower = prompt.toLowerCase();
  
  // Select response array based on prompt content
  let responses;
  if (promptLower.includes('lesson') || promptLower.includes('teaching')) {
    responses = lessonPlanResponses;
  } else if (promptLower.includes('parent') || promptLower.includes('communication')) {
    responses = parentCommunicationResponses;
  } else {
    responses = classroomManagementResponses;
  }

  // Return a random response from the selected array
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}