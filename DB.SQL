-- Create site_types table
CREATE TABLE site_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  extra_guest_price DECIMAL(10, 2) NOT NULL,
  base_guests INTEGER NOT NULL,
  max_guests INTEGER NOT NULL
);

-- Create sites table
CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  site_type_id INTEGER REFERENCES site_types(id),
  number TEXT NOT NULL UNIQUE
);

-- Create reservations table
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES sites(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  adult_count INTEGER NOT NULL,
  child_count INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create additional_services table
CREATE TABLE additional_services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  allow_multiple BOOLEAN NOT NULL DEFAULT false
);

-- Create reservation_services table (for many-to-many relationship)
CREATE TABLE reservation_services (
  id SERIAL PRIMARY KEY,
  reservation_id INTEGER REFERENCES reservations(id),
  service_id INTEGER REFERENCES additional_services(id),
  quantity INTEGER NOT NULL DEFAULT 1
);