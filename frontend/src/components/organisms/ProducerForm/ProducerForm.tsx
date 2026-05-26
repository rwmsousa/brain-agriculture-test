import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { FormField } from '../../molecules/FormField/FormField';
import { validateCPF, validateCNPJ, stripDocument } from '../../../utils/validators';
import { useAppDispatch } from '../../../store';
import { createProducer, updateProducer } from '../../../store/slices/producersSlice';
import { Producer } from '../../../types';

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

interface ProducerFormProps {
  producer?: Producer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProducerForm: React.FC<ProducerFormProps> = ({ producer, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(producer?.name ?? '');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>(producer?.documentType ?? 'CPF');
  const [document, setDocument] = useState(producer?.document ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors['name'] = 'Nome obrigatorio';
    }

    if (!document.trim()) {
      newErrors['document'] = 'Documento obrigatorio';
    } else {
      const stripped = stripDocument(document);
      const isValid = documentType === 'CPF' ? validateCPF(stripped) : validateCNPJ(stripped);
      if (!isValid) {
        newErrors['document'] = `${documentType} invalido`;
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
      if (producer) {
        await dispatch(
          updateProducer({ id: producer.id, data: { name, document, documentType } }),
        ).unwrap();
      } else {
        await dispatch(createProducer({ name, document, documentType })).unwrap();
      }
      onSuccess?.();
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Erro ao salvar produtor' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} aria-label="Formulario de produtor">
      <FormField label="Nome" htmlFor="name" error={errors['name']}>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          error={errors['name']}
        />
      </FormField>

      <FormField label="Tipo de Documento" htmlFor="documentType">
        <Select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as 'CPF' | 'CNPJ')}
          options={[
            { value: 'CPF', label: 'CPF' },
            { value: 'CNPJ', label: 'CNPJ' },
          ]}
        />
      </FormField>

      <FormField label="Documento" htmlFor="document" error={errors['document']}>
        <Input
          id="document"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
          error={errors['document']}
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
          {producer ? 'Salvar' : 'Criar Produtor'}
        </Button>
      </FormActions>
    </Form>
  );
};

export default ProducerForm;
