import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex flex-grow container justify-center items-center mx-auto px-4 py-4">
      <UserProfile path="/dashboard/user-profile" />
    </div>
  );
}
