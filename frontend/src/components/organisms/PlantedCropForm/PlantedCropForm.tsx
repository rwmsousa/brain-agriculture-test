import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../atoms/Select/Select';
import { FormField } from '../../molecules/FormField/FormField';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchHarvests } from '../../../store/slices/harvestsSlice';
import { fetchCropTypes } from '../../../store/slices/cropTypesSlice';
import { addPlantedCrop } from '../../../store/slices/plantedCropsSlice';

const Form = styled.form`
  margin-top: 16px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
`;

const SuccessMessage = styled.p`
  color: #2e7d32;
  font-size: 13px;
  margin: 4px 0 8px;
  background: #e8f5e9;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #a5d6a7;
`;

const ErrorText = styled.p`
  color: #c62828;
  font-size: 13px;
  margin: 4px 0;
`;

const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin: 16px 0 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

interface PlantedCropFormProps {
  farmId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PlantedCropForm: React.FC<PlantedCropFormProps> = ({
  farmId,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const harvests = useAppSelector((s) => s.harvests.items);
  const cropTypes = useAppSelector((s) => s.cropTypes.items);

  const [harvestId, setHarvestId] = useState('');
  const [cropTypeId, setCropTypeId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchHarvests());
    dispatch(fetchCropTypes());
  }, [dispatch]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!harvestId) errs['harvest'] = 'Selecione uma safra';
    if (!cropTypeId) errs['cropType'] = 'Selecione um tipo de cultura';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      await dispatch(addPlantedCrop({ farmId, harvestId, cropTypeId })).unwrap();

      // Resetar campos para permitir adicionar outra cultura
      setHarvestId('');
      setCropTypeId('');
      setErrors({});

      // Mostrar feedback de sucesso
      const harvestName = harvests.find((h) => h.id === harvestId)?.name ?? '';
      const cropName = cropTypes.find((ct) => ct.id === cropTypeId)?.name ?? '';
      setSuccessMsg(`✓ ${cropName} (${harvestName}) adicionada com sucesso.`);

      onSuccess?.();
    } catch (err: unknown) {
      const apiError = err as { message?: string; status?: number };
      if (apiError?.status === 409 || (apiError?.message ?? '').includes('409')) {
        setErrors((prev) => ({
          ...prev,
          submit: 'Esta cultura já foi cadastrada para esta fazenda e safra.',
        }));
      } else {
        setErrors((prev) => ({ ...prev, submit: 'Erro ao adicionar cultura. Tente novamente.' }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <SectionLabel>Adicionar Cultura Plantada</SectionLabel>

      {successMsg && <SuccessMessage>{successMsg}</SuccessMessage>}

      <FormRow>
        <FormField label="Safra" error={errors['harvest']}>
          <Select
            value={harvestId}
            onChange={(e) => setHarvestId(e.target.value)}
            options={harvests.map((h) => ({ value: h.id, label: h.name }))}
            placeholder="Selecione a safra"
            error={errors['harvest']}
          />
        </FormField>

        <FormField label="Tipo de Cultura" error={errors['cropType']}>
          <Select
            value={cropTypeId}
            onChange={(e) => setCropTypeId(e.target.value)}
            options={cropTypes.map((ct) => ({ value: ct.id, label: ct.name }))}
            placeholder="Selecione o tipo de cultura"
            error={errors['cropType']}
          />
        </FormField>
      </FormRow>

      {errors['submit'] && <ErrorText>{errors['submit']}</ErrorText>}

      <FormActions>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Fechar
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Adicionando...' : 'Adicionar Cultura'}
        </Button>
      </FormActions>
    </Form>
  );
};

export default PlantedCropForm;
