import UserRating from './userRating';

export default interface User {
  id: number;
  createdAt?: any;
  quaver_id: number;
  avatar: string;
  username: string;
  hash: string;
  ratings?: UserRating[];
}
