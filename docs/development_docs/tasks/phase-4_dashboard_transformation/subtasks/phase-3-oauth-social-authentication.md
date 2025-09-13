# Phase 3: OAuth & Social Authentication

**Phase**: 3 of 5  
**Priority**: HIGH  
**Estimated Duration**: 4-5 days  
**Dependencies**: Phase 1 (Database schema), Phase 2 (Gamification) must be completed  
**Deliverable**: Full OAuth integration (Google/Facebook), social authentication, and friend system foundation

## Overview

Implement comprehensive OAuth integration with Google and Facebook, extending existing JWT-based authentication while maintaining backward compatibility. Establish social authentication infrastructure and friend management system that integrates with the gamification system.

## Design Specifications

### OAuth Authentication Flow
Following modern OAuth 2.0 standards with PKCE:

**Login Options:**
- Enhanced login page with Google and Facebook buttons
- Existing email/password login preserved
- Account linking for existing users
- Smooth onboarding for new OAuth users

**Social Profile Integration:**
- Profile pictures from OAuth providers
- Display name preferences
- Locale and language preferences
- Account linking/unlinking interface

**Visual Design:**
- OAuth buttons following platform guidelines (Google: white/blue, Facebook: blue)
- Loading states during OAuth flow
- Error handling with user-friendly messages
- Account linking confirmation dialogs

### Friend System UI
Based on your mockup's leaderboard concept:

**Friend Discovery:**
- Search by email or display name
- Import from OAuth provider contacts (with permission)
- Friend suggestions based on mutual connections
- QR code sharing for in-person connections

**Friend Management:**
- Friend request notifications
- Accept/decline interface
- Friend list with online status
- Remove friend with confirmation

**Social Integration:**
- Friend progress comparison
- Leaderboard highlighting friends
- Study together invitations (future feature)
- Achievement sharing notifications

## Detailed Changes Required

### 1. OAuth Service Implementation (NEW)

**File**: `server/src/services/oauthService.ts`
```typescript
/**
 * OAuth Authentication Service
 * 
 * Handles Google and Facebook OAuth integration with account linking,
 * profile synchronization, and social feature integration.
 * Maintains backward compatibility with existing JWT authentication.
 * 
 * @version 1.0.0
 * @author Dashboard Transformation Team
 */

import db from '../config/db.js';
import type { Knex as KnexTypes } from 'knex';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

// OAuth Provider Types
export interface OAuthProfile {
  provider: 'google' | 'facebook';
  providerId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  locale?: string;
  rawProfile: any; // Store full provider response
}

export interface OAuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  oauthProfiles: OAuthProfile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  user: OAuthUser;
  token: string;
  isNewUser: boolean;
  linkedAccount?: boolean;
}

// OAuth Configuration
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Authenticate user with Google OAuth token
 * Handles both new user creation and existing user linking
 * 
 * @param googleToken - Google ID token from client
 * @param existingUserId - Optional: link to existing user account
 * @returns Authentication result with user and JWT token
 */
export async function authenticateWithGoogle(
  googleToken: string,
  existingUserId?: number
): Promise<AuthResult> {
  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }
    
    const oauthProfile: OAuthProfile = {
      provider: 'google',
      providerId: payload.sub,
      email: payload.email || '',
      displayName: payload.name || '',
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      profilePictureUrl: payload.picture,
      locale: payload.locale,
      rawProfile: payload
    };
    
    return await processOAuthAuthentication(oauthProfile, existingUserId);
    
  } catch (error) {
    console.error('Google OAuth authentication failed:', error);
    throw new Error('Google authentication failed');
  }
}

/**
 * Authenticate user with Facebook OAuth token
 * 
 * @param facebookToken - Facebook access token from client
 * @param existingUserId - Optional: link to existing user account
 * @returns Authentication result with user and JWT token
 */
export async function authenticateWithFacebook(
  facebookToken: string,
  existingUserId?: number
): Promise<AuthResult> {
  try {
    // Verify Facebook token and get user info
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${facebookToken}&fields=id,name,email,first_name,last_name,picture.type(large),locale`
    );
    
    const fbData = response.data;
    if (!fbData.id) {
      throw new Error('Invalid Facebook token response');
    }
    
    const oauthProfile: OAuthProfile = {
      provider: 'facebook',
      providerId: fbData.id,
      email: fbData.email || '',
      displayName: fbData.name || '',
      firstName: fbData.first_name || '',
      lastName: fbData.last_name || '',
      profilePictureUrl: fbData.picture?.data?.url,
      locale: fbData.locale,
      rawProfile: fbData
    };
    
    return await processOAuthAuthentication(oauthProfile, existingUserId);
    
  } catch (error) {
    console.error('Facebook OAuth authentication failed:', error);
    throw new Error('Facebook authentication failed');
  }
}

/**
 * Process OAuth authentication - handles both new users and account linking
 * 
 * @param oauthProfile - OAuth profile from provider
 * @param existingUserId - Optional: link to existing user
 * @returns Authentication result
 */
async function processOAuthAuthentication(
  oauthProfile: OAuthProfile,
  existingUserId?: number
): Promise<AuthResult> {
  return db.transaction(async (trx: KnexTypes.Transaction) => {
    try {
      // Check if this OAuth account already exists
      const existingOAuth = await trx('oauthProfiles')
        .where({ provider: oauthProfile.provider, providerId: oauthProfile.providerId })
        .first();
      
      let user: OAuthUser;
      let isNewUser = false;
      let linkedAccount = false;
      
      if (existingOAuth) {
        // OAuth account exists - get associated user
        user = await getUserWithOAuthProfiles(existingOAuth.userId, trx);
        
        // Update OAuth profile with latest data
        await trx('oauthProfiles')
          .where({ id: existingOAuth.id })
          .update({
            email: oauthProfile.email,
            displayName: oauthProfile.displayName,
            firstName: oauthProfile.firstName,
            lastName: oauthProfile.lastName,
            profilePictureUrl: oauthProfile.profilePictureUrl,
            locale: oauthProfile.locale,
            rawProfile: JSON.stringify(oauthProfile.rawProfile),
            updatedAt: trx.fn.now()
          });
        
      } else if (existingUserId) {
        // Link OAuth account to existing user
        await trx('oauthProfiles').insert({
          userId: existingUserId,
          provider: oauthProfile.provider,
          providerId: oauthProfile.providerId,
          email: oauthProfile.email,
          displayName: oauthProfile.displayName,
          firstName: oauthProfile.firstName,
          lastName: oauthProfile.lastName,
          profilePictureUrl: oauthProfile.profilePictureUrl,
          locale: oauthProfile.locale,
          rawProfile: JSON.stringify(oauthProfile.rawProfile)
        });
        
        user = await getUserWithOAuthProfiles(existingUserId, trx);
        linkedAccount = true;
        
      } else {
        // Check for existing user with same email
        const existingUser = await trx('users')
          .where({ email: oauthProfile.email })
          .first();
        
        if (existingUser) {
          // Link OAuth to existing email-based account
          await trx('oauthProfiles').insert({
            userId: existingUser.id,
            provider: oauthProfile.provider,
            providerId: oauthProfile.providerId,
            email: oauthProfile.email,
            displayName: oauthProfile.displayName,
            firstName: oauthProfile.firstName,
            lastName: oauthProfile.lastName,
            profilePictureUrl: oauthProfile.profilePictureUrl,
            locale: oauthProfile.locale,
            rawProfile: JSON.stringify(oauthProfile.rawProfile)
          });
          
          user = await getUserWithOAuthProfiles(existingUser.id, trx);
          linkedAccount = true;
          
        } else {
          // Create new user
          const [userId] = await trx('users').insert({
            email: oauthProfile.email,
            passwordHash: '', // OAuth users don't have password
            firstName: oauthProfile.firstName,
            lastName: oauthProfile.lastName,
            role: 'user'
          }).returning('id');
          
          const newUserId = typeof userId === 'object' ? userId.id : userId;
          
          // Create OAuth profile
          await trx('oauthProfiles').insert({
            userId: newUserId,
            provider: oauthProfile.provider,
            providerId: oauthProfile.providerId,
            email: oauthProfile.email,
            displayName: oauthProfile.displayName,
            firstName: oauthProfile.firstName,
            lastName: oauthProfile.lastName,
            profilePictureUrl: oauthProfile.profilePictureUrl,
            locale: oauthProfile.locale,
            rawProfile: JSON.stringify(oauthProfile.rawProfile)
          });
          
          // Initialize gamification for new user
          const { initializeUserGamification } = await import('./gamificationService.js');
          await initializeUserGamification(newUserId, trx);
          
          user = await getUserWithOAuthProfiles(newUserId, trx);
          isNewUser = true;
        }
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      
      console.log(`[OAuth] ${oauthProfile.provider} authentication successful for user ${user.id}`);
      
      return {
        user,
        token,
        isNewUser,
        linkedAccount
      };
      
    } catch (error) {
      console.error('Error processing OAuth authentication:', error);
      throw error;
    }
  });
}

/**
 * Link OAuth account to existing user
 * 
 * @param userId - Existing user ID
 * @param provider - OAuth provider
 * @param oauthToken - OAuth token from provider
 * @returns Success status
 */
export async function linkOAuthAccount(
  userId: number,
  provider: 'google' | 'facebook',
  oauthToken: string
): Promise<{ success: boolean; profile?: OAuthProfile }> {
  try {
    // Authenticate with provider to get profile
    let authResult: AuthResult;
    
    if (provider === 'google') {
      authResult = await authenticateWithGoogle(oauthToken, userId);
    } else {
      authResult = await authenticateWithFacebook(oauthToken, userId);
    }
    
    return {
      success: true,
      profile: authResult.user.oauthProfiles.find(p => p.provider === provider)
    };
    
  } catch (error) {
    console.error('Error linking OAuth account:', error);
    return { success: false };
  }
}

/**
 * Unlink OAuth account from user
 * 
 * @param userId - User ID
 * @param provider - OAuth provider to unlink
 * @returns Success status
 */
export async function unlinkOAuthAccount(
  userId: number,
  provider: 'google' | 'facebook'
): Promise<{ success: boolean }> {
  try {
    // Check if user has password or other OAuth method
    const user = await db('users').where({ id: userId }).first();
    const oauthProfiles = await db('oauthProfiles').where({ userId });
    
    if (!user.passwordHash && oauthProfiles.length === 1) {
      throw new Error('Cannot unlink the only authentication method. Please set a password first.');
    }
    
    await db('oauthProfiles')
      .where({ userId, provider })
      .del();
    
    console.log(`[OAuth] Unlinked ${provider} account for user ${userId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error unlinking OAuth account:', error);
    throw error;
  }
}

/**
 * Get user with OAuth profiles
 * 
 * @param userId - User ID
 * @param trx - Optional database transaction
 * @returns User with OAuth profiles
 */
async function getUserWithOAuthProfiles(
  userId: number, 
  trx?: KnexTypes.Transaction
): Promise<OAuthUser> {
  const database = trx || db;
  
  const user = await database('users').where({ id: userId }).first();
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  
  const oauthProfiles = await database('oauthProfiles')
    .where({ userId })
    .select('*');
  
  return {
    ...user,
    oauthProfiles: oauthProfiles.map(profile => ({
      ...profile,
      rawProfile: typeof profile.rawProfile === 'string' 
        ? JSON.parse(profile.rawProfile) 
        : profile.rawProfile
    }))
  };
}

/**
 * Get user's OAuth profiles
 * 
 * @param userId - User ID
 * @returns Array of OAuth profiles
 */
export async function getUserOAuthProfiles(userId: number): Promise<OAuthProfile[]> {
  try {
    const profiles = await db('oauthProfiles')
      .where({ userId })
      .select('*');
    
    return profiles.map(profile => ({
      ...profile,
      rawProfile: typeof profile.rawProfile === 'string' 
        ? JSON.parse(profile.rawProfile) 
        : profile.rawProfile
    }));
    
  } catch (error) {
    console.error('Error getting OAuth profiles:', error);
    return [];
  }
}
```

**File**: `server/src/services/socialService.ts`
```typescript
/**
 * Social Service - Friends, Leaderboards, and Social Features
 * 
 * Manages friend relationships, social interactions, and leaderboard functionality.
 * Integrates with OAuth service for enhanced social discovery and gamification system.
 * 
 * @version 1.0.0
 * @author Dashboard Transformation Team
 */

import db from '../config/db.js';
import type { Knex as KnexTypes } from 'knex';

// Social Types
export interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  acceptedAt?: Date;
}

export interface FriendProfile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  profilePictureUrl?: string;
  currentLevel: string;
  totalXp: number;
  weeklyXp: number;
  currentStreak: number;
  friendshipStatus: 'pending' | 'accepted' | 'none';
  friendshipId?: number;
}

export interface LeaderboardEntry {
  id: number;
  userId: number;
  displayName: string;
  profilePictureUrl?: string;
  weeklyXp: number;
  totalXp: number;
  currentStreak: number;
  rank: number;
  badge?: string;
  isFriend: boolean;
}

export interface SocialStats {
  friendsCount: number;
  leaderboardRank: number;
  weeklyRank: number;
  studyGroupsCount: number;
}

/**
 * Send friend request
 * 
 * @param userId - User sending the request
 * @param friendId - User receiving the request
 * @returns Created friendship record
 */
export async function sendFriendRequest(userId: number, friendId: number): Promise<Friendship> {
  if (userId === friendId) {
    throw new Error('Cannot send friend request to yourself');
  }
  
  try {
    // Check if friendship already exists
    const existingFriendship = await db('friendships')
      .where((builder) => {
        builder
          .where({ userId, friendId })
          .orWhere({ userId: friendId, friendId: userId });
      })
      .first();
    
    if (existingFriendship) {
      if (existingFriendship.status === 'pending') {
        throw new Error('Friend request already sent');
      } else if (existingFriendship.status === 'accepted') {
        throw new Error('Users are already friends');
      } else if (existingFriendship.status === 'blocked') {
        throw new Error('Cannot send friend request - user blocked');
      }
    }
    
    // Create friend request
    const [friendshipId] = await db('friendships')
      .insert({
        userId,
        friendId,
        status: 'pending',
        createdAt: db.fn.now()
      })
      .returning('id');
    
    const friendship = await db('friendships')
      .where({ id: typeof friendshipId === 'object' ? friendshipId.id : friendshipId })
      .first();
    
    console.log(`[Social] Friend request sent from user ${userId} to user ${friendId}`);
    return friendship;
    
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
}

/**
 * Accept friend request
 * 
 * @param userId - User accepting the request
 * @param requestId - Friendship record ID
 * @returns Updated friendship record
 */
export async function acceptFriendRequest(userId: number, requestId: number): Promise<Friendship> {
  return db.transaction(async (trx: KnexTypes.Transaction) => {
    try {
      // Get the friend request
      const friendship = await trx('friendships')
        .where({ id: requestId, friendId: userId, status: 'pending' })
        .first();
      
      if (!friendship) {
        throw new Error('Friend request not found or already processed');
      }
      
      // Accept the request
      await trx('friendships')
        .where({ id: requestId })
        .update({
          status: 'accepted',
          acceptedAt: trx.fn.now()
        });
      
      const updatedFriendship = await trx('friendships')
        .where({ id: requestId })
        .first();
      
      // Award social badges if applicable
      const { checkAndAwardAchievements } = await import('./gamificationService.js');
      await checkAndAwardAchievements(userId, 'friend_accepted', trx);
      await checkAndAwardAchievements(friendship.userId, 'friend_accepted', trx);
      
      console.log(`[Social] Friend request accepted between users ${friendship.userId} and ${userId}`);
      return updatedFriendship;
      
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  });
}

/**
 * Decline friend request
 * 
 * @param userId - User declining the request
 * @param requestId - Friendship record ID
 * @returns Success status
 */
export async function declineFriendRequest(userId: number, requestId: number): Promise<void> {
  try {
    const friendship = await db('friendships')
      .where({ id: requestId, friendId: userId, status: 'pending' })
      .first();
    
    if (!friendship) {
      throw new Error('Friend request not found');
    }
    
    await db('friendships').where({ id: requestId }).del();
    
    console.log(`[Social] Friend request declined by user ${userId}`);
  } catch (error) {
    console.error('Error declining friend request:', error);
    throw error;
  }
}

/**
 * Remove friendship
 * 
 * @param userId - User initiating removal
 * @param friendId - Friend to remove
 * @returns Success status
 */
export async function removeFriend(userId: number, friendId: number): Promise<void> {
  try {
    await db('friendships')
      .where((builder) => {
        builder
          .where({ userId, friendId, status: 'accepted' })
          .orWhere({ userId: friendId, friendId: userId, status: 'accepted' });
      })
      .del();
    
    console.log(`[Social] Friendship removed between users ${userId} and ${friendId}`);
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}

/**
 * Get user's friends list
 * 
 * @param userId - User ID
 * @param options - Query options
 * @returns Array of friend profiles
 */
export async function getFriendsList(
  userId: number,
  options: {
    status?: 'pending' | 'accepted';
    limit?: number;
    search?: string;
  } = {}
): Promise<FriendProfile[]> {
  try {
    let query = db('friendships as f')
      .leftJoin('users as u', function() {
        this.on('u.id', '=', 'f.friendId').andOn('f.userId', '=', db.raw('?', [userId]))
          .orOn('u.id', '=', 'f.userId').andOn('f.friendId', '=', db.raw('?', [userId]));
      })
      .leftJoin('userProgress as up', 'u.id', 'up.userId')
      .leftJoin('oauthProfiles as op', 'u.id', 'op.userId')
      .where((builder) => {
        builder
          .where('f.userId', userId)
          .orWhere('f.friendId', userId);
      })
      .where('u.id', '!=', userId) // Exclude self
      .select(
        'u.id',
        'u.email',
        'u.firstName',
        'u.lastName', 
        'up.currentLevel',
        'up.totalXp',
        'up.weeklyXp',
        'up.streakDays as currentStreak',
        'f.id as friendshipId',
        'f.status as friendshipStatus',
        db.raw('COALESCE(op.displayName, CONCAT(u.firstName, " ", u.lastName), u.email) as displayName'),
        'op.profilePictureUrl'
      );
    
    if (options.status) {
      query = query.where('f.status', options.status);
    }
    
    if (options.search) {
      query = query.where((builder) => {
        builder
          .where('u.email', 'like', `%${options.search}%`)
          .orWhere('u.firstName', 'like', `%${options.search}%`)
          .orWhere('u.lastName', 'like', `%${options.search}%`)
          .orWhere('op.displayName', 'like', `%${options.search}%`);
      });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const friends = await query;
    
    return friends.map((friend: any) => ({
      ...friend,
      totalXp: friend.totalXp || 0,
      weeklyXp: friend.weeklyXp || 0,
      currentStreak: friend.currentStreak || 0,
      currentLevel: friend.currentLevel || 'A1'
    }));
    
  } catch (error) {
    console.error('Error getting friends list:', error);
    return [];
  }
}

/**
 * Get weekly leaderboard with friend highlighting
 * 
 * @param userId - Current user ID (for friend status)
 * @param limit - Number of results to return
 * @returns Leaderboard entries
 */
export async function getWeeklyLeaderboard(
  userId?: number,
  limit: number = 20
): Promise<LeaderboardEntry[]> {
  try {
    let query = db('userProgress as up')
      .join('users as u', 'up.userId', 'u.id')
      .leftJoin('oauthProfiles as op', 'u.id', 'op.userId')
      .leftJoin('userBadges as ub', function() {
        this.on('u.id', '=', 'ub.userId');
      })
      .leftJoin('badges as b', function() {
        this.on('ub.badgeId', '=', 'b.id')
          .andOn('b.rarity', '=', db.raw('?', ['legendary'])); // Only show legendary badges
      })
      .where('up.weeklyXp', '>', 0)
      .select(
        'u.id',
        'up.userId',
        'up.weeklyXp',
        'up.totalXp',
        'up.streakDays as currentStreak',
        'up.leaderboardRank as rank',
        db.raw('COALESCE(op.displayName, CONCAT(u.firstName, " ", u.lastName), u.email) as displayName'),
        'op.profilePictureUrl',
        'b.name as badge'
      )
      .orderBy('up.weeklyXp', 'desc')
      .limit(limit);
    
    const leaderboardData = await query;
    
    // If userId provided, determine friend status
    let friendIds: number[] = [];
    if (userId) {
      const friendships = await db('friendships')
        .where((builder) => {
          builder.where('userId', userId).orWhere('friendId', userId);
        })
        .where('status', 'accepted');
      
      friendIds = friendships.map(f => 
        f.userId === userId ? f.friendId : f.userId
      );
    }
    
    return leaderboardData.map((entry: any, index: number) => ({
      id: entry.id,
      userId: entry.userId,
      displayName: entry.displayName || 'Anonymous',
      profilePictureUrl: entry.profilePictureUrl,
      weeklyXp: entry.weeklyXp || 0,
      totalXp: entry.totalXp || 0,
      currentStreak: entry.currentStreak || 0,
      rank: index + 1, // Calculate actual rank
      badge: entry.badge,
      isFriend: friendIds.includes(entry.userId)
    }));
    
  } catch (error) {
    console.error('Error getting weekly leaderboard:', error);
    return [];
  }
}

/**
 * Get user's social statistics
 * 
 * @param userId - User ID
 * @returns Social statistics
 */
export async function getUserSocialStats(userId: number): Promise<SocialStats> {
  try {
    const [friendsCount, userProgress] = await Promise.all([
      // Count accepted friends
      db('friendships')
        .where((builder) => {
          builder.where('userId', userId).orWhere('friendId', userId);
        })
        .where('status', 'accepted')
        .count('* as count')
        .first(),
      
      // Get user progress with ranks
      db('userProgress')
        .where('userId', userId)
        .first()
    ]);
    
    return {
      friendsCount: friendsCount?.count || 0,
      leaderboardRank: userProgress?.leaderboardRank || 0,
      weeklyRank: userProgress?.leaderboardRank || 0, // Same as leaderboard for now
      studyGroupsCount: 0 // Future feature
    };
    
  } catch (error) {
    console.error('Error getting social stats:', error);
    return {
      friendsCount: 0,
      leaderboardRank: 0,
      weeklyRank: 0,
      studyGroupsCount: 0
    };
  }
}

/**
 * Find users by email for friend discovery
 * 
 * @param email - Email to search for
 * @param currentUserId - Current user ID (to exclude from results)
 * @returns Array of matching user profiles
 */
export async function findUsersByEmail(email: string, currentUserId: number): Promise<FriendProfile[]> {
  try {
    const users = await db('users as u')
      .leftJoin('userProgress as up', 'u.id', 'up.userId')
      .leftJoin('oauthProfiles as op', 'u.id', 'op.userId')
      .leftJoin('friendships as f', function() {
        this.on((builder) => {
          builder
            .on('f.userId', '=', 'u.id').andOn('f.friendId', '=', db.raw('?', [currentUserId]))
            .orOn('f.friendId', '=', 'u.id').andOn('f.userId', '=', db.raw('?', [currentUserId]));
        });
      })
      .where('u.email', 'like', `%${email}%`)
      .where('u.id', '!=', currentUserId)
      .select(
        'u.id',
        'u.email',
        'u.firstName',
        'u.lastName',
        'up.currentLevel',
        'up.totalXp',
        'up.weeklyXp',
        'up.streakDays as currentStreak',
        'f.id as friendshipId',
        'f.status as friendshipStatus',
        db.raw('COALESCE(op.displayName, CONCAT(u.firstName, " ", u.lastName), u.email) as displayName'),
        'op.profilePictureUrl'
      )
      .limit(10);
    
    return users.map((user: any) => ({
      ...user,
      totalXp: user.totalXp || 0,
      weeklyXp: user.weeklyXp || 0,
      currentStreak: user.currentStreak || 0,
      currentLevel: user.currentLevel || 'A1',
      friendshipStatus: user.friendshipStatus || 'none'
    }));
    
  } catch (error) {
    console.error('Error finding users by email:', error);
    return [];
  }
}

/**
 * Get friend requests for user (both incoming and outgoing)
 * 
 * @param userId - User ID
 * @param type - Type of requests ('incoming' | 'outgoing' | 'all')
 * @returns Array of friend requests
 */
export async function getFriendRequests(
  userId: number,
  type: 'incoming' | 'outgoing' | 'all' = 'incoming'
): Promise<{incoming: FriendProfile[], outgoing: FriendProfile[]}> {
  try {
    let incomingRequests: FriendProfile[] = [];
    let outgoingRequests: FriendProfile[] = [];
    
    if (type === 'incoming' || type === 'all') {
      incomingRequests = await getFriendsList(userId, { status: 'pending' });
    }
    
    if (type === 'outgoing' || type === 'all') {
      const outgoing = await db('friendships as f')
        .join('users as u', 'f.friendId', 'u.id')
        .leftJoin('userProgress as up', 'u.id', 'up.userId')
        .leftJoin('oauthProfiles as op', 'u.id', 'op.userId')
        .where({ 'f.userId': userId, 'f.status': 'pending' })
        .select(
          'u.id',
          'u.email',
          'u.firstName',
          'u.lastName',
          'up.currentLevel',
          'up.totalXp',
          'up.weeklyXp',
          'up.streakDays as currentStreak',
          'f.id as friendshipId',
          'f.status as friendshipStatus',
          db.raw('COALESCE(op.displayName, CONCAT(u.firstName, " ", u.lastName), u.email) as displayName'),
          'op.profilePictureUrl'
        );
      
      outgoingRequests = outgoing.map((user: any) => ({
        ...user,
        totalXp: user.totalXp || 0,
        weeklyXp: user.weeklyXp || 0,
        currentStreak: user.currentStreak || 0,
        currentLevel: user.currentLevel || 'A1'
      }));
    }
    
    return { incoming: incomingRequests, outgoing: outgoingRequests };
    
  } catch (error) {
    console.error('Error getting friend requests:', error);
    return { incoming: [], outgoing: [] };
  }
}
```

### 2. Authentication Service Extensions (MODIFY EXISTING)

**File**: `server/src/services/authServiceFactory.ts`
**Changes**: Add OAuth integration to existing auth service (EXTEND: +120 lines)

```typescript
// ADD TO EXISTING authServiceFactory.ts

import { 
  authenticateWithGoogle, 
  authenticateWithFacebook,
  linkOAuthAccount,
  unlinkOAuthAccount,
  getUserOAuthProfiles
} from './oauthService.js';

/**
 * OAuth Authentication Factory Extension
 * Extends existing auth service with OAuth capabilities
 */
export class OAuthAuthenticationService {
  constructor(private authService: any) {}
  
  /**
   * Authenticate with Google OAuth
   * 
   * @param googleToken - Google ID token
   * @param existingUserId - Optional: link to existing user
   * @returns Authentication result
   */
  async authenticateWithGoogle(googleToken: string, existingUserId?: number) {
    return authenticateWithGoogle(googleToken, existingUserId);
  }
  
  /**
   * Authenticate with Facebook OAuth
   * 
   * @param facebookToken - Facebook access token
   * @param existingUserId - Optional: link to existing user
   * @returns Authentication result
   */
  async authenticateWithFacebook(facebookToken: string, existingUserId?: number) {
    return authenticateWithFacebook(facebookToken, existingUserId);
  }
  
  /**
   * Link OAuth account to existing user
   * 
   * @param userId - User ID
   * @param provider - OAuth provider
   * @param token - OAuth token
   * @returns Link result
   */
  async linkOAuthAccount(userId: number, provider: 'google' | 'facebook', token: string) {
    return linkOAuthAccount(userId, provider, token);
  }
  
  /**
   * Unlink OAuth account
   * 
   * @param userId - User ID  
   * @param provider - OAuth provider
   * @returns Unlink result
   */
  async unlinkOAuthAccount(userId: number, provider: 'google' | 'facebook') {
    return unlinkOAuthAccount(userId, provider);
  }
  
  /**
   * Get user's OAuth profiles
   * 
   * @param userId - User ID
   * @returns OAuth profiles
   */
  async getUserOAuthProfiles(userId: number) {
    return getUserOAuthProfiles(userId);
  }
}

// Export OAuth service factory function
export function createOAuthAuthenticationService(authService: any): OAuthAuthenticationService {
  return new OAuthAuthenticationService(authService);
}
```

### 3. API Routes (NEW)

**File**: `server/src/routes/auth.routes.ts` 
**Changes**: Add OAuth endpoints to existing auth routes

```typescript
// ADD TO EXISTING auth.routes.ts

import { 
  authenticateWithGoogle, 
  authenticateWithFacebook,
  linkOAuthAccount,
  unlinkOAuthAccount 
} from '../services/oauthService.js';
import { 
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendsList,
  findUsersByEmail
} from '../services/socialService.js';

// OAuth Authentication Endpoints
router.post('/auth/google', async (req, res) => {
  try {
    const { token, linkToUserId } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }
    
    const result = await authenticateWithGoogle(token, linkToUserId);
    
    res.json({
      success: true,
      user: result.user,
      token: result.token,
      isNewUser: result.isNewUser,
      linkedAccount: result.linkedAccount
    });
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Google authentication failed'
    });
  }
});

router.post('/auth/facebook', async (req, res) => {
  try {
    const { token, linkToUserId } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Facebook token is required' });
    }
    
    const result = await authenticateWithFacebook(token, linkToUserId);
    
    res.json({
      success: true,
      user: result.user,
      token: result.token,
      isNewUser: result.isNewUser,
      linkedAccount: result.linkedAccount
    });
    
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Facebook authentication failed'
    });
  }
});

// Account Linking Endpoints
router.post('/auth/link-oauth', authenticateToken, async (req, res) => {
  try {
    const { provider, token } = req.body;
    const userId = req.user!.id;
    
    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid OAuth provider' });
    }
    
    const result = await linkOAuthAccount(userId, provider, token);
    
    res.json({
      success: result.success,
      profile: result.profile,
      message: `${provider} account linked successfully`
    });
    
  } catch (error) {
    console.error('OAuth linking error:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to link OAuth account'
    });
  }
});

router.delete('/auth/unlink-oauth/:provider', authenticateToken, async (req, res) => {
  try {
    const { provider } = req.params;
    const userId = req.user!.id;
    
    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid OAuth provider' });
    }
    
    const result = await unlinkOAuthAccount(userId, provider as 'google' | 'facebook');
    
    res.json({
      success: result.success,
      message: `${provider} account unlinked successfully`
    });
    
  } catch (error) {
    console.error('OAuth unlinking error:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to unlink OAuth account'
    });
  }
});
```

**File**: `server/src/routes/social.routes.ts` (NEW)
```typescript
/**
 * Social API Routes
 * Handles friends, leaderboards, and social discovery endpoints
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendsList,
  getFriendRequests,
  getWeeklyLeaderboard,
  getUserSocialStats,
  findUsersByEmail
} from '../services/socialService.js';

const router = express.Router();

// Friend Management Endpoints
router.get('/friends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { status, search, limit } = req.query;
    
    const friends = await getFriendsList(userId, {
      status: status as 'pending' | 'accepted',
      search: search as string,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    res.json({ friends });
  } catch (error) {
    console.error('Error getting friends list:', error);
    res.status(500).json({ error: 'Failed to get friends list' });
  }
});

router.get('/friends/requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const type = req.query.type as 'incoming' | 'outgoing' | 'all' || 'incoming';
    
    const requests = await getFriendRequests(userId, type);
    
    res.json(requests);
  } catch (error) {
    console.error('Error getting friend requests:', error);
    res.status(500).json({ error: 'Failed to get friend requests' });
  }
});

router.post('/friends/request', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { friendId } = req.body;
    
    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }
    
    const friendship = await sendFriendRequest(userId, friendId);
    
    res.json({
      success: true,
      friendship,
      message: 'Friend request sent successfully'
    });
    
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to send friend request'
    });
  }
});

router.put('/friends/request/:requestId/accept', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const requestId = parseInt(req.params.requestId);
    
    const friendship = await acceptFriendRequest(userId, requestId);
    
    res.json({
      success: true,
      friendship,
      message: 'Friend request accepted'
    });
    
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to accept friend request'
    });
  }
});

router.delete('/friends/request/:requestId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const requestId = parseInt(req.params.requestId);
    
    await declineFriendRequest(userId, requestId);
    
    res.json({
      success: true,
      message: 'Friend request declined'
    });
    
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to decline friend request'
    });
  }
});

router.delete('/friends/:friendId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const friendId = parseInt(req.params.friendId);
    
    await removeFriend(userId, friendId);
    
    res.json({
      success: true,
      message: 'Friend removed successfully'
    });
    
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to remove friend'
    });
  }
});

// Social Discovery Endpoints
router.get('/users/search', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }
    
    const users = await findUsersByEmail(email, userId);
    
    res.json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Leaderboard Endpoints
router.get('/leaderboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const leaderboard = await getWeeklyLeaderboard(userId, limit);
    
    res.json({ leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

router.get('/social/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const stats = await getUserSocialStats(userId);
    
    res.json({ stats });
  } catch (error) {
    console.error('Error getting social stats:', error);
    res.status(500).json({ error: 'Failed to get social stats' });
  }
});

export default router;
```

### 4. Frontend OAuth Components (NEW)

**File**: `client/src/components/auth/OAuthLogin.tsx`
```typescript
/**
 * OAuth Login Component
 * 
 * Provides Google and Facebook login buttons with proper OAuth flow handling.
 * Integrates with existing authentication context and maintains design consistency.
 */

import React, { useState } from 'react';
import { Box, Button, Divider, Typography, CircularProgress } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';

interface OAuthLoginProps {
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  linkToUserId?: number; // For account linking
  disabled?: boolean;
}

export const OAuthLogin: React.FC<OAuthLoginProps> = ({
  onSuccess,
  onError,
  linkToUserId,
  disabled = false
}) => {
  const [loading, setLoading] = useState<'google' | 'facebook' | null>(null);

  const handleGoogleLogin = async () => {
    setLoading('google');
    try {
      // Google OAuth implementation using Google Identity Services
      if (!(window as any).google) {
        throw new Error('Google OAuth not loaded');
      }

      (window as any).google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            const result = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                token: response.credential,
                linkToUserId 
              })
            });

            const data = await result.json();
            
            if (data.success) {
              onSuccess(data);
            } else {
              onError(data.error || 'Google login failed');
            }
          } catch (error) {
            onError('Google login failed');
          } finally {
            setLoading(null);
          }
        }
      });

      (window as any).google.accounts.id.prompt();
      
    } catch (error) {
      setLoading(null);
      onError('Google login failed to initialize');
    }
  };

  const handleFacebookLogin = async () => {
    setLoading('facebook');
    try {
      // Facebook OAuth implementation using Facebook SDK
      if (!(window as any).FB) {
        throw new Error('Facebook SDK not loaded');
      }

      (window as any).FB.login(async (response: any) => {
        try {
          if (response.authResponse) {
            const result = await fetch('/api/auth/facebook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                token: response.authResponse.accessToken,
                linkToUserId 
              })
            });

            const data = await result.json();
            
            if (data.success) {
              onSuccess(data);
            } else {
              onError(data.error || 'Facebook login failed');
            }
          } else {
            onError('Facebook login cancelled');
          }
        } catch (error) {
          onError('Facebook login failed');
        } finally {
          setLoading(null);
        }
      }, { scope: 'email,public_profile' });
      
    } catch (error) {
      setLoading(null);
      onError('Facebook login failed to initialize');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!linkToUserId && (
        <>
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              or continue with
            </Typography>
          </Divider>
        </>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={loading === 'google' ? 
            <CircularProgress size={20} /> : 
            <GoogleIcon />
          }
          onClick={handleGoogleLogin}
          disabled={disabled || loading !== null}
          sx={{
            py: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#dadce0',
            color: '#3c4043',
            '&:hover': {
              borderColor: '#d2d3d4',
              backgroundColor: '#f8f9fa'
            }
          }}
        >
          {linkToUserId ? 'Link Google Account' : 'Continue with Google'}
        </Button>

        <Button
          fullWidth
          variant="contained"
          startIcon={loading === 'facebook' ? 
            <CircularProgress size={20} color="inherit" /> : 
            <FacebookIcon />
          }
          onClick={handleFacebookLogin}
          disabled={disabled || loading !== null}
          sx={{
            py: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#1877f2',
            '&:hover': {
              backgroundColor: '#166fe5'
            }
          }}
        >
          {linkToUserId ? 'Link Facebook Account' : 'Continue with Facebook'}
        </Button>
      </Box>
    </Box>
  );
};
```

## Dependencies

### Prerequisites
- Phase 1 (Database schema) completed with OAuth and social tables
- Phase 2 (Gamification) completed for badge integration
- Existing JWT authentication system functional

### New Dependencies (ADD TO EXISTING)

**Server Dependencies** (`server/package.json`):
```json
{
  "passport": "^0.6.0",
  "passport-google-oauth20": "^2.0.0", 
  "passport-facebook": "^3.0.0",
  "google-auth-library": "^8.9.0",
  "axios": "^1.5.0"
}
```

**Client Dependencies** (May not be needed - using provider SDKs):
- Google Identity Services (loaded via script tag)
- Facebook SDK (loaded via script tag)

**Environment Variables**:
```bash
# Server .env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Client .env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

## Testing Strategy

### OAuth Integration Testing
```typescript
// Test file: server/src/services/__tests__/oauthService.test.ts
describe('OAuth Service', () => {
  test('should authenticate existing user with Google', async () => {
    const mockToken = 'valid_google_token';
    const result = await authenticateWithGoogle(mockToken);
    
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.isNewUser).toBe(false);
  });

  test('should create new user from OAuth profile', async () => {
    // Mock new user OAuth authentication
  });

  test('should link OAuth account to existing user', async () => {
    // Mock account linking
  });
});
```

### Social Features Testing
- Friend request workflow (send → accept/decline)
- Leaderboard generation and friend highlighting
- Social stats calculation
- User discovery by email

### Integration Testing
- OAuth flow end-to-end testing
- Friend system with gamification integration
- Leaderboard with social features

## Review Points

### Critical Review Areas
1. **OAuth Security**: Token validation, scope permissions, secure storage
2. **Account Linking**: Prevention of account takeover, proper email verification
3. **Privacy**: Friend discovery privacy settings, profile visibility
4. **Performance**: Leaderboard queries with large user bases
5. **Social Features**: Friend spam prevention, blocking functionality

### Possible Solutions Considered

**OAuth Integration Strategy:**
- ✅ **Chosen**: Server-side token verification with client-side SDK (secure and user-friendly)
- ❌ **Rejected**: Server-side redirect flow only (poor mobile UX)
- ❌ **Rejected**: Client-side only verification (security risk)

**Friend System Architecture:**
- ✅ **Chosen**: Bidirectional friendship model with status tracking (clear relationship state)
- ❌ **Rejected**: Following/follower model (less suitable for learning context)
- ❌ **Rejected**: Simple mutual connection (lacks request workflow)

**Social Discovery Approach:**
- ✅ **Chosen**: Email-based search with privacy controls (simple and effective)
- ❌ **Rejected**: OAuth contact import (privacy concerns, complex implementation)
- ❌ **Rejected**: Location-based discovery (not relevant for online learning)

## Success Criteria

### Functional Requirements Met
- [ ] Google and Facebook OAuth login working seamlessly
- [ ] Account linking/unlinking for existing users
- [ ] Friend request workflow (send/accept/decline/remove)
- [ ] User discovery by email search
- [ ] Weekly leaderboard with friend highlighting
- [ ] Social stats integration with gamification system

### Security Requirements
- OAuth tokens properly validated server-side
- Account linking prevents takeover attacks
- Friend requests prevent spam/abuse
- User privacy settings respected

### User Experience Goals
- OAuth login is faster than email/password
- Friend system feels intuitive and social
- Leaderboard motivates friendly competition
- Social features enhance learning motivation

---

**Next Phase**: [Phase 4: Lesson Card System & AI Curation](./phase-4-lesson-card-ai-curation.md)
**Dependencies for Next Phase**: OAuth and social infrastructure operational and tested
