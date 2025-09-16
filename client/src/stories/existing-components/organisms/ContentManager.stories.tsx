import type { Meta, StoryObj } from '@storybook/react';
import ContentManager from '../../../components/admin/ContentManager';
import ThemeProvider from '../../../ThemeProvider';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import React from 'react';

// Mock function for onClick handlers
const fn = () => () => {};

/**
 * ContentManager is a comprehensive admin interface for managing learning content items.
 * 
 * **Key Features:**
 * - Full CRUD operations for content items
 * - Real-time data loading and error handling
 * - Integrated content form modal
 * - Confirmation dialogs for destructive actions
 * - Topic associations and filtering
 * - Status management (active/inactive)
 * - Responsive table layout with action buttons
 */
const meta: Meta<typeof ContentManager> = {
  title: 'Existing Components/Organisms/ContentManager',
  component: ContentManager,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Advanced content management interface for administrators with full CRUD capabilities, form integration, and confirmation dialogs.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Box sx={{ p: 3, minHeight: '600px' }}>
          <Story />
        </Box>
      </ThemeProvider>
    ),
  ]
};

export default meta;
type Story = StoryObj<typeof ContentManager>;

/**
 * Mock service responses for different scenarios
 */
const mockContentItems = [
  {
    id: 1,
    title: 'Basic French Greetings',
    name: 'greetings-basic',
    type: 'vocabulary',
    topicId: 1,
    active: true
  },
  {
    id: 2,
    title: 'Present Tense Conjugation',
    name: 'present-tense',
    type: 'grammar',
    topicId: 2,
    active: true
  },
  {
    id: 3,
    title: 'Restaurant Conversation',
    name: 'restaurant-talk',
    type: 'conversation',
    topicId: 3,
    active: false
  },
  {
    id: 4,
    title: 'French Pronunciation Guide',
    name: 'pronunciation-basics',
    type: 'pronunciation',
    topicId: 4,
    active: true
  },
  {
    id: 5,
    title: 'Cultural Etiquette',
    name: 'etiquette-basics',
    type: 'culture',
    topicId: 5,
    active: true
  }
];

const mockTopics = [
  { id: 1, name: 'Basic Communication' },
  { id: 2, name: 'Grammar Fundamentals' },
  { id: 3, name: 'Daily Conversations' },
  { id: 4, name: 'Pronunciation' },
  { id: 5, name: 'French Culture' }
];

/**
 * Default content manager with full functionality
 */
export const Default: Story = {
  parameters: {
    mockData: {
      contentItems: mockContentItems,
      topics: mockTopics
    }
  }
};

/**
 * Loading state demonstration
 */
export const LoadingState: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Manager - Loading State
        </Typography>
        
        <Box sx={{ 
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          p: 4,
          textAlign: 'center'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Content</Typography>
            <button 
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Add New Content
            </button>
          </Box>
          
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading content items and topics...
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
};

/**
 * Error state with retry functionality
 */
export const ErrorState: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Manager - Error State
        </Typography>
        
        <Box sx={{ 
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          p: 4
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Content</Typography>
            <button 
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Add New Content
            </button>
          </Box>
          
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load content items. Network connection error.
          </Alert>
          
          <Typography variant="body2" color="text.secondary">
            Unable to retrieve content data from the server. Please check your connection and try again.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
};

/**
 * Empty state - no content items
 */
export const EmptyState: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Manager - Empty State
        </Typography>
        
        <Box sx={{ 
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          p: 4
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Content</Typography>
            <button 
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Add New Content
            </button>
          </Box>
          
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Content Items Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first learning content item.
            </Typography>
            <button 
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Create First Content Item
            </button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
};

/**
 * Content table with all content types
 */
export const FullContentTable: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Manager - Full Table
        </Typography>
        
        <Box sx={{ 
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          p: 4
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Content</Typography>
            <button 
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Add New Content
            </button>
          </Box>
          
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Title</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Identifier</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Topic</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockContentItems.map((item, index) => {
                  const topic = mockTopics.find(t => t.id === item.topicId);
                  return (
                    <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{item.id}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>{item.title}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontFamily: 'monospace', color: '#6b7280' }}>{item.name}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{
                          background: item.type === 'vocabulary' ? '#dbeafe' : 
                                     item.type === 'grammar' ? '#dcfce7' :
                                     item.type === 'conversation' ? '#fef3c7' :
                                     item.type === 'pronunciation' ? '#ede9fe' : '#fce7f3',
                          color: item.type === 'vocabulary' ? '#1e40af' : 
                                item.type === 'grammar' ? '#166534' :
                                item.type === 'conversation' ? '#92400e' :
                                item.type === 'pronunciation' ? '#6d28d9' : '#be185d',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{topic?.name || 'N/A'}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{
                          background: item.active ? '#dcfce7' : '#fef2f2',
                          color: item.active ? '#166534' : '#dc2626',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                        <button 
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            marginRight: '8px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
};

/**
 * Responsive table behavior
 */
export const ResponsiveTable: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Responsive Content Manager
        </Typography>
        
        <Box display="grid" gridTemplateColumns="1fr" gap={3}>
          {/* Mobile View */}
          <Box>
            <Typography variant="h6" gutterBottom>Mobile View (400px wide)</Typography>
            <Box sx={{ 
              width: 400, 
              overflow: 'hidden',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Manage Content</Typography>
                <button 
                  style={{
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    width: '100%',
                    marginBottom: '16px'
                  }}
                >
                  Add New Content
                </button>
                
                {/* Mobile card layout instead of table */}
                {mockContentItems.slice(0, 3).map((item) => {
                  const topic = mockTopics.find(t => t.id === item.topicId);
                  return (
                    <Box key={item.id} sx={{ 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      p: 2,
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" gutterBottom>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.type} • {topic?.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <span style={{
                          background: item.active ? '#dcfce7' : '#fef2f2',
                          color: item.active ? '#166534' : '#dc2626',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px'
                        }}>
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                        <Box>
                          <button style={{ 
                            background: '#3b82f6', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            padding: '4px 8px', 
                            marginRight: '4px',
                            fontSize: '10px'
                          }}>
                            Edit
                          </button>
                          <button style={{ 
                            background: '#ef4444', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            padding: '4px 8px',
                            fontSize: '10px'
                          }}>
                            Delete
                          </button>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Desktop View */}
          <Box>
            <Typography variant="h6" gutterBottom>Desktop View (Full Width)</Typography>
            <Box sx={{ 
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              p: 3
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Manage Content</Typography>
                <button 
                  style={{
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px'
                  }}
                >
                  Add New Content
                </button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Full table layout with all columns visible and optimal spacing for large screens.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Content filtering and search scenarios
 */
export const ContentFiltering: Story = {
  render: () => {
    const [filter, setFilter] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredContent = mockContentItems.filter(item => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return (
      <ThemeProvider>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Content Filtering & Search
          </Typography>
          
          <Box sx={{ 
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            p: 4
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Manage Content</Typography>
              <button 
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
              >
                Add New Content
              </button>
            </Box>
            
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  minWidth: '200px'
                }}
              />
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="all">All Types</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="grammar">Grammar</option>
                <option value="conversation">Conversation</option>
                <option value="pronunciation">Pronunciation</option>
                <option value="culture">Culture</option>
              </select>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Found {filteredContent.length} items
            </Typography>
            
            {/* Results */}
            <Box sx={{ display: 'grid', gap: 2 }}>
              {filteredContent.map((item) => {
                const topic = mockTopics.find(t => t.id === item.topicId);
                return (
                  <Box key={item.id} sx={{ 
                    p: 2, 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.type} • {topic?.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <span style={{
                        background: item.active ? '#dcfce7' : '#fef2f2',
                        color: item.active ? '#166534' : '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {item.active ? 'Active' : 'Inactive'}
                      </span>
                      <button style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        padding: '6px 12px', 
                        marginRight: '8px'
                      }}>
                        Edit
                      </button>
                      <button style={{ 
                        background: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        padding: '6px 12px'
                      }}>
                        Delete
                      </button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Bulk operations demonstration
 */
export const BulkOperations: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
    
    const handleSelectAll = () => {
      if (selectedItems.length === mockContentItems.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(mockContentItems.map(item => item.id));
      }
    };
    
    const handleSelectItem = (id: number) => {
      if (selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    };

    return (
      <ThemeProvider>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Bulk Operations
          </Typography>
          
          <Box sx={{ 
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            p: 4
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Manage Content</Typography>
              <button 
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
              >
                Add New Content
              </button>
            </Box>
            
            {/* Bulk Actions Bar */}
            {selectedItems.length > 0 && (
              <Box sx={{ 
                background: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: '8px',
                p: 2,
                mb: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="body2">
                  {selectedItems.length} items selected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <button style={{ 
                    background: '#10b981', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '6px 12px',
                    fontSize: '12px'
                  }}>
                    Activate Selected
                  </button>
                  <button style={{ 
                    background: '#f59e0b', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '6px 12px',
                    fontSize: '12px'
                  }}>
                    Deactivate Selected
                  </button>
                  <button style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '6px 12px',
                    fontSize: '12px'
                  }}>
                    Delete Selected
                  </button>
                </Box>
              </Box>
            )}
            
            {/* Select All */}
            <Box sx={{ mb: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedItems.length === mockContentItems.length}
                  onChange={handleSelectAll}
                />
                <Typography variant="body2">
                  Select All ({mockContentItems.length} items)
                </Typography>
              </label>
            </Box>
            
            {/* Content List with Checkboxes */}
            <Box sx={{ display: 'grid', gap: 2 }}>
              {mockContentItems.map((item) => {
                const topic = mockTopics.find(t => t.id === item.topicId);
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <Box key={item.id} sx={{ 
                    p: 2, 
                    border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    background: isSelected ? '#eff6ff' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.type} • {topic?.name}
                      </Typography>
                    </Box>
                    
                    <span style={{
                      background: item.active ? '#dcfce7' : '#fef2f2',
                      color: item.active ? '#166534' : '#dc2626',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                    
                    <Box>
                      <button style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        padding: '6px 12px', 
                        marginRight: '8px'
                      }}>
                        Edit
                      </button>
                      <button style={{ 
                        background: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        padding: '6px 12px'
                      }}>
                        Delete
                      </button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
};
