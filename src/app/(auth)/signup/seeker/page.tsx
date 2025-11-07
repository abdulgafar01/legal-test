import SignupForm from "@/components/auth/SignupForm";
import LanguageSwitcher from "@/provider/LanguageSwitcher";

export default function ServiceSeekerSignupPage() {
  return (
    <>
      <LanguageSwitcher isAbsolute={true} />
      <SignupForm accountType="service-seeker" />
    </>
  );
}
