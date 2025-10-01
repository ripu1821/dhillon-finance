import bcrypt from "bcryptjs";

export const hashPassword = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainTextPassword, salt);
};
