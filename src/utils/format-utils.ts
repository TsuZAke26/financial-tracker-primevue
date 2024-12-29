import bigDecimal from 'js-big-decimal';

export function formatTransactionDate(dateStr: string) {
  const dateDelim = dateStr.split('-');

  return dateDelim[1].concat('/').concat(dateDelim[2]);
}

export function formatAmount(amount: number) {
  if (amount === undefined) return 0;

  const prefixChar = amount < 0 ? '-' : '';

  // Determine number of trailing zeros to add for rendering
  const amountDelim = amount.toString().split('.');
  let zeroPadding = '';
  // only tenths place
  if (amountDelim.length > 1 && amountDelim[1].length === 1) {
    zeroPadding = '0';
  }
  // no decimal at all
  else if (amountDelim.length === 1) {
    zeroPadding = '.00';
  }

  return prefixChar.concat('$').concat(Math.abs(amount).toString()).concat(zeroPadding);
}

export function styleAmount(amount: number) {
  const textColor = amount < 0 ? 'text-red-500' : null;

  return textColor;
}

export function formatPercent(percent: string) {
  const calculatedPercent = bigDecimal.multiply(percent, 100);
  const percentString = calculatedPercent === '0' ? '<1' : calculatedPercent;
  return percentString;
}
