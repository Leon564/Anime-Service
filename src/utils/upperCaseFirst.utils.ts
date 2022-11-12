const upperCaseFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const upperCaseAllFirst = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    if (txt.length < 3 || txt.toLocaleLowerCase() === "bakka")
      return txt.toLocaleLowerCase();
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
};

export { upperCaseFirst, upperCaseAllFirst };
