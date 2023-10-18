import { env } from "../env.js";

export function voiceId(name: string) {
  switch (name) {
    case "Joe Biden":
      return env.VOICE_BIDEN;
    case "Donald Trump":
      return env.VOICE_TRUMP;
    case "Barack Obama":
      return env.VOICE_OBAMA;
  }
}

export function voiceInfo(name: string) {
  switch (name) {
    case "Joe Biden":
      return {
        id: env.VOICE_BIDEN,
        volume: 2,
      };
    case "Donald Trump":
      return {
        id: env.VOICE_TRUMP,
        volume: 2.125,
      };
    case "Barack Obama":
      return {
        id: env.VOICE_OBAMA,
        volume: 2.125,
      };
    default:
      throw new Error(`Unknown voice ${name}`);
  }
}
