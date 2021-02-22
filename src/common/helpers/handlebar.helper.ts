/* eslint-disable @typescript-eslint/no-unused-vars */
export const getThemeName = (context?: unknown, options?: unknown): string => {
  const currentMonth = new Date().getMonth();
  switch (currentMonth) {
    case 9:
      return "halloween.theme";

    case 11:
      return "xmas.theme";

    default:
      return "standard.theme";
  }
};

export const getThemeCssPath = (): string =>
  `/css/themes/${getThemeName()}.css`;
