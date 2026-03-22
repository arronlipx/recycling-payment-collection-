/**
 * PayNow QR Code generator using EMVCo TLV format.
 * Produces a string suitable for encoding into a QR code that
 * Singapore banking apps can scan.
 */

// ─── CRC-16 CCITT-FALSE ──────────────────────────────────────────
// Polynomial: 0x1021, Init: 0xFFFF, RefIn: false, RefOut: false, XorOut: 0x0000
const CRC_TABLE = (() => {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i << 8;
    for (let j = 0; j < 8; j++) {
      c = (c & 0x8000) ? ((c << 1) ^ 0x1021) : (c << 1);
    }
    table.push(c & 0xFFFF);
  }
  return table;
})();

function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i) & 0xFF;
    crc = ((crc << 8) & 0xFFFF) ^ CRC_TABLE[((crc >> 8) ^ byte) & 0xFF];
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// ─── TLV builder ────────────────────────────────────────────────
// Each field: <ID padded to 2 chars><value length padded to 2 chars><value>
function tlv(id, value) {
  const v = String(value);
  return String(id).padStart(2, '0') + String(v.length).padStart(2, '0') + v;
}

/**
 * Build a PayNow EMVCo TLV payload string.
 *
 * @param {Object} opts
 * @param {'uen'|'mobile'} opts.proxyType  - Type of PayNow identifier
 * @param {string} opts.proxyValue         - UEN (e.g. "201234567A") or mobile (e.g. "+6591234567")
 * @param {string} opts.amount             - Amount string e.g. "12.50". Pass '' to omit.
 * @param {string} opts.billRef            - Bill reference / Order ID shown on payer's app
 * @param {string} opts.merchantName       - Shown in payer's app (max 25 chars)
 */
export function buildPayNowString({ proxyType, proxyValue, amount, billRef, merchantName }) {
  // Proxy type code: '0' = mobile number, '2' = UEN
  const proxyTypeCode = proxyType === 'uen' ? '2' : '0';

  // ID 26 — Merchant account information (PayNow)
  const merchantInfo = [
    tlv('00', 'SG.PAYNOW'),
    tlv('01', proxyTypeCode),
    tlv('02', proxyValue),
    tlv('03', '0'), // amount not editable by payer
  ].join('');

  // ID 62 — Additional data field template (bill reference in sub-field 01)
  const additionalData = billRef ? tlv('62', tlv('01', String(billRef).slice(0, 25))) : '';

  // Transaction amount — only include if provided
  const amountField = amount ? tlv('54', parseFloat(amount).toFixed(2)) : '';

  // Merchant name — max 25 chars per EMVCo spec
  const name = String(merchantName || 'MERCHANT').slice(0, 25);

  const body = [
    tlv('00', '01'),          // Payload format indicator
    tlv('01', '12'),          // Point of initiation: 12 = dynamic (amount embedded)
    tlv('26', merchantInfo),  // Merchant account info
    tlv('52', '0000'),        // Merchant category code (N/A)
    tlv('53', '702'),         // Currency: 702 = SGD
    amountField,              // Transaction amount (optional)
    tlv('58', 'SG'),          // Country code
    tlv('59', name),          // Merchant name
    tlv('60', 'Singapore'),   // Merchant city
    additionalData,           // Additional data (bill ref)
  ].join('');

  // CRC is computed over the full string including the "6304" prefix itself
  const withCrcPrefix = body + '6304';
  return withCrcPrefix + crc16(withCrcPrefix);
}
