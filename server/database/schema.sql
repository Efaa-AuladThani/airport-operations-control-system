-- Airport Operations Control System database schema

-- Users table stores airport staff and system users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operations', 'security', 'staff')),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Gates table stores available airport gates
CREATE TABLE gates (
    id SERIAL PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL UNIQUE,
    terminal VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Flights table stores flight schedules and assigned gate information
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL UNIQUE,
    airline VARCHAR(50) NOT NULL,
    aircraft_type VARCHAR(50),
    origin CHAR(3) NOT NULL
         CHECK (origin = UPPER(origin)),
    destination CHAR(3) NOT NULL
         CHECK (destination = UPPER(destination)),
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'boarding', 'departed', 'delayed', 'cancelled')),
    gate_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_flights_gate FOREIGN KEY (gate_id) REFERENCES gates(id) ON DELETE SET NULL
);

-- Incidents table stores operational issues linked to flights
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    flight_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_incidents_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
);
