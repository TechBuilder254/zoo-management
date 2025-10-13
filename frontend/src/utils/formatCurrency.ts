export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${amount.toFixed(2)}`;
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




