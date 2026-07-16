export const ClaseTarifa = {
  Economica: 'economica',
  Business: 'business',
  Primera: 'primera',
} as const;

export type ClaseTarifa = (typeof ClaseTarifa)[keyof typeof ClaseTarifa];
