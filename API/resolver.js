
const { getDB } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const JWT_SECRET = process.env.JWT_SECRET || 'P@$$w0rd10$';


const resolvers = {
  Query: {
    // --- CraftCart Query Resolvers ---
    getUser: async (_, { id }) => {
      const db = getDB();
      return db.collection('users').findOne({ _id: new ObjectId(id) });
    },
    getAllUsers: async () => {
      const db = getDB();
      return db.collection('users').find({}).toArray();
    },
    getProduct: async (_, { id }) => {
      const db = getDB();
      return db.collection('products').findOne({ _id: new ObjectId(id) });
    },
    getAllProducts: async () => {
      const db = getDB();
      return db.collection('products').find({}).toArray();
    },
    getProductsByCategory: async (_, { categoryId }) => {
      const db = getDB();
      return db.collection('products').find({ categoryId: new ObjectId(categoryId) }).toArray();
    },
    getCategory: async (_, { id }) => {
      const db = getDB();
      return db.collection('categories').findOne({ _id: new ObjectId(id) });
    },
    getAllCategories: async () => {
      const db = getDB();
      return db.collection('categories').find({}).toArray();
    },
  },

  Mutation: {

    // --- CraftCart Mutation Resolvers ---
    registerUser: async (_, { input }) => {
      const db = getDB();
      const { name, email, password, role } = input;

      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email.');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        password: hashedPassword,
        role: role || 'Buyer', // Default role if not provided
        profile_image: '', // Default or allow input
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection('users').insertOne(newUser);

      const createdUser = { ...newUser, _id: result.insertedId }; // Construct user object with id

      const token = jwt.sign(
        { userId: result.insertedId, email: createdUser.email, role: createdUser.role },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expiration
      );

      return {
        token,
        user: createdUser,
      };
    },

    loginUser: async (_, { input }) => {
      const db = getDB();
      const { email, password } = input;

      const user = await db.collection('users').findOne({ email });
      if (!user) {
        throw new Error('User not found.');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password.');
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        token,
        user,
      };
    },

    createCategory: async (_, { input }) => {
      const db = getDB();
      const { name } = input;

      const existingCategory = await db.collection('categories').findOne({ name });
      if (existingCategory) {
        throw new Error('Category already exists.');
      }
      const newCategory = {
        name,
        createdAt: new Date().toISOString(),
      };
      const result = await db.collection('categories').insertOne(newCategory);
      return { ...newCategory, _id: result.insertedId };
    },

    createProduct: async (_, { input }, context) => {
      const db = getDB();
      const { name, description, price, quantity, image_url, categoryId } = input;

      const category = await db.collection('categories').findOne({ _id: new ObjectId(categoryId) });
      if (!category) throw new Error('Category not found');

      const newProduct = {
        name,
        description,
        price,
        quantity,
        image_url,
        categoryId: new ObjectId(categoryId),
        // artisanId: new ObjectId(artisanId), 
        createdAt: new Date().toISOString(),
      };
      const result = await db.collection('products').insertOne(newProduct);
      return { ...newProduct, _id: result.insertedId };
    },
  },

  // --- Field Resolvers to populate related data ---
  Product: {
    artisan: async (parent) => {
      const db = getDB();

      if (!parent.artisanId) return null; // Or handle as error
      return db.collection('users').findOne({ _id: new ObjectId(parent.artisanId) });
    },
    category: async (parent) => {
      const db = getDB();
      return db.collection('categories').findOne({ _id: new ObjectId(parent.categoryId) });
    }
  },

  User: {
    // If you need to resolve specific fields for User, e.g., list of products by an artisan
    // products: async (parent) => {
    //   if (parent.role !== 'Artisan') return [];
    //   const db = getDB();
    //   return db.collection('products').find({ artisanId: new ObjectId(parent._id) }).toArray();
    // }
  }
};

module.exports = resolvers;