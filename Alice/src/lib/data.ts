export interface SiteData {
  profile: {
    name: string;
    alias: string;
    age: number;
    height: string;
    weight: string;
    eyes: string;
    hair: string;
    bust: string;
    ethnicity: string;
    languages: string[];
    location: string;
    bio: string;
    bioEn: string;
    heroImage: string;
    profileImages: { id: string; url: string; alt: string; altEn: string }[];
  };
  services: Service[];
  pricing: Pricing;
  gallery: GalleryImage[];
  reviews: Review[];
  contacts: Contacts;
  terms: { fr: string; en: string };
}

export interface Service {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  duration?: string;
}

export interface Pricing {
  hour: number;
  twoHours: number;
  threeHours: number;
  night: number;
  day: number;
  weekend: number;
  travel: number;
  currency: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  altEn: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  textEn: string;
  date: string;
  verified: boolean;
}

export interface Contacts {
  email: string;
  telegram: string;
  telegramUrl: string;
  phone: string;
}

export interface Client {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  duration: string;
  service: string;
  locationType: string;
  message: string;
  status: 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';
  depositPaid: boolean;
  totalAmount: number;
  depositAmount: number;
  paymentMethod?: 'interac' | 'plisio' | 'stripe' | '';
  paymentStatus?: 'unpaid' | 'pending' | 'paid';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export const defaultSiteData: SiteData = {
  profile: {
    name: 'Alice',
    alias: 'Alice Elite',
    age: 26,
    height: '170 cm',
    weight: '55 kg',
    eyes: 'Bleus',
    hair: 'Blonds',
    bust: '95C',
    ethnicity: 'Européenne',
    languages: ['Français', 'Anglais'],
    location: 'Paris, France',
    bio: `Je suis Alice, une jeune femme élégante et raffinée, passionnée par les belles choses de la vie. J'aime les rencontres de qualité, les conversations stimulantes et les moments partagés avec des gentlemen qui savent apprécier la finesse.

Avec mon tempérament chaleureux et ma personnalité engageante, je saurai vous mettre à l'aise dès les premiers instants. Que ce soit pour un dîner en ville, un événement prestigieux ou un moment plus intime, je m'engage à vivre chaque instant avec authenticité et plaisir partagé.

Ma philosophie : la qualité avant la quantité. Chaque rencontre est unique et mérite toute mon attention.`,
    bioEn: `I am Alice, an elegant and refined young woman, passionate about the finer things in life. I enjoy quality encounters, stimulating conversations, and moments shared with gentlemen who appreciate sophistication.

With my warm personality and engaging nature, I will put you at ease from the very first moments. Whether for a dinner in the city, a prestigious event, or a more intimate moment, I commit to living every moment with authenticity and shared pleasure.

My philosophy: quality over quantity. Every encounter is unique and deserves my full attention.`,
    heroImage: '',
    profileImages: [],
  },
  services: [
    {
      id: '1',
      name: 'Accompagnement Dîner',
      nameEn: 'Dinner Date',
      description: 'Un moment élégant dans un restaurant raffiné, suivi d\'une soirée enchantée.',
      descriptionEn: 'An elegant moment in a fine restaurant, followed by an enchanted evening.',
      icon: 'utensils',
      duration: '3-4 heures'
    },
    {
      id: '2',
      name: 'Événement Social',
      nameEn: 'Social Event',
      description: 'Votre plus belle accompagnante pour galas, soirées et événements prestigieux.',
      descriptionEn: 'Your most beautiful companion for galas, parties and prestigious events.',
      icon: 'sparkles',
      duration: 'Sur mesure'
    },
    {
      id: '3',
      name: 'Weekend Romantique',
      nameEn: 'Romantic Weekend',
      description: 'Échappez-vous ensemble pour un week-end de rêve, loin du quotidien.',
      descriptionEn: 'Escape together for a dream weekend, away from everyday life.',
      icon: 'heart',
      duration: '48 heures'
    },
    {
      id: '4',
      name: 'Voyage & Découverte',
      nameEn: 'Travel & Discovery',
      description: 'Partez à l\'aventure avec une compagne qui saura rendre chaque moment magique.',
      descriptionEn: 'Embark on an adventure with a companion who will make every moment magical.',
      icon: 'plane',
      duration: 'Sur mesure'
    },
    {
      id: '5',
      name: 'Moment Intime',
      nameEn: 'Intimate Moment',
      description: 'Un temps privilégié à deux, dans l\'intimité et la sérénité.',
      descriptionEn: 'Privileged time together, in intimacy and serenity.',
      icon: 'moon',
      duration: '1-3 heures'
    },
    {
      id: '6',
      name: 'Massage Relaxant',
      nameEn: 'Relaxing Massage',
      description: 'Séance de massage professionnel pour une détente totale du corps et de l\'esprit.',
      descriptionEn: 'Professional massage session for total body and mind relaxation.',
      icon: 'hands',
      duration: '1-2 heures'
    }
  ],
  pricing: {
    hour: 300,
    twoHours: 550,
    threeHours: 750,
    night: 1500,
    day: 2500,
    weekend: 4000,
    travel: 3000,
    currency: 'EUR'
  },
  gallery: [],
  reviews: [
    {
      id: '1',
      author: 'M. P.',
      rating: 5,
      text: 'Une expérience incroyable. Alice est une femme remarquable, intelligente et charmante. Notre dîner reste gravé dans ma mémoire.',
      textEn: 'An incredible experience. Alice is a remarkable woman, intelligent and charming. Our dinner remains etched in my memory.',
      date: '2024-11-15',
      verified: true
    },
    {
      id: '2',
      author: 'Anonymous',
      rating: 5,
      text: 'Professionnalisme et élégance au rendez-vous. Je recommande vivement.',
      textEn: 'Professionalism and elegance as expected. Highly recommended.',
      date: '2024-10-22',
      verified: true
    }
  ],
  contacts: {
    email: 'contact@alice-elite.com',
    telegram: '@alice_elite',
    telegramUrl: 'https://t.me/alice_elite',
    phone: '+33 6 XX XX XX XX'
  },
  terms: {
    fr: `## Conditions Générales d'Utilisation

### 1. Conditions d'accès
Ce site est réservé aux personnes majeures (18 ans et plus). En accédant à ce site, vous certifiez être majeur selon la législation de votre pays.

### 2. Réservation
- Toute réservation doit être effectuée via le formulaire en ligne
- Un acompte de 60% est requis pour confirmer toute réservation
- Le solde est payable au début du rendez-vous
- Les réservations doivent être faites au minimum 24h à l'avance

### 3. Annulation
- Annulation gratuite jusqu'à 48h avant le rendez-vous
- Entre 24h et 48h : 50% de l'acompte conservé
- Moins de 24h : acompte non remboursable

### 4. Confidentialité
Toutes vos informations personnelles sont traitées avec la plus grande confidentialité. Aucune donnée n'est partagée avec des tiers.

### 5. Respect mutuel
Tout comportement disrespectueux entraînera la fin immédiate de la rencontre sans remboursement.

### 6. Disponibilité
Les disponibilités sont sujettes à change. Les créneaux sont attribués dans l'ordre d'arrivée des réservations confirmées.

### 7. Paiement
L'acompte peut être effectué par virement bancaire ou crypto-monnaie. Les instructions seront communiquées après validation de la demande.`,
    en: `## Terms & Conditions

### 1. Access Conditions
This site is reserved for adults (18 years and older). By accessing this site, you certify that you are of legal age according to your country's legislation.

### 2. Booking
- All bookings must be made through the online form
- A 60% deposit is required to confirm any booking
- The balance is payable at the beginning of the appointment
- Bookings must be made at least 24 hours in advance

### 3. Cancellation
- Free cancellation up to 48 hours before the appointment
- Between 24h and 48h: 50% of deposit retained
- Less than 24h: deposit non-refundable

### 4. Confidentiality
All your personal information is treated with the utmost confidentiality. No data is shared with third parties.

### 5. Mutual Respect
Any disrespectful behavior will result in immediate termination of the encounter without refund.

### 6. Availability
Availability is subject to change. Slots are assigned in order of confirmed bookings.

### 7. Payment
The deposit can be made by bank transfer or cryptocurrency. Instructions will be communicated after request validation.`
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
