import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/account", // we use same page to prompt sign-in
  },
});

export const config = {
  matcher: ["/api/stripe/checkout", "/api/stripe/portal"],
};


