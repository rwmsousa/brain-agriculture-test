import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { FormField } from '../../molecules/FormField/FormField';
import { validateAreaConstraint } from '../../../utils/validators';
import { useAppDispatch } from '../../../store';
import { createFarm, updateFarm } from '../../../store/slices/farmsSlice';
import { Farm } from '../../../types';
import { BRAZILIAN_STATES } from '../../../utils/brazilianStates';

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

interface FarmFormProps {
  farm?: Farm;
  producerId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FarmForm: React.FC<FarmFormProps> = ({ farm, producerId, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(farm?.name ?? '');
  const [city, setCity] = useState(farm?.city ?? '');
  const [state, setState] = useState(farm?.state ?? '');
  const [totalArea, setTotalArea] = useState(String(farm?.totalAreaHectares ?? ''));
  const [arableArea, setArableArea] = useState(String(farm?.arableAreaHectares ?? ''));
  const [vegetationArea, setVegetationArea] = useState(String(farm?.vegetationAreaHectares ?? ''));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors['name'] = 'Nome obrigatorio';
    if (!city.trim()) newErrors['city'] = 'Cidade obrigatoria';
    if (!state) newErrors['state'] = 'Estado obrigatorio';

    const total = parseFloat(totalArea);
    const arable = parseFloat(arableArea);
    const vegetation = parseFloat(vegetationArea);

    if (isNaN(total) || total <= 0) newErrors['totalArea'] = 'Area total deve ser positiva';
    if (isNaN(arable) || arable < 0) newErrors['arableArea'] = 'Area agricultavel invalida';
    if (isNaN(vegetation) || vegetation < 0)
      newErrors['vegetationArea'] = 'Area de vegetacao invalida';

    if (!isNaN(total) && !isNaN(arable) && !isNaN(vegetation)) {
      if (!validateAreaConstraint(total, arable, vegetation)) {
        newErrors['areaConstraint'] =
          'A soma das areas agricultavel e de vegetacao nao pode exceder a area total';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = {
        name,
        city,
        state,
        totalAreaHectares: parseFloat(totalArea),
        arableAreaHectares: parseFloat(arableArea),
        vegetationAreaHectares: parseFloat(vegetationArea),
      };

      if (farm) {
        await dispatch(updateFarm({ id: farm.id, data })).unwrap();
      } else {
        await dispatch(createFarm({ ...data, producerId: producerId! })).unwrap();
      }
      onSuccess?.();
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Erro ao salvar fazenda' }));
    } finally {
      setSubmitting(false);
    }
  };

  const stateOptions = BRAZILIAN_STATES.map((s) => ({ value: s, label: s }));

  return (
    <Form onSubmit={handleSubmit} aria-label="Formulario de fazenda">
      <FormField label="Nome da Fazenda" htmlFor="farmName" error={errors['name']}>
        <Input
          id="farmName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors['name']}
        />
      </FormField>

      <FormField label="Cidade" htmlFor="city" error={errors['city']}>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={errors['city']}
        />
      </FormField>

      <FormField label="Estado" htmlFor="state" error={errors['state']}>
        <Select
          value={state}
          onChange={(e) => setState(e.target.value)}
          options={stateOptions}
          placeholder="Selecione o estado"
          error={errors['state']}
        />
      </FormField>

      <FormField label="Area Total (ha)" htmlFor="totalArea" error={errors['totalArea']}>
        <Input
          id="totalArea"
          type="number"
          value={totalArea}
          onChange={(e) => setTotalArea(e.target.value)}
          error={errors['totalArea']}
        />
      </FormField>

      <FormField label="Area Agricultavel (ha)" htmlFor="arableArea" error={errors['arableArea']}>
        <Input
          id="arableArea"
          type="number"
          value={arableArea}
          onChange={(e) => setArableArea(e.target.value)}
          error={errors['arableArea']}
        />
      </FormField>

      <FormField
        label="Area de Vegetacao (ha)"
        htmlFor="vegetationArea"
        error={errors['vegetationArea']}
      >
        <Input
          id="vegetationArea"
          type="number"
          value={vegetationArea}
          onChange={(e) => setVegetationArea(e.target.value)}
          error={errors['vegetationArea']}
        />
      </FormField>

      {errors['areaConstraint'] && (
        <p style={{ color: '#c62828', fontSize: '13px' }}>{errors['areaConstraint']}</p>
      )}
      {errors['submit'] && <p style={{ color: '#c62828' }}>{errors['submit']}</p>}

      <FormActions>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {farm ? 'Salvar' : 'Criar Fazenda'}
        </Button>
      </FormActions>
    </Form>
  );
};

export default FarmForm;
