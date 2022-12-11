import { Deta } from "deta";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const getCurrentTIme = () => {
  return dayjs().tz("Asia/Kolkata");
};

export const getTime = (
  date?: string | number | dayjs.Dayjs | Date | null | undefined
) => {
  return dayjs(date).tz("Asia/Kolkata");
};

const deta = Deta(process.env.DETA_PROJECT_KEY || "");
const sntstrsDb = deta.Base("sent_stories");
const users = deta.Base("usersToFetchStory");
const config = deta.Base("config");

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
  await config.put({
    value: "10",
    key: "intreval",
  });
};

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const getLastRuntime = async () => {
  const res = await config.get("last_runtime");
  return getTime(res?.value as string);
};

export const updateLastRuntime = async () => {
  await config.put({ value: getCurrentTIme().toISOString() }, "last_runtime");
};

export const getIntrval = async () => {
  const res = await config.get("intreval");
  return (parseInt(res?.value as string) || 60) * 1000 * 60;
};

export const getTimetoMs = (ms: number) => {
  const to = dayjs().add(ms, "milliseconds");
  return dayjs().to(to);
};
