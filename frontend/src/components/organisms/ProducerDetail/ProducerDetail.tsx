import React, { useState } from 'react';
import styled from 'styled-components';
import { Producer } from '../../../types';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { FarmForm } from '../FarmForm/FarmForm';
import { PlantedCropForm } from '../PlantedCropForm/PlantedCropForm';

const Container = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  margin-top: 24px;
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
  align-items: center;
  margin-bottom: 8px;
`;

interface ProducerDetailProps {
  producer: Producer;
}

export const ProducerDetail: React.FC<ProducerDetailProps> = ({ producer }) => {
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  return (
    <Container>
      <h2>{producer.name}</h2>
      <p>
        <Badge>{producer.documentType}</Badge> {producer.document}
      </p>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Fazendas ({producer.farms?.length ?? 0})</h3>
          <Button onClick={() => setShowFarmForm(!showFarmForm)}>
            {showFarmForm ? 'Cancelar' : 'Adicionar Fazenda'}
          </Button>
        </div>

        {showFarmForm && (
          <FarmForm
            producerId={producer.id}
            onSuccess={() => setShowFarmForm(false)}
            onCancel={() => setShowFarmForm(false)}
          />
        )}

        {producer.farms?.map((farm) => (
          <FarmCard key={farm.id}>
            <FarmHeader>
              <div>
                <strong>{farm.name}</strong>
                <span style={{ marginLeft: 8 }}>
                  <Badge>{farm.state}</Badge>
                </span>
                <p style={{ margin: '4px 0', color: '#666', fontSize: 13 }}>
                  {farm.city} — Total: {farm.totalAreaHectares}ha | Agricultavel:{' '}
                  {farm.arableAreaHectares}ha | Vegetacao: {farm.vegetationAreaHectares}ha
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setSelectedFarmId(selectedFarmId === farm.id ? null : farm.id)}
              >
                {selectedFarmId === farm.id ? 'Fechar' : 'Culturas'}
              </Button>
            </FarmHeader>

            {selectedFarmId === farm.id && (
              <div>
                <h4>Culturas Plantadas</h4>
                {farm.plantedCrops && farm.plantedCrops.length > 0 ? (
                  <ul>
                    {farm.plantedCrops.map((pc) => (
                      <li key={pc.id}>
                        {pc.cropType?.name ?? pc.cropTypeId} — {pc.harvest?.name ?? pc.harvestId}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma cultura plantada.</p>
                )}
                <PlantedCropForm farmId={farm.id} onSuccess={() => setSelectedFarmId(null)} />
              </div>
            )}
          </FarmCard>
        ))}

        {(!producer.farms || producer.farms.length === 0) && !showFarmForm && (
          <p>Nenhuma fazenda cadastrada.</p>
        )}
      </Section>
    </Container>
  );
};

export default ProducerDetail;
