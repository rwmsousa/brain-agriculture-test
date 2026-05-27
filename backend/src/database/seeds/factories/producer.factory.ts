import { CreateProducerDto } from '../../../modules/producers/dto/create-producer.dto';

// ─── CPFs válidos (para teste) ────────────────────────────────────────────────
const VALID_CPFS = [
  '52998224725',
  '27548406134',
  '71428793860',
  '87748248800',
  '20176220445',
  '45607488020',
  '10938158686',
  '38176123625',
];

// ─── CNPJs válidos (gerados deterministicamente para testes) ──────────────────
const VALID_CNPJS = [
  '10000001000190',
  '10000002000134',
  '10000003000189',
  '10000004000123',
  '10000005000178',
  '10000006000112',
  '10000007000167',
];

// ─── Nomes fictícios de produtores ───────────────────────────────────────────
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
  'Agropecuaria Brasil Ltda',
  'Fazendas do Cerrado S.A.',
  'Grupo Rural Norte Ltda',
  'Cooperativa Agro Sudeste',
  'Agromax Investimentos Ltda',
];

// ─── Tipo de documento por índice ────────────────────────────────────────────
// Produtores 0-7  → CPF
// Produtores 8-14 → CNPJ
function resolveDocument(index: number): { document: string; documentType: 'CPF' | 'CNPJ' } {
  if (index < 8) {
    return { document: VALID_CPFS[index], documentType: 'CPF' };
  }
  return { document: VALID_CNPJS[index - 8], documentType: 'CNPJ' };
}

export function buildProducer(
  index: number,
  overrides?: Partial<CreateProducerDto>,
): CreateProducerDto {
  const { document, documentType } = resolveDocument(index % PRODUCER_NAMES.length);
  return {
    document,
    documentType,
    name: PRODUCER_NAMES[index % PRODUCER_NAMES.length],
    ...overrides,
  };
}

export { VALID_CPFS, VALID_CNPJS };
