import { CreatePlantedCropDto } from '../../../modules/planted-crops/dto/create-planted-crop.dto';

export function buildPlantedCrop(
  farmId: string,
  harvestId: string,
  cropTypeId: string,
): CreatePlantedCropDto {
  return { farmId, harvestId, cropTypeId };
}
