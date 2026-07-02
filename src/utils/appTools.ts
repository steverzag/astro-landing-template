export const validateEmail = (email: string) => {
  if (!email) return false;

  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";

// Validate by whether the digits form a real, dialable number — not by the
// exact punctuation. Numbers written in international form (leading `+`) are
// checked as-is; anything else is interpreted against the default country.
export const validatePhone = (phone: string, country: CountryCode = "US") => {
  if (!phone) return false;
  return isValidPhoneNumber(phone, country);
};

export const formatPhoneNumber = (number: string, mask: string) => {
  // Remove all non-numeric characters
  let digits = number.toString().replace(/\D/g, "");
  
  // Replace mask placeholders (X) with actual digits
  let formatted = "";
  let digitIndex = 0;
  
  for (let char of mask) {
      if (char.toLowerCase() === "x") {
          formatted += digits[digitIndex] || "_"; // Placeholder if missing digits
          digitIndex++;
      } else {
          formatted += char; // Keep separators (e.g., parentheses, dashes)
      }
  }
  
  return formatted;
}
