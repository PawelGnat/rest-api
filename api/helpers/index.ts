export const capitalizeFirstLetter = (string: string) => {
  const lowerCased = string.toLowerCase();
  return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
};

export const normalizeString = (input: string) => {
  return capitalizeFirstLetter(input.trim().replace(/\s+/g, " "));
};
