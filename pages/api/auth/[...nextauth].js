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

        // Returns an object indicating that authorization succeeded
        return {
          message: "Successfully logged in.",
        };
      },
    }),
  ],
});
