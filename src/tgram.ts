import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as dotenv from "dotenv";

dotenv.config();

const stringSession = new StringSession(process.env.SESSION_STRING);
const apiID = process.env.TELEGRAM_API_ID || "";
const apiHash = process.env.TELGRAM_API_KEY || "";

const telegram = new TelegramClient(stringSession, parseInt(apiID), apiHash, {
  connectionRetries: 5,
});
export const telegramInit = async () => {
  if (!telegram.connected) {
    await telegram.connect();
  }
  return telegram;
};
type ChannelInfo = {
  id: bigInt.BigInteger;
  access_hash: string;
};
export const postPhotoToChannel = async (
  url: string,
  uid?: number,
  message?: string,
  dest?: {
    username?: string;
    groupId?: string;
    channel?: { channelId: string; accessHash: string };
  }
) => {
  return telegram.invoke(
    new Api.messages.SendMedia({
      peer:
        dest?.username ||
        (BigInt(dest?.groupId || false) as unknown as bigInt.BigInteger),
      media: new Api.InputMediaPhotoExternal({
        url,
      }),
      message,
      randomId: BigInt(
        `-${uid ? uid : stringToSum(url)}`
      ) as unknown as bigInt.BigInteger,
      noforwards: true,
    })
  );
};

export const postOtherToChannel = async (
  url: string,
  uid?: number,
  message?: string,
  dest?: {
    username?: string;
    groupId?: string;
    channel?: { channelId: string; accessHash: string };
  }
) => {
  return telegram.invoke(
    new Api.messages.SendMedia({
      peer:
        dest?.username ||
        (BigInt(dest?.groupId || false) as unknown as bigInt.BigInteger),
      media: new Api.InputMediaDocumentExternal({
        url,
      }),
      message,
      randomId: BigInt(
        `-${uid ? uid : stringToSum(url)}`
      ) as unknown as bigInt.BigInteger,
      noforwards: true,
    })
  );
};

const stringToSum = (str: string) =>
  [...(str || "A")].reduce((a, x) => (a += x.codePointAt(0) || 0), 0);
