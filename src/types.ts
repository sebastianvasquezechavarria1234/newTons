export interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  gradient: string;
}

export interface PhysicsControls {
  gravity: number;
  wind: number;
  restitution: number;
  frictionAir: number;
  magneticAttraction: number;
}
