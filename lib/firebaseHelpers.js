import { ref, deleteObject } from "firebase/storage";

import { storage } from "../firebase.config";

export const deleteImg = async (userId, imgIdentifier) => {
  const imgRef = ref(storage, `${userId}/${imgIdentifier}`);
  deleteObject(imgRef)
    .then(() => {
      console.log("Image Delete Successfully!");
    })
    .catch((err) => {
      console.log(`An Error Has Occurred Deleting the Image: ${err}`);
    });
};
