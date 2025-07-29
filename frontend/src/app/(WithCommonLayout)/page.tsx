import Banner from "@/components/modules/WithCommonLayout/banner/Banner";
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
    </div>
  );
};

export default HomePage;
