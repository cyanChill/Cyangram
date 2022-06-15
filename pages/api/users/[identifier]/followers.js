import { getFollowList } from "../../../../lib/backendHelpers";

const handler = async (req, res) => {
  const { identifier } = req.query;

  if (req.method !== "GET") {
    res.status(400).json({ message: "Invalid Request" });
    return;
  }

  let promises;
  try {
    promises = await getFollowList(identifier, "followers");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  return Promise.all(promises)
    .then((promiseData) => {
      res.status(200).json({
        message: "Successfully found the followers of the user.",
        users: promiseData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          "A problem has occurred while fetching data for the followers of the user.",
        users: [],
        errMsg: err,
      });
    });
};

export default handler;
