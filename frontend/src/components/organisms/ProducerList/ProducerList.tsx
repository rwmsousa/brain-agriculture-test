import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { ConfirmDialog } from '../../molecules/ConfirmDialog/ConfirmDialog';
import { useAppDispatch } from '../../../store';
import { deleteProducer } from '../../../store/slices/producersSlice';
import { Producer } from '../../../types';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background: #f5f5f5;
  font-size: 13px;
  color: #666;
  border-bottom: 1px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

interface ProducerListProps {
  producers: Producer[];
  onEdit?: (producer: Producer) => void;
}

export const ProducerList: React.FC<ProducerListProps> = ({ producers, onEdit }) => {
  const dispatch = useAppDispatch();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteProducer(deleteTarget));
    setDeleteTarget(null);
  };

  const maskDocument = (doc: string, type: string) => {
    if (type === 'CPF') {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4');
    }
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.***.***/****-$5');
  };

  if (producers.length === 0) {
    return <p>Nenhum produtor cadastrado.</p>;
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Documento</Th>
            <Th>Fazendas</Th>
            <Th>Acoes</Th>
          </tr>
        </thead>
        <tbody>
          {producers.map((producer) => (
            <tr key={producer.id}>
              <Td>
                <Link to={`/producers/${producer.id}`} style={{ color: '#2e7d32' }}>
                  {producer.name}
                </Link>
              </Td>
              <Td>
                <Badge>{producer.documentType}</Badge>{' '}
                {maskDocument(producer.document, producer.documentType)}
              </Td>
              <Td>{producer.farms?.length ?? 0}</Td>
              <Td>
                <Actions>
                  {onEdit && (
                    <Button variant="secondary" onClick={() => onEdit(producer)}>
                      Editar
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => setDeleteTarget(producer.id)}>
                    Excluir
                  </Button>
                </Actions>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message="Tem certeza que deseja excluir este produtor? Todas as fazendas e culturas associadas serao removidas."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default ProducerList;
