import Banner from "@/components/modules/WithCommonLayout/HOME/banner/Banner";
import Benefits from "@/components/modules/WithCommonLayout/HOME/benefits/Benefits";
import HowToJoin from "@/components/modules/WithCommonLayout/HOME/howtojoin/HowToJoin";
import NewsLetter from "@/components/modules/WithCommonLayout/HOME/newsletter/NewsLetter";
import ProgramOverview from "@/components/modules/WithCommonLayout/HOME/programOverview/ProgramOverview";
import Quote from "@/components/modules/WithCommonLayout/HOME/quote/Quote";
import RolesExpectations from "@/components/modules/WithCommonLayout/HOME/roles&expectations/RolesExpectations";
import SAExperience from "@/components/modules/WithCommonLayout/HOME/saexperience/SAExperience";
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
      <SAExperience />
      <NewsLetter />
    </div>
  );
};

export default HomePage;
