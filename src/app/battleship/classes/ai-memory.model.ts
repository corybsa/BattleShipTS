import {Coordinate} from './ship-position.model';
import {Orientation} from './orientation.model';
import {HitInfo} from './hit-info.model';

export interface AiMemory {
  orientation: Orientation;
  lastAttack: HitInfo;
  shipId: number;
  coordinates: Coordinate[];
}
