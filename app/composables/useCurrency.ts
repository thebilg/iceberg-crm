const tryFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0
})

export const formatCurrency = (amount: number) => tryFormatter.format(amount || 0)