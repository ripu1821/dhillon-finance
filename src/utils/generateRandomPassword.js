/**
 * Generate Random Password Middleware
 */

import crypto from "crypto";

const generateRandomPassword = (length = 12) => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@$%";

  // Ensure at least one character from each category
  let password = "";
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += specialChars[crypto.randomInt(specialChars.length)];

  // Fill remaining characters randomly from all sets
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = 4; i < length; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }

  // Shuffle the password to randomize character positions
  password = password
    .split("")
    .sort(() => crypto.randomInt(2) - 1)
    .join("");

  return password;
};

export { generateRandomPassword };
