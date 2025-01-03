export interface Vault {
  id: string;
  name: string;
  creatorId: string;
  ownerId?: string;
  ownerName: string;
  memoryCount: number;
  lastUpdated: string;
}

export interface Memory {
  id: number;
  title: string;
  imageUrl: string;
  audioUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invite {
  id: number;
  email: string;
  status: "pending" | "accepted" | "rejected";
}
