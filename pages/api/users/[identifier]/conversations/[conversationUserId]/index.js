import dbConnect from "../../../../../../lib/dbConnect";
import User from "../../../../../../models/User";
import Message from "../../../../../../models/Message";

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
          This route is made for our lazy-loading hook
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
/* This fetches the conversation with a specific user */
const handler = async (req, res) => {
  // Would use SEARCH method if supported (correct verb)
  const { identifier, conversationUserId, fromDate, amount } = req.query;
  const invalidQueries = !identifier.trim() || isNaN(fromDate) || isNaN(amount);
  if (req.method !== "POST" || invalidQueries) {
    res.status(400).json({ message: "Invalid Request/Input." });
    return;
  }
  const { usedIds } = req.body;

  await dbConnect();
  // See if users exists
  let existingUser, conversationUser;
  try {
    [existingUser, conversationUser] = await Promise.all([
      User.findOne({ username: identifier }),
      User.findById(conversationUserId),
    ]);
    if (!existingUser || !conversationUser) {
      res.status(404).json({ message: "User does not exist." });
      return;
    } else if (existingUser._id.equals(conversationUser._id)) {
      res.status(400).json({ message: "Cannot message yourself." });
      return;
    }
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while fetching users.",
      err: err,
    });
  }

  try {
    // Fetch the latest messages first
    const foundMessages = await Message.find({
      _id: { $nin: usedIds },
      date: { $lt: fromDate },
      $or: [
        { recieverId: conversationUserId, senderId: existingUser._id },
        { recieverId: existingUser._id, senderId: conversationUserId },
      ],
    })
      .sort({ date: "-1" })
      .limit(amount);
    const newUsedMessageIds = foundMessages.map((message) => message._id);

    res.status(200).json({
      message: "Successfully found users we had a conversation with.",
      newData: foundMessages,
      newIds: newUsedMessageIds,
    });
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while fetching conversation messages.",
      err: err,
    });
  }
};

export default handler;
