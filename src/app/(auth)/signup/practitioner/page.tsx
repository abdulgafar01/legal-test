import SignupForm from "@/components/auth/SignupForm";
import LanguageSwitcher from "@/provider/LanguageSwitcher";

export default function PractitionerSignupPage() {
  return (
    <>
      <LanguageSwitcher isAbsolute={true} />
      <SignupForm accountType="professional" />
    </>
  );
}
