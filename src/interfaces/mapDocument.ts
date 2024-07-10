import { Category } from './category';
import Map from './map';

export default interface MapDocument {
  map: Map;
  rating: number;
  category: Category;
  baseline?: boolean;
  banned?: boolean;
  timeAdded: number;
}
