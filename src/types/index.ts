export type AppType = 'wheel' | 'quiz' | 'station' | 'flashcard' | 'exit_ticket' | 'rubric';

export interface Student {
  id: string;
  name: string;
  group?: string;
  hasBeenCalled?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FlashcardItem {
  id: number;
  front: string;
  back: string;
  hint?: string;
  category?: string;
}

export interface StationItem {
  id: number;
  name: string;
  durationMinutes: number;
  task: string;
  product: string;
}

export interface RubricCriterion {
  criterion: string;
  level1: string; // Cần cố gắng (1-2đ)
  level2: string; // Đạt (3-5đ)
  level3: string; // Khá (6-8đ)
  level4: string; // Xuất sắc (9-10đ)
}

export interface ConnectedApp {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  type: AppType;
  pedagogyMethod: string;
  tags: string[];
  isCustom?: boolean;
  createdAt: string;
  // Specific data payloads
  students?: Student[];
  quizQuestions?: QuizQuestion[];
  flashcards?: FlashcardItem[];
  stations?: StationItem[];
  rubricCriteria?: RubricCriterion[];
  exitTicketQuestions?: string[];
  teacherGuide?: string;
}

export interface PedagogyMethodInfo {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  keySteps: string[];
  benefits: string[];
  recommendedApps: AppType[];
  exampleTopic: string;
  iconName: string;
}

export interface LessonPlanActivity {
  phase: string;
  goal: string;
  content: string;
  product: string;
  implementation: string;
}

export interface LessonPlan {
  id: string;
  lessonTitle: string;
  subject: string;
  gradeLevel: string;
  timeAllocation: string;
  pedagogyMethod: string;
  objectives: {
    competencies: string[];
    qualities: string[];
  };
  digitalTools: { name: string; role: string }[];
  activities: LessonPlanActivity[];
  differentiation?: string;
  assessmentRubricSummary?: string;
  linkedAppId?: string;
}
