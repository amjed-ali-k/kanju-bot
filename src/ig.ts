import {
  IgApiClient,
  StoryServiceInput,
  UserRepositorySearchResponseUsersItem,
} from "instagram-private-api";
import _ from "lodash";
import * as dotenv from "dotenv";

dotenv.config();

const ig = new IgApiClient();

export const igInit = async () => {
  ig.state.generateDevice(process.env.IG_USERNAME || "");
  // await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(
    process.env.IG_USERNAME || "",
    process.env.IG_PASSWORD || ""
  );
  console.log("Logged in as ", loggedInUser.username);
  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  // Create UserFeed instance to get loggedInUser's posts
  // console.log(loggedInUser);

  // process.nextTick(async () => await ig.simulate.postLoginFlow());
};

export const getUser = async (username: string) => {
  return ig.user.searchExact(username);
};

export const getUserStories = async (
  user: UserRepositorySearchResponseUsersItem
) => {
  const reelsFeed = ig.feed.reelsMedia({
    // working with reels media feed (stories feed)
    userIds: [user.pk], // you can specify multiple user id's, "pk" param is user id
  });

  const storyItems = await reelsFeed.items(); // getting reels, see "account-followers.feed.example.ts" if you want to know how to work with feeds
  if (storyItems.length === 0) {
    // we can check items length and find out if the user does have any story to watch
    console.log(`${user.username}'s story is empty`);
    return [];
  }
  return storyItems;
};

export const markStorySeen = async (story: StoryServiceInput) => {
  ig.story.seen(story);
};
