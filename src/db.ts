import { Deta } from "deta";

const deta = Deta(process.env.DETA_PROJECT_KEY || "");

const sntstrsDb = deta.Base("sent_stories");

const isStorySent = async (id: string) => {
  sntstrsDb.get(id);
};
