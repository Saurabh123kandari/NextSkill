import {
  OpenTriviaQuestion,
  OpenTriviaResponse,
  OpenTriviaCategory,
  OpenTriviaCategoryResponse,
  ProcessedQuestion,
  QuizParams,
} from '@/types';
import { getFallbackQuestions } from '@/data/fallbackQuiz';

const OPEN_TRIVIA_BASE_URL = 'https://opentdb.com';

/**
 * Decodes HTML entities from Open Trivia DB responses
 */
export const decodeHTMLEntities = (text: string): string => {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&eacute;/g, 'é')
    .replace(/&Eacute;/g, 'É')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&uuml;/g, 'ü')
    .replace(/&deg;/g, '°')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&copy;/g, '©');
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Shuffles answer options, placing correct answer randomly among incorrect ones
 */
export const shuffleAnswers = (
  correctAnswer: string,
  incorrectAnswers: string[]
): string[] => {
  const allAnswers = [correctAnswer, ...incorrectAnswers];
  return shuffleArray(allAnswers);
};

/**
 * Processes raw Open Trivia questions into our app format
 */
export const processQuestions = (
  rawQuestions: OpenTriviaQuestion[]
): ProcessedQuestion[] => {
  return rawQuestions.map((q, index) => ({
    id: `question-${index}-${Date.now()}`,
    question: decodeHTMLEntities(q.question),
    options: shuffleAnswers(
      decodeHTMLEntities(q.correct_answer),
      q.incorrect_answers.map(decodeHTMLEntities)
    ),
    correctAnswer: decodeHTMLEntities(q.correct_answer),
    category: decodeHTMLEntities(q.category),
    difficulty: q.difficulty,
  }));
};

/**
 * Fetches quiz categories from Open Trivia DB
 */
export const fetchCategories = async (): Promise<OpenTriviaCategory[]> => {
  try {
    const response = await fetch(`${OPEN_TRIVIA_BASE_URL}/api_category.php`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: OpenTriviaCategoryResponse = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return some default categories as fallback
    return [
      { id: 9, name: 'General Knowledge' },
      { id: 17, name: 'Science & Nature' },
      { id: 18, name: 'Science: Computers' },
      { id: 21, name: 'Sports' },
      { id: 22, name: 'Geography' },
      { id: 23, name: 'History' },
      { id: 27, name: 'Animals' },
    ];
  }
};

/**
 * Fetches quiz questions from Open Trivia DB
 */
export const fetchQuizQuestions = async (
  params: QuizParams
): Promise<ProcessedQuestion[]> => {
  const { amount = 10, category, difficulty } = params;

  try {
    // Build URL with query parameters
    const url = new URL(`${OPEN_TRIVIA_BASE_URL}/api.php`);
    url.searchParams.append('amount', amount.toString());
    url.searchParams.append('type', 'multiple'); // Always multiple choice
    
    if (category) {
      url.searchParams.append('category', category.toString());
    }
    if (difficulty) {
      url.searchParams.append('difficulty', difficulty);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data: OpenTriviaResponse = await response.json();

    // Handle Open Trivia DB response codes
    // 0: Success
    // 1: No Results
    // 2: Invalid Parameter
    // 3: Token Not Found
    // 4: Token Empty
    if (data.response_code !== 0) {
      console.warn('Open Trivia API returned code:', data.response_code);
      if (data.results.length === 0) {
        throw new Error('No questions available for this category/difficulty');
      }
    }

    const processedQuestions = processQuestions(data.results);
    
    if (processedQuestions.length === 0) {
      throw new Error('No questions received');
    }

    return processedQuestions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    // Return fallback questions on error
    console.log('Using fallback questions');
    return getFallbackQuestions(amount);
  }
};

/**
 * Generates a unique quiz result ID
 */
export const generateQuizResultId = (): string => {
  return `quiz-result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates quiz score percentage
 */
export const calculatePercentage = (score: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

/**
 * Determines if quiz passed based on score
 */
export const isQuizPassed = (percentage: number, passingScore: number = 70): boolean => {
  return percentage >= passingScore;
};

export default {
  fetchCategories,
  fetchQuizQuestions,
  decodeHTMLEntities,
  shuffleAnswers,
  processQuestions,
  generateQuizResultId,
  calculatePercentage,
  isQuizPassed,
};
