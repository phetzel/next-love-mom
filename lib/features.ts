import {
  HeartHandshake,
  Upload,
  Headphones,
  UserPlus,
  Gift,
  Lock,
} from "lucide-react";
import type { Feature } from "@/types";

export const features: Feature[] = [
  {
    icon: Gift,
    title: "Create a Memory Vault",
    description:
      "Start by creating a special memory vault for someone you care about.",
  },
  {
    icon: UserPlus,
    title: "Invite Contributors",
    description:
      "Invite friends and family to contribute their cherished memories to the vault.",
  },
  {
    icon: Upload,
    title: "Upload Memories",
    description:
      "Share photos and record audio messages to fill the vault with love.",
  },
  {
    icon: Lock,
    title: "Secure and Private",
    description:
      "Keep memories safe and private until you're ready to share them.",
  },
  {
    icon: HeartHandshake,
    title: "Reveal the Gift",
    description:
      "When the time is right, invite the recipient to open their memory vault.",
  },
  {
    icon: Headphones,
    title: "Relive the Love",
    description:
      "The recipient can listen to messages and view photos anytime, anywhere.",
  },
];
