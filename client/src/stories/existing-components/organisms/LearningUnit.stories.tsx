import type { Meta, StoryObj } from '@storybook/react';
import LearningUnit from '../../../components/learning/LearningUnit';
import { ClientLearningUnit, ClientLesson, LessonStatus, LessonType } from '../../../types/LearningPath';
import ThemeProvider from '../../../ThemeProvider';
import { MemoryRouter } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';

/**
 * LearningUnit represents a collection of related lessons with a visual path connector.
 * 
 * **Key Features:**
 * - Glass card design with visual lesson path
 * - Connected lesson nodes with progression lines
 * - CEFR level integration
 * - Responsive layout adaptation
 * - Optimized rendering with React.memo
 * - Progress tracking visualization
 */
const meta: Meta<typeof LearningUnit> = {
  title: 'Existing Components/Organisms/LearningUnit',
  component: LearningUnit,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Learning unit container that groups related lessons with visual progression indicators and path connectors.'
      }
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <div style={{ width: '600px', padding: '20px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    unit: {
      control: 'object',
      description: 'Learning unit data with lessons and metadata'
    }
  }
};

export default meta;
type Story = StoryObj<typeof LearningUnit>;

// Helper function to create lesson data
const createLesson = (
  id: number, 
  title: string, 
  status: LessonStatus, 
  type: LessonType,
  estimatedTime: number = 15,
  description?: string
): ClientLesson => ({
  id,
  title,
  description,
  type,
  estimatedTime,
  orderIndex: id,
  status
});

// Helper function to create unit data
const createUnit = (
  id: number,
  title: string,
  description: string,
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
  lessons: ClientLesson[]
): ClientLearningUnit => ({
  id,
  title,
  description,
  level,
  orderIndex: id,
  lessons
});

/**
 * Beginner unit with mixed lesson statuses
 */
export const BeginnerUnit: Story = {
  args: {
    unit: createUnit(
      1,
      'French Basics - Getting Started',
      'Essential foundations for beginning French learners including greetings, alphabet, and basic vocabulary.',
      'A1',
      [
        createLesson(1, 'French Alphabet & Pronunciation', 'completed', 'pronunciation', 15),
        createLesson(2, 'Basic Greetings', 'completed', 'vocabulary', 12),
        createLesson(3, 'Numbers 1-20', 'in_progress', 'vocabulary', 18),
        createLesson(4, 'Personal Introductions', 'available', 'conversation', 20),
        createLesson(5, 'Days and Months', 'locked', 'vocabulary', 15)
      ]
    )
  }
};

/**
 * Intermediate grammar unit
 */
export const IntermediateGrammar: Story = {
  args: {
    unit: createUnit(
      2,
      'French Grammar Foundations',
      'Master essential French grammar concepts including verb conjugations and sentence structure.',
      'A2',
      [
        createLesson(6, 'Present Tense: Regular Verbs', 'completed', 'grammar', 25),
        createLesson(7, 'Être and Avoir', 'completed', 'grammar', 20),
        createLesson(8, 'Articles (le, la, les)', 'completed', 'grammar', 18),
        createLesson(9, 'Adjective Agreement', 'in_progress', 'grammar', 30),
        createLesson(10, 'Question Formation', 'available', 'grammar', 22),
        createLesson(11, 'Negation', 'available', 'grammar', 20),
        createLesson(12, 'Past Tense (Passé Composé)', 'locked', 'grammar', 35)
      ]
    )
  }
};

/**
 * Advanced conversation unit
 */
export const AdvancedConversation: Story = {
  args: {
    unit: createUnit(
      3,
      'Advanced French Conversations',
      'Develop fluency through complex conversational scenarios and cultural contexts.',
      'B2',
      [
        createLesson(13, 'Business French Meetings', 'available', 'conversation', 40),
        createLesson(14, 'Debating and Arguing Points', 'available', 'conversation', 35),
        createLesson(15, 'French Humor and Wordplay', 'locked', 'culture', 30),
        createLesson(16, 'Academic Discussions', 'locked', 'conversation', 45)
      ]
    )
  }
};

/**
 * Culture-focused unit
 */
export const CultureUnit: Story = {
  args: {
    unit: createUnit(
      4,
      'French Culture & Society',
      'Explore French culture, traditions, and social customs for deeper cultural understanding.',
      'B1',
      [
        createLesson(17, 'French Holidays & Celebrations', 'completed', 'culture', 25),
        createLesson(18, 'French Cuisine & Dining', 'completed', 'culture', 30),
        createLesson(19, 'Art & Literature Overview', 'in_progress', 'culture', 35),
        createLesson(20, 'French Regional Differences', 'available', 'culture', 28),
        createLesson(21, 'Modern French Society', 'locked', 'culture', 32)
      ]
    )
  }
};

/**
 * Pronunciation-focused unit
 */
export const PronunciationUnit: Story = {
  args: {
    unit: createUnit(
      5,
      'French Pronunciation Mastery',
      'Perfect your French accent with focused pronunciation training and phonetic exercises.',
      'A2',
      [
        createLesson(22, 'French R Sound', 'completed', 'pronunciation', 15),
        createLesson(23, 'Nasal Vowels', 'in_progress', 'pronunciation', 18),
        createLesson(24, 'Silent Letters', 'available', 'pronunciation', 12),
        createLesson(25, 'Liaison Rules', 'available', 'pronunciation', 20),
        createLesson(26, 'Stress and Rhythm', 'locked', 'pronunciation', 22)
      ]
    )
  }
};

/**
 * Mixed lesson types unit
 */
export const MixedTypesUnit: Story = {
  args: {
    unit: createUnit(
      6,
      'Comprehensive French Skills',
      'Integrated approach combining vocabulary, grammar, conversation, and culture for well-rounded learning.',
      'A2',
      [
        createLesson(27, 'Travel Vocabulary', 'completed', 'vocabulary', 20),
        createLesson(28, 'Past Tense in Context', 'completed', 'grammar', 25),
        createLesson(29, 'Booking a Hotel', 'in_progress', 'conversation', 18),
        createLesson(30, 'French Travel Culture', 'available', 'culture', 22),
        createLesson(31, 'Travel Pronunciation Tips', 'available', 'pronunciation', 15),
        createLesson(32, 'Airport Conversations', 'locked', 'conversation', 20)
      ]
    )
  }
};

/**
 * Single lesson unit
 */
export const SingleLesson: Story = {
  args: {
    unit: createUnit(
      7,
      'Intensive Grammar Workshop',
      'Focused deep-dive session on French subjunctive mood.',
      'C1',
      [
        createLesson(33, 'The French Subjunctive', 'available', 'grammar', 60)
      ]
    )
  }
};

/**
 * Long unit with many lessons
 */
export const ExtensiveUnit: Story = {
  args: {
    unit: createUnit(
      8,
      'Complete French Verb System',
      'Comprehensive coverage of the entire French verb system from present to conditional moods.',
      'B1',
      [
        createLesson(34, 'Present Tense Review', 'completed', 'grammar', 20),
        createLesson(35, 'Imperfect Tense', 'completed', 'grammar', 25),
        createLesson(36, 'Passé Composé vs Imperfect', 'completed', 'grammar', 30),
        createLesson(37, 'Future Tense', 'completed', 'grammar', 22),
        createLesson(38, 'Conditional Mood', 'in_progress', 'grammar', 28),
        createLesson(39, 'Subjunctive Introduction', 'available', 'grammar', 35),
        createLesson(40, 'Subjunctive in Practice', 'available', 'grammar', 40),
        createLesson(41, 'Imperative Mood', 'available', 'grammar', 15),
        createLesson(42, 'Irregular Verb Patterns', 'locked', 'grammar', 45),
        createLesson(43, 'Advanced Verb Usage', 'locked', 'grammar', 50)
      ]
    )
  }
};

/**
 * All lesson statuses in one unit
 */
export const AllStatuses: Story = {
  args: {
    unit: createUnit(
      9,
      'Progress Demonstration',
      'Shows all possible lesson statuses within a single unit for demonstration purposes.',
      'A1',
      [
        createLesson(44, 'Completed Lesson', 'completed', 'vocabulary', 15),
        createLesson(45, 'In Progress Lesson', 'in_progress', 'grammar', 20),
        createLesson(46, 'Available Lesson', 'available', 'conversation', 25),
        createLesson(47, 'Locked Lesson', 'locked', 'culture', 30)
      ]
    )
  }
};

/**
 * All lesson types in one unit
 */
export const AllTypes: Story = {
  args: {
    unit: createUnit(
      10,
      'Multi-Type Learning Module',
      'Demonstrates all lesson types available in the French learning platform.',
      'B1',
      [
        createLesson(48, 'Essential Vocabulary', 'available', 'vocabulary', 18),
        createLesson(49, 'Grammar Fundamentals', 'available', 'grammar', 25),
        createLesson(50, 'Practice Conversation', 'available', 'conversation', 22),
        createLesson(51, 'Cultural Insights', 'available', 'culture', 20),
        createLesson(52, 'Pronunciation Practice', 'available', 'pronunciation', 15)
      ]
    )
  }
};

/**
 * Long unit titles and descriptions
 */
export const LongContent: Story = {
  args: {
    unit: createUnit(
      11,
      'Advanced Professional French Communication for Business and Academic Environments',
      'This comprehensive unit covers advanced French communication skills specifically designed for professional business environments, academic settings, and formal communication scenarios. Students will learn sophisticated vocabulary, formal register usage, and cultural nuances essential for success in professional French-speaking contexts.',
      'C2',
      [
        createLesson(53, 'Formal Business Correspondence and Email Etiquette', 'available', 'conversation', 40),
        createLesson(54, 'Academic Presentation Skills and Public Speaking', 'available', 'conversation', 45),
        createLesson(55, 'Technical Vocabulary for Professional Fields', 'locked', 'vocabulary', 35)
      ]
    )
  }
};

/**
 * Multiple units comparison
 */
export const UnitsComparison: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Stack spacing={3} sx={{ width: 700, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Learning Units Comparison
          </Typography>
          
          <LearningUnit unit={createUnit(
            1,
            'A1 - Beginner Basics',
            'Foundation skills for complete beginners',
            'A1',
            [
              createLesson(1, 'Alphabet', 'completed', 'pronunciation', 10),
              createLesson(2, 'Greetings', 'in_progress', 'vocabulary', 15),
              createLesson(3, 'Numbers', 'available', 'vocabulary', 12),
              createLesson(4, 'Colors', 'locked', 'vocabulary', 10)
            ]
          )} />
          
          <LearningUnit unit={createUnit(
            2,
            'B1 - Intermediate Grammar',
            'Building complex sentence structures and verb tenses',
            'B1',
            [
              createLesson(5, 'Past Tense', 'completed', 'grammar', 25),
              createLesson(6, 'Future Tense', 'completed', 'grammar', 20),
              createLesson(7, 'Conditional', 'available', 'grammar', 30),
              createLesson(8, 'Subjunctive', 'locked', 'grammar', 40)
            ]
          )} />
          
          <LearningUnit unit={createUnit(
            3,
            'C1 - Advanced Culture',
            'Deep cultural understanding and sophisticated expression',
            'C1',
            [
              createLesson(9, 'Literature Analysis', 'available', 'culture', 50),
              createLesson(10, 'Political Discourse', 'locked', 'conversation', 45)
            ]
          )} />
        </Stack>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Responsive layout demonstration
 */
export const ResponsiveDemo: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Responsive Learning Unit
          </Typography>
          
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(500px, 1fr))" gap={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Mobile/Tablet View</Typography>
              <Box sx={{ width: 500 }}>
                <LearningUnit unit={createUnit(
                  1,
                  'Mobile-Optimized Unit',
                  'Testing responsive behavior on smaller screens',
                  'A2',
                  [
                    createLesson(1, 'Responsive Test 1', 'completed', 'vocabulary', 15),
                    createLesson(2, 'Responsive Test 2', 'in_progress', 'grammar', 20),
                    createLesson(3, 'Responsive Test 3', 'available', 'conversation', 18)
                  ]
                )} />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Desktop View</Typography>
              <Box sx={{ width: 700 }}>
                <LearningUnit unit={createUnit(
                  2,
                  'Desktop-Optimized Unit',
                  'Testing responsive behavior on larger screens with more content space',
                  'B2',
                  [
                    createLesson(4, 'Desktop Test with Longer Titles', 'completed', 'culture', 25),
                    createLesson(5, 'Advanced Desktop Features', 'available', 'conversation', 30),
                    createLesson(6, 'Full-Width Content Display', 'locked', 'pronunciation', 20)
                  ]
                )} />
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};
