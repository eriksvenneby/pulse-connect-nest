/**
 * Calculate age from birthday date
 */
export const calculateAge = (birthday: string | Date): number => {
  const birthDate = typeof birthday === 'string' ? new Date(birthday) : birthday;
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format age display text
 */
export const formatAge = (age: number): string => {
  return `${age} ${age === 1 ? 'year' : 'years'} old`;
};

/**
 * Get age from birthday for profile display
 */
export const getDisplayAge = (birthday: string | Date): string => {
  const age = calculateAge(birthday);
  return age.toString();
};