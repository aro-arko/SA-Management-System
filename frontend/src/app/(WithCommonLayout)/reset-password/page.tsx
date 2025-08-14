import ResetPassword from "@/components/modules/WithCommonLayout/LOGIN/resetpassword/ResetPassword";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div></div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordPage;
