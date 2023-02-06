const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

const app = express();

const actors = [
  { id: 1, name: "Man with id 1" },
  { id: 2, name: "Man with id 2" },
  { id: 3, name: "Leonardo dicaprio" },
  { id: 4, name: "Man with id 4" },
];

const movies = [
  { id: 1, name: "Menu", year: 2023, actors: [1, 2, 3, 4] },
  { id: 2, name: "Elvis", year: 2023, actors: [4, 2] },
  { id: 3, name: "Wolf of wallstreet", year: 2014, actors: [3] },
  { id: 4, name: "Titanic", year: 1999, actors: [3] },
];

const ActorType = new GraphQLObjectType({
  name: "Actor",
  description: "This represents an actor",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve: (actor) => {
        return movies.filter((movie) => movie.actors.includes(actor.id));
      },
    },
  }),
});

const MovieType = new GraphQLObjectType({
  name: "Movie",
  description: "This represents a movie",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    year: { type: GraphQLNonNull(GraphQLInt) },
    actors: {
      type: new GraphQLList(ActorType),
      resolve: (movie) => {
        return movie.actors.map((actorId) =>
          actors.find((actor) => actor.id === actorId)
        );
      },
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    movie: {
      type: MovieType,
      description: "A single movie",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => movies.find((book) => book.id === args.id),
    },
    movies: {
      type: new GraphQLList(MovieType),
      description: "List of movies",
      resolve: () => movies,
    },
    actors: {
      type: new GraphQLList(ActorType),
      description: "List of actors",
      resolve: () => actors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log("Server listening"));
