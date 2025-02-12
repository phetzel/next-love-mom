import Image from "next/image";

export function Logo() {
  return (
    <Image src="/logo.png" alt="App Logo" width={80} height={80} priority />
  );
}
