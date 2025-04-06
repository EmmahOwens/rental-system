
/**
 * Format a number as UGX currency
 * @param amount Number to format
 * @returns Formatted UGX string
 */
export const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString("en-UG")}`;
};
