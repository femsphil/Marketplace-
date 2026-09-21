export function formatNaira(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₦0';
  }
  const num = Number(amount);
  if (num >= 1000000000) {
    return `₦${(num / 1000000000).toLocaleString('en-US', { maximumFractionDigits: 2 })}B`;
  }
  if (num >= 1000000) {
    return `₦${(num / 1000000).toLocaleString('en-US', { maximumFractionDigits: 2 })}M`;
  }
  return `₦${num.toLocaleString('en-NG')}`;
}

export function formatFullNaira(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₦0';
  }
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(Number(num))) {
    return '0';
  }
  return Number(num).toLocaleString('en-NG');
}

/**
 * Ensures a phone number is formatted for international Nigerian WhatsApp URL.
 * Converts local 080... format to international 23480...
 */
export function formatWhatsAppUrl(rawPhone: string | null | undefined, message: string): string {
  if (!rawPhone) return '#';
  let cleaned = rawPhone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.slice(1);
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

