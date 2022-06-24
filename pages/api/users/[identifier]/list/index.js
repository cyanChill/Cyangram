import { getFollowList } from "../../../../../lib/backendHelpers";

const handler = async (req, res) => {
  const { type } = req.query;
  const invalidQueries = type !== "followers" && type !== "following";
  if (req.method !== "GET" || invalidQueries) {
    res.status(400).json({ message: "Invalid Request/Input." });
    return;
  }

  let promises;
  try {
    promises = await getFollowList(req.query.identifier, type);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  return Promise.all(promises)
    .then((promiseData) => {
      res.status(200).json({
        message: `Successfully found ${type}.`,
        users: promiseData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: `A problem has occurred while fetching data for ${type}.`,
        users: [],
        err: err,
      });
    });
};

export default handler;
