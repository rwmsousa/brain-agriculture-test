import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { Producer } from './entities/producer.entity';
import { ProducersRepository } from './producers.repository';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import {
  validateCPF,
  validateCNPJ,
  stripDocument,
} from '../../common/validators/cpf-cnpj.validator';

@Injectable()
export class ProducersService {
  constructor(private readonly producersRepository: ProducersRepository) {}

  private validateDocument(document: string, documentType: 'CPF' | 'CNPJ'): void {
    const stripped = stripDocument(document);
    const isValid = documentType === 'CPF' ? validateCPF(stripped) : validateCNPJ(stripped);
    if (!isValid) {
      throw new UnprocessableEntityException(`${documentType} invalido`);
    }
  }

  async create(dto: CreateProducerDto): Promise<Producer> {
    this.validateDocument(dto.document, dto.documentType);

    const stripped = stripDocument(dto.document);
    const existing = await this.producersRepository.findByDocument(stripped);
    if (existing) {
      throw new ConflictException('Documento ja cadastrado');
    }

    return this.producersRepository.create({
      document: stripped,
      documentType: dto.documentType,
      name: dto.name,
    });
  }

  findAll(): Promise<Producer[]> {
    return this.producersRepository.findAll();
  }

  async findById(id: string): Promise<Producer> {
    const producer = await this.producersRepository.findById(id);
    if (!producer) {
      throw new NotFoundException(`Produtor com id ${id} nao encontrado`);
    }
    return producer;
  }

  async update(id: string, dto: UpdateProducerDto): Promise<Producer> {
    await this.findById(id);

    const updateData: Partial<Producer> = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.document !== undefined || dto.documentType !== undefined) {
      const currentProducer = await this.producersRepository.findById(id);
      const currentType = (dto.documentType ?? currentProducer!.documentType) as 'CPF' | 'CNPJ';
      const rawDoc = dto.document ?? currentProducer!.document;

      this.validateDocument(rawDoc, currentType);

      const stripped = stripDocument(rawDoc);
      if (stripped !== currentProducer!.document) {
        const existing = await this.producersRepository.findByDocument(stripped);
        if (existing && existing.id !== id) {
          throw new ConflictException('Documento ja cadastrado');
        }
        updateData.document = stripped;
      }

      if (dto.documentType !== undefined) {
        updateData.documentType = dto.documentType;
      }
    }

    return this.producersRepository.update(id, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    return this.producersRepository.delete(id);
  }
}
