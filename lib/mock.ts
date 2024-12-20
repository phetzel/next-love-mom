import { Vault, Memory } from "@/types";

export const ownedVaults: Vault[] = [
  {
    id: "1",
    name: "Mom's Memories",
    ownerName: "You",
    memoryCount: 42,
    lastUpdated: "2024-03-15",
  },
  {
    id: "2",
    name: "Family Treasures",
    ownerName: "You",
    memoryCount: 78,
    lastUpdated: "2024-03-10",
  },
];

export const contributedVaults: Vault[] = [
  {
    id: "3",
    name: "Dad's Stories",
    ownerName: "Dad",
    memoryCount: 35,
    lastUpdated: "2024-03-12",
  },
  {
    id: "4",
    name: "Grandma's Wisdom",
    ownerName: "Aunt Sarah",
    memoryCount: 56,
    lastUpdated: "2024-03-08",
  },
];

export const memories: Memory[] = [
  {
    id: "1",
    title: "First Day of School",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/sample-audio.mp3",
  },
  {
    id: "2",
    title: "Family Vacation",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/sample-audio.mp3",
  },
  {
    id: "3",
    title: "Grandma's Birthday",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/sample-audio.mp3",
  },
  {
    id: "4",
    title: "Learning to Ride a Bike",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/sample-audio.mp3",
  },
];
