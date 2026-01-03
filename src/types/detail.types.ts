export interface VehicleDetail {
  title: string;
  price?: number;
  odometer?: number;
  stockNumber?: string;
  description?: string;
  images: string[];
  transmission?: string;
  bodyType?: string;
  driveType?: string;
  engine?: string;
  vin?: string;
  registration?: string;
}
