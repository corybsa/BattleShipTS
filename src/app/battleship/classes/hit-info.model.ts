export enum HitType {
  HIT,
  MISS,
  DESTROYED
}

export interface HitInfo {
  shipId: number;
  hitType: HitType;
}
