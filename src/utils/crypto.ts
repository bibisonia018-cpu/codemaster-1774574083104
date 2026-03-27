import CryptoJS from 'crypto-js';

// تشفير الرسالة
export const encryptMessage = (text: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// فك تشفير الرسالة
export const decryptMessage = (cipherText: string, secretKey: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    // إذا كانت كلمة السر خاطئة، ستكون النتيجة فارغة
    return decryptedText || '🔒 [رسالة مشفرة - مفتاح خاطئ]';
  } catch (error) {
    return '🔒 [رسالة مشفرة - مفتاح خاطئ]';
  }
};