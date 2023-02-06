# Movie and Actor GraphQL API

A GraphQL API that returns information about movies and their actors.

## Getting started

To run the server locally, follow these steps:

1. Clone the repository.

`git clone https://github.com/hamidfarmani/movie-actor-graphql-api.git`

2. Navigate to the project directory.

`cd movie-actor-graphql-api`

3. Install the dependencies.
   `npm install`
4. Start the server.
   `npm run startDev`
5. Open a web browser and go to http://localhost:4000/graphql.

## Data Types

This API has two main data types: Movie and Actor.

Movie:

- id: unique identifier for the movie (integer)
- name: name of the movie (string)
- year: year the movie was released (integer)
- actors: array of actors who played in the movie

Actor:

- id: unique identifier for the actor (integer)
- name: name of the actor (string)

## Queries

You can query the following fields on the root Query type:

- movies: returns a list of all movies
- actors: returns a list of all actors

Example Queries

1. This query returns a list of all movies along with their id, name, year, and a list of actors who played in each movie with their id and name:

```
{
  movies {
    id
    name
    year
    actors {
      id
      name
    }
  }
}

```

2. This query returns a list of all actors along with their id, name, and a list of movies they played in along with their id, name, and year:

```
{
  actors {
    id
    name
    movies {
      id
      name
      year
    }
  }
}
```
