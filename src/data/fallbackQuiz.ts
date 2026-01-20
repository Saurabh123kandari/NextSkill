import { ProcessedQuestion } from '@/types';

/**
 * Fallback quiz questions for offline/demo mode
 * These questions are used when the Open Trivia API is unavailable
 */
const fallbackQuestions: ProcessedQuestion[] = [
  {
    id: 'fallback-1',
    question: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    correctAnswer: 'Paris',
    category: 'Geography',
    difficulty: 'easy',
  },
  {
    id: 'fallback-2',
    question: 'Which planet is known as the Red Planet?',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    category: 'Science & Nature',
    difficulty: 'easy',
  },
  {
    id: 'fallback-3',
    question: 'What is the largest mammal in the world?',
    options: ['Blue Whale', 'African Elephant', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 'Blue Whale',
    category: 'Animals',
    difficulty: 'easy',
  },
  {
    id: 'fallback-4',
    question: 'In what year did World War II end?',
    options: ['1945', '1944', '1946', '1943'],
    correctAnswer: '1945',
    category: 'History',
    difficulty: 'easy',
  },
  {
    id: 'fallback-5',
    question: 'What programming language is primarily used for iOS app development?',
    options: ['Swift', 'Java', 'Python', 'C#'],
    correctAnswer: 'Swift',
    category: 'Science: Computers',
    difficulty: 'medium',
  },
  {
    id: 'fallback-6',
    question: 'What is the chemical symbol for gold?',
    options: ['Au', 'Ag', 'Fe', 'Cu'],
    correctAnswer: 'Au',
    category: 'Science & Nature',
    difficulty: 'easy',
  },
  {
    id: 'fallback-7',
    question: 'Which country hosted the 2016 Summer Olympics?',
    options: ['Brazil', 'China', 'United Kingdom', 'Japan'],
    correctAnswer: 'Brazil',
    category: 'Sports',
    difficulty: 'medium',
  },
  {
    id: 'fallback-8',
    question: 'What is the largest ocean on Earth?',
    options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
    correctAnswer: 'Pacific Ocean',
    category: 'Geography',
    difficulty: 'easy',
  },
  {
    id: 'fallback-9',
    question: 'Who painted the Mona Lisa?',
    options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Vincent van Gogh'],
    correctAnswer: 'Leonardo da Vinci',
    category: 'Art',
    difficulty: 'easy',
  },
  {
    id: 'fallback-10',
    question: 'What is the smallest prime number?',
    options: ['2', '1', '0', '3'],
    correctAnswer: '2',
    category: 'Science: Mathematics',
    difficulty: 'easy',
  },
  {
    id: 'fallback-11',
    question: 'Which element has the atomic number 1?',
    options: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'],
    correctAnswer: 'Hydrogen',
    category: 'Science & Nature',
    difficulty: 'easy',
  },
  {
    id: 'fallback-12',
    question: 'What is the currency of Japan?',
    options: ['Yen', 'Won', 'Yuan', 'Ringgit'],
    correctAnswer: 'Yen',
    category: 'General Knowledge',
    difficulty: 'easy',
  },
  {
    id: 'fallback-13',
    question: 'Which company developed the React Native framework?',
    options: ['Facebook (Meta)', 'Google', 'Microsoft', 'Apple'],
    correctAnswer: 'Facebook (Meta)',
    category: 'Science: Computers',
    difficulty: 'medium',
  },
  {
    id: 'fallback-14',
    question: 'What year was the first iPhone released?',
    options: ['2007', '2006', '2008', '2005'],
    correctAnswer: '2007',
    category: 'Science: Computers',
    difficulty: 'medium',
  },
  {
    id: 'fallback-15',
    question: 'What is the speed of light in a vacuum (approximately)?',
    options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'],
    correctAnswer: '300,000 km/s',
    category: 'Science & Nature',
    difficulty: 'medium',
  },
  {
    id: 'fallback-16',
    question: 'Which planet has the most moons?',
    options: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'],
    correctAnswer: 'Saturn',
    category: 'Science & Nature',
    difficulty: 'hard',
  },
  {
    id: 'fallback-17',
    question: 'What does "HTTP" stand for?',
    options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transmission Protocol', 'High Text Transfer Protocol'],
    correctAnswer: 'HyperText Transfer Protocol',
    category: 'Science: Computers',
    difficulty: 'easy',
  },
  {
    id: 'fallback-18',
    question: 'Which instrument has 88 keys?',
    options: ['Piano', 'Organ', 'Accordion', 'Harpsichord'],
    correctAnswer: 'Piano',
    category: 'Entertainment: Music',
    difficulty: 'easy',
  },
  {
    id: 'fallback-19',
    question: 'What is the largest desert in the world?',
    options: ['Antarctica', 'Sahara', 'Arabian', 'Gobi'],
    correctAnswer: 'Antarctica',
    category: 'Geography',
    difficulty: 'hard',
  },
  {
    id: 'fallback-20',
    question: 'In which year did the Berlin Wall fall?',
    options: ['1989', '1991', '1987', '1990'],
    correctAnswer: '1989',
    category: 'History',
    difficulty: 'medium',
  },
  {
    id: 'fallback-21',
    question: 'What is the main ingredient in guacamole?',
    options: ['Avocado', 'Tomato', 'Onion', 'Lime'],
    correctAnswer: 'Avocado',
    category: 'General Knowledge',
    difficulty: 'easy',
  },
  {
    id: 'fallback-22',
    question: 'Which programming language was created by Brendan Eich?',
    options: ['JavaScript', 'Python', 'Java', 'C++'],
    correctAnswer: 'JavaScript',
    category: 'Science: Computers',
    difficulty: 'medium',
  },
  {
    id: 'fallback-23',
    question: 'What is the capital of Australia?',
    options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'],
    correctAnswer: 'Canberra',
    category: 'Geography',
    difficulty: 'medium',
  },
  {
    id: 'fallback-24',
    question: 'How many bones are in the adult human body?',
    options: ['206', '208', '204', '212'],
    correctAnswer: '206',
    category: 'Science & Nature',
    difficulty: 'medium',
  },
  {
    id: 'fallback-25',
    question: 'Which gas do plants absorb from the atmosphere?',
    options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 'Carbon Dioxide',
    category: 'Science & Nature',
    difficulty: 'easy',
  },
];

/**
 * Fisher-Yates shuffle algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Gets a specified number of random fallback questions
 * @param amount Number of questions to return (default: 10)
 * @returns Array of shuffled ProcessedQuestion objects
 */
export const getFallbackQuestions = (amount: number = 10): ProcessedQuestion[] => {
  const shuffled = shuffleArray(fallbackQuestions);
  const selected = shuffled.slice(0, Math.min(amount, fallbackQuestions.length));
  
  // Also shuffle the options for each question
  return selected.map(q => ({
    ...q,
    id: `${q.id}-${Date.now()}`, // Make ID unique for each session
    options: shuffleArray(q.options),
  }));
};

export default fallbackQuestions;
