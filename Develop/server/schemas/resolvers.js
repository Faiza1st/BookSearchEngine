const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          try {
            const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
            return userData;
          } catch (error) {
            throw new Error('Failed to fetch user data');
          }
        }
  
        throw new AuthenticationError('Please log in!');
      },
    },

    Mutation: {
        addUser: async (parent, args) => {
          try {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
          } catch (error) {
            throw new Error('Failed to create user');
          }
        },
        login: async (parent, { email, password }) => {
          try {
            const user = await User.findOne({ email });
    
            if (!user) {
              throw new AuthenticationError('Incorrect email or password');
            }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
              throw new AuthenticationError('Incorrect email or password');
            }
    
            const token = signToken(user);
            return { token, user };
          } catch (error) {
            throw new Error('Login failed');
          }
        },
        saveBook: async (parent, { bookData }, context) => {
          try {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: bookData } },
                { new: true }
              );
      
              return updatedUser;
            }
          } catch (error) {
            throw new AuthenticationError('Please log in to save the book');
          }
        },
        removeBook: async (parent, { bookId }, context) => {
          try {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
      
              return updatedUser;
            }
          } catch (error) {
            throw new AuthenticationError('Please log in to remove the book');
          }
        },
      },
    };
    
    module.exports = resolvers;
