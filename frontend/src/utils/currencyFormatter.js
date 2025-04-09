export function formatIndianCurrency(amount) {
    if (isNaN(amount)) return '₹0';
  
    amount = Number(amount);
    const isNegative = amount < 0;
    amount = Math.abs(amount);
  
    if (amount < 1000) {
      return `${isNegative ? '-' : ''}₹${amount.toFixed(2)}`;
    }
  
    if (amount < 100000) {
      // Thousands
      return `${isNegative ? '-' : ''}₹${(amount / 1000).toFixed(2)}K`;
    }
  
    if (amount < 10000000) {
      // Lakhs
      return `${isNegative ? '-' : ''}₹${(amount / 100000).toFixed(2)}L`;
    }
  
    // Crores
    return `${isNegative ? '-' : ''}₹${(amount / 10000000).toFixed(2)}Cr`;
  }