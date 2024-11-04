export const formatPrice = (p: string) => {
    const priceNumber = parseInt(p?.replace(/[.,đ\s]/g, ''), 10);

    return priceNumber;
};
