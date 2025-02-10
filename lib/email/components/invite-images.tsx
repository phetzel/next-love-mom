import { Column, Img, Row } from "@react-email/components";
import { env } from "@/lib/env";

interface InviteImagesProps {
  invitedByImageUrl?: string;
}

export function InviteImages({ invitedByImageUrl }: InviteImagesProps) {
  let invitedBySrc;
  if (invitedByImageUrl) {
    invitedBySrc = invitedByImageUrl;
    const params = new URLSearchParams();

    params.set("height", "64");
    params.set("width", "64");
    params.set("quality", "100");
    params.set("fit", "crop");

    invitedBySrc = `${invitedBySrc}?${params.toString()}`;
  } else {
    invitedBySrc = `${env.NEXT_PUBLIC_APP_URL}/avatar.svg`;
  }

  return (
    <Row>
      <Column align="right">
        <Img
          className="rounded-full"
          src={invitedBySrc}
          width="64"
          height="64"
        />
      </Column>
      <Column align="center">
        <Img
          src={`${env.NEXT_PUBLIC_APP_URL}/arrow.png`}
          width="12"
          height="9"
          alt="invited you to"
        />
      </Column>
      <Column align="left">
        <Img
          className="rounded-full"
          src={`${env.NEXT_PUBLIC_APP_URL}/logo.png`}
          width="64"
          height="64"
        />
      </Column>
    </Row>
  );
}
