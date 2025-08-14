const { Review } = require('../../models');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
    productReviews: (_, { productId }) => 
      Review.find({ product: productId }).populate('user'),
    userReviews: (_, { userId }) => 
      Review.find({ user: userId }).populate('product')
  },

  Mutation: {
    createReview: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      const review = new Review({
        ...input,
        product: input.productId,
        user: user.id
      });

      await review.save();
      return review.populate('user product').execPopulate();
    },

    updateReview: async (_, { id, comment }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      const review = await Review.findOneAndUpdate(
        { _id: id, user: user.id },
        { comment },
        { new: true }
      ).populate('user product');
      
      if (!review) throw new Error('Review not found');
      return review;
    },

    deleteReview: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      const review = await Review.findOneAndDelete({
        _id: id,
        user: user.id
      });
      
      if (!review) throw new Error('Review not found');
      return true;
    }
  }
};