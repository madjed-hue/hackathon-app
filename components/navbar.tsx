import { UserButton } from "@clerk/nextjs";

import { MobileSidebar } from "@/components/mobile-sidebar";
// import { getApiLimitCount } from "@/lib/api-limit";
// import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {
  //   const apiLimitCount = await getApiLimitCount();
  //   const isPro = await checkSubscription();

  return (
    <div className="flex items-center p-4 z-50 relative">
      <MobileSidebar isPro={true} apiLimitCount={5} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
