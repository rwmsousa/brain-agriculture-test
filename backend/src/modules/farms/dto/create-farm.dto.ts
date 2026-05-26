import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsUUID,
  IsNumber,
  Min,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BRAZILIAN_STATES } from '../../../common/constants/brazilian-states.constant';

export class CreateFarmDto {
  @ApiProperty({ example: 'uuid-of-producer' })
  @IsUUID()
  producerId: string;

  @ApiProperty({ example: 'Fazenda Santa Rosa' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Rondonopolis' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city: string;

  @ApiProperty({ example: 'MT', enum: BRAZILIAN_STATES })
  @IsIn(BRAZILIAN_STATES)
  state: string;

  @ApiProperty({ example: 500.0 })
  @IsNumber()
  @IsPositive()
  totalAreaHectares: number;

  @ApiProperty({ example: 300.0 })
  @IsNumber()
  @Min(0)
  arableAreaHectares: number;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0)
  vegetationAreaHectares: number;
}
