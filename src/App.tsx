import ResetPasswordForm from "./components/layout/ResetPasswordForm.tsx";
import LoginForm from "./components/layout/LoginForm";

// import OTPForm from "./components/layout/OTPForm";


// import ResetPasswordForm from "./components/layout/ResetPasswordForm.tsx";
import RegisterForm from "./components/layout/RegisterForm"
function App() {
  return (
    <>
      <ResetPasswordForm />

      <LoginForm />
      {/* <OTPForm /> */}
      <RegisterForm />
    </>
  );
}

export default App;
