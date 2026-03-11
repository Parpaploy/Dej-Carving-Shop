import { Suspense } from "react";
import LoginClient from "../components/clients/login";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
