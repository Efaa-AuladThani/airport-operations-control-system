-- Seed data for the Airport Operations Control System

TRUNCATE TABLE incidents, flights, gates, users RESTART IDENTITY CASCADE;

-- Sample gates
INSERT INTO gates (id, gate_number, terminal, status) VALUES
    (1, 'A1', 'Terminal 1', 'occupied'),
    (2, 'A2', 'Terminal 1', 'available'),
    (3, 'B5', 'Terminal 2', 'occupied'),
    (4, 'C3', 'Terminal 3', 'maintenance'),
    (5, 'D1', 'Terminal 2', 'available'),
    (6, 'E7', 'Terminal 3', 'available');

-- Sample flights with realistic Gulf-region airlines and IATA codes
INSERT INTO flights (id, flight_number, airline, aircraft_type, origin, destination, scheduled_time, status, gate_id) VALUES
    (1, 'WY201', 'Oman Air', 'Boeing 737-800', 'MCT', 'DXB', '2026-07-20 08:30:00', 'boarding', 1),
    (2, 'OV300', 'SalamAir', 'Airbus A320', 'MCT', 'DOH', '2026-07-20 09:15:00', 'scheduled', 2),
    (3, 'EK501', 'Emirates', 'Boeing 777-300ER', 'MCT', 'DXB', '2026-07-20 10:00:00', 'delayed', 3),
    (4, 'QR321', 'Qatar Airways', 'Airbus A350-900', 'MCT', 'DOH', '2026-07-20 11:20:00', 'scheduled', 5),
    (5, 'EY202', 'Etihad Airways', 'Airbus A321', 'MCT', 'AUH', '2026-07-20 12:30:00', 'scheduled', 5),
    (6, 'FZ193', 'flydubai', 'Boeing 737 MAX 8', 'MCT', 'DXB', '2026-07-20 13:45:00', 'boarding', 2);

-- Sample incidents linked to flights
INSERT INTO incidents (id, flight_id, title, description, severity, status, reported_at) VALUES
    (1, 1, 'Delayed baggage transfer', 'Baggage transfer from the inbound aircraft is running behind schedule, causing a boarding delay.', 'high', 'investigating', '2026-07-20 08:05:00'),
    (2, 3, 'Gate equipment issue', 'The jet bridge at Gate B5 is temporarily unavailable, affecting passenger boarding.', 'medium', 'open', '2026-07-20 09:40:00'),
    (3, 6, 'Fueling delay', 'Fuel delivery to the aircraft has been delayed due to a temporary refueling queue.', 'critical', 'open', '2026-07-20 13:10:00');

-- Sample users
INSERT INTO users (id, full_name, email, role, password_hash) VALUES
    (1, 'Aisha Al Rashid', 'aisha.rashid@airportops.local', 'admin', 'sha256$placeholder$admin$1'),
    (2, 'Omar Haddad', 'omar.haddad@airportops.local', 'operations', 'sha256$placeholder$ops$2'),
    (3, 'Noura Al Balushi', 'noura.balushi@airportops.local', 'security', 'sha256$placeholder$security$3');
