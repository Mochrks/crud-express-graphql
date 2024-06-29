const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require("graphql");
const Book = require("../models/Book");
const { GraphQLDate } = require("graphql-iso-date");

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    publishedDate: { type: GraphQLDate },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publishedDate: { type: GraphQLDate },
      },
      resolve(parent, args) {
        let book = new Book({
          title: args.title,
          author: args.author,
          publishedDate: args.publishedDate,
        });
        return book.save();
      },
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publishedDate: { type: GraphQLDate },
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(
          args.id,
          {
            title: args.title,
            author: args.author,
            publishedDate: args.publishedDate,
          },
          { new: true }
        );
      },
    },
    deleteBook: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findByIdAndDelete(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
