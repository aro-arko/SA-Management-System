import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar></Navbar>
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
