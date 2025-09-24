"use client";
import ProfileAuthGuard from "@/components/ProfileAuthGuard";

const EditProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProfileAuthGuard>
      <div className="flex  max-h-screen">
        <main className="flex-1 flex flex-col pb-8 bg-white text-black relative overflow-hidden">
          <div>{children}</div>
        </main>
      </div>
    </ProfileAuthGuard>
  );
};

export default EditProfileLayout;
