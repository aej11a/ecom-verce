import { FlagOverridesType, decrypt } from "@vercel/flags";
import { cookies } from "next/headers";

export async function getFlags() {
  const cookieStore = await cookies();
  const overrideCookie = cookieStore.get("vercel-flag-overrides")?.value;
  const overrides = overrideCookie
    ? await decrypt<FlagOverridesType>(overrideCookie)
    : {};

  const flags = {
    categoryDescFlag: overrides?.categoryDescFlag ?? false,
  };

  return flags;
}
