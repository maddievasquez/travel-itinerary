
INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Trinity College Library', 'College St, Dublin', 53.3438, -6.2566, 'Historic');

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Guinness Storehouse', 'St. James''s Gate, Dublin', 53.3418, -6.2868, 'Attraction');

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Dublin Castle', 'Dame St, Dublin', 53.3429, -6.2673, 'Historic');

-- Repeat the pattern for all landmarks, like below
INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'St. Patrick''s Cathedral', 'St Patrick''s Close, Dublin', 53.3395, -6.2711, 'Religious');

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Phoenix Park', 'Phoenix Park, Dublin', 53.3566, -6.329, 'Park');

-- Continue for each city and set of landmarks
INSERT INTO location_location (city) VALUES ('New York');
SET @location_id = LAST_INSERT_ID();

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Statue of Liberty', 'Liberty Island, New York', 40.6892, -74.0445, 'Historic');

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Central Park', 'Central Park, New York', 40.7851, -73.9683, 'Park');

-- Add remaining New York landmarks here
-- Repeat for Madrid
INSERT INTO location_location (city) VALUES ('Madrid');
SET @location_id = LAST_INSERT_ID();

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Prado Museum', 'Calle Ruiz de Alarcón 23, Madrid', 40.4138, -3.6921, 'Museum');

-- Continue for each city and landmark
-- London
INSERT INTO location_location (city) VALUES ('London');
SET @location_id = LAST_INSERT_ID();

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Big Ben', 'Westminster, London', 51.5007, -0.1246, 'Historic');

-- Paris
INSERT INTO location_location (city) VALUES ('Paris');
SET @location_id = LAST_INSERT_ID();

INSERT INTO location_location (parent_location_id, name, address, latitude, longitude, category)
VALUES (@location_id, 'Eiffel Tower', 'Champ de Mars, Paris', 48.8584, 2.2945, 'Historic');
