import Token from "../models/token";
import User from "../models/user";

const getUserByToken = async (accessTokenVal: string) => {
  const accessToken = accessTokenVal ? await Token.findByValue(accessTokenVal) : null;

  if (!accessToken) return null;

  const user = await User.findById(accessToken.userId);

  return user;
};

export default getUserByToken;
