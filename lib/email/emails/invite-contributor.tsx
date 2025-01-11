import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

import { env } from "@/lib/env";
import { Logo } from "@/lib/email/components/logo";

interface InviteEmailProps {
  inviteName: string;
  inviteUrl: string;
  invitedByName: string;
  invitedByEmail: string;
  invitedByImageUrl?: string;
  vaultName: string;
}

export function InviteContributorEmail({
  inviteName,
  inviteUrl,
  invitedByName,
  invitedByEmail,
  invitedByImageUrl,
  vaultName,
}: InviteEmailProps) {
  const previewText = `Share memories in ${vaultName}'s memory vault`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Logo />
            </Section>

            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>{vaultName}</strong> memory vault on{" "}
              <strong>ILYF</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px]">
              Hello {inviteName},
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{invitedByName}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to share loving memories in{" "}
              <strong>{vaultName}</strong> on <strong>ILYF</strong>.
            </Text>

            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={invitedByImageUrl}
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
                    src={`${env.NEXT_PUBLIC_APP_URL}/hand-heart.svg`}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteUrl}
              >
                Join
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
