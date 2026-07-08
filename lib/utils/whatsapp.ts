export function buildWhatsAppLink(phone: string, projectName: string, intent: "enquire" | "site_visit" = "enquire") {
  const messageText = intent === "site_visit" 
    ? `Hi, I'd like to book a site visit for ${projectName}.`
    : `Hi, I'm interested in ${projectName}. Could you share more details?`;
  const message = encodeURIComponent(messageText);
  return `https://wa.me/${phone}?text=${message}`;
}
