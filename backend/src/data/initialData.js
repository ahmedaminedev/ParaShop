const allProducts = [
    { 
        id: 1, 
        name: 'Sérum Éclat Vitamine C Liposomale - 15%', 
        brand: 'L-DERMA LAB', 
        price: 89.000, 
        oldPrice: 115.000, 
        imageUrl: 'https://images.unsplash.com/photo-1570172619383-2ef40176191a?q=80&w=600&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1570172619383-2ef40176191a?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1608248597359-26920f269a84?q=80&w=600&auto=format&fit=crop'
        ], 
        discount: 22, 
        category: 'Dermo-cosmétique', 
        promo: true, 
        description: 'Solution antioxydante haute performance pour un teint rayonnant et protégé contre le stress oxydatif.', 
        quantity: 85, 
        specifications: [{ name: 'Volume', value: '30ml' }, { name: 'Usage', value: 'Quotidien - Matin' }] 
    },
    { 
        id: 2, 
        name: 'Baume Réparateur Intense - Peaux Sensibles', 
        brand: 'BIO-BOTANIC', 
        price: 45.500, 
        oldPrice: 58.000,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop', 
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop'],
        discount: 21,
        category: 'Dermo-cosmétique', 
        promo: true,
        description: 'Soin apaisant immédiat pour les irritations cutanées et la réparation de la barrière épidermique.', 
        quantity: 120,
        specifications: [{ name: 'Texture', value: 'Baume riche' }, { name: 'Contenance', value: '50ml' }] 
    },
    {
        id: 3,
        name: 'Complexe Magnésium Bisglycinate & Vitamine B6',
        brand: 'PHARMA-NUTRITION',
        price: 36.000,
        oldPrice: 48.000,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'],
        discount: 25,
        category: 'Micronutrition',
        promo: true,
        description: 'Formule haute biodisponibilité pour réduire la fatigue physique et nerveuse. Cursus de 30 jours.',
        quantity: 95,
        specifications: [{ name: 'Format', value: '60 gélules végétales' }, { name: 'Posologie', value: '2 gélules le soir' }]
    },
    {
        id: 4,
        name: 'Fluide Invisible Solaire SPF 50+ Toucher Sec',
        brand: 'L-DERMA LAB',
        price: 52.000,
        imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop'],
        category: 'Solaire',
        description: 'Protection à très large spectre UVA/UVB avec fini mat non gras, résistant à l’eau.',
        quantity: 150,
        specifications: [{ name: 'Filtre', value: 'SPF 50+ PA++++' }, { name: 'Volume', value: '50ml' }]
    },
    {
        id: 5,
        name: 'Huile Lavante Bébé Bio Calendula & Camomille',
        brand: 'BIO-BOTANIC',
        price: 29.900,
        imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop'],
        category: 'Bébé & Maman',
        description: 'Nettoie tout en douceur la peau délicate et le cuir chevelu de bébé sans piquer les yeux.',
        quantity: 60,
        specifications: [{ name: 'Certifié', value: 'Bio Ecocert' }, { name: 'Volume', value: '400ml' }]
    },
    {
        id: 6,
        name: 'Huile Essentielle d’Arbre à Thé Pur (Tea Tree)',
        brand: 'BIO-BOTANIC',
        price: 24.500,
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop'],
        category: 'Bio & Naturel',
        description: 'Huile essentielle 100% pure et chémotypée aux propriétés purifiantes et assainissantes reconnues.',
        quantity: 80,
        specifications: [{ name: 'Origine', value: 'Madagascar' }, { name: 'Volume', value: '10ml' }]
    }
];

const categories = [
    { 
        name: 'Micronutrition', 
        subCategories: ['Vitamines', 'Sommeil', 'Énergie'],
        megaMenu: [
            {
                title: 'Compléments Essentiels',
                items: [{ name: 'Vitamines' }, { name: 'Sommeil' }, { name: 'Énergie' }]
            }
        ]
    },
    { 
        name: 'Dermo-cosmétique', 
        subCategories: ['Visage', 'Corps', 'Cheveux'],
        megaMenu: [
            {
                title: 'Soins Visage & Corps',
                items: [{ name: 'Visage' }, { name: 'Corps' }, { name: 'Cheveux' }]
            }
        ]
    },
    { 
        name: 'Solaire', 
        subCategories: ['SPF 50+', 'Après-Soleil'],
        megaMenu: [
            {
                title: 'Protection UV',
                items: [{ name: 'SPF 50+' }, { name: 'Après-Soleil' }]
            }
        ]
    },
    { 
        name: 'Bébé & Maman', 
        subCategories: ['Hygiène', 'Lait Maternisé'],
        megaMenu: [
            {
                title: 'Soins Bébé',
                items: [{ name: 'Hygiène' }, { name: 'Lait Maternisé' }]
            }
        ]
    },
    { 
        name: 'Bio & Naturel', 
        subCategories: ['Huiles Essentielles', 'Tisanes'],
        megaMenu: [
            {
                title: 'Phytothérapie Bio',
                items: [{ name: 'Huiles Essentielles' }, { name: 'Tisanes' }]
            }
        ]
    }
];

const brands = [
    {
        id: 1,
        name: 'L-DERMA LAB',
        logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop',
        associatedCategories: [{ parentCategory: 'Dermo-cosmétique', subCategory: 'Visage' }]
    },
    {
        id: 2,
        name: 'BIO-BOTANIC',
        logoUrl: 'https://images.unsplash.com/photo-1570172619383-2ef40176191a?q=80&w=200&auto=format&fit=crop',
        associatedCategories: [{ parentCategory: 'Bio & Naturel', subCategory: 'Huiles Essentielles' }]
    },
    {
        id: 3,
        name: 'PHARMA-NUTRITION',
        logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop',
        associatedCategories: [{ parentCategory: 'Micronutrition', subCategory: 'Vitamines' }]
    }
];

const packs = [
    {
        id: 1,
        name: 'Pack Rituel Éclat & Jeunesse',
        description: 'Association synergique du Sérum Vitamine C et du Baume Réparateur pour une peau repulpée et protégée.',
        price: 119.000,
        oldPrice: 147.000,
        imageUrl: 'https://images.unsplash.com/photo-1570172619383-2ef40176191a?q=80&w=600&auto=format&fit=crop',
        includedItems: ['Sérum Éclat Vitamine C 30ml', 'Baume Réparateur Intense 50ml'],
        includedProductIds: [1, 2],
        discount: 19
    },
    {
        id: 2,
        name: 'Cure Défenses & Sérénité Bio',
        description: 'Pack combinant Magnésium Bisglycinate haute biodisponibilité et Huile Essentielle purifiante.',
        price: 52.000,
        oldPrice: 65.000,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
        includedItems: ['Magnésium Bisglycinate 60 gélules', 'Huile Essentielle Tea Tree 10ml'],
        includedProductIds: [3, 6],
        discount: 20
    }
];

const stores = [
    {
        id: 1,
        name: 'PharmaNature Lac II',
        address: 'Avenue de la Bourse, Les Berges du Lac 2',
        city: 'Tunis',
        postalCode: '1053',
        phone: '+216 71 888 999',
        email: 'lac2@pharmanature.tn',
        openingHours: 'Lun - Sam: 08h30 - 20h00',
        imageUrl: 'https://images.unsplash.com/photo-1586015555751-63c29994c6a7?q=80&w=600&auto=format&fit=crop',
        isPickupPoint: true
    },
    {
        id: 2,
        name: 'PharmaNature Ennasr',
        address: 'Avenue Hédi Nouira, Ennasr 2',
        city: 'Ariana',
        postalCode: '2037',
        phone: '+216 71 820 450',
        email: 'ennasr@pharmanature.tn',
        openingHours: 'Lun - Sam: 08h30 - 20h30',
        imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=600&auto=format&fit=crop',
        isPickupPoint: true
    }
];

const promotions = [
    {
        id: 1,
        name: 'Offre Rentrée Santé Naturelle',
        discountPercentage: 20,
        startDate: '2026-09-01',
        endDate: '2026-10-31',
        productIds: [1, 2, 3],
        packIds: [1]
    }
];

const blogPosts = [
    {
        id: 1,
        slug: 'les-bienfaits-de-la-vitamine-c-liposomale',
        title: 'Les Bienfaits Révolutionnaires de la Vitamine C Liposomale',
        excerpt: 'Pourquoi la technologie liposomale révolutionne l’absorption cutanée des antioxydants majeurs.',
        content: 'La vitamine C est l’un des actifs les plus étudiés en dermo-cosmétique. Encapsulée sous forme liposomale, elle pénètre en profondeur pour stimuler la synthèse du collagène tout en éliminant les radicaux libres responsables du vieillissement cutané prématuré...',
        imageUrl: 'https://images.unsplash.com/photo-1570172619383-2ef40176191a?q=80&w=800&auto=format&fit=crop',
        author: 'Dr. Nadia K.',
        authorImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
        date: '2026-09-15',
        readTime: '4 min'
    },
    {
        id: 2,
        slug: 'micronutrition-et-gestion-du-stress',
        title: 'Micronutrition : Comment Réguler Naturellement le Stress ?',
        excerpt: 'Magnésium, zinc et vitamines du groupe B : les clés pour préserver son système nerveux.',
        content: 'Le stress chronique épuise nos réserves en micronutriments fondamentaux. Une supplémentation ciblée en bisglycinate de magnésium permet de relancer la production des neurotransmetteurs apaisants et favorise un sommeil réparateur...',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
        author: 'Dr. Karim M.',
        authorImageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop',
        date: '2026-09-10',
        readTime: '5 min'
    }
];

const sampleOrders = [];
const contactMessages = [];

const initialAdvertisements = {
    heroSlides: [
        {
            id: 1,
            bgImage: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1600&auto=format&fit=crop",
            title: "L'EXPERTISE <br/><span class='text-brand-primary italic'>PHARMACEUTIQUE</span>",
            subtitle: "Sélection rigoureuse des meilleurs laboratoires certifiés pour votre bien-être au quotidien.",
            buttonText: "DÉCOUVRIR LE CATALOGUE"
        }
    ],
    trustBadges: [
        { id: 1, title: 'Laboratoires Certifiés', subtitle: 'Produits 100% authentiques' },
        { id: 2, title: 'Conseils Experts', subtitle: 'Pharmaciens à votre écoute' },
        { id: 3, title: 'Livraison Express', subtitle: 'Sous 48h partout en Tunisie' },
        { id: 4, title: 'Paiement Sécurisé', subtitle: 'En ligne ou à la livraison' }
    ],
    audioPromo: [],
    promoBanners: [
        {
            id: 101,
            title: "Routine <br/>Éclat Pur",
            subtitle: "Redonnez vie à votre teint avec nos cures de Vitamine C concentrée.",
            buttonText: "VOIR LE RITUEL",
            image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000&auto=format&fit=crop",
            linkType: 'category',
            linkTarget: 'Dermo-cosmétique'
        },
        {
            id: 102,
            title: "Douceur <br/>Bébé Bio",
            subtitle: "Parce que leur peau mérite le meilleur de la nature et de la science.",
            buttonText: "PROTÉGER BÉBÉ",
            image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop",
            linkType: 'category',
            linkTarget: 'Bébé & Maman'
        }
    ],
    smallPromoBanners: [],
    editorialCollage: [],
    shoppableVideos: [],
    newArrivals: {
        title: "Nouveautés en Parapharmacie",
        productIds: [1, 2, 3, 4],
        limit: 4
    },
    summerSelection: {
        title: "Sélection Beauté & Soleil",
        productIds: [2, 4, 5, 6],
        limit: 4
    },
    virtualTryOn: {
        title: "VOTRE DIAGNOSTIC",
        description: "PharmaNature vous accompagne pour trouver la cure idéale selon vos besoins de santé.",
        buttonText: "LANCER LE TEST",
        link: "#/product-list"
    },
    featuredGrid: {
        title: "Les <span class='text-brand-primary'>Incontournables</span> Santé",
        productIds: [1, 2, 3, 4],
        buttonText: "VOIR TOUTE LA BOUTIQUE",
        buttonLink: "#/product-list"
    }
};

const offersConfig = {
    header: {
        title: "Nos Offres Exclusives",
        subtitle: "Profitez des meilleures réductions du moment sur nos soins et compléments."
    },
    performanceSection: {
        title: "Cures Vitalité & Micronutrition",
        subtitle: "Booster vos défenses naturelles avec nos complexes vitaminiques.",
        buttonText: "DÉCOUVRIR LES CURES",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
        link: "#/product-list?category=Micronutrition"
    },
    muscleBuilders: {
        title: "Soins Dermo-Réparateurs",
        subtitle: "Pour une peau éclatante et revitalisée.",
        buttonText: "VOIR LES SOINS",
        image: "https://images.unsplash.com/photo-1570172619383-2ef40176191a?q=80&w=600&auto=format&fit=crop",
        link: "#/product-list?category=Dermo-cosmétique"
    },
    dealOfTheDay: {
        productId: 1
    },
    allOffersGrid: {
        title: "Toutes nos promotions",
        useManualSelection: false,
        manualProductIds: [],
        limit: 8
    }
};

module.exports = {
    allProducts,
    categories,
    brands,
    packs,
    stores,
    initialAdvertisements,
    promotions,
    offersConfig,
    sampleOrders,
    blogPosts,
    contactMessages
};
