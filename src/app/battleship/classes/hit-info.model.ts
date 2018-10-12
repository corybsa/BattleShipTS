export enum HitType {
  HIT,
  MISS,
  DESTROYED,
  NULL
}

export interface HitInfo {
  shipId: number;
  hitType: HitType;
}
