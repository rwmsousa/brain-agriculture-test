import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CropTypesService } from './crop-types.service';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';

@ApiTags('crop-types')
@Controller('crop-types')
export class CropTypesController {
  constructor(private readonly cropTypesService: CropTypesService) {}

  @Get()
  @ApiOperation({ summary: 'List all crop types' })
  @ApiResponse({ status: 200, description: 'List of crop types' })
  findAll() {
    return this.cropTypesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a crop type' })
  @ApiResponse({ status: 201, description: 'Crop type created' })
  @ApiResponse({ status: 409, description: 'Crop type already exists' })
  create(@Body() dto: CreateCropTypeDto) {
    return this.cropTypesService.create(dto);
  }
}
