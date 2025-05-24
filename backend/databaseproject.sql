-- Database creation
CREATE DATABASE IF NOT EXISTS databaseproject;
USE databaseproject;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Planets table
CREATE TABLE IF NOT EXISTS planets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    distance_from_sun VARCHAR(50) NOT NULL,
    diameter VARCHAR(50) NOT NULL,
    orbital_period VARCHAR(50) NOT NULL,
    details TEXT NOT NULL
);

-- Asteroids table
CREATE TABLE IF NOT EXISTS asteroids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    distance_from_sun VARCHAR(50) NOT NULL,
    diameter VARCHAR(50) NOT NULL,
    discovery_year INT,
    details TEXT NOT NULL
);

-- Comets table
CREATE TABLE IF NOT EXISTS comets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    distance_from_sun VARCHAR(50) NOT NULL,
    orbital_period VARCHAR(50) NOT NULL,
    last_observed YEAR,
    details TEXT NOT NULL
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer ENUM('a', 'b', 'c', 'd') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

select * from quiz_results;
select * from users;
-- Sample data for planets
INSERT INTO planets (name, distance_from_sun, diameter, orbital_period, details, image_url) VALUES
('Mercury', '57.91 million km', '4,880 km', '88 days', 'Mercury is the closest planet to the sun and also the smallest planet in the solar system. The small and cratered planet does not have any moons and zips around the sun faster than any other planet in the solar system, hence why the Romans named it after their swift-footed messenger god.', 'mercury.jpg'),
('Venus', '108.2 million km', '12,104 km', '225 days', 'Venus is the second planet from the Sun. It is a terrestrial planet and is the closest in mass and size to its orbital neighbour Earth. Venus is notable for having the densest atmosphere of the terrestrial planets, composed mostly of carbon dioxide with a thick, global sulfuric acid cloud cover.', 'venus.jpg'),
('Earth', '149.6 million km', '12,742 km', '365.25 days', 'Earth, our home planet, is a world unlike any other. The third planet from the sun, Earth is the only place in the known universe confirmed to host life. With a radius of 3,959 miles, Earth is the fifth largest planet in our solar system, and its the only one known for sure to have liquid water on its surface.', 'earth.jpg'),
('Mars', '227.9 million km', '6,779 km', '687 days', 'Mars is the fourth planet from the Sun at an average distance of about 228 million km (142 million miles) or 1.52 AU. One day on Mars takes a little over 24 hours. Mars makes a complete orbit around the Sun (a year in Martian time) in 687 Earth days. Mars is a rocky planet.', 'mars.jpg'),
('Jupiter', '778.5 million km', '139,820 km', '12 years', 'Fifth planet from the Sun, the largest nonstellar object in the solar system. It has 318 times the mass and more than 1,400 times the volume of Earth. Its enormous mass gives it nearly 2.5 times the gravity of Earth (measured at the top of Jupiter�s atmosphere), and it exerts strong effects on other members of the solar system. It is responsible for the Kirkwood gaps in the asteroid belt and changes in the orbits of comets; it may act as a �sweeper,� pulling in bodies that might otherwise collide with other planets. Jupiter has more than 90 identified moons. It has a diffuse ring system that was discovered in 1979 by the Voyager spacecraft. Jupiter is a gas giant, composed mainly of hydrogen and helium in proportions near those of the Sun, which it orbits every 11.9 years at an average distance of 483 million mi (778 million km). Its rapid rotation (9 hr 55.5 min) acts on electric currents to give it the largest magnetic field of any of the planets and causes intense storms, including one that has lasted hundreds of years (the Great Red Spot). Little is known of its interior, but it is presumed to have a deep layer of metallic hydrogen and a dense core. Its central temperature is estimated to be 45,000 �F (25,000 �C); it radiates twice as much heat as it receives from the Sun, probably largely heat left over from its formation.', 'jupiter.jpg'),
('Saturn', '1.434 billion km', '116,460 km', '29 years', 'Saturn is the sixth planet from the Sun and the second largest planet in our solar system. Adorned with a dazzling system of icy rings, Saturn is unique among the planets. It is not the only planet to have rings, but none are as spectacular or as complex as Saturns', 'saturn.jpg'),
('Uranus', '2.871 billion km', '50,724 km', '84 years', 'Uranus is the seventh planet from the Sun. It is a gaseous cyan-coloured ice giant. Most of the planet is made of water, ammonia, and methane in a supercritical phase of matter, which in astronomy is called "ice" or volatiles', 'uranus.jpg'),
('Neptune', '4.495 billion km', '49,244 km', '165 years', 'Neptune is the eighth and farthest known planet from the Sun. It is the fourth-largest planet in the Solar System by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth, and slightly more massive than fellow ice giant Uranus.', 'neptune.jpg');
select * from planets;
-- Sample data for asteroids
INSERT INTO asteroids (name, distance_from_sun, diameter, discovery_year, details, image_url) VALUES
('Ceres', '413.7 million km', '940 km', 1801, 'It was discovered in 1801 by Giuseppe Piazzi ,Notability: The largest object in the asteroid belt and classified as a dwarf planet.It has a differentiated interior and evidence of water ice and cryovolcanism.Studied extensively by NASAs Dawn mission.', 'ceres.jpg'),
('Vesta', '353.4 million km', '525 km', 1807, 'It was discovered in 1807 by Heinrich Wilhelm Olbers ,Notability: One of the largest asteroids in the main belt, with a basaltic surface indicating a differentiated structure.Visited by NASAs Dawn mission, which provided detailed images and data.', 'vesta.jpg'),
('Pallas', '414.7 million km', '512 km', 1802, 'It was discovered in 1802 by Heinrich Wilhelm Olbers ,Notability: The second asteroid discovered and notable for its highly inclined orbit.Its surface composition suggests it may be a protoplanet.', 'pallas.jpg'),
('Hygeia', '470.3 million km', '434 km', 1849, 'It was discovered in 1849 by Annibale de Gasparis ,Notability: The fourth largest asteroid in the main belt.It is nearly spherical, making it a candidate for dwarf planet classification.', 'hygeia.jpg'),
('Eros', '470.3 million km', '434 km', 1898, 'It was discovered in 1898 by Carl Gustav Witt and Auguste Charlois ,Notability: Visited by NASAs NEAR Shoemaker spacecraft, which orbited and landed on Eros in 2001. Provided detailed data about its surface and composition.', 'hygeia.jpg'),
('Itokawa', '470.3 million km', '454 km', 1998, 'It was discovered in 1998 by LINEAR ,Notability: Target of JAXAs Hayabusa mission, which returned samples to Earth in 2010. Itokawas surface is covered with boulders and dust, indicating a rubble-pile structure.', 'hygeia.jpg'),
('Bennu', '470.3 million km', '504 km', 1999, 'It was discovered in 1999 by LINEAR Notability : Target of NASAs OSIRIS-REx mission, which collected samples in 2020. Bennu is a carbonaceous asteroid, rich in organic materials and water-bearing minerals.', 'hygeia.jpg'),
('Ryugu', '470.3 million km', '936 km', 1999, 'It was discovered in 1999 by LINEAR Notability: Target of JAXAs Hayabusa2 mission, which collected samples and returned them to Earth in 2020. Ryugus surface features large boulders and a spinning top shape.', 'hygeia.jpg'),
('Gaspra', '470.3 million km', '494 km', 1916, 'It was discovered in 1916 by Grigory Neujmin Notability: First asteroid to be closely imaged by a spacecraft(Galileo in 1991).It has an irregular shape and numerous craters.', 'hygeia.jpg'),
('Ida', '470.3 million km', '604 km', 1884, 'It was discovered in 1884 by Johann Palisa Notability: Imaged by the Galileo spacecraft in 1993, revealing it has a small moon named Dactyl, making it the first asteroid known to have a moon.', 'hygeia.jpg'),
('Toutatis', '412.0 million km', '2.5 km', 1989, 'It was discovered in 1989 by Christian Pollas. Notability: A near-Earth asteroid with a tumbling rotation. Closely approached Earth in 2004 and was observed by radar and optical telescopes.', 'toutatis.jpg'),
('Hygiea', '470.3 million km', '430 km', 1849, 'It was discovered in 1849 by Annibale de Gasparis. Notability: The fourth-largest object in the asteroid belt and nearly spherical in shape. Potential candidate for dwarf planet status.', 'hygiea.jpg'),
('Steins', '344.0 million km', '5.9 km', 1969, 'It was discovered in 1969 by Soviet astronomer Nikolai Chernykh. Notability: Visited by ESA’s Rosetta spacecraft in 2008, providing detailed images of its surface and shape.', 'steins.jpg'),
('Lutetia', '379.0 million km', '100 km', 1852, 'It was discovered in 1852 by Hermann Goldschmidt. Notability: Visited by ESA’s Rosetta mission in 2010. Found to be a primitive, metal-rich asteroid.', 'lutetia.jpg'),
('Apophis', '150 million km', '370 m', 2004, 'It was discovered in 2004 by Roy A. Tucker, David J. Tholen, and Fabrizio Bernardi. Notability: Known for its potential Earth close approach in 2029. Subject of planetary defense studies.', 'apophis.jpg'),
('Mathilde', '449.0 million km', '66 km', 1885, 'It was discovered in 1885 by Johann Palisa. Notability: Visited by NASA’s NEAR Shoemaker in 1997. Known for its low density and large craters.', 'mathilde.jpg'),
('Kleopatra', '422.0 million km', '217 km', 1880, 'It was discovered in 1880 by Johann Palisa. Notability: A dog-bone shaped metallic asteroid with two moons. Imaged using radar and adaptive optics.', 'kleopatra.jpg'),
('Didymos', '149.6 million km', '780 m', 1996, 'It was discovered in 1996 by the Spacewatch survey. Notability: Target of NASA’s DART mission, which impacted its moon Dimorphos in 2022 to test asteroid deflection.', 'didymos.jpg'),
('Eugenia', '395.0 million km', '215 km', 1857, 'It was discovered in 1857 by Hermann Goldschmidt. Notability: First asteroid discovered to have a moon. It has two known satellites, Petit-Prince and S/2004 (45) 1.', 'eugenia.jpg'),
('Psyche', '437.0 million km', '226 km', 1852, 'It was discovered in 1852 by Annibale de Gasparis. Notability: A metal-rich asteroid believed to be the exposed core of a protoplanet. Target of NASA’s Psyche mission.', 'psyche.jpg');


-- Sample data for comets
INSERT INTO comets (name, distance_from_sun, orbital_period, last_observed, details, image_url) VALUES
("Halley's Comet", '0.586 AU', '76 years', 1986, 'One of the most well-known comets, visible from Earth approximately every 76 years. It was the first comet predicted to return by Edmond Halley in 1705.', 'halley.jpg'),
('Comet NEOWISE', '0.294 AU', '6,800 years', 2020, 'Provided a spectacular display in July 2020, visible to the naked eye and widely photographed.', 'neowise.jpg'),
('Comet Hale-Bopp', '0.914 AU', '2,533 years', 1997, 'One of the brightest and most observed comets of the 20th century, visible to the naked eye for a record 18 months.', 'hale-bopp.jpg'),
('Comet Lovejoy', '0.811 AU', '8,000 years', 2011, 'A sun-grazing comet that survived its close approach to the Sun and provided spectacular views.'),
('Comet Hyakutake', '0.23 AU', '17,000 years', 1996, 'Passed very close to Earth in 1996, providing a stunning and bright tail visible in the night sky.'),
('Comet Encke', '0.34 AU', '3.3 years', 1786, 'Has the shortest orbital period of any known comet. Responsible for the Taurid meteor shower.'),
('Comet Tempel 1', '1.5 AU', '5.5 years', 1867, 'Target of NASA’s Deep Impact mission, which released a probe that impacted the comet’s surface in 2005.'),
('Comet Wild 2', '1.59 AU', '6.4 years', 1978, 'Studied by NASA’s Stardust mission, which returned samples of the comet’s dust to Earth in 2006.'),
('Comet Borrelly', '1.36 AU', '6.9 years', 1904, 'Visited by NASA’s Deep Space 1 spacecraft in 2001, which captured detailed images of its nucleus.'),
('Comet McNaught', '0.17 AU', '92,600 years', 2007, 'One of the brightest comets in recent history, easily visible in the Southern Hemisphere.'),
('Comet ISON', '0.012 AU', 'Lost (unknown)', 2013, 'A sungrazing comet that disintegrated during its close approach to the Sun.'),
('Comet Holmes', '2.05 AU', '6.9 years', 1892, 'Had a massive outburst in 2007, becoming temporarily visible to the naked eye.'),
('Comet Lemmon', '0.73 AU', '11,000 years', 2013, 'Known for its greenish hue due to diatomic carbon; visible with binoculars in the Southern Hemisphere.'),
('Comet PANSTARRS (C/2011 L4)', '0.3 AU', '106,000 years', 2011, 'Visible in 2013; developed a bright tail and was photographed extensively worldwide.'),
('Comet Giacobini–Zinner', '0.99 AU', '6.6 years', 1900, 'Source of the Draconid meteor shower and visited by the ICE spacecraft in 1985.'),
('Comet Shoemaker-Levy 9', '1.0 AU', 'Disrupted', 1993, 'Famous for colliding with Jupiter in 1994, providing the first direct observation of an extraterrestrial collision.' ),
('Comet West', '0.2 AU', '558,000 years', 1976, 'One of the brightest comets of the 20th century; had a large, impressive tail.', 'west.jpg'),
('Comet Machholz', '0.75 AU', '5.2 years', 2004, 'A long-period comet discovered by amateur astronomer Donald Machholz.', 'machholz.jpg'),
('Comet Tuttle', '1.03 AU', '13.6 years', 1790, 'Parent body of the Ursid meteor shower, it has a relatively short period.', 'tuttle.jpg'),
('Comet SWAN (C/2020 F8)', '0.43 AU', '11,597 years', 2020, 'Visible in 2020, known for its green glow and brief visibility to the naked eye.');


-- Sample quiz questions
INSERT INTO quizzes (category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('planets', 'Which planet is closest to the Sun?', 'Venus', 'Mercury', 'Earth', 'Mars', 'b', 'easy'),
('planets', 'Which planet has the most moons?', 'Jupiter', 'Saturn', 'Neptune', 'Uranus', 'b', 'medium'),
('planets', 'What is the hottest planet in our solar system?', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'b', 'medium'),
('planets', 'Which planet has the Great Red Spot?', 'Saturn', 'Jupiter', 'Neptune', 'Mars', 'b', 'easy'),
('asteroids', 'Where is the asteroid belt located?', 'Between Earth and Mars', 'Between Mars and Jupiter', 'Between Jupiter and Saturn', 'Beyond Neptune', 'b', 'easy'),
('asteroids', 'What is the largest object in the asteroid belt?', 'Vesta', 'Ceres', 'Pallas', 'Hygeia', 'b', 'easy'),
('comets', 'What causes a comet''s tail to form?', 'Solar wind', 'Magnetic fields', 'Atmospheric friction', 'Cosmic radiation', 'a', 'hard'),
('comets', 'How often does Halley''s Comet appear?', 'Every 25 years', 'Every 50 years', 'Every 76 years', 'Every 100 years', 'c', 'medium'); 
select * from quizzes;
ALTER TABLE users ADD COLUMN role VARCHAR(10) NOT NULL DEFAULT 'user';
UPDATE users SET role = 'admin' WHERE email = 'admin@gmail.com';

CREATE VIEW user_quiz_results_view AS
SELECT 
    u.id AS user_id,
    u.username,
    u.email,
    qr.id AS result_id,
    qr.category,
    qr.score,
    qr.total,
    ROUND((qr.score/qr.total)*100, 2) AS percentage,
    qr.taken_at
FROM 
    users u
JOIN 
    quiz_results qr ON u.id = qr.user_id
ORDER BY 
    qr.taken_at DESC;
    
    
select * from user_quiz_results_view;
    
    
DELIMITER //
CREATE PROCEDURE display()
BEGIN
    SELECT * FROM users;
END //

DELIMITER ;

CALL display();

DELIMITER //

DELIMITER //
CREATE FUNCTION planet_exists(planet_name VARCHAR(100))
RETURNS BOOLEAN
BEGIN
    DECLARE result BOOLEAN;
    SELECT COUNT(*) > 0 INTO result
    FROM planets 
    WHERE name = planet_name;
    RETURN result;
END;
//
DELIMITER ;


