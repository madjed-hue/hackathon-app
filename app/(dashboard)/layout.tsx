import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 relative ">
        <div className="sidebar absolute top-0 left-0 w-full h-full" />
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-10" />

        <div className="z-[80]">
          <Sidebar isPro={true} apiLimitCount={5} />
        </div>
      </div>
      <main className="md:ml-72 z-[80] h-full main_dashboard relative">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
