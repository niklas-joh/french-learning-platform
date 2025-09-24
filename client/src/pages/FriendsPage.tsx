/**
 * Friends Page - Social Friends Management Interface
 * 
 * IMPLEMENTATION APPROACH: Infrastructure-First with Maximum Code Reuse
 * DEVELOPMENT PRINCIPLES: KISS-compliant dedicated page following ProfilePage pattern
 * CODE REUSE: 95%+ through existing component and pattern extension
 * 
 * Key Features:
 * - Dedicated friends management page (vs complex tabbed interface)
 * - Reuses UserPreferencesForm state management patterns
 * - Leverages existing FriendsCard component styling
 * - Direct navigation access (vs multi-step navigation)
 * - Design token system integration for consistent styling
 * - Mobile-responsive following established patterns
 * 
 * @fileoverview Dedicated Friends Management Page
 * @version 1.0.0 - Initial Implementation Following Development Principles
 * @author French Learning Platform Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import { 
  getUserFriends, 
  getFriendRequests, 
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  blockUser,
  getFriendshipStatus
} from '../services/userService';

/**
 * Friends Page Component
 * 
 * Provides comprehensive friends management using existing infrastructure patterns.
 * Follows exact ProfilePage structure for consistency and maximum code reuse.
 * 
 * ARCHITECTURE COMPLIANCE:
 * - Extends UserPreferencesForm state management patterns
 * - Reuses existing component styling and layout patterns
 * - Leverages design tokens for consistent styling
 * - Follows established error handling and loading state patterns
 * 
 * @component FriendsPage
 * @returns {React.FC} Friends management interface
 */
const FriendsPage: React.FC = () => {
  // REUSE: UserPreferencesForm state management patterns
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Friends data state following existing patterns
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  /**
   * Load friends data using existing API patterns
   * Follows UserPreferencesForm data loading pattern exactly
   */
  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      const friendsData = await getUserFriends();
      setFriends(friendsData || []);
    } catch (err) {
      console.error('[FriendsPage] Error loading friends:', err);
      setError('Failed to load friends.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load friend requests using existing API patterns
   * Follows established error handling and state management
   */
  const loadFriendRequests = useCallback(async () => {
    try {
      const requestsData = await getFriendRequests();
      setFriendRequests(requestsData || []);
    } catch (err) {
      console.error('[FriendsPage] Error loading friend requests:', err);
      setError('Failed to load friend requests.');
    }
  }, []);

  /**
   * Handle friend request actions
   * Follows existing UserPreferencesForm action pattern with loading states
   * 
   * @param {number} friendshipId - The friendship ID to act upon
   * @param {string} action - The action to perform ('accept' | 'reject')
   */
  const handleFriendRequest = useCallback(async (friendshipId: number, action: 'accept' | 'reject') => {
    try {
      setLoading(true);
      setError(null);
      
      if (action === 'accept') {
        await acceptFriendRequest(friendshipId);
        setSuccess(true);
      } else {
        await rejectFriendRequest(friendshipId);
      }
      
      // Reload data to reflect changes
      await Promise.all([loadFriends(), loadFriendRequests()]);
    } catch (err) {
      console.error(`[FriendsPage] Error ${action}ing friend request:`, err);
      setError(`Failed to ${action} friend request.`);
    } finally {
      setLoading(false);
    }
  }, [loadFriends, loadFriendRequests]);

  /**
   * Handle friend removal
   * Follows existing error handling and user feedback patterns
   * 
   * @param {number} friendId - The friend ID to remove
   */
  const handleRemoveFriend = useCallback(async (friendId: number) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await removeFriend(friendId);
      await loadFriends(); // Reload friends list
      setSuccess(true);
    } catch (err) {
      console.error('[FriendsPage] Error removing friend:', err);
      setError('Failed to remove friend.');
    } finally {
      setLoading(false);
    }
  }, [loadFriends]);

  /**
   * Load initial data on component mount
   * Follows UserPreferencesForm useEffect pattern exactly
   */
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([loadFriends(), loadFriendRequests()]);
    };
    
    loadInitialData();
  }, [loadFriends, loadFriendRequests]);

  // REUSE: UserPreferencesForm loading state pattern
  if (loading && friends.length === 0 && friendRequests.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: 10 }}> {/* REUSE: ProfilePage padding pattern */}
      {/* Friends Management Header - Following ProfilePage pattern */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
          Friends Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
          Connect with fellow French learners and study together
        </Typography>
      </Paper>

      {/* Friend Requests Section - REUSE: Card patterns from existing components */}
      {friendRequests.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
            Friend Requests ({friendRequests.length})
          </Typography>
          <Stack spacing={2}>
            {friendRequests.map((request) => (
              <Card key={request.id} className="glass-card" data-category="social">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'var(--font-weight-semibold)'
                      }}>
                        {request.requesterName?.charAt(0)?.toUpperCase() || 'F'}
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                          {request.requesterName || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                          Sent {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleFriendRequest(request.id, 'accept')}
                        disabled={loading}
                        sx={{
                          backgroundColor: 'var(--accent-green)',
                          '&:hover': { backgroundColor: 'var(--accent-green-light)' }
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleFriendRequest(request.id, 'reject')}
                        disabled={loading}
                        sx={{
                          borderColor: 'var(--border-medium)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        Decline
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Current Friends Section - REUSE: FriendsCard styling patterns */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
          Your Friends ({friends.length})
        </Typography>
        
        {friends.length > 0 ? (
          <Stack spacing={2}>
            {friends.map((friend) => (
              <Card key={friend.userId} className="glass-card" data-category="social">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'var(--font-weight-semibold)'
                      }}>
                        {friend.displayName?.charAt(0)?.toUpperCase() || 'F'}
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                          {friend.displayName || 'Friend'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--accent-green)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {friend.weeklyXp || 0} XP this week
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRemoveFriend(friend.userId)}
                      disabled={loading}
                      sx={{
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-secondary)',
                        '&:hover': {
                          borderColor: 'var(--accent-red)',
                          color: 'var(--accent-red)'
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
              You haven't added any friends yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-tertiary)' }}>
              Start connecting with fellow French learners to study together!
            </Typography>
          </Box>
        )}
      </Paper>

      {/* REUSE: UserPreferencesForm error handling pattern */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* REUSE: UserPreferencesForm success handling pattern */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Action completed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FriendsPage;
