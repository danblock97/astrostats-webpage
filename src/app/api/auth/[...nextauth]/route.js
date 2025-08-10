import { createRequire } from "module";
import { authOptions } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const require = createRequire(import.meta.url);
const NextAuthModule = require("next-auth/next");
const factory = typeof NextAuthModule === "function" ? NextAuthModule : NextAuthModule?.default;
const handler = factory(authOptions);

export { handler as GET, handler as POST };


