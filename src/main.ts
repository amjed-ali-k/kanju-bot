import { postOtherToChannel, postPhotoToChannel, telegramInit } from "./tgram";
import { getUser, getUserStories, igInit, markStorySeen } from "./ig";
import {
  getCurrentTIme,
  getIntrval,
  getLastRuntime,
  getTimetoMs,
  getUsersToFetch,
  isStorySent,
  // populateUsers,
  storySent,
  updateLastRuntime,
  UsersType,
} from "./db";

import express from "express";

const app = express();
const port = process.env.PORT || 3001;

app.head("/", async (req, res) => {
  const message = await main();
  res.type("json").send({ message });
});

app.get("/", async (req, res) => {
  const message = await main();
  res.type("json").send({ message });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

const main = async () => {
  // await populateUsers();
  // await updateLastRuntime();
  // return;
  console.info(
    "Current Time is " + `${getCurrentTIme().format("DD-MM-YYYY h:mm:ss A")}`
  );
  const time = await getLastRuntime();
  const intreval = await getIntrval();
  const diff = getCurrentTIme().diff(time);
  if (diff < intreval)
    return `Too soon! Will run ${getTimetoMs(intreval - diff)}`;
  await updateLastRuntime();

  await igInit();
  await telegramInit();
  console.log("Initialized Bot");
  // setInterval(async () => {
  if (getCurrentTIme().hour() < 10 && getCurrentTIme().hour() > 20) {
    console.log("Skipped as it is night");
    return "Skipped as it is night";
  } // Skip night
  const users = await getUsersToFetch();
  const msgs = await Promise.all(
    users.map(async (user) => {
      return fetchAndForward(user);
    })
  );
  console.info(
    "Finished current fetch " +
      `${getCurrentTIme().format("DD-MM-YYYY h:mm:ss A")}`
  );
  // }, 2 * 60 * 60 * 1000);
  return {
    message: "Success",
    data: msgs,
  };
};

// main();

const fetchAndForward = async (userType: UsersType) => {
  const stories = await getUserStories(await getUser(userType.username));
  return Promise.all(
    stories.map(async (storyItem) => {
      if (await isStorySent(storyItem.pk)) return;
      if (storyItem.media_type === 1) {
        postPhotoToChannel(
          storyItem.image_versions2.candidates[0].url,
          parseInt(storyItem.pk),
          userType.forwardChannel,
          userType.message
        );
      }
      if (storyItem.media_type === 2) {
        postOtherToChannel(
          storyItem.video_versions[0].url,
          parseInt(storyItem.pk),
          userType.forwardChannel,
          userType.message
        );
      }
      await markStorySeen(storyItem);
      await storySent(storyItem.pk);
      console.info(
        `${getCurrentTIme().format("DD-MM-YYYY h:mm:ss A")} - New ${
          userType.username
        } is posted!`
      );
      return `New ${userType.username} is posted!`;
    })
  );
};
