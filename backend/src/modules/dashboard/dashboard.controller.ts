import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics',
    schema: {
      example: {
        totalFarms: 42,
        totalHectares: 125430.5,
        farmsByState: [{ state: 'MT', count: 15 }],
        farmsByCropType: [{ cropType: 'Soja', count: 20 }],
        landUse: { totalArableArea: 87000.0, totalVegetationArea: 38430.5 },
      },
    },
  })
  getStats() {
    return this.dashboardService.getStats();
  }
}
