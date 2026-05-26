import { CreateProducerDto } from '../../../modules/producers/dto/create-producer.dto';

// Pre-defined list of valid CPFs for reproducibility
const VALID_CPFS = [
  '52998224725',
  '27548406134',
  '71428793860',
  '87748248800',
  '20176220445',
  '45607488020',
  '10938158686',
  '38176123625',
  '54271113794',
  '65427227261',
];

const PRODUCER_NAMES = [
  'Maria Fernanda Costa',
  'Joao Pedro Almeida',
  'Ana Clara Rodrigues',
  'Carlos Eduardo Silva',
  'Patricia Oliveira Santos',
  'Roberto Machado Lima',
  'Fernanda Souza Pereira',
  'Marcelo Torres Ferreira',
  'Juliana Mendes Carvalho',
  'Anderson Lima Barbosa',
];

export function buildProducer(
  index: number,
  overrides?: Partial<CreateProducerDto>,
): CreateProducerDto {
  return {
    document: VALID_CPFS[index % VALID_CPFS.length],
    documentType: 'CPF',
    name: PRODUCER_NAMES[index % PRODUCER_NAMES.length],
    ...overrides,
  };
}

export { VALID_CPFS };
