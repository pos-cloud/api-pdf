export default interface ArticleI {
    creationDate: string
    type: string
    order: number
    containsVariants: boolean
    containsStructure: boolean
    code: string
    codeProvider: string
    codeSAT: string
    description: string
    url: string
    posDescription: string
    quantityPerMeasure: string
    observation: string
    notes: []
    tags: []
    basePrice: number
    costPrice: number
    markupPercentage: number
    markupPrice: number
    salePrice: number

    locations: {
      location: Location
    }[]
    children: {
      article: ArticleI
      quantity: number
    }[]
    pictures: {
      wooId?: string
      meliId?: string
      picture: string
    }[]
    barcode: string
    wooId: string
    meliId: string
    printIn: string
    posKitchen: boolean
    allowPurchase: boolean
    allowSale: boolean
    allowStock: boolean
    allowSaleWithoutStock: boolean
    allowMeasure: boolean
    ecommerceEnabled: boolean
    favourite: boolean
    isWeigth: boolean
    forShipping: boolean
    picture: string
    providers: []
    harticle: ArticleI
    minStock: Number
    maxStock: Number
    pointOfOrder: Number
    purchasePrice: Number
    costPrice2: Number
  }
  