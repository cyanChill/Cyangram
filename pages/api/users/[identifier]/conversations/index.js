import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";
import Message from "../../../../../models/Message";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const { identifier } = req.query;
  if (!identifier.trim()) {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  await dbConnect();
  // See if username exists
  const existingUser = await User.findOne({ username: identifier });
  if (!existingUser) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }

  try {
    {
      /* TODO: Put on top of list the ones who messaged the latest */
    }
    // Get the ids of users we had a conversation with
    const [startedConv, recieveConv] = await Promise.all([
      Message.find({ senderId: existingUser._id }, "recieverId -_id"),
      Message.find({ recieverId: existingUser._id }, "senderId -_id"),
    ]);
    const ids1 = startedConv.map((user) => user.recieverId);
    const ids2 = recieveConv.map((user) => user.senderId);
    const convWithIds = [...new Set([...ids1, ...ids2])];

    const conversationUsers = await User.find({
      _id: { $in: convWithIds },
    }).sort({ name: "1" });

    res.status(200).json({
      message: "Successfully found users we had a conversation with.",
      users: conversationUsers,
    });
  } catch (err) {
    res.status(500).json({
      message:
        "A problem has occurred while fetching users we had a conversation with.",
      err: err,
    });
  }
};

export default handler;
