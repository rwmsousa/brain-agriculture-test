import { validateCPF, validateCNPJ, validateAreaConstraint, stripDocument } from './validators';

describe('stripDocument', () => {
  it('removes dots, dashes, slashes and spaces', () => {
    expect(stripDocument('529.982.247-25')).toBe('52998224725');
    expect(stripDocument('11.222.333/0001-81')).toBe('11222333000181');
  });
});

describe('validateCPF', () => {
  it('validates a correct CPF with formatting', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  it('validates a correct CPF without formatting', () => {
    expect(validateCPF('52998224725')).toBe(true);
  });

  it('rejects CPF with invalid check digit', () => {
    expect(validateCPF('529.982.247-26')).toBe(false);
  });

  it('rejects all-same-digit CPF', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('00000000000')).toBe(false);
    expect(validateCPF('999.999.999-99')).toBe(false);
  });

  it('rejects CPF with wrong length', () => {
    expect(validateCPF('1234567890')).toBe(false);
    expect(validateCPF('123456789012')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateCPF('')).toBe(false);
  });
});

describe('validateCNPJ', () => {
  it('validates a correct CNPJ with formatting', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
  });

  it('validates a correct CNPJ without formatting', () => {
    expect(validateCNPJ('11222333000181')).toBe(true);
  });

  it('rejects CNPJ with invalid check digit', () => {
    expect(validateCNPJ('11.222.333/0001-82')).toBe(false);
  });

  it('rejects all-same-digit CNPJ', () => {
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
    expect(validateCNPJ('00000000000000')).toBe(false);
  });

  it('rejects CNPJ with wrong length', () => {
    expect(validateCNPJ('1234567890123')).toBe(false);
    expect(validateCNPJ('123456789012345')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateCNPJ('')).toBe(false);
  });
});

describe('validateAreaConstraint', () => {
  it('accepts when arable + vegetation < total', () => {
    expect(validateAreaConstraint(500, 300, 150)).toBe(true);
  });

  it('accepts boundary case where arable + vegetation equals total', () => {
    expect(validateAreaConstraint(500, 300, 200)).toBe(true);
  });

  it('rejects when arable + vegetation exceeds total', () => {
    expect(validateAreaConstraint(500, 300, 201)).toBe(false);
  });

  it('accepts zero areas', () => {
    expect(validateAreaConstraint(100, 0, 0)).toBe(true);
  });

  it('rejects when both arable and vegetation exceed total independently', () => {
    expect(validateAreaConstraint(100, 60, 50)).toBe(false);
  });
});
