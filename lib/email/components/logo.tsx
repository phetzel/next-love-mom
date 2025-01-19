import { Img } from "@react-email/components";

import { env } from "@/lib/env";

export function Logo() {
  const logoSrc = `${env.NEXT_PUBLIC_APP_URL}/logo.jpeg`;

  return (
    <Img
      src={logoSrc}
      width="40"
      height="37"
      alt="Logo"
      className="my-0 mx-auto"
    />
  );
}
