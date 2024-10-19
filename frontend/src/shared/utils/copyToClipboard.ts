export const copyToClipboard = (text?: string) => {
  if (!text) return;

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }

  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};
