/**
 * Generate serial number
 */

const generateSerialNumber = (currentSerial) => {
  if (!currentSerial || currentSerial === "0") {
    return "A0001";
  }

  const prefix = currentSerial[0];
  const number = parseInt(currentSerial.slice(1));

  if (number < 9999) {
    const nextNumber = (number + 1).toString().padStart(4, "0");
    return `${prefix}${nextNumber}`;
  }

  // If number is 9999, move to next prefix
  if (prefix === "Z") {
    throw new Error("Serial limit reached. No prefix after 'Z'");
  }

  const nextPrefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
  return `${nextPrefix}0001`;
};

/**
 * Generate serial number for work order
 */

const generateWorkOrderSerialNumber = (currentSerial) => {
  const [mainSerial, subPart] = currentSerial.split("#");

  const prefix = mainSerial.slice(0, 3); // "WOA"
  const number = parseInt(mainSerial.slice(3));
  const subNumber = subPart ? parseInt(subPart) : 0;

  if (subNumber < 999) {
    return `${prefix}${number.toString().padStart(4, "0")}#${subNumber + 1}`;
  }

  if (number < 9999) {
    const nextNumber = (number + 1).toString().padStart(4, "0");
    return `${prefix}${nextNumber}#1`;
  }

  const lastChar = prefix[2];
  if (lastChar === "Z") {
    throw new Error("Serial limit reached. No prefix after 'WOZ'");
  }

  const nextPrefix =
    prefix.slice(0, 2) + String.fromCharCode(lastChar.charCodeAt(0) + 1);
  return `${nextPrefix}0001#1`;
};

/**
 * Generate readable type serial (e.g., "Int Painting 001")
 */
const generateTypeSerialNumber = (currentTypeSerial, prefixKey) => {
  if (!currentTypeSerial || !prefixKey) {
    throw new Error("Invalid input for serial generation.");
  }

  const typeLabelMap = {
    carp: "Carpentry",
    pw: "Power Washing",
    ext: "Ext Painting",
    int: "Int Painting",
    work: "Work",
  };

  const label = typeLabelMap[prefixKey.toLowerCase()] || "Unknown";

  // Match number part from current serial
  const match = currentTypeSerial.match(/(\d{1,})$/);
  const currentNum = match ? parseInt(match[1], 10) : 0;
  const nextNum = (currentNum + 1).toString().padStart(3, "0");

  return `${label} ${nextNum}`; // e.g., "Int Painting 002"
};

export {
  generateSerialNumber,
  generateWorkOrderSerialNumber,
  generateTypeSerialNumber,
};
