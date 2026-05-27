import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';

@ApiTags('harvests')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Get()
  @ApiOperation({ summary: 'List all harvests' })
  @ApiResponse({ status: 200, description: 'List of harvests' })
  findAll() {
    return this.harvestsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a harvest' })
  @ApiResponse({ status: 201, description: 'Harvest created' })
  create(@Body() dto: CreateHarvestDto) {
    return this.harvestsService.create(dto);
  }
}
