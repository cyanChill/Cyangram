import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";
import Message from "../../../../../models/Message";

const handler = async (req, res) => {
  const { identifier } = req.query;
  if (req.method !== "GET" || !identifier.trim()) {
    res.status(400).json({ message: "Invalid Request/Input." });
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
    /* Get the latest message per id */
    // Order by latest message we received from another user
    const results1 = await Message.aggregate([
      { $match: { recieverId: existingUser._id } },
      { $sort: { recieverId: 1, senderId: 1, date: -1 } },
      {
        $group: {
          _id: "$senderId",
          recieverId: { $first: "$recieverId" },
          senderId: { $first: "$senderId" },
          messageContent: { $first: "$messageContent" },
          date: { $first: "$date" },
        },
      },
    ]);
    // Order by latest message we sent to user
    const results2 = await Message.aggregate([
      { $match: { senderId: existingUser._id } },
      { $sort: { recieverId: 1, senderId: 1, date: -1 } },
      {
        $group: {
          _id: "$recieverId",
          recieverId: { $first: "$recieverId" },
          senderId: { $first: "$senderId" },
          messageContent: { $first: "$messageContent" },
          date: { $first: "$date" },
        },
      },
    ]);
    const aggregatedUsersIds = [
      ...new Set(
        [...results1, ...results2]
          .sort((a, b) => b.date - a.date)
          .map((user) => user._id.toString())
      ),
    ];

    const getUser = async (userId) => {
      try {
        const conversationUser = await User.findById(userId);
        return Promise.resolve(conversationUser._doc);
      } catch (err) {
        return Promise.reject();
      }
    };

    const promises = aggregatedUsersIds.map((userId) => getUser(userId));
    const conversationUsers = await Promise.all(promises);

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
