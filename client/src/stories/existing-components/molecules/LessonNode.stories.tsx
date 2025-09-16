import type { Meta, StoryObj } from '@storybook/react';
import LessonNode from '../../../components/learning/LessonNode';
import { ClientLesson, LessonStatus, LessonType } from '../../../types/LearningPath';
import ThemeProvider from '../../../ThemeProvider';
import { MemoryRouter } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';

/**
 * LessonNode represents individual lessons in a learning path with visual status indicators.
 * 
 * **Key Features:**
 * - Visual status system (locked, available, in_progress, completed)
 * - Animated interactions with Framer Motion
 * - Color-coded lesson types and progress states
 * - Responsive design with hover effects
 * - Navigation integration for accessible lessons
 * - Time estimates and lesson type indicators
 */
const meta: Meta<typeof LessonNode> = {
  title: 'Existing Components/Molecules/LessonNode',
  component: LessonNode,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interactive lesson nodes with status-based styling and animations. Features navigation, progress tracking, and accessibility-compliant interactions.'
      }
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <div style={{ width: '400px', padding: '20px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    lesson: {
      control: 'object',
      description: 'Lesson data with status, type, and metadata'
    }
  }
};

export default meta;
type Story = StoryObj<typeof LessonNode>;

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

/**
 * Available lesson ready for interaction
 */
export const Available: Story = {
  args: {
    lesson: createLesson(
      1, 
      'Introduction to French Greetings', 
      'available', 
      'vocabulary',
      20,
      'Learn basic French greeting expressions'
    )
  }
};

/**
 * Locked lesson - not yet accessible
 */
export const Locked: Story = {
  args: {
    lesson: createLesson(
      2, 
      'Advanced Conversation Skills', 
      'locked', 
      'conversation',
      35,
      'Master complex conversational patterns'
    )
  }
};

/**
 * In progress lesson - currently being studied
 */
export const InProgress: Story = {
  args: {
    lesson: createLesson(
      3, 
      'French Grammar: Present Tense', 
      'in_progress', 
      'grammar',
      25,
      'Master present tense verb conjugations'
    )
  }
};

/**
 * Completed lesson with success styling
 */
export const Completed: Story = {
  args: {
    lesson: createLesson(
      4, 
      'French Culture: Art and History', 
      'completed', 
      'culture',
      30,
      'Explore French cultural heritage'
    )
  }
};

/**
 * Vocabulary lesson type
 */
export const VocabularyLesson: Story = {
  args: {
    lesson: createLesson(
      5, 
      'Essential French Vocabulary', 
      'available', 
      'vocabulary',
      18,
      'Build your core French vocabulary'
    )
  }
};

/**
 * Grammar lesson type
 */
export const GrammarLesson: Story = {
  args: {
    lesson: createLesson(
      6, 
      'French Subjunctive Mood', 
      'available', 
      'grammar',
      40,
      'Understanding the subjunctive mood'
    )
  }
};

/**
 * Conversation lesson type
 */
export const ConversationLesson: Story = {
  args: {
    lesson: createLesson(
      7, 
      'Ordering at a Restaurant', 
      'available', 
      'conversation',
      28,
      'Practice real-world restaurant conversations'
    )
  }
};

/**
 * Culture lesson type
 */
export const CultureLesson: Story = {
  args: {
    lesson: createLesson(
      8, 
      'French Holidays and Traditions', 
      'available', 
      'culture',
      22,
      'Discover French cultural celebrations'
    )
  }
};

/**
 * Pronunciation lesson type
 */
export const PronunciationLesson: Story = {
  args: {
    lesson: createLesson(
      9, 
      'French R Sound Mastery', 
      'available', 
      'pronunciation',
      15,
      'Perfect the challenging French R sound'
    )
  }
};

/**
 * Short duration lesson
 */
export const ShortLesson: Story = {
  args: {
    lesson: createLesson(
      10, 
      'Quick French Phrases', 
      'available', 
      'vocabulary',
      5,
      'Essential phrases for beginners'
    )
  }
};

/**
 * Long duration lesson
 */
export const LongLesson: Story = {
  args: {
    lesson: createLesson(
      11, 
      'Complete French Literature Analysis', 
      'available', 
      'culture',
      60,
      'Deep dive into French literary works'
    )
  }
};

/**
 * Lesson with very long title
 */
export const LongTitleLesson: Story = {
  args: {
    lesson: createLesson(
      12, 
      'Comprehensive French Business Communication for Professional Settings and Corporate Environments', 
      'available', 
      'conversation',
      45,
      'Master professional French communication skills for business contexts'
    )
  }
};

/**
 * All lesson statuses comparison
 */
export const StatusComparison: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Stack spacing={2} sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            All Lesson Statuses
          </Typography>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Available (Click to navigate)
            </Typography>
            <LessonNode lesson={createLesson(1, 'Available Lesson', 'available', 'vocabulary')} />
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              In Progress
            </Typography>
            <LessonNode lesson={createLesson(2, 'In Progress Lesson', 'in_progress', 'grammar')} />
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Completed
            </Typography>
            <LessonNode lesson={createLesson(3, 'Completed Lesson', 'completed', 'conversation')} />
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Locked (No interaction)
            </Typography>
            <LessonNode lesson={createLesson(4, 'Locked Lesson', 'locked', 'culture')} />
          </Box>
        </Stack>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * All lesson types comparison
 */
export const TypeComparison: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Stack spacing={2} sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            All Lesson Types
          </Typography>
          
          <LessonNode lesson={createLesson(1, 'Vocabulary Lesson', 'available', 'vocabulary', 15)} />
          <LessonNode lesson={createLesson(2, 'Grammar Lesson', 'available', 'grammar', 25)} />
          <LessonNode lesson={createLesson(3, 'Conversation Lesson', 'available', 'conversation', 30)} />
          <LessonNode lesson={createLesson(4, 'Culture Lesson', 'available', 'culture', 20)} />
          <LessonNode lesson={createLesson(5, 'Pronunciation Lesson', 'available', 'pronunciation', 12)} />
        </Stack>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Interactive demonstration with different hover states
 */
export const InteractiveDemo: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Stack spacing={2} sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Interactive States Demo
          </Typography>
          
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Hover over lessons to see interactions:
            </Typography>
            
            <Stack spacing={1}>
              <LessonNode lesson={createLesson(1, 'Clickable: Available Lesson', 'available', 'vocabulary')} />
              <LessonNode lesson={createLesson(2, 'Clickable: In Progress', 'in_progress', 'grammar')} />
              <LessonNode lesson={createLesson(3, 'Clickable: Completed', 'completed', 'conversation')} />
              <LessonNode lesson={createLesson(4, 'Non-clickable: Locked', 'locked', 'culture')} />
            </Stack>
          </Box>
        </Stack>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Duration variety showcase
 */
export const DurationVariety: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Stack spacing={2} sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lesson Duration Variety
          </Typography>
          
          <LessonNode lesson={createLesson(1, 'Quick Review', 'available', 'vocabulary', 5)} />
          <LessonNode lesson={createLesson(2, 'Standard Lesson', 'available', 'grammar', 20)} />
          <LessonNode lesson={createLesson(3, 'In-depth Study', 'available', 'conversation', 45)} />
          <LessonNode lesson={createLesson(4, 'Comprehensive Module', 'available', 'culture', 90)} />
        </Stack>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Realistic lesson sequence
 */
export const RealisticSequence: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Stack spacing={1} sx={{ width: 450, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Realistic Learning Sequence
          </Typography>
          
          {/* Completed lessons */}
          <LessonNode lesson={createLesson(1, 'French Alphabet', 'completed', 'pronunciation', 10)} />
          <LessonNode lesson={createLesson(2, 'Basic Greetings', 'completed', 'vocabulary', 15)} />
          <LessonNode lesson={createLesson(3, 'Numbers 1-20', 'completed', 'vocabulary', 18)} />
          
          {/* Current lesson */}
          <LessonNode lesson={createLesson(4, 'Present Tense: Être and Avoir', 'in_progress', 'grammar', 25)} />
          
          {/* Available next lessons */}
          <LessonNode lesson={createLesson(5, 'Days of the Week', 'available', 'vocabulary', 12)} />
          <LessonNode lesson={createLesson(6, 'Introducing Yourself', 'available', 'conversation', 20)} />
          
          {/* Locked future lessons */}
          <LessonNode lesson={createLesson(7, 'Past Tense Conjugation', 'locked', 'grammar', 35)} />
          <LessonNode lesson={createLesson(8, 'French Dining Etiquette', 'locked', 'culture', 28)} />
          <LessonNode lesson={createLesson(9, 'Advanced Pronunciation', 'locked', 'pronunciation', 40)} />
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
            Responsive Layout Demo
          </Typography>
          
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Mobile (300px)</Typography>
              <Box sx={{ width: 300 }}>
                <LessonNode lesson={createLesson(1, 'Mobile Layout Test', 'available', 'vocabulary', 15)} />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Tablet (400px)</Typography>
              <Box sx={{ width: 400 }}>
                <LessonNode lesson={createLesson(2, 'Tablet Layout Test', 'in_progress', 'grammar', 25)} />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Desktop (500px)</Typography>
              <Box sx={{ width: 500 }}>
                <LessonNode lesson={createLesson(3, 'Desktop Layout Test with Longer Title', 'completed', 'conversation', 30)} />
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
