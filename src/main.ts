import { postOtherToChannel, postPhotoToChannel, telegramInit } from "./tgram";
import { getUser, getUserStories, igInit, markStorySeen } from "./ig";
import {
  getCurrentTIme,
  getUsersToFetch,
  isStorySent,
  storySent,
  UsersType,
} from "./db";

(async () => {
  // await populateUsers();
  await igInit();
  await telegramInit();
  console.log("Initialized Bot");
  setInterval(async () => {
    if (getCurrentTIme().hour() < 10 && getCurrentTIme().hour() > 20) return; // Skip night
    const users = await getUsersToFetch();
    await Promise.all(
      users.map(async (user) => {
        await fetchAndForward(user);
      })
    );
    console.info(
      "Finished current fetch " +
        `${getCurrentTIme().format("DD-MM-YYYY h:mm:ss A")}`
    );
  }, 2 * 60 * 60 * 1000);
})();

const fetchAndForward = async (userType: UsersType) => {
  const stories = await getUserStories(await getUser(userType.username));
  await Promise.all(
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
    })
  );
};
