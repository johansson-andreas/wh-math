export const addWeaponKeyword = (keyword, weapon) => {

    const updatedWeapon = { ...weapon };

    const regex = /([a-zA-Z- ]+)(\d)?/;
    const match = keyword.match(regex);
    
    if (!match) {
        return updatedWeapon; 
    }

    const keywordName = match[1].trim();
    const keywordNumber = parseInt(match[2]) || 1;
    const sanitizePropertyName = (name) => {
        return name
            .replace(/[^a-zA-Z]/g, '') 
            .replace(/(?:^|-)(.)/g, (match, p1) => p1.toLowerCase()); 
    };

    const sanitizedPropertyName = sanitizePropertyName(keywordName);

    updatedWeapon[sanitizedPropertyName] = keywordNumber;

    return updatedWeapon;
};

export const addKeywordsToWeapon = (weapon) => {
    const updatedWeapon = { ...weapon };
    updatedWeapon.keywords.forEach((keyword) => {
        Object.assign(updatedWeapon, addWeaponKeyword(keyword, updatedWeapon));
    });
    return updatedWeapon;
};