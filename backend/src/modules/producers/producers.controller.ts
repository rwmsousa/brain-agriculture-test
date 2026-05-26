import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerResponseDto } from './dto/producer-response.dto';

@ApiTags('rural-producers')
@Controller('rural-producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get()
  @ApiOperation({ summary: 'List all rural producers' })
  @ApiResponse({ status: 200, description: 'List of producers', type: [ProducerResponseDto] })
  findAll() {
    return this.producersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rural producer by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Producer found', type: ProducerResponseDto })
  @ApiResponse({ status: 404, description: 'Producer not found' })
  findById(@Param('id') id: string) {
    return this.producersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a rural producer' })
  @ApiResponse({ status: 201, description: 'Producer created', type: ProducerResponseDto })
  @ApiResponse({ status: 409, description: 'Document already registered' })
  @ApiResponse({ status: 422, description: 'Invalid CPF or CNPJ' })
  create(@Body() dto: CreateProducerDto) {
    return this.producersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rural producer' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Producer updated', type: ProducerResponseDto })
  @ApiResponse({ status: 404, description: 'Producer not found' })
  @ApiResponse({ status: 422, description: 'Invalid document' })
  update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    return this.producersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a rural producer' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Producer deleted' })
  @ApiResponse({ status: 404, description: 'Producer not found' })
  remove(@Param('id') id: string) {
    return this.producersService.remove(id);
  }
}
