import { getFollowList } from "../../../../lib/backendHelpers";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  let promises;
  try {
    promises = await getFollowList(req.query.identifier, "following");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  return Promise.all(promises)
    .then((promiseData) => {
      res.status(200).json({
        message: "Successfully found the users being followed.",
        users: promiseData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          "A problem has occurred while fetching data for users being followed.",
        users: [],
        err: err,
      });
    });
};

export default handler;
