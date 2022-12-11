import { Deta } from "deta";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getCurrentTIme = () => {
  return dayjs().tz("Asia/Kolkata");
};

const deta = Deta(process.env.DETA_PROJECT_KEY || "");
const sntstrsDb = deta.Base("sent_stories");
const users = deta.Base("usersToFetchStory");

export const isStorySent = async (id: string) => {
  return !!(await sntstrsDb.get(id));
};

export const storySent = async (id: string) => {
  return sntstrsDb.put({ time: new Date().toISOString() }, id);
};

export type UsersType = {
  username: string;
  message: string;
  forwardChannel: string;
};

export const getUsersToFetch = async () => {
  return (await users.fetch({})).items as unknown as UsersType[];
};

export const populateUsers = async () => {
  await users.put({
    username: "doctor.chrome",
    message: "@dr_chromental ・ 𝕊𝕙𝕒𝕣𝕖 ・ 𝔽𝕠𝕝𝕝𝕠𝕨",
    forwardChannel: "psychofact",
  });
};

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
