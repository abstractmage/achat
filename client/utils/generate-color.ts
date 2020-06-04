const generateColor = (id: string) => {
  const str = parseInt(id.slice(6, 18), 16).toString();
  const lastChar = str[str.length - 1];

  if (/[012]/g.test(lastChar)) return 'red';
  else if (/[345]/g.test(lastChar)) return 'orange';
  
  return 'green';
};


export default generateColor;
