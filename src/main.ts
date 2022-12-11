import { postOtherToChannel, postPhotoToChannel, telegramInit } from "./tgram";
import { getUser, getUserStories, igInit } from "./ig";

(async () => {
  await igInit();
  await telegramInit();

  const user = await getUser("doctor.chrome");
  const stories = await getUserStories(user);

  await Promise.all(
    stories.map(async (storyItem) => {
      if (storyItem.media_type === 1) {
        postPhotoToChannel(
          storyItem.image_versions2.candidates[0].url,
          parseInt(storyItem.pk),
          "psychofact",
          "New Story"
        );
      }
      if (storyItem.media_type === 2) {
        postOtherToChannel(
          storyItem.video_versions[0].url,
          parseInt(storyItem.pk),
          "psychofact",
          "New Story"
        );
      }
    })
  );
})();

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
