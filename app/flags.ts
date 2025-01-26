import { flag } from "@vercel/flags/next";

export const categoryDescFlag = flag<boolean>({
  key: "category-description-visibility",
  decide() {
    return false;
  },
});
