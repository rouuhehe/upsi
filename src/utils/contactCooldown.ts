const LAST_CONTACT_PREFIX = "lastContactTo_";

export const setLastContactTime = (lawyerId: string) => {
  localStorage.setItem(
    `${LAST_CONTACT_PREFIX}${lawyerId}`,
    Date.now().toString(),
  );
};

export const getLastContactTime = (lawyerId: string): number | null => {
  const time = localStorage.getItem(`${LAST_CONTACT_PREFIX}${lawyerId}`);
  return time ? parseInt(time) : null;
};

export const hasCooldown = (
  lawyerId: string,
  cooldownMs = 3600000,
): boolean => {
  const last = getLastContactTime(lawyerId);
  return last !== null && Date.now() - last < cooldownMs;
};

export const getCooldownRemaining = (
  lawyerId: string,
  cooldownMs = 3600000,
): number => {
  const last = getLastContactTime(lawyerId);
  if (!last) return 0;
  return Math.max(0, cooldownMs - (Date.now() - last));
};
