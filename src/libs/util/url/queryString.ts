


const parseQueryString = (obj: {[key: string]: any}) => {
  let queryString = '';
  for (const key in obj) {
    queryString += `${key}=${obj[key]}&`;
  }
  return queryString.slice(0, -1);
}