export interface TRoom {
  id: number;
  code: string;
  title: string;
  maximum?: number;
  count?: number;
  createdAt: string;
  currentUserCount: number;
}
