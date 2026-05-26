import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export interface DashboardStats {
  totalFarms: number;
  totalHectares: number;
  farmsByState: { state: string; count: number }[];
  farmsByCropType: { cropType: string; count: number }[];
  landUse: { totalArableArea: number; totalVegetationArea: number };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const [totalResult] = await this.dataSource.query<
      { total_farms: string; total_hectares: string }[]
    >(`
      SELECT COUNT(*) as total_farms, COALESCE(SUM(total_area_hectares), 0) as total_hectares
      FROM fazendas
    `);

    const stateResult = await this.dataSource.query<{ state: string; count: string }[]>(`
      SELECT state, COUNT(*) as count
      FROM fazendas
      GROUP BY state
      ORDER BY count DESC
    `);

    const cropTypeResult = await this.dataSource.query<{ crop_type: string; count: string }[]>(`
      SELECT tc.name as crop_type, COUNT(cp.id) as count
      FROM culturas_plantadas cp
      JOIN tipos_cultura tc ON tc.id = cp.crop_type_id
      GROUP BY tc.name
      ORDER BY count DESC
    `);

    const [landUseResult] = await this.dataSource.query<
      {
        total_arable: string;
        total_vegetation: string;
      }[]
    >(`
      SELECT
        COALESCE(SUM(arable_area_hectares), 0) as total_arable,
        COALESCE(SUM(vegetation_area_hectares), 0) as total_vegetation
      FROM fazendas
    `);

    return {
      totalFarms: parseInt(totalResult.total_farms, 10),
      totalHectares: parseFloat(totalResult.total_hectares),
      farmsByState: stateResult.map((r) => ({ state: r.state, count: parseInt(r.count, 10) })),
      farmsByCropType: cropTypeResult.map((r) => ({
        cropType: r.crop_type,
        count: parseInt(r.count, 10),
      })),
      landUse: {
        totalArableArea: parseFloat(landUseResult.total_arable),
        totalVegetationArea: parseFloat(landUseResult.total_vegetation),
      },
    };
  }
}
