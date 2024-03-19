export default function SearchParams(obj: any) {
  let str = '?';
  Object.entries(obj).forEach((entry) => {
    str = `${str}${entry[0]}=${entry[1]}&`;
  });

  return str.substring(0, str.length - 1);
}
