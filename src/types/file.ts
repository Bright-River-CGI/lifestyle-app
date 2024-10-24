export interface Comment {
  id: number;
  orderfileId: string;
  text: string;
  author: string;
  date: string;
}

export interface OrderFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: Comment[];
}