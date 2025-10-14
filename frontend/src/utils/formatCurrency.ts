export const formatCurrency = (amount: number | undefined | null, currency: string = 'KSh'): string => {
  try {
    // Handle undefined or null values
    if (amount === undefined || amount === null || isNaN(amount)) {
      return `${currency} 0`;
    }
    
    if (currency === 'KSh') {
      return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} 0`;
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





