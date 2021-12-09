export const priceFormatter = (number) => {
    if (typeof number === 'number') {
        try {
            const numberFormatted = number
                .toLocaleString()
                .replaceAll(',', ' ');

            return numberFormatted;
        } catch {
            return '';
        }
    } else {
        return '';
    }
};
