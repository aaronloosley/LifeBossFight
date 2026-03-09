# Firestore Data Structure Guidance

## Collections
- `users/{userId}`
  - `name`, `email`, `photoUrl`, `createdAt`, `updatedAt`
- `missionTemplates/{templateId}`
  - `slug`, `title`, `category`, `summary`, `threatLevel`, `missionType`, `status`, `estimatedMinutes`, `phases`, `stepDefinitions`, `reportConfig`, `active`
- `missionRuns/{runId}`
  - `userId`, `templateId`, `status`, `startedAt`, `completedAt`, `currentStepId`, `progress`, `metadata`
- `missionRuns/{runId}/steps/{stepRunId}`
  - `stepDefinitionId`, `status`, `completedAt`, `notes`, `evidenceCount`
- `evidenceItems/{evidenceId}`
  - `missionRunId`, `userId`, `type`, `storagePath`, `url`, `title`, `description`, `createdAt`, `linkedStepId`, `tags`
- `timelineEvents/{eventId}`
  - `missionRunId`, `type`, `timestamp`, `title`, `detail`, `actor`
- `contactLogs/{contactLogId}`
  - `missionRunId`, `personOrOrg`, `channel`, `outcome`, `notes`, `timestamp`
- `reminders/{reminderId}`
  - `missionRunId`, `relatedStepId`, `dueAt`, `status`, `reminderType`
- `reports/{reportId}`
  - `missionRunId`, `generatedAt`, `reportType`, `url`, `renderConfig`

## Indexing recommendations
- `missionRuns`: composite index `(userId asc, startedAt desc)`
- `evidenceItems`: `(missionRunId asc, createdAt desc)`
- `timelineEvents`: `(missionRunId asc, timestamp asc)`
