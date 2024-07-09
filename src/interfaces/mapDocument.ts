import { Category } from './category';
import Map from './map';

export default interface MapDocument {
  map: Map;
  rating: string;
  category: Category;
  baseline?: boolean;
}
