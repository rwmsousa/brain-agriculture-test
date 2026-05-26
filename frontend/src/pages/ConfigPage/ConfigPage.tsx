import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHarvests, createHarvest } from '../../store/slices/harvestsSlice';
import { fetchCropTypes, createCropType } from '../../store/slices/cropTypesSlice';
import { Button } from '../../components/atoms/Button/Button';
import { Input } from '../../components/atoms/Input/Input';
import { FormField } from '../../components/molecules/FormField/FormField';
import { LoadingSpinner } from '../../components/molecules/LoadingSpinner/LoadingSpinner';

// ─── Estilos ──────────────────────────────────────────────────────────────────

const PageContainer = styled.div`
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0 0 24px;
`;

const TabsWrapper = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#2e7d32' : '#666')};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#2e7d32' : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.15s;

  &:hover {
    color: #2e7d32;
  }
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  color: #333;
  margin: 0;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eeeeee;
  font-size: 14px;
  color: #333;
`;

const ItemDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2e7d32;
  flex-shrink: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 20px 0;
`;

const AddTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin: 0 0 12px;
`;

const InlineForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const FieldWrapper = styled.div`
  flex: 1;
`;

const ErrorText = styled.p`
  color: #c62828;
  font-size: 13px;
  margin: 8px 0 0;
`;

const EmptyState = styled.p`
  color: #888;
  font-size: 14px;
  font-style: italic;
`;

// ─── Sub-componente: painel de Safras ─────────────────────────────────────────

const HarvestsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const harvests = useAppSelector((s) => s.harvests.items);
  const status = useAppSelector((s) => s.harvests.status);

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchHarvests());
  }, [dispatch, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Nome da safra obrigatorio');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await dispatch(createHarvest({ name: trimmed })).unwrap();
      setName('');
    } catch {
      setError('Erro ao criar safra. Verifique se ja nao existe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitle>Safras cadastradas</SectionTitle>
      </SectionHeader>

      {status === 'loading' && <LoadingSpinner />}

      {status !== 'loading' && (
        <>
          {harvests.length === 0 ? (
            <EmptyState>Nenhuma safra cadastrada.</EmptyState>
          ) : (
            <ItemList>
              {harvests.map((h) => (
                <ItemRow key={h.id}>
                  <ItemDot />
                  {h.name}
                </ItemRow>
              ))}
            </ItemList>
          )}

          <Divider />
          <AddTitle>Adicionar nova safra</AddTitle>
          <InlineForm onSubmit={handleSubmit} aria-label="Formulario de safra">
            <FieldWrapper>
              <FormField label="Nome" htmlFor="harvestName" error={error}>
                <Input
                  id="harvestName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Safra 2025"
                  error={error}
                />
              </FormField>
            </FieldWrapper>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Adicionar'}
            </Button>
          </InlineForm>
          {error && <ErrorText>{error}</ErrorText>}
        </>
      )}
    </SectionCard>
  );
};

// ─── Sub-componente: painel de Tipos de Cultura ───────────────────────────────

const CropTypesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const cropTypes = useAppSelector((s) => s.cropTypes.items);
  const status = useAppSelector((s) => s.cropTypes.status);

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCropTypes());
  }, [dispatch, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Nome do tipo de cultura obrigatorio');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await dispatch(createCropType({ name: trimmed })).unwrap();
      setName('');
    } catch {
      setError('Erro ao criar tipo de cultura. Verifique se ja nao existe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitle>Tipos de cultura cadastrados</SectionTitle>
      </SectionHeader>

      {status === 'loading' && <LoadingSpinner />}

      {status !== 'loading' && (
        <>
          {cropTypes.length === 0 ? (
            <EmptyState>Nenhum tipo de cultura cadastrado.</EmptyState>
          ) : (
            <ItemList>
              {cropTypes.map((ct) => (
                <ItemRow key={ct.id}>
                  <ItemDot />
                  {ct.name}
                </ItemRow>
              ))}
            </ItemList>
          )}

          <Divider />
          <AddTitle>Adicionar novo tipo de cultura</AddTitle>
          <InlineForm onSubmit={handleSubmit} aria-label="Formulario de tipo de cultura">
            <FieldWrapper>
              <FormField label="Nome" htmlFor="cropTypeName" error={error}>
                <Input
                  id="cropTypeName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Arroz"
                  error={error}
                />
              </FormField>
            </FieldWrapper>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Adicionar'}
            </Button>
          </InlineForm>
          {error && <ErrorText>{error}</ErrorText>}
        </>
      )}
    </SectionCard>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────

type Tab = 'harvests' | 'cropTypes';

export const ConfigPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('harvests');

  return (
    <PageContainer>
      <PageTitle>Configurações</PageTitle>

      <TabsWrapper>
        <Tab $active={activeTab === 'harvests'} onClick={() => setActiveTab('harvests')}>
          Safras
        </Tab>
        <Tab $active={activeTab === 'cropTypes'} onClick={() => setActiveTab('cropTypes')}>
          Tipos de Cultura
        </Tab>
      </TabsWrapper>

      {activeTab === 'harvests' && <HarvestsPanel />}
      {activeTab === 'cropTypes' && <CropTypesPanel />}
    </PageContainer>
  );
};

export default ConfigPage;
