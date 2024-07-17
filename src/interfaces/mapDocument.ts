import { Category } from "./category";
import Map from "./map";

export default interface MapDocument {
    map_id: number;
    mapQua: Map;
    submittedBy_id: number;
    quaver_id: number;
    totalRating: number;
    category: Category;
    baseline?: boolean;
    banned?: boolean;
    createdAt: number;
}
