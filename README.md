![CI](https://www.shieldcn.dev/github/ci/jeremyMees/dartBuddy.svg?variant=secondary&size=sm)
![License](https://www.shieldcn.dev/github/license/jeremyMees/dartBuddy.svg?variant=ghost&size=sm)
![Open issues](https://www.shieldcn.dev/github/open-issues/jeremyMees/dartBuddy.svg?variant=secondary&size=sm)
![Open PRs](https://www.shieldcn.dev/github/open-prs/jeremyMees/dartBuddy.svg?variant=secondary&size=sm)

# DartBuddy

DartBuddy is a darts statistics app built around imported data from DartCounter. Instead of scoring matches live, the app is meant to collect your finished session results and turn them into clear, useful statistics over time.
The current focus is on analytics and training insights, not match management. You play and score elsewhere, then use DartBuddy to track performance.

## Project Direction

DartBuddy is being reshaped into a personal stats companion for darts players.

The idea is simple:

- play your games or training sessions in DartCounter
- bring those scores into DartBuddy
- review your performance through statistics and trends

## Planned Focus

The application is intended to help with:

- storing imported darts results
- tracking performance across training sessions
- showing statistics over time
- comparing consistency and scoring levels between sessions
- giving a clearer overview of progress

## Supported Data Types

At the moment, the data model is focused on training and analytics entries such as:

- around the clock results
- singles training results
- doubles training results
- scoring training results
- match game results

These entries are used to calculate and display performance metrics instead of managing full live matches inside the app.

## Tech Stack

- **Nuxt 4** for the application framework
- **Nitro** for server-side functionality
- **Prisma** for database access
- **PostgreSQL** as the database
- **Tailwind CSS + shadcn/ui** for the interface
