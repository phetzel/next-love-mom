import { Img } from "@react-email/components";

import { env } from "@/lib/env";

export function Logo() {
  const logo = `${env.NEXT_PUBLIC_APP_URL}/vercel.svg`;

  return (
    <Img
      src={logo}
      width="40"
      height="37"
      alt="Logo"
      className="my-0 mx-auto"
    />
  );
}
