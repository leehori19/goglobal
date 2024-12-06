const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectMongoDB = require('./models/mongo');
const stripeRoutes = require('./routes/stripe');
const coinbaseRoutes = require('./routes/coinbase');
const db = require('./models');

dotenv.config();

// Connect to PostgreSQL
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL.');
  })
  .catch((err) => {
    console.error('PostgreSQL connection error:', err);
  });

// Connect to MongoDB
connectMongoDB();

// Sample type definitions and resolvers
const typeDefs = gql`
  type Query {
    hello: String
    users: [User]
    translate(text: String!, targetLang: String!): String
    generateContent(prompt: String!): String
  }

  type Mutation {
    addUser(name: String!): String
  }

  type User {
    id: ID!
    name: String!
  }
`;

query({"inputs": "Can you please let us know more details about your "}).then((response) => {
	console.log(JSON.stringify(response));
});

const fetch = require('node-fetch');

// Helper function for querying the Hugging Face API
async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GoGlobal Server!',
    users: async () => {
      const users = await db.User.findAll();
      return users;
    },
    translate: async (_, { text, targetLang }) => {
      const url = 'https://libretranslate.com/translate';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text',
        }),
      });
      const data = await response.json();
      return data.translatedText;
    },
    generateContent: async (_, { prompt }) => {
      try {
        // Use the query helper function
        const response = await query({ inputs: prompt });

        // Handle errors from Hugging Face API
        if (response.error) {
          throw new Error(response.error);
        }

        return response.generated_text || 'No response generated';
      } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Failed to generate content');
      }
    },
  },
  Mutation: {
    addUser: async (_, { name }) => {
      const user = await db.User.create({ name });
      return `User ${user.name} added successfully!`;
    },
  },
};


// Initialize Apollo Server
async function startApolloServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/stripe', stripeRoutes);
  app.use('/coinbase', coinbaseRoutes);

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
