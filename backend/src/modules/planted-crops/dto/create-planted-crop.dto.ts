import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantedCropDto {
  @ApiProperty({ example: 'uuid-of-farm' })
  @IsUUID()
  farmId: string;

  @ApiProperty({ example: 'uuid-of-harvest' })
  @IsUUID()
  harvestId: string;

  @ApiProperty({ example: 'uuid-of-crop-type' })
  @IsUUID()
  cropTypeId: string;
}
