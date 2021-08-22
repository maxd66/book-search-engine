const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, { id }) => {
      return User.findOne({ _id: id }).populate("savedBooks");
    },
    userBooks: async (parent, args) => {
      const user = User.findOne({ _id: id }).populate("savedBooks");
      return user.savedBooks;
    },
    fetchBooks: async (parent, args) => {},
  },
  Mutation: {},
};
