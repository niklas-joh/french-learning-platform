# Task 3.1.D: Practice Page Integration

## **Objective**
Integrate the AI tutor into the Practice tab with lesson-specific scenarios and guided conversations, following existing page patterns.

## **Status**: Not Started

## **Key Activities**
1. **Enhance Practice Page**: Update `client/src/pages/PracticePage.tsx` with tabbed interface
2. **Integrate AI Tutor**: Add AI Tutor component as primary tab
3. **Create Supporting Tabs**: Add placeholder tabs for future features (Speaking, Quiz, Scenarios)
4. **Implement Tab Navigation**: Smooth transitions between practice modes
5. **Add Conversation Scenarios**: Predefined practice scenarios for AI conversations

## **Implementation Details**

### **Files to Modify**
- `client/src/pages/PracticePage.tsx` (major enhancement with tabs)

### **Files to Create**
- `client/src/components/practice/ConversationScenarios.tsx` (scenario selection)
- `client/src/components/practice/SpeakingPractice.tsx` (placeholder)
- `client/src/components/practice/QuickQuiz.tsx` (placeholder)

### **Tab Structure**
1. **AI Tutor Tab**: Primary conversational learning interface
2. **Speaking Tab**: Placeholder for future speech recognition (Task 3.2)
3. **Quick Quiz Tab**: Placeholder for adaptive quizzing
4. **Scenarios Tab**: Predefined conversation starters and practice scenarios

### **Design Requirements**
- **Material-UI Tabs**: Use consistent tab component with app styling
- **Mobile Optimization**: Bottom tab navigation for mobile
- **French Theme**: Consistent with existing app colors and gradients
- **Smooth Transitions**: Page transitions and tab switching animations
- **State Persistence**: Maintain AI conversation when switching tabs

### **Conversation Scenarios**
```typescript
interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  duration: string;
  prompt: string;
  targetPhrases: string[];
  category: 'daily' | 'travel' | 'business' | 'culture';
}
```

### **Predefined Scenarios**
- **A1 Level**: "At the Café", "Greetings", "Shopping for basics"
- **A2 Level**: "Asking for directions", "Making appointments", "Describing family"
- **B1 Level**: "Job interview", "Expressing opinions", "Travel planning"
- **B2+ Level**: "Debate topics", "Cultural discussions", "Professional presentations"

### **State Management**
- **Tab State**: Persist across navigation
- **Conversation State**: Maintain AI chat history when switching tabs
- **Scenario State**: Track completed scenarios and progress
- **Performance**: Lazy load tab content to improve initial load time

### **Review Points & Solutions**
- **Memory Management**: Only render active tab content
- **State Persistence**: Use React state lifting to maintain conversation
- **Performance**: Implement lazy loading for heavy components
- **Accessibility**: Proper tab navigation with keyboard support

### **TODOs for Future Enhancement**
- TODO: Add speaking practice integration (Task 3.2)
- TODO: Implement adaptive quiz system
- TODO: Add scenario progress tracking
- TODO: Connect scenarios to user level and progress

## **Acceptance Criteria**
- [ ] Practice page has functional tab navigation
- [ ] AI Tutor tab integrates seamlessly
- [ ] Conversation scenarios display with proper categorization
- [ ] Placeholder tabs show appropriate "coming soon" content
- [ ] Tab state persists during navigation
- [ ] Mobile-responsive design works correctly
- [ ] Smooth animations and transitions
- [ ] Scenarios launch AI conversations with proper context

## **Testing Instructions**
1. Navigate to Practice page
2. Test all tab navigation
3. Start AI conversation in AI Tutor tab
4. Switch to other tabs and back, verify conversation persists
5. Click on conversation scenarios and verify they start AI chats
6. Test mobile responsiveness
7. Verify accessibility with keyboard navigation

## **Dependencies**
- Task 3.1.B: Conversational Interface (AI Tutor component)
- Task 3.1.C: Learning Context Integration (for scenario personalization)
- Existing navigation and page structure
- Design tokens and theme system

---

## **Implementation Timeline**
- **Estimated Time**: 2-3 hours
- **Dependencies**: Must complete 3.1.B and 3.1.C first
- **Completed**: [To be filled during implementation]
