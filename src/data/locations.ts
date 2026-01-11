export interface Location {
  country: string;
  state: string;
  city: string;
}

export interface Country {
  code: string;
  name: string;
  states: State[];
}

export interface State {
  code: string;
  name: string;
  cities: string[];
}

export const countries: Country[] = [
  {
    code: 'BR',
    name: 'Brasil',
    states: [
      {
        code: 'SP',
        name: 'São Paulo',
        cities: ['São Paulo', 'Campinas', 'Santos', 'Guarulhos', 'Ribeirão Preto', 'Sorocaba', 'São José dos Campos'],
      },
      {
        code: 'RJ',
        name: 'Rio de Janeiro',
        cities: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu', 'Duque de Caxias', 'Búzios', 'Angra dos Reis'],
      },
      {
        code: 'MG',
        name: 'Minas Gerais',
        cities: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Ouro Preto', 'Montes Claros', 'Contagem'],
      },
      {
        code: 'BA',
        name: 'Bahia',
        cities: ['Salvador', 'Porto Seguro', 'Feira de Santana', 'Ilhéus', 'Vitória da Conquista'],
      },
      {
        code: 'RS',
        name: 'Rio Grande do Sul',
        cities: ['Porto Alegre', 'Gramado', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
      },
      {
        code: 'PR',
        name: 'Paraná',
        cities: ['Curitiba', 'Londrina', 'Maringá', 'Foz do Iguaçu', 'Ponta Grossa', 'Cascavel'],
      },
      {
        code: 'SC',
        name: 'Santa Catarina',
        cities: ['Florianópolis', 'Joinville', 'Blumenau', 'Balneário Camboriú', 'Itajaí', 'Chapecó'],
      },
      {
        code: 'PE',
        name: 'Pernambuco',
        cities: ['Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Caruaru', 'Petrolina'],
      },
      {
        code: 'CE',
        name: 'Ceará',
        cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
      },
      {
        code: 'GO',
        name: 'Goiás',
        cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Caldas Novas'],
      },
      {
        code: 'DF',
        name: 'Distrito Federal',
        cities: ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Águas Claras'],
      },
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    states: [
      {
        code: 'LIS',
        name: 'Lisboa',
        cities: ['Lisboa', 'Sintra', 'Cascais', 'Amadora', 'Oeiras'],
      },
      {
        code: 'POR',
        name: 'Porto',
        cities: ['Porto', 'Vila Nova de Gaia', 'Matosinhos', 'Gondomar'],
      },
      {
        code: 'FAR',
        name: 'Faro',
        cities: ['Faro', 'Portimão', 'Albufeira', 'Lagos', 'Loulé'],
      },
    ],
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    states: [
      {
        code: 'FL',
        name: 'Florida',
        cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
      },
      {
        code: 'CA',
        name: 'California',
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
      },
      {
        code: 'NY',
        name: 'New York',
        cities: ['New York City', 'Buffalo', 'Rochester', 'Albany'],
      },
      {
        code: 'TX',
        name: 'Texas',
        cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
      },
    ],
  },
];

// City coordinates for map display
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Brazil
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
  'Salvador': { lat: -12.9714, lng: -38.5014 },
  'Brasília': { lat: -15.7942, lng: -47.8822 },
  'Curitiba': { lat: -25.4284, lng: -49.2733 },
  'Florianópolis': { lat: -27.5954, lng: -48.5480 },
  'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
  'Recife': { lat: -8.0476, lng: -34.8770 },
  'Fortaleza': { lat: -3.7172, lng: -38.5433 },
  'Campinas': { lat: -22.9099, lng: -47.0626 },
  'Santos': { lat: -23.9608, lng: -46.3336 },
  'Niterói': { lat: -22.8833, lng: -43.1036 },
  // Portugal
  'Lisboa': { lat: 38.7223, lng: -9.1393 },
  'Porto': { lat: 41.1579, lng: -8.6291 },
  // USA
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'New York City': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
};

// Extended mock users with locations
export interface CreatorWithLocation {
  id: string;
  username: string;
  profileType: 'single' | 'dating' | 'couple' | 'throuple';
  members: { id: string; name: string; avatar: string }[];
  bio: string;
  followers: number;
  isVerified: boolean;
  location: Location;
  coordinates?: { lat: number; lng: number };
  distance?: number; // km from user
  tags: string[];
  isOnline: boolean;
  lastActive?: Date;
}

export const mockCreatorsWithLocation: CreatorWithLocation[] = [
  {
    id: '1',
    username: 'julia_santos',
    profileType: 'single',
    members: [{ id: '1a', name: 'Julia Santos', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' }],
    bio: '✨ Vivendo a vida intensamente',
    followers: 1234,
    isVerified: true,
    location: { country: 'Brasil', state: 'São Paulo', city: 'São Paulo' },
    distance: 2.5,
    tags: ['lifestyle', 'moda', 'viagem'],
    isOnline: true,
  },
  {
    id: '2',
    username: 'casal_feliz',
    profileType: 'couple',
    members: [
      { id: '2a', name: 'Pedro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: '2b', name: 'Maria', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    ],
    bio: '💕 Juntos há 3 anos',
    followers: 5678,
    isVerified: true,
    location: { country: 'Brasil', state: 'Rio de Janeiro', city: 'Rio de Janeiro' },
    distance: 380,
    tags: ['casal', 'romance', 'viagem'],
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    username: 'ana_namorando',
    profileType: 'dating',
    members: [
      { id: '3a', name: 'Ana', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
      { id: '3b', name: 'Lucas', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    ],
    bio: '💘 Fase boa demais',
    followers: 890,
    isVerified: false,
    location: { country: 'Brasil', state: 'São Paulo', city: 'Campinas' },
    distance: 85,
    tags: ['namoro', 'diversão'],
    isOnline: true,
  },
  {
    id: '4',
    username: 'trisal_amor',
    profileType: 'throuple',
    members: [
      { id: '4a', name: 'Carla', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: '4b', name: 'Bruno', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: '4c', name: 'Fernanda', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop' },
    ],
    bio: '💜 Três corações, um só amor',
    followers: 3456,
    isVerified: true,
    location: { country: 'Brasil', state: 'Minas Gerais', city: 'Belo Horizonte' },
    distance: 480,
    tags: ['trisal', 'polyamor', 'lifestyle'],
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '5',
    username: 'marcos_single',
    profileType: 'single',
    members: [{ id: '5a', name: 'Marcos Silva', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }],
    bio: '🎸 Músico | Criador de conteúdo',
    followers: 2345,
    isVerified: false,
    location: { country: 'Brasil', state: 'São Paulo', city: 'Santos' },
    distance: 72,
    tags: ['música', 'arte', 'criador'],
    isOnline: true,
  },
  {
    id: '6',
    username: 'bella_rio',
    profileType: 'single',
    members: [{ id: '6a', name: 'Isabella', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop' }],
    bio: '🌴 Carioca de coração',
    followers: 8901,
    isVerified: true,
    location: { country: 'Brasil', state: 'Rio de Janeiro', city: 'Niterói' },
    distance: 395,
    tags: ['praia', 'fitness', 'lifestyle'],
    isOnline: true,
  },
  {
    id: '7',
    username: 'casal_sp',
    profileType: 'couple',
    members: [
      { id: '7a', name: 'Rafael', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { id: '7b', name: 'Camila', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
    ],
    bio: '❤️ Amor paulistano',
    followers: 4532,
    isVerified: true,
    location: { country: 'Brasil', state: 'São Paulo', city: 'São Paulo' },
    distance: 5,
    tags: ['casal', 'gastronomia', 'viagem'],
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '8',
    username: 'patricia_floripa',
    profileType: 'single',
    members: [{ id: '8a', name: 'Patricia', avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop' }],
    bio: '🏖️ Ilha da magia',
    followers: 6789,
    isVerified: true,
    location: { country: 'Brasil', state: 'Santa Catarina', city: 'Florianópolis' },
    distance: 705,
    tags: ['surf', 'natureza', 'yoga'],
    isOnline: true,
  },
  {
    id: '9',
    username: 'casal_curitiba',
    profileType: 'couple',
    members: [
      { id: '9a', name: 'Fernando', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: '9b', name: 'Juliana', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
    ],
    bio: '🌲 Amor no frio',
    followers: 3210,
    isVerified: false,
    location: { country: 'Brasil', state: 'Paraná', city: 'Curitiba' },
    distance: 408,
    tags: ['casal', 'café', 'cultura'],
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: '10',
    username: 'leo_portugal',
    profileType: 'single',
    members: [{ id: '10a', name: 'Leonardo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' }],
    bio: '🇵🇹 Brasileiro em Lisboa',
    followers: 4567,
    isVerified: true,
    location: { country: 'Portugal', state: 'Lisboa', city: 'Lisboa' },
    distance: 8200,
    tags: ['expat', 'europa', 'viagem'],
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: '11',
    username: 'miami_couple',
    profileType: 'couple',
    members: [
      { id: '11a', name: 'Diego', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
      { id: '11b', name: 'Amanda', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
    ],
    bio: '🌴 Living the dream',
    followers: 12345,
    isVerified: true,
    location: { country: 'Estados Unidos', state: 'Florida', city: 'Miami' },
    distance: 7100,
    tags: ['luxury', 'beach', 'travel'],
    isOnline: true,
  },
  {
    id: '12',
    username: 'salvador_vibes',
    profileType: 'single',
    members: [{ id: '12a', name: 'Beatriz', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop' }],
    bio: '🥁 Axé na veia',
    followers: 5432,
    isVerified: false,
    location: { country: 'Brasil', state: 'Bahia', city: 'Salvador' },
    distance: 1650,
    tags: ['carnaval', 'música', 'cultura'],
    isOnline: true,
  },
];
