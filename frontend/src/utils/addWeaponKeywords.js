const addWeaponKeyword = (keyword, weapon) => {

    const updatedWeapon = { ...weapon };

    const regex = /([a-zA-Z-]+)(?:\/(\d+))?/;
    const match = keyword.match(regex);
    
    if (!match) {
        return updatedWeapon; 
    }

    const keywordName = match[1].trim();
    const keywordNumber = parseInt(match[2], 10) || 1;

    const sanitizePropertyName = (name) => {
        return name
            .replace(/[^a-zA-Z]/g, '') 
            .replace(/(?:^|-)(.)/g, (match, p1) => p1.toUpperCase()); 
    };

    const sanitizedPropertyName = sanitizePropertyName(keywordName);

    updatedWeapon[sanitizedPropertyName] = keywordNumber;

    return updatedWeapon;
};