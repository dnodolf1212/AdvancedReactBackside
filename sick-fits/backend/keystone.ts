import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';

const databaseURL = 
process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
};

export default config ({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    //data seeding will go here
  },
  lists: createSchema({
    //schema items here
  }),
  ui: {
    // roles will go here
    isAccessAllowed: () => true,
  },
  //add session values here
});