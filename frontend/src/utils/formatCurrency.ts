export const formatCurrency = (amount: number, currency: string = 'KSh'): string => {
  try {
    if (currency === 'KSh') {
      return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `KSh ${amount.toFixed(0)}`;
  }
};

export const calculateTotal = (
  adultQty: number,
  childQty: number,
  seniorQty: number,
  adultPrice: number,
  childPrice: number,
  seniorPrice: number
): number => {
  return (adultQty * adultPrice) + (childQty * childPrice) + (seniorQty * seniorPrice);
};




