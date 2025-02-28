export const getCookie = (name: string) => {
  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
};
