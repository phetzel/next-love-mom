export interface Vault {
  id: string;
  name: string;
  ownerName: string;
  memoryCount: number;
  lastUpdated: string;
}

export interface Memory {
  id: string;
  title: string;
  image: string;
  audio: string;
}
