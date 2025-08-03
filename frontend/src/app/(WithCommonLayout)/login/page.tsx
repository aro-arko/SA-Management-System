import LoginForm from "@/components/modules/WithCommonLayout/LOGIN/loginForm/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="pt-16"></div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
