# Task 3.1.G: Conversation Persistence

## **Objective**
Implement persistent conversation management so users can resume AI conversations across sessions and maintain long-term learning relationships with the AI tutor.

## **Status**: Not Started (Future Subtask)

## **Key Activities**
1. **Database Schema**: Create tables for conversation and message storage
2. **Conversation API**: Endpoints for creating, retrieving, and managing conversations
3. **Message Threading**: Organize conversations by topic or learning session
4. **Conversation History**: Allow users to view and search past conversations
5. **Context Continuity**: Maintain conversation context across sessions

## **Implementation Details**

### **Database Schema**
```sql
CREATE TABLE ai_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  title VARCHAR(255),
  topic VARCHAR(100), -- 'general', 'grammar', 'vocabulary', 'pronunciation'
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  metadata JSON, -- lesson context, user level when started, etc.
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE ai_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversationId INTEGER NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSON, -- suggestions, confidence score, etc.
  FOREIGN KEY (conversationId) REFERENCES ai_conversations(id)
);
```

### **Files to Create**
- `server/src/models/AIConversation.ts` (conversation data model)
- `server/src/models/AIMessage.ts` (message data model)
- `server/src/services/conversationService.ts` (conversation management)
- `server/src/controllers/conversationController.ts` (API endpoints)
- `client/src/components/ai/ConversationHistory.tsx` (history UI)

## **Acceptance Criteria**
- [ ] Conversations persist across browser sessions
- [ ] Users can view chronological conversation history
- [ ] Search functionality works across all conversations
- [ ] Conversation context maintained when resuming
- [ ] Data privacy controls allow user management of data
- [ ] Performance remains good with large conversation volumes
- [ ] Mobile interface provides good UX for conversation management

## **Dependencies**
- Task 3.1.B: Conversational Interface (base chat system)
- Database migration system for new tables
- Search indexing for message content
- User authentication for data security

---

## **Implementation Timeline**
- **Estimated Time**: 3-4 hours
- **Priority**: Medium (UX enhancement)
- **Dependencies**: Basic AI chat functionality must exist
- **Completed**: [To be filled during implementation]
