# Stage 1

## Campus Notifications Priority Inbox

The goal of this stage is to show the top 10 most important unread campus notifications.

The system supports three notification types:

1. Placement
2. Result
3. Event

The priority order is:

```
Placement > Result > Event
```

## Data Source

The implementation does not use hardcoded notification data and does not use a database.

Notifications are fetched directly from the provided evaluation API:

```
http://20.207.122.201/evaluation-service/notifications
```

The API returns a `notifications` array.

Each notification contains:

```
ID
Type
Message
Timestamp
```

The system calculates priority from this API response at runtime.

## Priority Score

Each notification type is assigned a weight:

```
Placement = 3
Result = 2
Event = 1
```

A small recency score is added so newer notifications rank above older notifications when their type priority is close.

The final score is:

```
priority_score = type_weight + recency_score
```

The type weight is the main factor. Recency helps order notifications within similar priority levels.

## Unread Notifications

The requirement asks for the top unread notifications.

Since the API response does not include a read/unread field, the frontend implementation treats notifications as unread until the user views them. Viewed notification IDs are stored in localStorage.

For Stage 1, the script ranks the latest notifications returned by the API. In the full frontend implementation, viewed notifications are excluded from the Priority Notifications page.

## Current Implementation

The Stage 1 implementation uses a plain Node.js script.

The script:

1. Calls the notifications API.
2. Logs the API call using the custom logging middleware.
3. Reads the `notifications` array.
4. Calculates a priority score for every notification.
5. Sorts notifications by priority score.
6. Selects the top 10 notifications.
7. Writes the result to an HTML file for screenshot capture.

## Maintaining Top 10 When New Notifications Keep Arriving

In the current submission, notifications are fetched from the API when the script or frontend page loads.

For continuously arriving notifications, there are two possible approaches.

### Polling Approach

The frontend can call the notification API at a fixed interval, such as every 15 or 30 seconds.

On each poll:

1. Fetch the latest notifications.
2. Remove notifications already marked as viewed.
3. Recalculate priority scores.
4. Display the latest top 10.

This is simple and works well for moderate traffic.

### Real-Time Streaming Approach

For a production real-time system, I would use WebSockets or Server-Sent Events.

When a new notification arrives, the system would calculate its priority score and maintain a min heap of size 10.

For every new unread notification:

1. Calculate its priority score.
2. If the heap has fewer than 10 notifications, insert it.
3. If the heap already has 10 notifications, compare the new notification with the lowest-priority item in the heap.
4. If the new notification has a higher score, replace the lowest-priority item.
5. Otherwise, ignore the new notification for the Priority Inbox.

This avoids sorting all notifications repeatedly.

```
Time per new notification: O(log 10)
Space: O(10)
```

Since 10 is fixed, the operation is effectively constant time.

## Logging

All API calls are logged using the custom logging middleware from the pre-test setup.

A typical log body is:

```json
{
  "stack": "backend",
  "level": "info",
  "package": "api",
  "message": "Fetching notifications from API"
}
```

