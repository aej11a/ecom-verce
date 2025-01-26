import { flag } from "@vercel/flags/next";

export const categoryDescFlag = flag<boolean>({
  key: "categoryDescFlag",
  decide() {
    return false;
  },
});
