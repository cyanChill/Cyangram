import { getSession } from "next-auth/react";

import { auth } from "../../../firebaseAdmin.config";

/* Returns customToken for firebase signin */

const handler = async (req, res) => {
  const method = req.method;

  if (method !== "POST") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }

  try {
    const customToken = await auth.createCustomToken(
      session.user.dbId.toString()
    );
    res.status(200).json({ message: "Obtained custom token.", customToken });
  } catch (err) {
    res.status(500).json({ message: "Error creating custom token.", err: err });
  }
};

export default handler;
