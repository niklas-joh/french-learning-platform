import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import LearningPath from '../../../components/learning/LearningPath'
import { ClientLearningPath, ClientLearningUnit, ClientLesson } from '../../../types/LearningPath'
import ThemeProvider from '../../../ThemeProvider'
import { MemoryRouter } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

// Mock the useLearningPath hook for Storybook
const mockUseLearningPath = (pathId: number) => {
  const mockData = getMockData(pathId)
  return {
    data: mockData.data,
    isLoading: mockData.isLoading,
    error: mockData.error,
    refetch: () => console.log(`Refetching learning path ${pathId}`)
  }
}

// Override the hook for Storybook
React.useEffect(() => {
  if (typeof window !== 'undefined') {
    // Mock the module for Storybook environment
    const mockModule = {
      useLearningPath: mockUseLearningPath
    }
    // Store in window for access
    ;(window as any).__mockUseLearningPath = mockModule
  }
}, [])

/**
 * LearningPath represents a complete learning journey with animated transitions.
 * 
 * **Key Features:**
 * - Complete learning path visualization
 * - Framer Motion animations
 * - Error handling and loading states
 * - Responsive design with mobile optimization
 * - Integration with learning progress hooks
 * - Virtualization ready for long paths
 */
const meta: Meta<typeof LearningPath> = {
  title: 'Existing Components/Organisms/LearningPath',
  component: LearningPath,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Complete learning path component with units, lessons, and progress tracking. Features loading states, error handling, and smooth animations.'
      }
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <div style={{ width: '800px', padding: '20px', maxHeight: '600px', overflow: 'auto' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    pathId: {
      control: 'number',
      description: 'ID of the learning path to display'
    }
  }
}

export default meta
type Story = StoryObj<typeof LearningPath>

// Helper functions to create mock data
const createLesson = (
  id: number, 
  title: string, 
  status: 'locked' | 'available' | 'in_progress' | 'completed', 
  type: 'vocabulary' | 'grammar' | 'conversation' | 'culture' | 'pronunciation',
  estimatedTime: number = 15
): ClientLesson => ({
  id,
  title,
  type,
  estimatedTime,
  orderIndex: id,
  status
})

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
})

// Mock data based on pathId
const getMockData = (pathId: number) => {
  switch (pathId) {
    case 1:
      return {
        data: {
          id: 1,
          name: 'French for Absolute Beginners',
          description: 'Start your French journey with essential basics, from alphabet to first conversations.',
          totalLessons: 15,
          units: [
            createUnit(
              1,
              'Getting Started with French',
              'Essential foundations including alphabet, basic greetings, and pronunciation.',
              'A1',
              [
                createLesson(1, 'French Alphabet & Sounds', 'completed', 'pronunciation', 15),
                createLesson(2, 'Basic Greetings', 'completed', 'vocabulary', 12),
                createLesson(3, 'Numbers 1-20', 'in_progress', 'vocabulary', 18),
                createLesson(4, 'Personal Introductions', 'available', 'conversation', 20),
                createLesson(5, 'Days of the Week', 'locked', 'vocabulary', 15)
              ]
            ),
            createUnit(
              2,
              'First Grammar Steps',
              'Introduction to French grammar with present tense and basic sentence structure.',
              'A1',
              [
                createLesson(6, 'Present Tense: Être (to be)', 'available', 'grammar', 25),
                createLesson(7, 'Present Tense: Avoir (to have)', 'locked', 'grammar', 20),
                createLesson(8, 'Articles: le, la, les', 'locked', 'grammar', 18),
                createLesson(9, 'Simple Questions', 'locked', 'grammar', 22)
              ]
            )
          ]
        } as ClientLearningPath,
        isLoading: false,
        error: undefined
      }
    
    case 2:
      return {
        data: {
          id: 2,
          name: 'Intermediate French Mastery',
          description: 'Build fluency with complex grammar, expanded vocabulary, and cultural understanding.',
          totalLessons: 20,
          units: [
            createUnit(
              3,
              'Advanced Grammar Concepts',
              'Master complex tenses and grammatical structures.',
              'B1',
              [
                createLesson(10, 'Passé Composé', 'completed', 'grammar', 30),
                createLesson(11, 'Imparfait vs Passé Composé', 'in_progress', 'grammar', 35),
                createLesson(12, 'Future Tense', 'available', 'grammar', 25),
                createLesson(13, 'Conditional Mood', 'locked', 'grammar', 28)
              ]
            ),
            createUnit(
              4,
              'French Culture & Society',
              'Explore French culture, traditions, and contemporary society.',
              'B1',
              [
                createLesson(14, 'French Holidays', 'available', 'culture', 25),
                createLesson(15, 'French Cuisine', 'locked', 'culture', 30),
                createLesson(16, 'Art and Literature', 'locked', 'culture', 35)
              ]
            )
          ]
        } as ClientLearningPath,
        isLoading: false,
        error: undefined
      }
    
    case 999: // Loading state
      return {
        data: null,
        isLoading: true,
        error: undefined
      }
    
    case 998: // Error state
      return {
        data: null,
        isLoading: false,
        error: 'Failed to load learning path. Please check your connection.'
      }
    
    case 997: // Empty state
      return {
        data: null,
        isLoading: false,
        error: undefined
      }
    
    default:
      return {
        data: null,
        isLoading: false,
        error: undefined
      }
  }
}

// Mock component that uses the hook
const MockedLearningPath: React.FC<{ pathId: number }> = ({ pathId }) => {
  const mockData = getMockData(pathId)
  
  // Simulate the component behavior
  if (mockData.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading...</div>
      </Box>
    )
  }

  if (mockData.error) {
    return (
      <div role="alert" style={{ color: 'red', padding: '20px' }}>
        {mockData.error}
        <button onClick={() => console.log('Retry clicked')}>Retry</button>
      </div>
    )
  }

  if (!mockData.data) {
    return <Typography>No learning path data available.</Typography>
  }

  const data = mockData.data
  
  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
        {data.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {data.description}
      </Typography>
      
      {/* Render units simplified for demo */}
      {data.units.map((unit) => (
        <Box key={unit.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {unit.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {unit.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Level: {unit.level} • {unit.lessons.length} lessons
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

/**
 * Beginner learning path with mixed progress
 */
export const BeginnerPath: Story = {
  args: {
    pathId: 1
  },
  render: (args) => <MockedLearningPath {...args} />
}

/**
 * Intermediate learning path
 */
export const IntermediatePath: Story = {
  args: {
    pathId: 2
  },
  render: (args) => <MockedLearningPath {...args} />
}

/**
 * Loading state demonstration
 */
export const LoadingState: Story = {
  args: {
    pathId: 999
  },
  render: (args) => <MockedLearningPath {...args} />
}

/**
 * Error state with retry functionality
 */
export const ErrorState: Story = {
  args: {
    pathId: 998
  },
  render: (args) => <MockedLearningPath {...args} />
}

/**
 * Empty learning path state
 */
export const EmptyPath: Story = {
  args: {
    pathId: 997
  },
  render: (args) => <MockedLearningPath {...args} />
}

/**
 * Comprehensive learning path with extensive content
 */
export const ExtensivePath: Story = {
  args: {
    pathId: 3
  },
  render: (args) => {
    const extensiveData = {
      id: 3,
      name: 'Complete French Mastery Program',
      description: 'Comprehensive French learning program from absolute beginner to advanced proficiency.',
      totalLessons: 45,
      units: [
        createUnit(5, 'Beginner Foundation', 'Basic French fundamentals', 'A1', [
          createLesson(20, 'Alphabet', 'completed', 'pronunciation', 10),
          createLesson(21, 'Greetings', 'in_progress', 'vocabulary', 12)
        ]),
        createUnit(6, 'Elementary Grammar', 'Basic grammar structures', 'A2', [
          createLesson(22, 'Present Tense', 'available', 'grammar', 25),
          createLesson(23, 'Articles', 'locked', 'grammar', 18)
        ]),
        createUnit(7, 'Intermediate Skills', 'Building intermediate proficiency', 'B1', [
          createLesson(24, 'Past Tense', 'locked', 'grammar', 30),
          createLesson(25, 'Complex Sentences', 'locked', 'grammar', 35)
        ]),
        createUnit(8, 'Advanced Mastery', 'Advanced language skills', 'C1', [
          createLesson(26, 'Literature', 'locked', 'culture', 50),
          createLesson(27, 'Advanced Writing', 'locked', 'conversation', 45)
        ])
      ]
    } as ClientLearningPath

    return (
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
          {extensiveData.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {extensiveData.description}
        </Typography>
        
        {extensiveData.units.map((unit) => (
          <Box key={unit.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {unit.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {unit.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Level: {unit.level} • {unit.lessons.length} lessons
            </Typography>
          </Box>
        ))}
      </Box>
    )
  },
  parameters: {
    layout: 'fullscreen'
  }
}

/**
 * Progress comparison across different paths
 */
export const ProgressComparison: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Learning Path Progress Comparison
          </Typography>
          
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Early Progress (Beginner)
              </Typography>
              <Box sx={{ height: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <MockedLearningPath pathId={1} />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Advanced Progress (Intermediate)
              </Typography>
              <Box sx={{ height: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <MockedLearningPath pathId={2} />
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
}

/**
 * Responsive layout demonstration
 */
export const ResponsiveDemo: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Responsive Learning Path
          </Typography>
          
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Mobile/Tablet (400px)</Typography>
              <Box sx={{ width: 400, height: 400, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
                <MockedLearningPath pathId={1} />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Desktop (600px)</Typography>
              <Box sx={{ width: 600, height: 400, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
                <MockedLearningPath pathId={2} />
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
}

/**
 * Interactive state management demo
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [currentPath, setCurrentPath] = React.useState(1)
    
    return (
      <MemoryRouter>
        <ThemeProvider>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Interactive Learning Path Demo
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <button onClick={() => setCurrentPath(1)} style={{ margin: '5px' }}>
                Beginner Path
              </button>
              <button onClick={() => setCurrentPath(2)} style={{ margin: '5px' }}>
                Intermediate Path
              </button>
              <button onClick={() => setCurrentPath(999)} style={{ margin: '5px' }}>
                Loading State
              </button>
              <button onClick={() => setCurrentPath(998)} style={{ margin: '5px' }}>
                Error State
              </button>
            </Box>
            
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, height: 400, overflow: 'auto' }}>
              <MockedLearningPath pathId={currentPath} />
            </Box>
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    )
  },
  parameters: {
    layout: 'fullscreen'
  }
}
