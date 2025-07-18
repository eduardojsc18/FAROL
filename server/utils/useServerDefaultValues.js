
export function useServerDefaultValues() {

    const productCost = {
        'MLB5402391910': 49, // LUMINARIA BRANCA
        'MLB5385112480': 40, // KIT TECLADO PRETO
        'MLB5370856210': 49, // LUMINARIA PRETA
        'MLB5349332438': 35, // PENDRIVE 128GB
        'MLB4001628013': 33.70, // KIT 8 NECESSAIRE
        'MLB3991098369': 58, // KIT 6 BANHEIRO BAMBU
        'MLB3991149161': 49, // LUMINARIA PRETA (ANTIGO)
        'MLB3991070331': 23.50, // KIT FACA AFIADOR
        'MLB3985510287': 40, // KIT TECLADO PRETO (ANTIGO)
        'MLB3952492195': 40, // KIT TECLADO PRETO (ANTIGO)
        'MLB5500745782': 40, // KIT TECLADO PRETO (CATALOGO)
        'MLB3866006087': 44, // KIT TECLADO BRANCO
        'MLB5500642350': 44, // KIT TECLADO BRANCO (CATALOGO)
        'MLB5014464806': 40, // KIT TECLADO PRETO (ANTIGO)
        'MLB3793458613': 13.50, // KIT 4 DINOS
        'MLB4085120641': 42, // KIT TECLADO PRETO TECLAS ALTAS
        'MLB5452310180': 27, // KIT ORGANIZADOR DE GAVETAS
        'MLB5452218196': 26, // KIT ORGANIZADOR DE MALA 8 UNIDADES
        'MLB5452334002': 43, // LUMINARIA LED COM PONTA
        'MLB5452372540': 55, // LUMINARIA LED REDONDA
    }

    const shippingType = {
        "fulfillment": "FULL",
        "self_service": "FLEX",
        "cross_docking": "FLEX",
        "pickup": "COLETA",
        "me2": "MERCADO ENVIO",
        "custom": "PERSONALIZADO"
    };


    return {
        productCost,
        shippingType,
    }

}
