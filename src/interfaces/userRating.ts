import { Quality } from "./quality";
import MapDocument from "./mapDocument";
export default interface UserRating {
    rating_id: number;
    user_id: number;
    map_id: number;
    rating: number;
    quality: Quality;
    map?: MapDocument;
}
