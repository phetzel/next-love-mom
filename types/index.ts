export interface User {
  email: string;
  name?: string | null;
  imageUrl?: string;
}

export interface Vault {
  id: number;
  name: string;
  ownerId: string | null;
  creatorId: string;
  ownerEmail: string;
  isClaimed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultDetails extends Vault {
  memoryCount: number;
  owner?: User;
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
  inviteName: string | null;
  status: "pending" | "accepted" | "rejected";
  type: "contributor" | "owner";
}

export interface InviteDetails extends Invite {
  vault: Vault;
  invitor: User;
}
