import Banner from "@/components/modules/WithCommonLayout/banner/Banner";
import Benefits from "@/components/modules/WithCommonLayout/benefits/Benefits";
import ProgramOverview from "@/components/modules/WithCommonLayout/programOverview/ProgramOverview";
import RolesExpectations from "@/components/modules/WithCommonLayout/roles&expectations/RolesExpectations";
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
      <Benefits />
      <RolesExpectations />
    </div>
  );
};

export default HomePage;
