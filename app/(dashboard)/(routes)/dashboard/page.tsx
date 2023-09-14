"use client";

import useStoreUserEffect from "@/hooks/useStoreUserEffect";

export default function DashboardPage() {
  const userId = useStoreUserEffect();

  if (userId === null) {
    return <div>Storing user...</div>;
  }
  return (
    <div>
      <p>hello ai saas user {userId}</p>
    </div>
  );
}
