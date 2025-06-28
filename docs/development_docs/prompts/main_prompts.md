## First review
Identify the next task in @/docs\development_docs\app_overhaul_plan.md.

Conduct a detailed analysis of your approach, impacted files, dependencies, and create concrete developing suggestions. Adhere to the PRD in @/docs/development_docs/language_learning_prd.md and capture/follow the detailes outlined inthe @/docs/development_docs/tasks folder.

Make sure it is future-proof, following best coding standards, and reuses existing content whenever possible. Follow KISS.

If the task require larger changes, expand the tasks into subtask, update the @/docs\development_docs\app_overhaul_plan.md with the subtasks.

## Second review
What are the changes needed in these files, and are there other files that needs update (e.g. @/docs\development_docs\architecture\system_architecture.mermaid  , @/database\schema.sql , @/docs\development_docs\architecture\database_schema.mermaid  or other high-level overview documents)? 

Consider impacts on Architecture and technical documents, plans etc., before starting any code work.

## Third and final review
Now criticise your approach, identifying flaws or ineffiencies, validate that you are reusing existing logic, follow best coding practices, and think of performance and efficient functionalities. When you find a better coding option, implement this in the code instead. If the change is too large to do under this scope, add it as a subtask in @/docs\development_docs\app_overhaul_plan.md, capture it as a TODO within the code with clear explanations. If outside current scope, add it as a future implementation in @/docs\development_docs\future_implementation_considerations.md 

## ACT MODE
If you have found tasks for future use, add them to @\docs\development_docs\future_implementation_considerations.md before working on other activities. Then proceed to work on your identified sub-task one by one, following this approach for each subtask:
1. Develop the proposed code
2. Review your code for consistency, logic and potential flaws
3. Analyse if changes are needed to other files
4. Ask me to validate, explaining how I can validate, expected outcome
5. Update documentation plans with our progress
6. Push to git with comprehensive message and git body in a separate file
7. Create a new Cline task for the next subtask to keep to atomic changes.


## Creating subtasks
Provide details of the changes in each of these subtasks, including any example code you have already identified. Also include dependent files, review points you raised above to be aware of, possible solutions.