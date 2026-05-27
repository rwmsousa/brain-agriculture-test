import React, { useState } from 'react';
import styled from 'styled-components';
import { Producer } from '../../../types';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { FarmForm } from '../FarmForm/FarmForm';
import { PlantedCropForm } from '../PlantedCropForm/PlantedCropForm';
import { useAppDispatch } from '../../../store';
import { fetchProducerById } from '../../../store/slices/producersSlice';

/* ─── Styled Components ─────────────────────────────────────── */

const Container = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProducerHeader = styled.div`
  margin-bottom: 4px;
`;

const DocRow = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 0;
  font-size: 14px;
  color: #555;
`;

const Section = styled.section`
  margin-top: 28px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const FarmCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const FarmHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const FarmInfo = styled.div`
  flex: 1;
`;

const FarmName = styled.strong`
  font-size: 15px;
`;

const FarmMeta = styled.p`
  margin: 4px 0 0;
  color: #666;
  font-size: 13px;
  line-height: 1.5;
`;

const CropList = styled.ul`
  margin: 8px 0 0;
  padding-left: 20px;

  li {
    font-size: 13px;
    color: #444;
    margin-bottom: 3px;
  }
`;

const EmptyText = styled.p`
  font-size: 13px;
  color: #999;
  margin: 8px 0;
`;

const FormWrapper = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const FarmFormWrapper = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 16px;
`;

/* ─── Helpers ───────────────────────────────────────────────── */

/**
 * Formata um valor de hectares de forma legível.
 * Aceita string pois TypeORM serializa colunas `decimal` do Postgres como string.
 * Ex: "1000.0000" → "1.000" | "480.5" → "480,5"
 */
const formatHa = (value: number | string): string =>
  parseFloat(String(value)).toLocaleString('pt-BR', { maximumFractionDigits: 2 });

/** Aplica máscara de CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00). */
const maskDocument = (doc: string, type: 'CPF' | 'CNPJ'): string => {
  const digits = doc.replace(/\D/g, '');
  if (type === 'CPF') {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/* ─── Component ─────────────────────────────────────────────── */

interface ProducerDetailProps {
  producer: Producer;
}

export const ProducerDetail: React.FC<ProducerDetailProps> = ({ producer }) => {
  const dispatch = useAppDispatch();
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  /** Recarrega o produtor (e suas fazendas + culturas) do servidor. */
  const refresh = () => {
    dispatch(fetchProducerById(producer.id));
  };

  const handleFarmSuccess = () => {
    setShowFarmForm(false);
    refresh();
  };

  // Mantém o painel da fazenda aberto após adicionar cultura
  // para que o usuário veja imediatamente a nova cultura na lista.
  const handleCropSuccess = () => {
    refresh();
  };

  return (
    <Container>
      {/* ── Cabeçalho do produtor ─────────────────────────── */}
      <ProducerHeader>
        <h2 style={{ margin: 0 }}>{producer.name}</h2>
        <DocRow>
          <Badge>{producer.documentType}</Badge>
          {maskDocument(producer.document, producer.documentType)}
        </DocRow>
      </ProducerHeader>

      {/* ── Fazendas ─────────────────────────────────────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Fazendas ({producer.farms?.length ?? 0})</SectionTitle>
          <Button onClick={() => setShowFarmForm((v) => !v)}>
            {showFarmForm ? 'Cancelar' : 'Adicionar Fazenda'}
          </Button>
        </SectionHeader>

        {showFarmForm && (
          <FarmFormWrapper>
            <FarmForm
              producerId={producer.id}
              onSuccess={handleFarmSuccess}
              onCancel={() => setShowFarmForm(false)}
            />
          </FarmFormWrapper>
        )}

        {producer.farms?.map((farm) => (
          <FarmCard key={farm.id}>
            <FarmHeader>
              <FarmInfo>
                <FarmName>{farm.name}</FarmName> <Badge>{farm.state}</Badge>
                <FarmMeta>
                  {farm.city} — Total: <strong>{formatHa(farm.totalAreaHectares)} ha</strong>
                  {' | '}
                  Agricultável: <strong>{formatHa(farm.arableAreaHectares)} ha</strong>
                  {' | '}
                  Vegetação: <strong>{formatHa(farm.vegetationAreaHectares)} ha</strong>
                </FarmMeta>
              </FarmInfo>

              <Button
                variant="secondary"
                onClick={() => setSelectedFarmId(selectedFarmId === farm.id ? null : farm.id)}
              >
                {selectedFarmId === farm.id ? 'Fechar' : 'Culturas'}
              </Button>
            </FarmHeader>

            {selectedFarmId === farm.id && (
              <FormWrapper>
                <strong style={{ fontSize: 14 }}>Culturas Plantadas</strong>

                {farm.plantedCrops && farm.plantedCrops.length > 0 ? (
                  <CropList>
                    {farm.plantedCrops.map((pc) => (
                      <li key={pc.id}>
                        <strong>{pc.cropType?.name ?? '—'}</strong>
                        {' — '}
                        {pc.harvest?.name ?? '—'}
                      </li>
                    ))}
                  </CropList>
                ) : (
                  <EmptyText>Nenhuma cultura plantada nesta fazenda.</EmptyText>
                )}

                <PlantedCropForm
                  farmId={farm.id}
                  onSuccess={handleCropSuccess}
                  onCancel={() => setSelectedFarmId(null)}
                />
              </FormWrapper>
            )}
          </FarmCard>
        ))}

        {(!producer.farms || producer.farms.length === 0) && !showFarmForm && (
          <EmptyText>Nenhuma fazenda cadastrada.</EmptyText>
        )}
      </Section>
    </Container>
  );
};

export default ProducerDetail;
