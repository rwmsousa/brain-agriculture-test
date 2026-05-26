import { CreateFarmDto } from '../../../modules/farms/dto/create-farm.dto';

const STATE_CITY_MAP: Record<string, string[]> = {
  MT: ['Cuiaba', 'Rondonopolis', 'Sinop', 'Varzea Grande'],
  GO: ['Goiania', 'Aparecida de Goiania', 'Rio Verde', 'Anapolis'],
  SP: ['Ribeirao Preto', 'Araçatuba', 'Bauru', 'Marilia'],
  MG: ['Uberaba', 'Uberlandia', 'Patos de Minas', 'Ituiutaba'],
  PR: ['Cascavel', 'Maringa', 'Londrina', 'Ponta Grossa'],
  RS: ['Passo Fundo', 'Cruz Alta', 'Ijui', 'Santa Rosa'],
  BA: ['Barreiras', 'Luis Eduardo Magalhaes', 'Ibotirama', 'Cotegipe'],
  MS: ['Dourados', 'Campo Grande', 'Tres Lagoas', 'Corumba'],
};

export function buildFarm(
  producerId: string,
  state: string,
  index: number,
  overrides?: Partial<CreateFarmDto>,
): CreateFarmDto {
  const cities = STATE_CITY_MAP[state] || ['Cidade Generica'];
  const city = cities[index % cities.length];
  const totalArea = 500 + index * 100;
  const arableArea = Math.floor(totalArea * 0.55);
  const vegetationArea = Math.floor(totalArea * 0.3);

  return {
    producerId,
    name: `Fazenda ${city} ${index + 1}`,
    city,
    state,
    totalAreaHectares: totalArea,
    arableAreaHectares: arableArea,
    vegetationAreaHectares: vegetationArea,
    ...overrides,
  };
}
