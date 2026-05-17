export type User = {
  id: number;
  username: string;
  role?: string;
};

export type Client = {
  id: number;
  name: string;
  document: string;
  email: string;
  hasPhoto?: boolean;
  photoUrl?: string | null;
};

export type Company = {
  id: number;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  user: User;
  client: Client;
  company: Company;
};

export type MeResponse = {
  user: User;
  client: Client;
  company: Company;
};
