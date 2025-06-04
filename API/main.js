require('dotenv').config({ path: 'api.env' });
const express = require('express'); 
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');

// Import your GraphQL schema, resolvers, and database connection utilities
const typeDefs = require('./schema'); //
const resolvers = require('./resolver'); //
const { connectDB, getDB } = require('./db'); //

const app = express();
app.use(cors()); // Enable CORS

// Function to extract user information from a JWT token
const getUserFromToken = (token) => {
  if (token) {
    try {
      // Remove 'Bearer ' prefix if it exists
      const processedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      // Verify the token using the secret key
      return jwt.verify(processedToken, process.env.JWT_SECRET || 'P@$$w0rd10$'); //
    } catch (err) {
      // If token is invalid or expired, log the error (optional) and return null
      // console.error('Invalid token:', err.message);
      return null;
    }
  }
  return null;
};

// Asynchronous function to start the server
async function start() {
  try {
    // Ensure the database is connected before starting the Apollo server
    await connectDB(); //

    // Create a new ApolloServer instance
    const server = new ApolloServer({
      typeDefs, // Your GraphQL type definitions
      resolvers, // Your GraphQL resolvers
      context: ({ req }) => { // Function to set the context for each request
        // Get the Authorization header from the request
        const token = req.headers.authorization || ''; //
        // Extract user info from the token
        const user = getUserFromToken(token); //
        // Return the user and database instance in the context
        // This makes 'user' and 'db' available to all resolvers
        return { user, db: getDB() }; //
      },
      // Consider adding formatError for better error handling in development/production
      // formatError: (error) => {
      //   console.error(error);
      //   return error;
      // }
    });

    // Start the Apollo server
    await server.start(); //

    // Apply the Apollo GraphQL middleware to the Express app
    server.applyMiddleware({ app, path: '/graphql' }); //

    // Define the port for the server
    const port = process.env.PORT || 4000; //

    // Start listening on the defined port
    app.listen(port, () => {
      console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`); //
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1); // Exit if server fails to start
  }
}

// Call the start function to launch the server
start();