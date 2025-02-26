import "server-only";
import { createNextBungieAuth } from "next-bungie-auth/server";

export const {
  catchAllHandler,
  serverSideHelpers: { getServerSession },
} = createNextBungieAuth({
  clientId: process.env.BUNGIE_CLIENT_ID!,
  clientSecret: process.env.BUNGIE_CLIENT_SECRET!,
  baseCookieName: "__destiny-wrapped",
  generateState: () => crypto.randomUUID(),
});
