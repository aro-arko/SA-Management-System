import Banner from "@/components/modules/WithCommonLayout/banner/Banner";
import Benefits from "@/components/modules/WithCommonLayout/benefits/Benefits";
import HowToJoin from "@/components/modules/WithCommonLayout/howtojoin/HowToJoin";
import ProgramOverview from "@/components/modules/WithCommonLayout/programOverview/ProgramOverview";
import Quote from "@/components/modules/WithCommonLayout/quote/Quote";
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
      <HowToJoin />
      <Quote />
    </div>
  );
};

export default HomePage;
