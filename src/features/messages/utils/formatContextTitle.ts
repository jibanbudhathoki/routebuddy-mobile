export function formatContextTitle(context?: string) {
  if (!context) return "Trip conversation";
  const normalized = context.toLowerCase();
  if (normalized.includes("request")) return "Request conversation";
  if (normalized.includes("trip")) return "Trip conversation";
  return `${context[0].toUpperCase()}${context.slice(1)} conversation`;
}
