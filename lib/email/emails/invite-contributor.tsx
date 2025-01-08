import {
  // Layout Components
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,

  // Elements
  Button,
  Link,
  Text,
  Heading,
  Hr,

  // Styling
  Tailwind,
} from "@react-email/components";

interface InviteEmailProps {
  inviteUrl: string;
  vaultName: string;
}

export function InviteContributorEmail({
  inviteUrl,
  vaultName,
}: InviteEmailProps) {
  return (
    <Html>
      <Preview>You've been invited to {vaultName}</Preview>
      <Tailwind>
        <Body className="my-auto mx-auto font-sans">
          <Container className="border border-solid border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[600px]">
            <Heading className="text-2xl font-normal text-center my-[30px]">
              You've been invited to contribute
            </Heading>
            <Section className="mb-4">
              You've been invited to contribute memories to {vaultName}.
            </Section>
            <Section className="mb-6 text-center">
              <Link href={inviteUrl}>
                <Button className="bg-black text-white px-6 py-3 rounded">
                  Accept Invitation
                </Button>
              </Link>
            </Section>
            <Hr className="border-t border-gray-200" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
