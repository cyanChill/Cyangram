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
          { username: credentials.username },
          "+password"
        );

        if (!user) throw new Error("No user found!");

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Could not log you in!");

        return {
          dbId: user._id,
          name: user.name,
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
    session: async ({ session, token }) => {
      session.user = token.user;

      /*
        If user is logged in, refresh session [in case we change] the values
        of name or username in our settings page
      */
      if (token?.user?.dbId) {
        const user = await User.findOne({ _id: token.user.dbId });
        session.user = {
          ...session.user,
          name: user.name,
          username: user.username,
        };
        token.user = {
          ...token.user,
          name: user.name,
          username: user.username,
        };
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
