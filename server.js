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
const { movies, actors } = require("./db");

const app = express();

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
    actor: {
      type: ActorType,
      description: "A single actor",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => actors.find((actor) => actor.id === args.id),
    },
    actors: {
      type: new GraphQLList(ActorType),
      description: "List of actors",
      resolve: () => actors,
    },
  }),
});

const rootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "root mutation",
  fields: () => ({
    addMovie: {
      type: MovieType,
      description: "add a movie",
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        actors: {
          type: new GraphQLList(GraphQLInt),
        },
      },
      resolve: (parent, args) => {
        const movie = {
          id: movies.length + 1,
          name: args.name,
          actors: args.actors,
        };
        movies.push(movie);
        return movie;
      },
    },

    addActor: {
      type: ActorType,
      description: "add an actor",
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (parent, args) => {
        const actor = {
          id: actors.length + 1,
          name: args.name,
        };
        actors.push(actor);
        return actor;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => console.log("Server listening"));
