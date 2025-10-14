-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "habitat" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "diet" TEXT NOT NULL,
    "lifespan" TEXT NOT NULL,
    "status" "AnimalStatus" NOT NULL DEFAULT 'ACTIVE',
    "location" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- Insert animals data
INSERT INTO "Animal" ("id", "name", "species", "category", "habitat", "description", "imageUrl", "diet", "lifespan", "status", "location", "createdAt", "updatedAt") VALUES
-- MAMMALS
('b2ccffc5-7739-4864-af1c-5ad7f0661fb5', 'Leo the Lion', 'Panthera leo', 'Mammals', 'African Savanna', 'The lion is a large cat of the genus Panthera. Known as the "King of the Jungle," lions are social animals that live in groups called prides.', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800', 'Carnivore', '10-14 years in wild', 'ACTIVE', '{"lat": 40.7484, "lng": -73.9857, "exhibit": "African Plains"}', NOW(), NOW()),
('57ef506d-32f2-4968-990a-5bf1d11191ef', 'Ella the Elephant', 'Loxodonta africana', 'Mammals', 'African Grasslands', 'African elephants are the largest land animals on Earth. They are incredibly intelligent and have strong family bonds.', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800', 'Herbivore', '60-70 years', 'ACTIVE', '{"lat": 40.7485, "lng": -73.9858, "exhibit": "Elephant Sanctuary"}', NOW(), NOW()),
('759bb167-8576-4252-b061-f4a935db616f', 'Gerry the Giraffe', 'Giraffa camelopardalis', 'Mammals', 'African Savanna', 'Giraffes are the tallest mammals on Earth. Their long necks help them reach leaves high in trees.', 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800', 'Herbivore', '25 years', 'ACTIVE', '{"lat": 40.7486, "lng": -73.9859, "exhibit": "African Plains"}', NOW(), NOW()),
('cf9d278b-14db-4a82-bdfe-c8a30e9d212b', 'Panda the Giant Panda', 'Ailuropoda melanoleuca', 'Mammals', 'Bamboo Forests', 'Giant pandas are native to China and are known for their distinctive black and white coloring. They spend most of their day eating bamboo.', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800', 'Herbivore (mostly bamboo)', '20 years in wild', 'ACTIVE', '{"lat": 40.7487, "lng": -73.9860, "exhibit": "Asian Highlands"}', NOW(), NOW()),
('bece250a-630e-42f4-9780-f9c5f0db21c3', 'Stripe the Tiger', 'Panthera tigris', 'Mammals', 'Tropical Forests', 'Tigers are the largest cat species. They are solitary hunters and are known for their beautiful striped coats.', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800', 'Carnivore', '10-15 years in wild', 'ACTIVE', '{"lat": 40.7488, "lng": -73.9861, "exhibit": "Tiger Mountain"}', NOW(), NOW()),
('b9e793be-5954-4835-8460-e90cafb65e53', 'Polar the Polar Bear', 'Ursus maritimus', 'Mammals', 'Arctic Ice', 'Polar bears are the largest land carnivores. They are excellent swimmers and spend much of their time on sea ice.', 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800', 'Carnivore', '25-30 years', 'ACTIVE', '{"lat": 40.7489, "lng": -73.9862, "exhibit": "Arctic Circle"}', NOW(), NOW()),
('e7349ca6-f3f3-4245-a1c6-b477a48a5750', 'Koko the Gorilla', 'Gorilla gorilla', 'Mammals', 'Tropical Rainforest', 'Gorillas are gentle giants and the largest living primates. They live in family groups led by a dominant male.', 'https://images.unsplash.com/photo-1551503766-ac63dfa6e23f?w=800', 'Herbivore', '35-40 years', 'ACTIVE', '{"lat": 40.7491, "lng": -73.9864, "exhibit": "Congo Gorilla Forest"}', NOW(), NOW()),
('d1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a6', 'Dolphin Dave', 'Tursiops truncatus', 'Mammals', 'Ocean Waters', 'Bottlenose dolphins are highly intelligent marine mammals known for their playful behavior and complex social structures.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Carnivore (fish, squid)', '40-50 years', 'ACTIVE', '{"lat": 40.7492, "lng": -73.9865, "exhibit": "Marine World"}', NOW(), NOW()),

-- BIRDS
('95c85b3a-f5a2-40b1-a638-782719857832', 'Polly the Penguin', 'Spheniscus demersus', 'Birds', 'Coastal Waters', 'African penguins are excellent swimmers. They use their wings as flippers to propel through water.', 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800', 'Carnivore (fish)', '10-20 years', 'ACTIVE', '{"lat": 40.7490, "lng": -73.9863, "exhibit": "Penguin Point"}', NOW(), NOW()),
('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Eagle Eddie', 'Haliaeetus leucocephalus', 'Birds', 'Mountain Regions', 'Bald eagles are powerful birds of prey and the national bird of the United States. They have incredible eyesight and hunting skills.', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800', 'Carnivore (fish, small mammals)', '20-30 years', 'ACTIVE', '{"lat": 40.7493, "lng": -73.9866, "exhibit": "Raptor Ridge"}', NOW(), NOW()),
('b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7', 'Flamingo Flora', 'Phoenicopterus roseus', 'Birds', 'Wetlands', 'Greater flamingos are famous for their pink color and standing on one leg. They filter feed in shallow waters.', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 'Omnivore (algae, small fish)', '20-30 years', 'ACTIVE', '{"lat": 40.7494, "lng": -73.9867, "exhibit": "Flamingo Lagoon"}', NOW(), NOW()),
('c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8', 'Owl Oscar', 'Bubo bubo', 'Birds', 'Forest Regions', 'Eurasian eagle-owls are one of the largest owl species. They are nocturnal predators with exceptional hearing and night vision.', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800', 'Carnivore (small mammals, birds)', '20-30 years', 'ACTIVE', '{"lat": 40.7495, "lng": -73.9868, "exhibit": "Nocturnal House"}', NOW(), NOW()),

-- REPTILES
('d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9', 'Snake Sam', 'Python regius', 'Reptiles', 'Grasslands', 'Ball pythons are popular pet snakes known for their docile nature. When threatened, they curl into a tight ball.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'Carnivore (small mammals)', '20-30 years', 'ACTIVE', '{"lat": 40.7496, "lng": -73.9869, "exhibit": "Reptile House"}', NOW(), NOW()),
('e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', 'Lizard Larry', 'Varanus komodoensis', 'Reptiles', 'Tropical Islands', 'Komodo dragons are the largest living lizards on Earth. They are apex predators with venomous bites.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 'Carnivore (large mammals)', '30-50 years', 'ACTIVE', '{"lat": 40.7497, "lng": -73.9870, "exhibit": "Komodo Kingdom"}', NOW(), NOW()),
('f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', 'Turtle Tom', 'Chelonia mydas', 'Reptiles', 'Ocean Waters', 'Green sea turtles are ancient reptiles that can live for over 80 years. They migrate thousands of miles to nest.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Herbivore (sea grass, algae)', '80-100 years', 'ACTIVE', '{"lat": 40.7498, "lng": -73.9871, "exhibit": "Turtle Bay"}', NOW(), NOW()),

-- AMPHIBIANS
('a7b8c9d0-e1f2-a3b4-c5d6-e7f8a9b0c1d2', 'Frog Fred', 'Dendrobates tinctorius', 'Amphibians', 'Tropical Rainforest', 'Poison dart frogs are small but brightly colored amphibians. Their vibrant colors warn predators of their toxicity.', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 'Carnivore (small insects)', '10-15 years', 'ACTIVE', '{"lat": 40.7499, "lng": -73.9872, "exhibit": "Amphibian Alley"}', NOW(), NOW()),
('b8c9d0e1-f2a3-b4c5-d6e7-f8a9b0c1d2e3', 'Salamander Sally', 'Ambystoma mexicanum', 'Amphibians', 'Freshwater Lakes', 'Axolotls are unique salamanders that retain their larval features throughout life. They have incredible regenerative abilities.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'Carnivore (small fish, worms)', '10-15 years', 'ACTIVE', '{"lat": 40.7500, "lng": -73.9873, "exhibit": "Aquatic Amphibians"}', NOW(), NOW()),

-- FISH
('c9d0e1f2-a3b4-c5d6-e7f8-a9b0c1d2e3f4', 'Shark Steve', 'Carcharodon carcharias', 'Fish', 'Ocean Waters', 'Great white sharks are apex predators of the ocean. They have been swimming in Earth''s oceans for millions of years.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Carnivore (fish, seals)', '70+ years', 'ACTIVE', '{"lat": 40.7501, "lng": -73.9874, "exhibit": "Shark Tank"}', NOW(), NOW()),
('d0e1f2a3-b4c5-d6e7-f8a9-b0c1d2e3f4a5', 'Clownfish Charlie', 'Amphiprion ocellatus', 'Fish', 'Coral Reefs', 'Clownfish live in symbiotic relationships with sea anemones. They are immune to the anemone''s stinging tentacles.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Omnivore (algae, small crustaceans)', '6-10 years', 'ACTIVE', '{"lat": 40.7502, "lng": -73.9875, "exhibit": "Coral Reef"}', NOW(), NOW()),

-- INVERTEBRATES
('e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6', 'Spider Spinner', 'Theraphosa blondi', 'Invertebrates', 'Tropical Rainforest', 'Goliath bird-eating spiders are the largest spiders by mass. Despite their name, they rarely eat birds.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'Carnivore (insects, small vertebrates)', '15-25 years', 'ACTIVE', '{"lat": 40.7503, "lng": -73.9876, "exhibit": "Invertebrate House"}', NOW(), NOW()),
('f2a3b4c5-d6e7-f8a9-b0c1-d2e3f4a5b6c7', 'Butterfly Bella', 'Morpho peleides', 'Invertebrates', 'Tropical Forests', 'Blue morpho butterflies are known for their brilliant blue wings. They are among the most beautiful insects in the world.', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800', 'Herbivore (fruit, tree sap)', '2-3 months', 'ACTIVE', '{"lat": 40.7504, "lng": -73.9877, "exhibit": "Butterfly Garden"}', NOW(), NOW());
