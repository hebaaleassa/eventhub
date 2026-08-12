# NOTES

## Data Model and Relationships

The application uses four MongoDB collections:

- `User`
- `Venue`
- `Event`
- `Registration`

An `Event` references one `Venue` and one organizer (`User`).

A `Registration` connects a `User` to an `Event` and stores the number of tickets. A compound unique index on `{ user, event }` prevents the same user from registering for the same event more than once.

When an event is deleted, its related registrations are deleted as well to avoid leaving orphaned registration records.

## Search Approach

Event search is implemented with MongoDB regular-expression matching on the event `title` and `description`.

I chose this approach because the assignment is small and the expected dataset is limited. It keeps the implementation simple and does not require an additional search service.

For a larger production application, I would consider MongoDB text indexes or Elasticsearch depending on the search requirements and dataset size.

## Capacity Handling

Event capacity comes from the selected venue.

Before creating a registration, the API sums the existing ticket counts for that event and checks whether adding the requested tickets would exceed the venue capacity.

## What I Would Improve With More Time

With more time, I would:

- Add backend and frontend automated tests.
- Add stronger validation for referenced venue and organizer IDs.
- Add pagination controls to the frontend.
- Improve frontend loading and error feedback.
- Move frontend/backend URLs into environment variables.
- Add transactions around operations that modify related documents.
- Improve the UI while keeping the current functionality unchanged.
- Add authentication and authorization if required for a production version.

## Optional Features

The optional extra-credit features such as Elasticsearch, JWT authentication, waitlist support, and role-based authorization were not implemented. The focus was on completing and understanding the core requirements first.
