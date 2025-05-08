// components/MobileMenu.tsx
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.actions";
import { MobileMenu } from "../header/components/MobileMenu";

export default async function MobileMenuServer() {
  const authUser = await currentUser();
  const serverUser = authUser ? await getUserByClerkId(authUser.id) : null;
  return <MobileMenu serverUser={serverUser} />;
}
