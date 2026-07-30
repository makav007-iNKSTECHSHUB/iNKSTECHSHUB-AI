import { EncryptedProjectPayload } from '../types';

/**
 * Encrypt / Encode project state into a secure URL-safe hash payload
 */
export async function encodeEncryptedPayload(
  payload: Omit<EncryptedProjectPayload, 'encryptedHash'>,
  passcode: string = ''
): Promise<string> {
  const jsonStr = JSON.stringify(payload);
  
  // Use UTF-8 text encoder
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonStr);

  if (!passcode) {
    // Standard Base64 URL-safe encoding with header signature
    const base64 = btoa(String.fromCharCode(...data))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return `INKSHUB_V1.${base64}`;
  }

  // Encrypt with AES-GCM if passcode is provided
  const pwData = encoder.encode(passcode);
  const pwHash = await crypto.subtle.digest('SHA-256', pwData);

  const key = await crypto.subtle.importKey(
    'raw',
    pwHash,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);

  const base64Encrypted = btoa(String.fromCharCode(...combined))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `INKSHUB_SECURE_V1.${base64Encrypted}`;
}

/**
 * Decrypt / Decode payload from token
 */
export async function decodeEncryptedPayload(
  token: string,
  passcode: string = ''
): Promise<EncryptedProjectPayload | null> {
  try {
    if (!token) return null;

    if (token.startsWith('INKSHUB_V1.')) {
      const base64 = token.replace('INKSHUB_V1.', '').replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
      const binary = atob(padded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      const jsonStr = decoder.decode(bytes);
      return JSON.parse(jsonStr) as EncryptedProjectPayload;
    }

    if (token.startsWith('INKSHUB_SECURE_V1.')) {
      if (!passcode) {
        throw new Error('PASSCODE_REQUIRED');
      }

      const base64 = token.replace('INKSHUB_SECURE_V1.', '').replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
      const binary = atob(padded);
      const combined = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        combined[i] = binary.charCodeAt(i);
      }

      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const encoder = new TextEncoder();
      const pwData = encoder.encode(passcode);
      const pwHash = await crypto.subtle.digest('SHA-256', pwData);

      const key = await crypto.subtle.importKey(
        'raw',
        pwHash,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const decoder = new TextDecoder();
      const jsonStr = decoder.decode(decryptedBuffer);
      return JSON.parse(jsonStr) as EncryptedProjectPayload;
    }

    return null;
  } catch (err) {
    console.error('Failed to decode encrypted project payload:', err);
    throw err;
  }
}
