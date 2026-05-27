import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PlantedCropsService } from './planted-crops.service';
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto';

@ApiTags('planted-crops')
@Controller()
export class PlantedCropsController {
  constructor(private readonly plantedCropsService: PlantedCropsService) {}

  @Get('farms/:farmId/planted-crops')
  @ApiOperation({ summary: 'Get planted crops by farm' })
  @ApiParam({ name: 'farmId', type: String })
  @ApiResponse({ status: 200, description: 'List of planted crops' })
  findByFarmId(@Param('farmId') farmId: string) {
    return this.plantedCropsService.findByFarmId(farmId);
  }

  @Post('planted-crops')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a planted crop' })
  @ApiResponse({ status: 201, description: 'Planted crop added' })
  @ApiResponse({
    status: 409,
    description: 'Planted crop already exists for this farm and harvest',
  })
  create(@Body() dto: CreatePlantedCropDto) {
    return this.plantedCropsService.create(dto);
  }

  @Delete('planted-crops/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a planted crop' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Planted crop removed' })
  @ApiResponse({ status: 404, description: 'Planted crop not found' })
  remove(@Param('id') id: string) {
    return this.plantedCropsService.remove(id);
  }
}
