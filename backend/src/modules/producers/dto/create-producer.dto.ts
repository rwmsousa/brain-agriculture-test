import { IsString, IsNotEmpty, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @ApiProperty({ example: '529.982.247-25', description: 'CPF or CNPJ of the producer' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({ enum: ['CPF', 'CNPJ'], example: 'CPF' })
  @IsIn(['CPF', 'CNPJ'])
  documentType: 'CPF' | 'CNPJ';

  @ApiProperty({ example: 'Joao da Silva', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
