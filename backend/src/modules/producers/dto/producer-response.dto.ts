import { ApiProperty } from '@nestjs/swagger';

export class ProducerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  document: string;

  @ApiProperty({ enum: ['CPF', 'CNPJ'] })
  documentType: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  farms?: unknown[];
}
