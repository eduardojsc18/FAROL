export const useHelpers = () => {
    const toBRL = (value) => {
        if (typeof value === "string") value = parseFloat(value)
        return (value || 0).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    }
    const normalizeString = (text) => {
        return text
            ? text.toString().toLowerCase().normalize("NFD")
            : ''
    }
    const removeEmptyAttributes = (obj) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v != null && v !== "")
        );
    }
    const clearAttr = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                clearAttr(obj[key]);
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                }
            } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                delete obj[key];
            }
        }
        return obj;
    }

    return {
        toBRL,
        normalizeString,
        removeEmptyAttributes,
        clearAttr,
    }
}
