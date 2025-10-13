import { Animal, AnimalType, ConservationStatus, AnimalSex } from '../types';

export const mockAnimals: Animal[] = [
  // MAMMALS (15 animals)
  {
    _id: 'lion-001',
    name: 'Simba',
    species: 'African Lion',
    type: 'Mammal' as AnimalType,
    age: 8,
    sex: 'Male' as AnimalSex,
    weight: 190,
    conservationStatus: 'Vulnerable' as ConservationStatus,
    description: 'Simba is our majestic male African lion, known for his impressive mane and gentle nature with visitors.',
    habitat: {
      name: 'African Savanna',
      location: 'East Africa',
      coordinates: { lat: -2.0, lng: 35.0 },
      environment: 'Open grasslands with scattered trees'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Lions are the only cats that live in groups called prides',
      'A lion\'s roar can be heard from 5 miles away',
      'Male lions can sleep up to 20 hours a day'
    ],
    photos: [
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=600&fit=crop',
    history: 'Simba arrived at our zoo in 2020 from a wildlife rescue center in Kenya. He was found orphaned as a cub and has been raised by our expert animal care team.',
    averageRating: 4.8,
    reviewCount: 156,
    viewCount: 2340,
    createdAt: '2020-03-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'elephant-002',
    name: 'Dumbo',
    species: 'African Elephant',
    type: 'Mammal' as AnimalType,
    age: 25,
    sex: 'Male' as AnimalSex,
    weight: 4500,
    conservationStatus: 'Endangered' as ConservationStatus,
    description: 'Dumbo is our gentle giant, loved by all visitors for his intelligence and playful personality.',
    habitat: {
      name: 'African Savanna',
      location: 'Central Africa',
      coordinates: { lat: 0.0, lng: 20.0 },
      environment: 'Grasslands and woodland savanna'
    },
    diet: 'Herbivore',
    interestingFacts: [
      'Elephants have the largest brain of any land animal',
      'They can communicate through infrasonic sounds',
      'Elephants never forget and have excellent memories'
    ],
    photos: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop',
    history: 'Dumbo came to us in 2018 from a conservation program in Botswana. He is a key member of our elephant family and helps educate visitors about elephant conservation.',
    averageRating: 4.9,
    reviewCount: 203,
    viewCount: 3120,
    createdAt: '2018-07-20T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'giraffe-003',
    name: 'Tallulah',
    species: 'Masai Giraffe',
    type: 'Mammal' as AnimalType,
    age: 12,
    sex: 'Female' as AnimalSex,
    weight: 800,
    conservationStatus: 'Vulnerable' as ConservationStatus,
    description: 'Tallulah is our graceful Masai giraffe, always reaching for the highest leaves and greeting visitors with curiosity.',
    habitat: {
      name: 'African Savanna',
      location: 'East Africa',
      coordinates: { lat: -1.0, lng: 36.0 },
      environment: 'Acacia woodlands and savanna'
    },
    diet: 'Herbivore',
    interestingFacts: [
      'Giraffes are the tallest mammals on Earth',
      'They have the same number of neck vertebrae as humans',
      'A giraffe\'s tongue can be up to 20 inches long'
    ],
    photos: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
    history: 'Tallulah joined our zoo family in 2019. She was born in the wild but was rescued after her mother was injured. She has adapted beautifully to life at our zoo.',
    averageRating: 4.7,
    reviewCount: 189,
    viewCount: 2780,
    createdAt: '2019-11-10T11:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'zebra-004',
    name: 'Stripes',
    species: 'Plains Zebra',
    type: 'Mammal' as AnimalType,
    age: 6,
    sex: 'Male' as AnimalSex,
    weight: 350,
    conservationStatus: 'Near Threatened' as ConservationStatus,
    description: 'Stripes is our energetic zebra who loves to run and play with other herd members.',
    habitat: {
      name: 'African Savanna',
      location: 'Southern Africa',
      coordinates: { lat: -25.0, lng: 25.0 },
      environment: 'Grasslands and open woodlands'
    },
    diet: 'Herbivore',
    interestingFacts: [
      'Each zebra has a unique stripe pattern',
      'Zebras can run up to 65 km/h',
      'They sleep standing up'
    ],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    history: 'Stripes arrived in 2021 as part of a breeding program to maintain genetic diversity in captive zebra populations.',
    averageRating: 4.5,
    reviewCount: 134,
    viewCount: 1950,
    createdAt: '2021-05-12T13:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'tiger-005',
    name: 'Rajah',
    species: 'Bengal Tiger',
    type: 'Mammal' as AnimalType,
    age: 10,
    sex: 'Male' as AnimalSex,
    weight: 220,
    conservationStatus: 'Endangered' as ConservationStatus,
    description: 'Rajah is our magnificent Bengal tiger, known for his striking orange and black stripes and powerful presence.',
    habitat: {
      name: 'Tropical Forest',
      location: 'India',
      coordinates: { lat: 20.0, lng: 77.0 },
      environment: 'Dense tropical forests and mangrove swamps'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Tigers are the largest cat species',
      'They are excellent swimmers',
      'Tigers can jump up to 10 meters in length'
    ],
    photos: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
    history: 'Rajah came to us from a tiger sanctuary in India in 2019. He is an ambassador for tiger conservation and helps raise awareness about their endangered status.',
    averageRating: 4.9,
    reviewCount: 245,
    viewCount: 3890,
    createdAt: '2019-09-08T15:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'panda-006',
    name: 'Bamboo',
    species: 'Giant Panda',
    type: 'Mammal' as AnimalType,
    age: 7,
    sex: 'Female' as AnimalSex,
    weight: 95,
    conservationStatus: 'Vulnerable' as ConservationStatus,
    description: 'Bamboo is our adorable giant panda who spends most of her time eating bamboo and napping.',
    habitat: {
      name: 'Bamboo Forest',
      location: 'China',
      coordinates: { lat: 32.0, lng: 103.0 },
      environment: 'High-altitude bamboo forests'
    },
    diet: 'Herbivore',
    interestingFacts: [
      'Pandas eat 12-38 kg of bamboo daily',
      'They have a pseudo-thumb for gripping bamboo',
      'Pandas are excellent tree climbers'
    ],
    photos: [
      'https://images.unsplash.com/photo-1547407139-3c921a71905c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1547407139-3c921a71905c?w=800&h=600&fit=crop',
    history: 'Bamboo arrived in 2020 as part of an international conservation partnership. She represents our commitment to protecting endangered species worldwide.',
    averageRating: 5.0,
    reviewCount: 312,
    viewCount: 4560,
    createdAt: '2020-12-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'gorilla-007',
    name: 'Koko',
    species: 'Western Lowland Gorilla',
    type: 'Mammal' as AnimalType,
    age: 15,
    sex: 'Male' as AnimalSex,
    weight: 180,
    conservationStatus: 'Critically Endangered' as ConservationStatus,
    description: 'Koko is our intelligent silverback gorilla, the leader of our gorilla family group.',
    habitat: {
      name: 'Tropical Rainforest',
      location: 'Central Africa',
      coordinates: { lat: 0.0, lng: 20.0 },
      environment: 'Dense tropical rainforest'
    },
    diet: 'Herbivore',
    interestingFacts: [
      'Gorillas share 98% of their DNA with humans',
      'They can live up to 50 years in the wild',
      'Silverback males protect their family groups'
    ],
    photos: [
      'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1547407139-3c921a71905c?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&h=600&fit=crop',
    history: 'Koko has been with us since 2017. He was rescued from illegal wildlife trade and has become a symbol of hope for gorilla conservation.',
    averageRating: 4.8,
    reviewCount: 198,
    viewCount: 2890,
    createdAt: '2017-04-15T12:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'cheetah-017',
    name: 'Flash',
    species: 'Cheetah',
    type: 'Mammal' as AnimalType,
    age: 6,
    sex: 'Female' as AnimalSex,
    weight: 50,
    conservationStatus: 'Vulnerable' as ConservationStatus,
    description: 'Flash is our lightning-fast cheetah, the fastest land animal on Earth.',
    habitat: {
      name: 'African Savanna',
      location: 'East Africa',
      coordinates: { lat: -2.0, lng: 35.0 },
      environment: 'Open grasslands and semi-arid regions'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Cheetahs can run up to 70 mph',
      'They can accelerate from 0 to 60 mph in 3 seconds',
      'Cheetahs have distinctive black tear marks'
    ],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    history: 'Flash joined our zoo in 2021. She was born in captivity as part of a conservation breeding program to help preserve this vulnerable species.',
    averageRating: 4.7,
    reviewCount: 189,
    viewCount: 2670,
    createdAt: '2021-11-20T15:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'rhino-018',
    name: 'Tank',
    species: 'White Rhinoceros',
    type: 'Mammal' as AnimalType,
    age: 18,
    sex: 'Male' as AnimalSex,
    weight: 2300,
    conservationStatus: 'Near Threatened' as ConservationStatus,
    description: 'Tank is our massive white rhinoceros, one of the largest land mammals.',
    habitat: {
      name: 'African Grasslands',
      location: 'Southern Africa',
      coordinates: { lat: -25.0, lng: 25.0 },
      environment: 'Grasslands and savanna woodlands'
    },
    diet: 'Herbivore',
    interestingFacts: [
      'White rhinos are actually gray in color',
      'They can weigh up to 2,300 kg',
      'Rhinos have poor eyesight but excellent hearing'
    ],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    history: 'Tank has been with us since 2016. He was rescued from poaching threats and now serves as an ambassador for rhino conservation.',
    averageRating: 4.6,
    reviewCount: 167,
    viewCount: 2340,
    createdAt: '2016-08-12T13:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  // BIRDS (10 animals)
  {
    _id: 'penguin-008',
    name: 'Waddle',
    species: 'Emperor Penguin',
    type: 'Bird' as AnimalType,
    age: 5,
    sex: 'Female' as AnimalSex,
    weight: 22,
    conservationStatus: 'Near Threatened' as ConservationStatus,
    description: 'Waddle is our playful emperor penguin who loves to swim and interact with visitors.',
    habitat: {
      name: 'Antarctic Ice',
      location: 'Antarctica',
      coordinates: { lat: -75.0, lng: 0.0 },
      environment: 'Sea ice and coastal waters'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Emperor penguins are the tallest penguin species',
      'They can dive deeper than any other bird',
      'Males incubate eggs on their feet'
    ],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    history: 'Waddle came to us in 2022 from a marine research facility. She helps educate visitors about climate change and its impact on Antarctic wildlife.',
    averageRating: 4.6,
    reviewCount: 167,
    viewCount: 2450,
    createdAt: '2022-02-14T14:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'flamingo-009',
    name: 'Pinkie',
    species: 'Greater Flamingo',
    type: 'Bird' as AnimalType,
    age: 8,
    sex: 'Female' as AnimalSex,
    weight: 3.5,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Pinkie is our elegant flamingo who stands gracefully on one leg and loves to preen her beautiful pink feathers.',
    habitat: {
      name: 'Wetlands',
      location: 'East Africa',
      coordinates: { lat: -2.0, lng: 35.0 },
      environment: 'Shallow lakes and lagoons'
    },
    diet: 'Omnivore',
    interestingFacts: [
      'Flamingos get their pink color from their diet',
      'They can stand on one leg for hours',
      'Flamingos filter food from water using their specialized beaks'
    ],
    photos: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
    history: 'Pinkie joined our flock in 2020. She was rescued from a polluted wetland and now thrives in our clean, spacious habitat.',
    averageRating: 4.4,
    reviewCount: 145,
    viewCount: 1980,
    createdAt: '2020-06-20T16:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'eagle-010',
    name: 'Thunder',
    species: 'Bald Eagle',
    type: 'Bird' as AnimalType,
    age: 12,
    sex: 'Male' as AnimalSex,
    weight: 6,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Thunder is our majestic bald eagle, a symbol of freedom and strength with incredible flying abilities.',
    habitat: {
      name: 'Forest and Wetlands',
      location: 'North America',
      coordinates: { lat: 45.0, lng: -100.0 },
      environment: 'Coastal areas and large lakes'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Bald eagles can spot prey from 3 miles away',
      'They can fly at speeds up to 100 mph',
      'Eagles mate for life'
    ],
    photos: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
    history: 'Thunder has been with us since 2018. He was injured in the wild and cannot be released, so he now serves as an educational ambassador.',
    averageRating: 4.7,
    reviewCount: 178,
    viewCount: 2560,
    createdAt: '2018-10-05T11:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'owl-011',
    name: 'Wise',
    species: 'Great Horned Owl',
    type: 'Bird' as AnimalType,
    age: 6,
    sex: 'Female' as AnimalSex,
    weight: 1.5,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Wise is our nocturnal great horned owl, known for her silent flight and piercing yellow eyes.',
    habitat: {
      name: 'Forest',
      location: 'North America',
      coordinates: { lat: 40.0, lng: -100.0 },
      environment: 'Mixed woodlands and open areas'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Owls can rotate their heads 270 degrees',
      'They have excellent night vision',
      'Owls are silent flyers due to special feather structure'
    ],
    photos: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
    history: 'Wise came to us in 2021 after being found injured. She has recovered well and now helps teach visitors about nocturnal wildlife.',
    averageRating: 4.3,
    reviewCount: 123,
    viewCount: 1780,
    createdAt: '2021-08-30T18:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'parrot-019',
    name: 'Rainbow',
    species: 'Scarlet Macaw',
    type: 'Bird' as AnimalType,
    age: 15,
    sex: 'Female' as AnimalSex,
    weight: 1.2,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Rainbow is our colorful scarlet macaw with brilliant red, blue, and yellow plumage.',
    habitat: {
      name: 'Tropical Rainforest',
      location: 'Central America',
      coordinates: { lat: 15.0, lng: -90.0 },
      environment: 'Lowland tropical forests'
    },
    diet: 'Omnivore',
    interestingFacts: [
      'Macaws can live up to 80 years',
      'They have strong beaks that can crack nuts',
      'These birds are highly intelligent and social'
    ],
    photos: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
    history: 'Rainbow joined us in 2019 from a parrot rescue center. She loves interacting with visitors and showing off her intelligence.',
    averageRating: 4.8,
    reviewCount: 201,
    viewCount: 2890,
    createdAt: '2019-04-25T12:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  // REPTILES (5 animals)
  {
    _id: 'snake-012',
    name: 'Slinky',
    species: 'Ball Python',
    type: 'Reptile' as AnimalType,
    age: 4,
    sex: 'Female' as AnimalSex,
    weight: 2.5,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Slinky is our gentle ball python who loves to curl up in a ball when feeling shy.',
    habitat: {
      name: 'Grasslands and Savanna',
      location: 'West Africa',
      coordinates: { lat: 8.0, lng: -5.0 },
      environment: 'Dry grasslands and open savanna'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Ball pythons get their name from curling into a ball when threatened',
      'They can go months without eating',
      'Ball pythons are constrictors'
    ],
    photos: [
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
    history: 'Slinky came to us in 2022 from a reptile rescue. She helps dispel myths about snakes and shows visitors how gentle they can be.',
    averageRating: 4.2,
    reviewCount: 98,
    viewCount: 1450,
    createdAt: '2022-03-10T13:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'turtle-013',
    name: 'Shelly',
    species: 'Galapagos Tortoise',
    type: 'Reptile' as AnimalType,
    age: 45,
    sex: 'Female' as AnimalSex,
    weight: 180,
    conservationStatus: 'Vulnerable' as ConservationStatus,
    description: 'Shelly is our ancient Galapagos tortoise, one of the longest-living animals in our zoo.',
    habitat: {
      name: 'Island Grasslands',
      location: 'Galapagos Islands',
      coordinates: { lat: -0.5, lng: -91.0 },
      environment: 'Arid grasslands and scrubland'
    },
    diet: 'Herbivore',
    interestingFacts: [
      'Galapagos tortoises can live over 100 years',
      'They can survive without food or water for up to a year',
      'These tortoises helped inspire Darwin\'s theory of evolution'
    ],
    photos: [
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
    history: 'Shelly has been with us since 2015. She was part of a breeding program to help preserve this iconic species from the Galapagos.',
    averageRating: 4.8,
    reviewCount: 234,
    viewCount: 3450,
    createdAt: '2015-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'lizard-014',
    name: 'Spike',
    species: 'Bearded Dragon',
    type: 'Reptile' as AnimalType,
    age: 3,
    sex: 'Male' as AnimalSex,
    weight: 0.5,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Spike is our friendly bearded dragon who loves to bask under heat lamps and interact with visitors.',
    habitat: {
      name: 'Australian Desert',
      location: 'Australia',
      coordinates: { lat: -25.0, lng: 135.0 },
      environment: 'Arid and semi-arid regions'
    },
    diet: 'Omnivore',
    interestingFacts: [
      'Bearded dragons can change color based on mood',
      'They wave their arms to communicate',
      'These lizards are excellent climbers'
    ],
    photos: [
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
    history: 'Spike joined us in 2023 as a young dragon. He quickly became a favorite with visitors due to his calm demeanor and unique appearance.',
    averageRating: 4.5,
    reviewCount: 87,
    viewCount: 1230,
    createdAt: '2023-05-20T14:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'crocodile-020',
    name: 'Snappy',
    species: 'Nile Crocodile',
    type: 'Reptile' as AnimalType,
    age: 22,
    sex: 'Male' as AnimalSex,
    weight: 400,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Snappy is our impressive Nile crocodile, a living dinosaur from prehistoric times.',
    habitat: {
      name: 'Rivers and Lakes',
      location: 'East Africa',
      coordinates: { lat: -2.0, lng: 35.0 },
      environment: 'Freshwater rivers, lakes, and swamps'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Crocodiles have been around for 200 million years',
      'They can hold their breath for up to 2 hours',
      'Crocodiles have the strongest bite force of any animal'
    ],
    photos: [
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
    history: 'Snappy has been with us since 2017. He was rescued from illegal wildlife trade and now serves as an ambassador for crocodile conservation.',
    averageRating: 4.4,
    reviewCount: 134,
    viewCount: 1890,
    createdAt: '2017-12-03T16:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  // AMPHIBIANS (5 animals)
  {
    _id: 'frog-015',
    name: 'Kermit',
    species: 'Red-Eyed Tree Frog',
    type: 'Amphibian' as AnimalType,
    age: 2,
    sex: 'Male' as AnimalSex,
    weight: 0.05,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Kermit is our vibrant red-eyed tree frog with striking colors and amazing jumping abilities.',
    habitat: {
      name: 'Tropical Rainforest',
      location: 'Central America',
      coordinates: { lat: 15.0, lng: -90.0 },
      environment: 'Lowland tropical rainforests'
    },
    diet: 'Insectivore',
    interestingFacts: [
      'Red-eyed tree frogs have excellent night vision',
      'They can jump up to 20 times their body length',
      'These frogs are masters of camouflage'
    ],
    photos: [
      'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=800&h=600&fit=crop',
    history: 'Kermit joined us in 2023 as part of our amphibian conservation program. He helps educate visitors about the importance of protecting rainforest habitats.',
    averageRating: 4.6,
    reviewCount: 156,
    viewCount: 2340,
    createdAt: '2023-09-15T12:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'salamander-016',
    name: 'Slippy',
    species: 'Axolotl',
    type: 'Amphibian' as AnimalType,
    age: 1,
    sex: 'Female' as AnimalSex,
    weight: 0.1,
    conservationStatus: 'Critically Endangered' as ConservationStatus,
    description: 'Slippy is our fascinating axolotl, known for her ability to regenerate lost body parts.',
    habitat: {
      name: 'Freshwater Lakes',
      location: 'Mexico',
      coordinates: { lat: 19.0, lng: -99.0 },
      environment: 'High-altitude freshwater lakes'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Axolotls can regenerate entire limbs',
      'They never undergo metamorphosis',
      'These creatures can regrow their spinal cord'
    ],
    photos: [
      'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=800&h=600&fit=crop',
    history: 'Slippy arrived in 2024 as part of our critical species conservation program. She represents hope for one of the world\'s most endangered amphibians.',
    averageRating: 4.9,
    reviewCount: 89,
    viewCount: 1450,
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'toad-021',
    name: 'Bumpy',
    species: 'Cane Toad',
    type: 'Amphibian' as AnimalType,
    age: 4,
    sex: 'Female' as AnimalSex,
    weight: 0.3,
    conservationStatus: 'Least Concern' as ConservationStatus,
    description: 'Bumpy is our warty cane toad with distinctive bumpy skin and large parotoid glands.',
    habitat: {
      name: 'Grasslands and Forests',
      location: 'South America',
      coordinates: { lat: -10.0, lng: -60.0 },
      environment: 'Tropical and subtropical regions'
    },
    diet: 'Carnivore',
    interestingFacts: [
      'Cane toads secrete toxic substances from their skin',
      'They can live up to 15 years',
      'These toads are excellent jumpers'
    ],
    photos: [
      'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc4ac81a5e7?w=800&h=600&fit=crop'
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=800&h=600&fit=crop',
    history: 'Bumpy came to us in 2022 from a research facility. She helps educate visitors about the complex role of invasive species in ecosystems.',
    averageRating: 4.1,
    reviewCount: 76,
    viewCount: 1120,
    createdAt: '2022-07-18T14:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  }
];

export const getAnimalsByType = (type: AnimalType): Animal[] => {
  return mockAnimals.filter(animal => animal.type === type);
};

export const getAnimalsByConservationStatus = (status: ConservationStatus): Animal[] => {
  return mockAnimals.filter(animal => animal.conservationStatus === status);
};

export const searchAnimals = (query: string): Animal[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockAnimals.filter(animal => 
    animal.name.toLowerCase().includes(lowercaseQuery) ||
    animal.species.toLowerCase().includes(lowercaseQuery) ||
    animal.description.toLowerCase().includes(lowercaseQuery)
  );
};