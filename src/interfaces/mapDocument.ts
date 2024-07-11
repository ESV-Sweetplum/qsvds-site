import { Category } from "./category";
import Map from "./map";

export default interface MapDocument {
    id: number;
    map: Map;
    submittedBy_id: number;
    quaver_id: number;
    totalRating: number;
    category: Category;
    baseline?: boolean;
    banned?: boolean;
    timeAdded: number;
}
