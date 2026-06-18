-- ============================================================
-- Parmar Properties — Fake Seed Data
-- 4 developers x 5 projects each, with 2-3 configurations per project
-- Safe to re-run: wipes only the rows it creates via the marker city tag below
-- ============================================================

-- Wipe previous seed run (optional safety net — comment out if you don't want this)
delete from inventory where "configurationId" in (
  select c.id from configurations c
  join projects p on p.id = c."projectId"
  join developers d on d.id = p."developerId"
  where d.name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);
delete from floor_plans where "configurationId" in (
  select c.id from configurations c
  join projects p on p.id = c."projectId"
  join developers d on d.id = p."developerId"
  where d.name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);
delete from configurations where "projectId" in (
  select p.id from projects p
  join developers d on d.id = p."developerId"
  where d.name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);
delete from project_images where "projectId" in (
  select p.id from projects p
  join developers d on d.id = p."developerId"
  where d.name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);
delete from project_documents where "projectId" in (
  select p.id from projects p
  join developers d on d.id = p."developerId"
  where d.name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);
delete from projects where "developerId" in (
  select id from developers where name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);
delete from developers where name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group');

-- ============================================================
-- DEVELOPERS
-- ============================================================
insert into developers (id, name, "logoUrl", website, established) values
  ('11111111-1111-1111-1111-111111111101', 'Skyline Realty',      'logos/skyline-realty.png',      'https://skylinerealty.example.com',      1998),
  ('11111111-1111-1111-1111-111111111102', 'Horizon Developers',  'logos/horizon-developers.png',  'https://horizondevelopers.example.com',  2004),
  ('11111111-1111-1111-1111-111111111103', 'Bluewater Estates',   'logos/bluewater-estates.png',   'https://bluewaterestates.example.com',   1991),
  ('11111111-1111-1111-1111-111111111104', 'Meridian Group',      'logos/meridian-group.png',      'https://meridiangroup.example.com',       2011);

-- ============================================================
-- PROJECTS — Skyline Realty (5)
-- ============================================================
insert into projects (id, "developerId", name, slug, location, city, locality, description, amenities, latitude, longitude) values
('22222222-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111101', 'Skyline Horizon Towers', 'skyline-horizon-towers', 'Andheri West, Mumbai', 'Mumbai', 'Andheri West', 'A premium high-rise residential tower with panoramic city views, located minutes from the Andheri metro and SV Road.', 'Swimming Pool, Gymnasium, Club House, Kids Play Area, 24/7 Security, Landscape Garden', 19.1359, 72.8296),
('22222222-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111101', 'Skyline Park Residency', 'skyline-park-residency', 'Powai, Mumbai', 'Mumbai', 'Powai', 'Lake-facing residences surrounded by greenery, close to Powai business hubs and top schools.', 'Jogging Track, Clubhouse, Indoor Games Room, Multipurpose Hall, CCTV Surveillance', 19.1176, 72.9060),
('22222222-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111101', 'Skyline Garden Enclave', 'skyline-garden-enclave', 'Mulund West, Mumbai', 'Mumbai', 'Mulund West', 'Gated community with landscaped gardens, ideal for families seeking a quieter suburb lifestyle.', 'Garden, Senior Citizen Sit-out, Kids Play Area, Power Backup, Rainwater Harvesting', 19.1726, 72.9425),
('22222222-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111101', 'Skyline Business Bay', 'skyline-business-bay', 'BKC, Mumbai', 'Mumbai', 'Bandra Kurla Complex', 'Premium residences with direct access to BKC''s commercial district, designed for working professionals.', 'Co-working Lounge, Rooftop Pool, Valet Parking, Gymnasium, EV Charging', 19.0660, 72.8679),
('22222222-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111101', 'Skyline Riverside Heights', 'skyline-riverside-heights', 'Kalyan West, Mumbai', 'Mumbai', 'Kalyan West', 'Affordable riverside-facing homes with strong connectivity via Kalyan station.', 'Community Hall, Garden, 24/7 Security, Children''s Play Area', 19.2403, 73.1305);

-- ============================================================
-- PROJECTS — Horizon Developers (5)
-- ============================================================
insert into projects (id, "developerId", name, slug, location, city, locality, description, amenities, latitude, longitude) values
('22222222-0002-0002-0002-000000000001', '11111111-1111-1111-1111-111111111102', 'Horizon Crest', 'horizon-crest', 'Thane West, Mumbai', 'Mumbai', 'Thane West', 'Modern crest-style towers with curated retail at the podium level, close to Eastern Express Highway.', 'Retail Podium, Swimming Pool, Gym, Amphitheater, Jogging Track', 19.2183, 72.9781),
('22222222-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111102', 'Horizon Greens', 'horizon-greens', 'Goregaon East, Mumbai', 'Mumbai', 'Goregaon East', 'Green-certified residences with solar-powered common areas and rainwater harvesting.', 'Solar Power, Rainwater Harvesting, Yoga Deck, Clubhouse, EV Charging', 19.1663, 72.8526),
('22222222-0002-0002-0002-000000000003', '11111111-1111-1111-1111-111111111102', 'Horizon Skyview', 'horizon-skyview', 'Malad West, Mumbai', 'Mumbai', 'Malad West', 'Sky-deck residences with infinity pool and unobstructed sea-facing views on higher floors.', 'Infinity Pool, Sky Lounge, Gymnasium, 24/7 Security, Indoor Games Room', 19.1864, 72.8493),
('22222222-0002-0002-0002-000000000004', '11111111-1111-1111-1111-111111111102', 'Horizon Central Square', 'horizon-central-square', 'Dadar West, Mumbai', 'Mumbai', 'Dadar West', 'Centrally located residences walking distance from Dadar station with excellent rail and road connectivity.', 'Rooftop Garden, Gym, Multipurpose Hall, CCTV, Power Backup', 19.0185, 72.8430),
('22222222-0002-0002-0002-000000000005', '11111111-1111-1111-1111-111111111102', 'Horizon Lakeview Residency', 'horizon-lakeview-residency', 'Virar West, Mumbai', 'Mumbai', 'Virar West', 'Budget-friendly lakeside homes targeted at first-time homebuyers and young families.', 'Garden, Community Hall, Children''s Play Area, Security Cabin', 19.4559, 72.8107);

-- ============================================================
-- PROJECTS — Bluewater Estates (5)
-- ============================================================
insert into projects (id, "developerId", name, slug, location, city, locality, description, amenities, latitude, longitude) values
('22222222-0003-0003-0003-000000000001', '11111111-1111-1111-1111-111111111103', 'Bluewater Marina Residences', 'bluewater-marina-residences', 'Worli, Mumbai', 'Mumbai', 'Worli', 'Ultra-luxury sea-facing apartments with private marina access and concierge services.', 'Private Marina Access, Concierge Desk, Infinity Pool, Spa, Valet Parking', 19.0176, 72.8170),
('22222222-0003-0003-0003-000000000002', '11111111-1111-1111-1111-111111111103', 'Bluewater Palms', 'bluewater-palms', 'Versova, Mumbai', 'Mumbai', 'Versova', 'Resort-style living with palm-lined walkways and beach proximity.', 'Beach Access, Palm Garden, Clubhouse, Swimming Pool, Gym', 19.1316, 72.8132),
('22222222-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111103', 'Bluewater Meadows', 'bluewater-meadows', 'Kandivali East, Mumbai', 'Mumbai', 'Kandivali East', 'Mid-segment family homes set around landscaped meadows and a central courtyard.', 'Central Courtyard, Garden, Kids Play Area, Power Backup, Security', 19.2086, 72.8693),
('22222222-0003-0003-0003-000000000004', '11111111-1111-1111-1111-111111111103', 'Bluewater Harbour View', 'bluewater-harbour-view', 'Sewri, Mumbai', 'Mumbai', 'Sewri', 'Harbour-facing apartments with unique flamingo-watching views from the promenade.', 'Promenade Deck, Gym, Clubhouse, 24/7 Security', 18.9929, 72.8588),
('22222222-0003-0003-0003-000000000005', '11111111-1111-1111-1111-111111111103', 'Bluewater Orchid Towers', 'bluewater-orchid-towers', 'Chembur, Mumbai', 'Mumbai', 'Chembur', 'Orchid-themed landscaped towers close to the upcoming Chembur metro corridor.', 'Landscape Garden, Clubhouse, Gym, Kids Play Area, Rainwater Harvesting', 19.0522, 72.9005);

-- ============================================================
-- PROJECTS — Meridian Group (5)
-- ============================================================
insert into projects (id, "developerId", name, slug, location, city, locality, description, amenities, latitude, longitude) values
('22222222-0004-0004-0004-000000000001', '11111111-1111-1111-1111-111111111104', 'Meridian One', 'meridian-one', 'Lower Parel, Mumbai', 'Mumbai', 'Lower Parel', 'Iconic single-tower landmark development with double-height lobby and skyline views.', 'Double Height Lobby, Sky Lounge, Gym, Spa, Valet Parking', 18.9967, 72.8258),
('22222222-0004-0004-0004-000000000002', '11111111-1111-1111-1111-111111111104', 'Meridian Heights', 'meridian-heights', 'Ghatkopar West, Mumbai', 'Mumbai', 'Ghatkopar West', 'Twin-tower residences with excellent metro and highway connectivity for daily commuters.', 'Clubhouse, Swimming Pool, Gym, Multipurpose Hall, Security', 19.0857, 72.9081),
('22222222-0004-0004-0004-000000000003', '11111111-1111-1111-1111-111111111104', 'Meridian Sunrise Enclave', 'meridian-sunrise-enclave', 'Vikhroli East, Mumbai', 'Mumbai', 'Vikhroli East', 'East-facing homes designed to maximize natural morning light across all units.', 'Garden, Yoga Deck, Kids Play Area, 24/7 Security, Power Backup', 19.1075, 72.9359),
('22222222-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111104', 'Meridian Grand Avenue', 'meridian-grand-avenue', 'Borivali West, Mumbai', 'Mumbai', 'Borivali West', 'Avenue-style low-rise development with tree-lined internal roads and ample parking.', 'Tree-lined Avenue, Clubhouse, Gym, Garden, CCTV', 19.2307, 72.8567),
('22222222-0004-0004-0004-000000000005', '11111111-1111-1111-1111-111111111104', 'Meridian Coastal Pearl', 'meridian-coastal-pearl', 'Uttan, Mumbai', 'Mumbai', 'Uttan', 'Low-density coastal project offering a resort-like second-home experience near Gorai beach.', 'Beach Proximity, Swimming Pool, Garden, Clubhouse, Security', 19.2685, 72.7847);

-- ============================================================
-- CONFIGURATIONS
-- Mix of statuses: NEW_LAUNCH, UNDER_CONSTRUCTION, READY_TO_MOVE, SOLD_OUT
-- Each project gets 2-3 configurations (different BHK / variant / size / price)
-- ============================================================

-- Skyline Horizon Towers (UNDER_CONSTRUCTION project)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0001-0001-0001-000000000001', 2, 'without Deck', 720, 28500, 'UNDER_CONSTRUCTION', '2028-06-30', 'P51800001001'),
('22222222-0001-0001-0001-000000000001', 2, 'with Deck',    780, 29500, 'UNDER_CONSTRUCTION', '2028-06-30', 'P51800001002'),
('22222222-0001-0001-0001-000000000001', 3, 'without Deck', 1050, 31000, 'UNDER_CONSTRUCTION', '2028-06-30', 'P51800001003');

-- Skyline Park Residency (READY_TO_MOVE project)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0001-0001-0001-000000000002', 2, 'Lake Facing',    810, 32500, 'READY_TO_MOVE', '2025-03-31', 'P51800002001'),
('22222222-0001-0001-0001-000000000002', 3, 'Lake Facing',    1180, 34000, 'READY_TO_MOVE', '2025-03-31', 'P51800002002');

-- Skyline Garden Enclave (NEW_LAUNCH project)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0001-0001-0001-000000000003', 1, 'Compact',         480, 18500, 'NEW_LAUNCH', '2031-12-31', 'P51800003001'),
('22222222-0001-0001-0001-000000000003', 2, 'Garden Facing',   700, 19500, 'NEW_LAUNCH', '2031-12-31', 'P51800003002'),
('22222222-0001-0001-0001-000000000003', 3, 'Garden Facing',   980, 20500, 'NEW_LAUNCH', '2031-12-31', 'P51800003003');

-- Skyline Business Bay (UNDER_CONSTRUCTION, premium)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0001-0001-0001-000000000004', 2, 'Premium',  900, 48000, 'UNDER_CONSTRUCTION', '2029-09-30', 'P51800004001'),
('22222222-0001-0001-0001-000000000004', 3, 'Premium',  1320, 50500, 'UNDER_CONSTRUCTION', '2029-09-30', 'P51800004002'),
('22222222-0001-0001-0001-000000000004', 4, 'Penthouse', 2100, 56000, 'UNDER_CONSTRUCTION', '2029-09-30', 'P51800004003');

-- Skyline Riverside Heights (SOLD_OUT, affordable)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0001-0001-0001-000000000005', 1, 'Standard', 410, 9800, 'SOLD_OUT', '2024-12-31', 'P51800005001'),
('22222222-0001-0001-0001-000000000005', 2, 'Standard', 650, 10200, 'SOLD_OUT', '2024-12-31', 'P51800005002');

-- Horizon Crest (NEW_LAUNCH)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0002-0002-0002-000000000001', 1, 'Smart Studio', 450, 16500, 'NEW_LAUNCH', '2032-03-31', 'P51800006001'),
('22222222-0002-0002-0002-000000000001', 2, 'Standard',     720, 17500, 'NEW_LAUNCH', '2032-03-31', 'P51800006002');

-- Horizon Greens (UNDER_CONSTRUCTION)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0002-0002-0002-000000000002', 2, 'Eco Series', 740, 21000, 'UNDER_CONSTRUCTION', '2027-11-30', 'P51800007001'),
('22222222-0002-0002-0002-000000000002', 3, 'Eco Series', 1080, 22500, 'UNDER_CONSTRUCTION', '2027-11-30', 'P51800007002'),
('22222222-0002-0002-0002-000000000002', 3, 'Eco Series Plus', 1180, 23500, 'UNDER_CONSTRUCTION', '2027-11-30', 'P51800007003');

-- Horizon Skyview (READY_TO_MOVE)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0002-0002-0002-000000000003', 2, 'Sea View',  830, 27500, 'READY_TO_MOVE', '2025-01-31', 'P51800008001'),
('22222222-0002-0002-0002-000000000003', 3, 'Sea View',  1240, 29000, 'READY_TO_MOVE', '2025-01-31', 'P51800008002');

-- Horizon Central Square (UNDER_CONSTRUCTION)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0002-0002-0002-000000000004', 1, 'Compact City', 460, 26000, 'UNDER_CONSTRUCTION', '2028-08-31', 'P51800009001'),
('22222222-0002-0002-0002-000000000004', 2, 'Compact City', 740, 27000, 'UNDER_CONSTRUCTION', '2028-08-31', 'P51800009002');

-- Horizon Lakeview Residency (SOLD_OUT, budget)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0002-0002-0002-000000000005', 1, 'Lake View', 420, 7200, 'SOLD_OUT', '2023-06-30', 'P51800010001'),
('22222222-0002-0002-0002-000000000005', 2, 'Lake View', 660, 7600, 'SOLD_OUT', '2023-06-30', 'P51800010002');

-- Bluewater Marina Residences (NEW_LAUNCH, ultra-luxury)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0003-0003-0003-000000000001', 3, 'Marina Facing',  1450, 68000, 'NEW_LAUNCH', '2031-06-30', 'P51800011001'),
('22222222-0003-0003-0003-000000000001', 4, 'Marina Facing',  2050, 72000, 'NEW_LAUNCH', '2031-06-30', 'P51800011002'),
('22222222-0003-0003-0003-000000000001', 4, 'Marina Penthouse', 3200, 85000, 'NEW_LAUNCH', '2031-06-30', 'P51800011003');

-- Bluewater Palms (UNDER_CONSTRUCTION)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0003-0003-0003-000000000002', 2, 'Palm View', 760, 33000, 'UNDER_CONSTRUCTION', '2028-02-28', 'P51800012001'),
('22222222-0003-0003-0003-000000000002', 3, 'Palm View', 1100, 35000, 'UNDER_CONSTRUCTION', '2028-02-28', 'P51800012002');

-- Bluewater Meadows (READY_TO_MOVE, mid-segment)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0003-0003-0003-000000000003', 1, 'Meadow Compact', 470, 13500, 'READY_TO_MOVE', '2024-09-30', 'P51800013001'),
('22222222-0003-0003-0003-000000000003', 2, 'Meadow Standard', 730, 14200, 'READY_TO_MOVE', '2024-09-30', 'P51800013002'),
('22222222-0003-0003-0003-000000000003', 3, 'Meadow Standard', 1020, 15000, 'READY_TO_MOVE', '2024-09-30', 'P51800013003');

-- Bluewater Harbour View (UNDER_CONSTRUCTION)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0003-0003-0003-000000000004', 2, 'Harbour View', 700, 19800, 'UNDER_CONSTRUCTION', '2027-12-31', 'P51800014001'),
('22222222-0003-0003-0003-000000000004', 3, 'Harbour View', 990, 20800, 'UNDER_CONSTRUCTION', '2027-12-31', 'P51800014002');

-- Bluewater Orchid Towers (NEW_LAUNCH)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0003-0003-0003-000000000005', 2, 'Orchid Standard', 715, 22500, 'NEW_LAUNCH', '2031-09-30', 'P51800015001'),
('22222222-0003-0003-0003-000000000005', 3, 'Orchid Standard', 1040, 23800, 'NEW_LAUNCH', '2031-09-30', 'P51800015002');

-- Meridian One (UNDER_CONSTRUCTION, landmark)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0004-0004-0004-000000000001', 3, 'Signature', 1380, 58000, 'UNDER_CONSTRUCTION', '2029-03-31', 'P51800016001'),
('22222222-0004-0004-0004-000000000001', 4, 'Signature', 1950, 62000, 'UNDER_CONSTRUCTION', '2029-03-31', 'P51800016002');

-- Meridian Heights (READY_TO_MOVE)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0004-0004-0004-000000000002', 1, 'Tower A', 440, 15800, 'READY_TO_MOVE', '2025-05-31', 'P51800017001'),
('22222222-0004-0004-0004-000000000002', 2, 'Tower A', 710, 16800, 'READY_TO_MOVE', '2025-05-31', 'P51800017002'),
('22222222-0004-0004-0004-000000000002', 2, 'Tower B', 730, 17000, 'READY_TO_MOVE', '2025-05-31', 'P51800017003');

-- Meridian Sunrise Enclave (NEW_LAUNCH)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0004-0004-0004-000000000003', 2, 'Sunrise Facing', 705, 18800, 'NEW_LAUNCH', '2032-01-31', 'P51800018001'),
('22222222-0004-0004-0004-000000000003', 3, 'Sunrise Facing', 1015, 19800, 'NEW_LAUNCH', '2032-01-31', 'P51800018002');

-- Meridian Grand Avenue (UNDER_CONSTRUCTION)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0004-0004-0004-000000000004', 2, 'Avenue Facing', 750, 20500, 'UNDER_CONSTRUCTION', '2028-10-31', 'P51800019001'),
('22222222-0004-0004-0004-000000000004', 3, 'Avenue Facing', 1090, 21800, 'UNDER_CONSTRUCTION', '2028-10-31', 'P51800019002'),
('22222222-0004-0004-0004-000000000004', 4, 'Avenue Corner', 1620, 23500, 'UNDER_CONSTRUCTION', '2028-10-31', 'P51800019003');

-- Meridian Coastal Pearl (SOLD_OUT, second-home)
insert into configurations ("projectId", bhk, "variantName", "carpetArea", "pricePerSqft", status, "possessionDate", "reraId") values
('22222222-0004-0004-0004-000000000005', 2, 'Coastal Studio', 680, 16200, 'SOLD_OUT', '2024-06-30', 'P51800020001'),
('22222222-0004-0004-0004-000000000005', 3, 'Coastal Villa',  1380, 17500, 'SOLD_OUT', '2024-06-30', 'P51800020002');

-- ============================================================
-- PROJECT IMAGES (one elevation + one amenities shot per project)
-- ============================================================
insert into project_images ("projectId", url, label, "sortOrder")
select id, 'elevation.jpg', 'Main Elevation', 0 from projects
where "developerId" in (
  select id from developers where name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);

insert into project_images ("projectId", url, label, "sortOrder")
select id, 'amenities.jpg', 'Clubhouse & Pool', 1 from projects
where "developerId" in (
  select id from developers where name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);

-- ============================================================
-- PROJECT DOCUMENTS (brochure per project)
-- ============================================================
insert into project_documents ("projectId", name, url)
select id, 'Project Brochure PDF', 'brochure.pdf' from projects
where "developerId" in (
  select id from developers where name in ('Skyline Realty', 'Horizon Developers', 'Bluewater Estates', 'Meridian Group')
);
