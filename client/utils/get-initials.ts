const getInitials = (nickname: string) => {
  const words = nickname.split(' ');

  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();

  return words[0][0].toUpperCase();
};


export default getInitials;
