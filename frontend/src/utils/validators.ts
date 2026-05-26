/**
 * Frontend validation utilities — mirror of backend CPF/CNPJ algorithms.
 * Pure functions, independently unit-testable.
 */

export function stripDocument(raw: string): string {
  return raw.replace(/[.\-/\s]/g, '');
}

export function validateCPF(raw: string): boolean {
  const digits = stripDocument(raw);

  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcDigit = (base: string, length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(base[i]) * (length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calcDigit(digits, 9);
  if (firstDigit !== parseInt(digits[9])) return false;

  const secondDigit = calcDigit(digits, 10);
  return secondDigit === parseInt(digits[10]);
}

export function validateCNPJ(raw: string): boolean {
  const digits = stripDocument(raw);

  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calcDigit = (base: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(base[i]) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstDigit = calcDigit(digits, weights1);
  if (firstDigit !== parseInt(digits[12])) return false;

  const secondDigit = calcDigit(digits, weights2);
  return secondDigit === parseInt(digits[13]);
}

export function validateAreaConstraint(total: number, arable: number, vegetation: number): boolean {
  return arable + vegetation <= total;
}
