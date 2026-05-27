import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { FormField } from '../../molecules/FormField/FormField';
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage';
import {
  validateCPF,
  validateCNPJ,
  stripDocument,
  validateAreaConstraint,
} from '../../../utils/validators';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createProducer, updateProducer } from '../../../store/slices/producersSlice';
import { createFarm, updateFarm } from '../../../store/slices/farmsSlice';
import { addPlantedCrop, removePlantedCrop } from '../../../store/slices/plantedCropsSlice';
import { fetchHarvests } from '../../../store/slices/harvestsSlice';
import { fetchCropTypes } from '../../../store/slices/cropTypesSlice';
import { BRAZILIAN_STATES } from '../../../utils/brazilianStates';
import { Producer } from '../../../types';

/* ─── Styled Components ─────────────────────────────────────── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #2e7d32;
  margin: 20px 0 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid #e8f5e9;
`;

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 12px;
`;

const ThreeColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0 12px;
`;

const CropRowHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 4px;
`;

const CropColumnLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #444;
`;

const CropRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
`;

const CropField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AddCropButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px dashed #66bb6a;
  color: #2e7d32;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 4px;

  &:hover {
    background: #e8f5e9;
  }
`;

const RemoveCropButton = styled.button`
  background: none;
  border: 1px solid #e57373;
  color: #c62828;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #ffebee;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const ErrorText = styled.p`
  color: #c62828;
  font-size: 13px;
  margin: 2px 0 8px;
`;

const NoCropsText = styled.p`
  font-size: 13px;
  color: #999;
  margin: 4px 0 8px;
`;

/* ─── Types ─────────────────────────────────────────────────── */

interface CropEntry {
  tempId: string;
  existingId?: string;
  harvestId: string;
  cropTypeId: string;
}

interface ProducerFormProps {
  producer?: Producer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/* ─── Component ─────────────────────────────────────────────── */

export const ProducerForm: React.FC<ProducerFormProps> = ({ producer, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const harvests = useAppSelector((s) => s.harvests.items);
  const cropTypes = useAppSelector((s) => s.cropTypes.items);

  // ── Producer fields ──────────────────────────────────────────
  const [name, setName] = useState(producer?.name ?? '');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>(producer?.documentType ?? 'CPF');
  const [document, setDocument] = useState(producer?.document ?? '');

  // ── Farm fields (first farm when editing) ────────────────────
  const firstFarm = producer?.farms?.[0];
  const [farmName, setFarmName] = useState(firstFarm?.name ?? '');
  const [city, setCity] = useState(firstFarm?.city ?? '');
  const [farmState, setFarmState] = useState(firstFarm?.state ?? '');
  const [totalArea, setTotalArea] = useState(String(firstFarm?.totalAreaHectares ?? ''));
  const [arableArea, setArableArea] = useState(String(firstFarm?.arableAreaHectares ?? ''));
  const [vegetationArea, setVegetationArea] = useState(
    String(firstFarm?.vegetationAreaHectares ?? ''),
  );

  // ── Crops ────────────────────────────────────────────────────
  const [cropEntries, setCropEntries] = useState<CropEntry[]>(
    firstFarm?.plantedCrops?.map((pc) => ({
      tempId: pc.id,
      existingId: pc.id,
      harvestId: pc.harvestId,
      cropTypeId: pc.cropTypeId,
    })) ?? [],
  );
  const [removedCropIds, setRemovedCropIds] = useState<string[]>([]);

  // ── UI state ─────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchHarvests());
    dispatch(fetchCropTypes());
  }, [dispatch]);

  /* ── Crop helpers ─────────────────────────────────────────── */

  const addCropEntry = () => {
    setCropEntries((prev) => [
      ...prev,
      { tempId: `new-${Date.now()}`, harvestId: '', cropTypeId: '' },
    ]);
  };

  const removeCropEntry = (tempId: string) => {
    const entry = cropEntries.find((c) => c.tempId === tempId);
    if (entry?.existingId) {
      setRemovedCropIds((prev) => [...prev, entry.existingId!]);
    }
    setCropEntries((prev) => prev.filter((c) => c.tempId !== tempId));
  };

  const updateCropEntry = (tempId: string, field: 'harvestId' | 'cropTypeId', value: string) => {
    setCropEntries((prev) => prev.map((c) => (c.tempId === tempId ? { ...c, [field]: value } : c)));
  };

  /* ── Validation ───────────────────────────────────────────── */

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // Producer
    if (!name.trim()) errs['name'] = 'Nome obrigatório';

    if (!document.trim()) {
      errs['document'] = 'Documento obrigatório';
    } else {
      const stripped = stripDocument(document);
      const valid = documentType === 'CPF' ? validateCPF(stripped) : validateCNPJ(stripped);
      if (!valid) errs['document'] = `${documentType} inválido`;
    }

    // Farm
    if (!farmName.trim()) errs['farmName'] = 'Nome da fazenda obrigatório';
    if (!city.trim()) errs['city'] = 'Cidade obrigatória';
    if (!farmState) errs['farmState'] = 'Estado obrigatório';

    const total = parseFloat(totalArea);
    const arable = parseFloat(arableArea);
    const vegetation = parseFloat(vegetationArea);

    if (isNaN(total) || total <= 0) errs['totalArea'] = 'Área total deve ser positiva';
    if (isNaN(arable) || arable < 0) errs['arableArea'] = 'Área agricultável inválida';
    if (isNaN(vegetation) || vegetation < 0) errs['vegetationArea'] = 'Área de vegetação inválida';

    if (!isNaN(total) && !isNaN(arable) && !isNaN(vegetation)) {
      if (!validateAreaConstraint(total, arable, vegetation)) {
        errs['areaConstraint'] =
          'A soma das áreas agricultável e de vegetação não pode exceder a área total';
      }
    }

    // Crops (each entry must have both fields)
    cropEntries.forEach((c, i) => {
      if (!c.harvestId) errs[`crop_harvest_${i}`] = 'Selecione a safra';
      if (!c.cropTypeId) errs[`crop_type_${i}`] = 'Selecione a cultura';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ───────────────────────────────────────────────── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const farmData = {
        name: farmName,
        city,
        state: farmState,
        totalAreaHectares: parseFloat(totalArea),
        arableAreaHectares: parseFloat(arableArea),
        vegetationAreaHectares: parseFloat(vegetationArea),
      };

      let farmId: string;

      if (producer) {
        // Update producer
        await dispatch(
          updateProducer({ id: producer.id, data: { name, document, documentType } }),
        ).unwrap();

        // Update or create farm
        if (firstFarm) {
          await dispatch(updateFarm({ id: firstFarm.id, data: farmData })).unwrap();
          farmId = firstFarm.id;
        } else {
          const farm = await dispatch(
            createFarm({ ...farmData, producerId: producer.id }),
          ).unwrap();
          farmId = farm.id;
        }

        // Remove deleted crops
        for (const cropId of removedCropIds) {
          await dispatch(removePlantedCrop(cropId)).unwrap();
        }

        // Add new crops (those without existingId)
        for (const entry of cropEntries.filter((c) => !c.existingId)) {
          await dispatch(
            addPlantedCrop({ farmId, harvestId: entry.harvestId, cropTypeId: entry.cropTypeId }),
          ).unwrap();
        }
      } else {
        // Create producer
        const p = await dispatch(createProducer({ name, document, documentType })).unwrap();

        // Create farm
        const farm = await dispatch(createFarm({ ...farmData, producerId: p.id })).unwrap();
        farmId = farm.id;

        // Create crops
        for (const entry of cropEntries) {
          await dispatch(
            addPlantedCrop({ farmId, harvestId: entry.harvestId, cropTypeId: entry.cropTypeId }),
          ).unwrap();
        }
      }

      onSuccess?.();
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Erro ao salvar produtor. Tente novamente.' }));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Render ───────────────────────────────────────────────── */

  const stateOptions = BRAZILIAN_STATES.map((s) => ({ value: s, label: s }));
  const harvestOptions = harvests.map((h) => ({ value: h.id, label: h.name }));
  const cropTypeOptions = cropTypes.map((ct) => ({ value: ct.id, label: ct.name }));

  return (
    <Form onSubmit={handleSubmit} aria-label="Formulário de produtor">
      {/* ── Seção: Dados do Produtor ──────────────────────── */}
      <SectionTitle>Dados do Produtor</SectionTitle>

      <FormField label="Nome do Produtor" htmlFor="producerName" error={errors['name']}>
        <Input
          id="producerName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          error={errors['name']}
        />
      </FormField>

      <TwoColumns>
        <FormField label="Tipo de Documento" htmlFor="documentType">
          <Select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as 'CPF' | 'CNPJ')}
            options={[
              { value: 'CPF', label: 'CPF' },
              { value: 'CNPJ', label: 'CNPJ' },
            ]}
          />
        </FormField>

        <FormField
          label={documentType === 'CPF' ? 'CPF' : 'CNPJ'}
          htmlFor="document"
          error={errors['document']}
        >
          <Input
            id="document"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
            error={errors['document']}
          />
        </FormField>
      </TwoColumns>

      {/* ── Seção: Dados da Fazenda ───────────────────────── */}
      <SectionTitle>
        Dados da Fazenda
        {producer && (producer.farms?.length ?? 0) > 1 && (
          <span style={{ fontSize: 12, color: '#888', fontWeight: 400, marginLeft: 8 }}>
            (exibindo fazenda principal — demais fazendas disponíveis na página de detalhes)
          </span>
        )}
      </SectionTitle>

      <FormField label="Nome da Fazenda" htmlFor="farmName" error={errors['farmName']}>
        <Input
          id="farmName"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          placeholder="Nome da propriedade"
          error={errors['farmName']}
        />
      </FormField>

      <TwoColumns>
        <FormField label="Cidade" htmlFor="city" error={errors['city']}>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cidade"
            error={errors['city']}
          />
        </FormField>

        <FormField label="Estado" htmlFor="farmState" error={errors['farmState']}>
          <Select
            id="farmState"
            value={farmState}
            onChange={(e) => setFarmState(e.target.value)}
            options={stateOptions}
            placeholder="Selecione o estado"
            error={errors['farmState']}
          />
        </FormField>
      </TwoColumns>

      <ThreeColumns>
        <FormField label="Área Total (ha)" htmlFor="totalArea" error={errors['totalArea']}>
          <Input
            id="totalArea"
            type="number"
            min="0"
            step="0.01"
            value={totalArea}
            onChange={(e) => setTotalArea(e.target.value)}
            placeholder="0"
            error={errors['totalArea']}
          />
        </FormField>

        <FormField label="Área Agricultável (ha)" htmlFor="arableArea" error={errors['arableArea']}>
          <Input
            id="arableArea"
            type="number"
            min="0"
            step="0.01"
            value={arableArea}
            onChange={(e) => setArableArea(e.target.value)}
            placeholder="0"
            error={errors['arableArea']}
          />
        </FormField>

        <FormField
          label="Área de Vegetação (ha)"
          htmlFor="vegetationArea"
          error={errors['vegetationArea']}
        >
          <Input
            id="vegetationArea"
            type="number"
            min="0"
            step="0.01"
            value={vegetationArea}
            onChange={(e) => setVegetationArea(e.target.value)}
            placeholder="0"
            error={errors['vegetationArea']}
          />
        </FormField>
      </ThreeColumns>

      {errors['areaConstraint'] && <ErrorText>{errors['areaConstraint']}</ErrorText>}

      {/* ── Seção: Culturas Plantadas ─────────────────────── */}
      <SectionTitle>Culturas Plantadas</SectionTitle>

      {cropEntries.length === 0 && (
        <NoCropsText>
          Nenhuma cultura adicionada. Clique em &quot;+ Adicionar Cultura&quot; para inserir.
        </NoCropsText>
      )}

      {cropEntries.length > 0 && (
        <CropRowHeader>
          <CropColumnLabel>Safra</CropColumnLabel>
          <CropColumnLabel>Cultura</CropColumnLabel>
          <span />
        </CropRowHeader>
      )}

      {cropEntries.map((entry, index) => (
        <CropRow key={entry.tempId}>
          <CropField>
            <Select
              value={entry.harvestId}
              onChange={(e) => updateCropEntry(entry.tempId, 'harvestId', e.target.value)}
              options={harvestOptions}
              placeholder="Selecione a safra"
              error={errors[`crop_harvest_${index}`]}
            />
            {errors[`crop_harvest_${index}`] && (
              <ErrorMessage>{errors[`crop_harvest_${index}`]}</ErrorMessage>
            )}
          </CropField>

          <CropField>
            <Select
              value={entry.cropTypeId}
              onChange={(e) => updateCropEntry(entry.tempId, 'cropTypeId', e.target.value)}
              options={cropTypeOptions}
              placeholder="Selecione a cultura"
              error={errors[`crop_type_${index}`]}
            />
            {errors[`crop_type_${index}`] && (
              <ErrorMessage>{errors[`crop_type_${index}`]}</ErrorMessage>
            )}
          </CropField>

          <RemoveCropButton
            type="button"
            onClick={() => removeCropEntry(entry.tempId)}
            title="Remover cultura"
          >
            ×
          </RemoveCropButton>
        </CropRow>
      ))}

      <AddCropButton type="button" onClick={addCropEntry}>
        + Adicionar Cultura
      </AddCropButton>

      {/* ── Erros globais e ações ─────────────────────────── */}
      {errors['submit'] && <ErrorText style={{ marginTop: 12 }}>{errors['submit']}</ErrorText>}

      <FormActions>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : producer ? 'Salvar Alterações' : 'Cadastrar Produtor'}
        </Button>
      </FormActions>
    </Form>
  );
};

export default ProducerForm;
