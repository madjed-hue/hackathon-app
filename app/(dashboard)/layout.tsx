import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 relative z-[100]">
        <div className="">
          <Sidebar isPro={true} apiLimitCount={5} />
        </div>
      </div>
      <main className="md:ml-72 h-full relative z-50">
        <div className="main_dashboard">
          <div className="gradient" />
        </div>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
