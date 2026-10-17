/** Turns a React `useId` value into a valid `view-transition-name` ident. */
export const vtName = (prefix: string, id: string) => `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
