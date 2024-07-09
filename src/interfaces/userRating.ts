import { Quality } from "./quality";

export default interface UserRating {
  user_id: number;
  map_id: number;
  rating: number;
  quality: Quality;
}
