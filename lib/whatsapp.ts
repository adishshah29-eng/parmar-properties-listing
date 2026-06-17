export function buildWhatsAppLink(phone: string, projectName: string) {
  const message = encodeURIComponent(`Hi, I'm interested in ${projectName}. Could you share more details?`);
  return `https://wa.me/${phone}?text=${message}`;
}
