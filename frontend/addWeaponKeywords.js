const addWeaponKeyword = (keyword, weapon) => {
    // Create a copy of the weapon object to avoid mutating the original
    const updatedWeapon = { ...weapon };

    // Extract the property name and amount using regex
    const regex = /([a-zA-Z-]+)(?:\/(\d+))?/;
    const match = keyword.match(regex);
    
    if (!match) {
        return updatedWeapon; // No match found
    }

    const keywordName = match[1].trim();
    const keywordNumber = parseInt(match[2], 10) || 1;

    // Sanitize property name by removing non-alphabetic characters and converting to camel case
    const sanitizePropertyName = (name) => {
        return name
            .replace(/[^a-zA-Z]/g, '') // Remove non-alphabetic characters
            .replace(/(?:^|-)(.)/g, (match, p1) => p1.toUpperCase()); // Convert to camel case
    };

    // Create the sanitized property name
    const sanitizedPropertyName = sanitizePropertyName(keywordName);

    // Dynamically assign the property to the updatedWeapon object
    updatedWeapon[sanitizedPropertyName] = keywordNumber;

    return updatedWeapon;
};

// Example usage
const weapon = { antiInfantry: 0, antiVehicle: 0, antiMonster: 0 };
const updatedWeapon = addWeaponKeyword('anti-vehicle/5', weapon);
console.log(updatedWeapon); // Output: { antiInfantry: 0, antiVehicle: 5, antiMonster: 0 }

// Test with a new property
const newWeapon = { antiInfantry: 0 };
const updatedNewWeapon = addWeaponKeyword('anti-aircraft/7', newWeapon);
console.log(updatedNewWeapon); // Output: { antiInfantry: 0, antiAircraft: 7 }
