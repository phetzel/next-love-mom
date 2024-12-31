export interface Vault {
  id: string;
  name: string;
  ownerName: string;
  memoryCount: number;
  lastUpdated: string;
}

export interface Memory {
  id: number;
  title: string;
  imageUrl: string;
  audioUrl: string;
  createdAt: string;
  updatedAt: string;
}
