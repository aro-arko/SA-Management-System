import Banner from "@/components/modules/WithCommonLayout/banner/Banner";
import ProgramOverview from "@/components/modules/WithCommonLayout/programOverview/ProgramOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Ambassador",
  description:
    "UCSI University Student Ambassador Program under Student Enrollment Centre",
};

const HomePage = () => {
  return (
    <div>
      <Banner />
      <ProgramOverview />
    </div>
  );
};

export default HomePage;
