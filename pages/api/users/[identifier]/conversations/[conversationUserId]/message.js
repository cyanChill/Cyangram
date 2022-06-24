import Filter from "bad-words";

import dbConnect from "../../../../../../lib/dbConnect";
import User from "../../../../../../models/User";
import Message from "../../../../../../models/Message";

const handler = async (req, res) => {
  const { identifier: username, conversationUserId } = req.query;
  const method = req.method;
  if (method !== "POST" && method !== "DELETE") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  if (!username.trim() || !conversationUserId.trim()) {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  await dbConnect();
  /* See if the specified users in the conversation exist */
  let existingUser, conversationUser;
  try {
    [existingUser, conversationUser] = await Promise.all([
      User.findOne({ username: username }),
      User.findById(conversationUserId),
    ]);
    if (!existingUser || !conversationUser) {
      res.status(404).json({ message: "User does not exist." });
      return;
    } else if (existingUser._id === conversationUser._id) {
      res.status(400).json({ message: "Cannot message yourself." });
      return;
    }
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while fetching users.",
      err: err,
    });
    return;
  }

  switch (method) {
    case "POST":
      try {
        const filter = new Filter();
        await Message.create({
          recieverId: conversationUser._id,
          senderId: existingUser._id,
          messageContent: filter.clean(req.body.messageContent),
          date: Date.now(),
        });
        res.status(200).json({ message: "Successfully sent message." });
      } catch (err) {
        res.status(500).json({
          message: "A problem has occurred with sending the message.",
          err: err,
        });
      }
      break;

    case "DELETE":
      /* Verify deleter of message made the message */
      const message = await Message.findById(req.body.messageId);
      if (!message) {
        res.status(404).json({ message: "Message does not exist." });
      } else if (!message.senderId.equals(existingUser._id)) {
        res
          .status(401)
          .json({ message: "You cannot delete a message you have not made." });
      } else {
        /* Now deleting message */
        try {
          await Message.findByIdAndDelete(req.body.messageId);
          res.status(200).json({ message: "Successfully deleted message." });
        } catch (err) {
          res.status(500).json({
            message: "A problem has occurred with deleting the message.",
            err: err,
          });
        }
      }
      break;
  }
};

export default handler;
