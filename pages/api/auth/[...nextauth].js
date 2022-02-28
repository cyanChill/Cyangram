import NextAuth from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";

import dbConnect from "../../../lib/dbConnect";
import { verifyPassword } from "../../../lib/hash";
import User from "../../../models/User";

export default NextAuth({
  // Configuring Auth Providers
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProviders({
      authorize: async (credentials, req) => {
        await dbConnect();

        const user = await User.findOne(
          {
            $or: [
              { email: credentials.username },
              { username: credentials.username },
            ],
          },
          "+password"
        );

        if (!user) throw new Error("No user found!");

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Could not log you in!");

        /* 
          Any data passed here will be accessed in the 'user' property of
          the 'session' object
        */
        return {
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.user = user;
      return token;
    },
    session: async ({ session, token, user }) => {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
