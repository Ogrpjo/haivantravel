export const DEFAULT_PROJECT_TYPES = [
  "Gala Dinner",
  "Team Building",
  "Conference",
  "Year End Party",
] as const;

export const PROJECT_TYPE_OPTIONS = DEFAULT_PROJECT_TYPES.map((value) => ({
  value,
  label: value,
}));
