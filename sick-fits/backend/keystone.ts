import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import 'dotenv/config';
import { insertSeedData } from './seed-data';

const databaseURL = 
process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    //add initial roles
  },
  passwordResetLink: {
    async sendToken(args) {
      console.log(args)
    },
  },
});

export default withAuth(config ({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    async onConnect(keystone) {
      console.log('connected bro');
      if (process.argv.includes('--seed-data')) {
        await insertSeedData(keystone);
      }
    },
  },
  lists: createSchema({
    //show for UI for people who pass auth test
    User,
    Product,
    ProductImage,
  }),
  ui: {
    
    isAccessAllowed: ({session}) => {
      //console.log(session);
      return !!session?.data; 
    }
  },
  session: withItemData(statelessSessions(sessionConfig), {
    //this is a GraphQL query
    User: 'id name email'
    }),
  })
);