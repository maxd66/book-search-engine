const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, { id }) => {
      return User.findOne({ _id: id }).populate("savedBooks");
    },
    userBooks: async (parent, args) => {
      const user = User.findOne({ _id: id }).populate("savedBooks");
      if (user.savedBooks < 1) {
        return "User has no saved books";
      }
      return user.savedBooks;
    },
    fetchBooks: async (parent, args) => {},
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (
      parent,
      { bookId, userId, authors, title, description, image }
    ) => {
      const book = Book.create({ authors, description, bookId, image, title });
      return User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: book._id } }
      );
    },
  },
};
