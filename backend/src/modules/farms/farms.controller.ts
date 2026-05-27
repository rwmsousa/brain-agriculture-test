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
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@ApiTags('farms')
@Controller()
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Get('rural-producers/:producerId/farms')
  @ApiOperation({ summary: 'Get farms by producer' })
  @ApiParam({ name: 'producerId', type: String })
  @ApiResponse({ status: 200, description: 'List of farms' })
  findByProducerId(@Param('producerId') producerId: string) {
    return this.farmsService.findByProducerId(producerId);
  }

  @Get('farms/:id')
  @ApiOperation({ summary: 'Get a farm by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Farm found' })
  @ApiResponse({ status: 404, description: 'Farm not found' })
  findById(@Param('id') id: string) {
    return this.farmsService.findById(id);
  }

  @Post('farms')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a farm' })
  @ApiResponse({ status: 201, description: 'Farm created' })
  @ApiResponse({ status: 422, description: 'Area constraint violation' })
  create(@Body() dto: CreateFarmDto) {
    return this.farmsService.create(dto);
  }

  @Patch('farms/:id')
  @ApiOperation({ summary: 'Update a farm' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Farm updated' })
  @ApiResponse({ status: 404, description: 'Farm not found' })
  @ApiResponse({ status: 422, description: 'Area constraint violation' })
  update(@Param('id') id: string, @Body() dto: UpdateFarmDto) {
    return this.farmsService.update(id, dto);
  }

  @Delete('farms/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a farm' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Farm deleted' })
  @ApiResponse({ status: 404, description: 'Farm not found' })
  remove(@Param('id') id: string) {
    return this.farmsService.remove(id);
  }
}
