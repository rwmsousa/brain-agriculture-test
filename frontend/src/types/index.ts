export interface Producer {
  id: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  name: string;
  farms?: Farm[];
  createdAt: string;
  updatedAt: string;
}

export interface Farm {
  id: string;
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalAreaHectares: number;
  arableAreaHectares: number;
  vegetationAreaHectares: number;
  plantedCrops?: PlantedCrop[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Harvest {
  id: string;
  name: string;
  createdAt?: string;
}

export interface CropType {
  id: string;
  name: string;
}

export interface PlantedCrop {
  id: string;
  farmId: string;
  harvestId: string;
  cropTypeId: string;
  harvest?: Harvest;
  cropType?: CropType;
  createdAt?: string;
}

export interface FarmsByState {
  state: string;
  count: number;
}

export interface FarmsByCropType {
  cropType: string;
  count: number;
}

export interface LandUse {
  totalArableArea: number;
  totalVegetationArea: number;
}

export interface DashboardStats {
  totalFarms: number;
  totalHectares: number;
  farmsByState: FarmsByState[];
  farmsByCropType: FarmsByCropType[];
  landUse: LandUse;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
