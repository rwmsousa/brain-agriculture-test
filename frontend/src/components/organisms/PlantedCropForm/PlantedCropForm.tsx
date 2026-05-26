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
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
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

  useEffect(() => {
    dispatch(fetchHarvests());
    dispatch(fetchCropTypes());
  }, [dispatch]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!harvestId) newErrors['harvest'] = 'Selecione uma safra';
    if (!cropTypeId) newErrors['cropType'] = 'Selecione um tipo de cultura';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await dispatch(addPlantedCrop({ farmId, harvestId, cropTypeId })).unwrap();
      onSuccess?.();
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Erro ao adicionar cultura' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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

      {errors['submit'] && <p style={{ color: '#c62828' }}>{errors['submit']}</p>}

      <FormActions>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          Adicionar Cultura
        </Button>
      </FormActions>
    </Form>
  );
};

export default PlantedCropForm;
