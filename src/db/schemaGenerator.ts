function createPRNG(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export const generateDatabaseSQL = (): string => {
  const random = createPRNG(42); 
  
  // tworzenie schematu bazy danych
  let sql = "BEGIN TRANSACTION;\n";

  sql += `
    CREATE TABLE employees (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      full_name TEXT,
      department TEXT,
      pos TEXT,
      clearance_level INTEGER,
      status TEXT,
      assigned_location_id INTEGER
    );

    CREATE TABLE locations (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      sector TEXT,
      security_level INTEGER
    );

    CREATE TABLE access_logs (
      id INTEGER PRIMARY KEY,
      employee_id INTEGER,
      location_id INTEGER,
      action_type TEXT,
      created_at TEXT,
      access_granted INTEGER
    );

    CREATE TABLE messages (
      id INTEGER PRIMARY KEY,
      sender_id INTEGER,
      receiver_id INTEGER,
      created_at TEXT,
      subject TEXT,
      body TEXT,
      is_encrypted INTEGER
    );

    CREATE TABLE incidents (
      id INTEGER PRIMARY KEY,
      location_id INTEGER,
      created_at TEXT,
      severity TEXT,
      description TEXT
    );
  `;

  // wstawianie danych do tabeli locations
  const locations = [
    { id: 1, name: 'MAIN_LOBBY', sector: 'A', sec: 1 },
    { id: 2, name: 'SECURITY_HQ', sector: 'A', sec: 3 },
    { id: 3, name: 'SERVER_ROOM_ALPHA', sector: 'B', sec: 4 },
    { id: 4, name: 'ORACLE_LAB', sector: 'B', sec: 5 },
    { id: 5, name: 'ARCHIVES_DEEP', sector: 'C', sec: 4 },
    { id: 6, name: 'EXECUTIVE_SUITE', sector: 'A', sec: 5 },
    { id: 7, name: 'R&D_LAB_1', sector: 'B', sec: 3 },
    { id: 8, name: 'R&D_LAB_2', sector: 'B', sec: 3 },
    { id: 9, name: 'CAFETERIA', sector: 'A', sec: 1 },
    { id: 10, name: 'MAINTENANCE_LEVEL_1', sector: 'D', sec: 2 },
    { id: 11, name: 'SERVER_ROOM_BETA', sector: 'B', sec: 4 },
    { id: 12, name: 'STORAGE_UNIT_7', sector: 'C', sec: 2 },
    { id: 13, name: 'DATA_PROCESSING', sector: 'B', sec: 3 },
    { id: 14, name: 'CONFERENCE_ROOM_A', sector: 'A', sec: 1 },
    { id: 15, name: 'CONFERENCE_ROOM_B', sector: 'A', sec: 1 },
    { id: 16, name: 'WASTE_MANAGEMENT', sector: 'D', sec: 1 },
    { id: 17, name: 'POWER_GRID_CONTROL', sector: 'D', sec: 5 },
    { id: 18, name: 'HR_DEPARTMENT', sector: 'A', sec: 2 },
    { id: 19, name: 'LEGAL_DEPARTMENT', sector: 'A', sec: 3 },
    { id: 20, name: 'TESTING_CHAMBER_1', sector: 'C', sec: 4 },
    { id: 21, name: 'TESTING_CHAMBER_2', sector: 'C', sec: 4 },
    { id: 22, name: 'UNDERGROUND_PARKING', sector: 'E', sec: 1 },
    { id: 23, name: 'HELIPAD_ACCESS', sector: 'A', sec: 4 },
    { id: 24, name: 'JANITOR_CLOSET_1', sector: 'A', sec: 1 },
    { id: 25, name: 'JANITOR_CLOSET_2', sector: 'B', sec: 1 },
    { id: 26, name: 'QUARANTINE_ZONE', sector: 'C', sec: 5 },
    { id: 27, name: 'MEDICAL_BAY', sector: 'A', sec: 2 },
    { id: 28, name: 'SECURITY_CHECKPOINT_1', sector: 'A', sec: 2 },
    { id: 29, name: 'SECURITY_CHECKPOINT_2', sector: 'B', sec: 3 },
    { id: 30, name: 'VENTILATION_CONTROL', sector: 'D', sec: 4 }
  ];

  locations.forEach(loc => {
    sql += `INSERT INTO locations VALUES (${loc.id}, '${loc.name}', '${loc.sector}', ${loc.sec});\n`;
  });

  const depts = ['IT_OPS', 'SECURITY', 'R&D', 'HR', 'MAINTENANCE', 'EXECUTIVE', 'SPECIAL_PROJECTS'];

  const firstNames = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Elena', 'James', 'Anna', 'Robert', 'Maria', 'William', 
    'Sophia', 'Richard', 'Olivia', 'Charles', 'Isabella', 'Joseph', 'Mia', 'Thomas', 'Amelia', 'Jack', 'Charlotte', 'Daniel', 
    'Harper', 'Matthew', 'Evelyn', 'Anthony', 'Abigail', 'Mark', 'Emily', 'Paul', 'Ella', 'Steven', 'Scarlett', 'Andrew', 'Grace', 
    'Joshua', 'Chloe', 'Kevin', 'Lily'];

  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 
    'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 
    'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'King', 'Wright', 'Scott', 
    'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker'];

  // IGŁY -> kluczowi pracownicy
  sql += `INSERT INTO employees VALUES (13, 'ghost', 'REDACTED', 'EXECUTIVE', 'Director', 5, 'ACTIVE', 6);\n`;
  sql += `INSERT INTO employees VALUES (42, 'admin_sys', 'Marcus Vance', 'IT_OPS', 'System Admin', 5, 'ACTIVE', 3);\n`;
  sql += `INSERT INTO employees VALUES (77, 'oracle_01', 'REDACTED', 'SPECIAL_PROJECTS', 'Lead Analyst', 4, 'ACTIVE', 4);\n`;
  sql += `INSERT INTO employees VALUES (99, 'csmith_99', 'Colin Smith', 'MAINTENANCE', 'Janitor', 1, 'ACTIVE', 10);\n`;
  sql += `INSERT INTO employees VALUES (105, 'agrant_105', 'Alan Grant', 'R&D', 'Lead Scientist', 3, 'ACTIVE', 7);\n`;
  sql += `INSERT INTO employees VALUES (200, 'hacker_200', 'Unknown', 'EXTERNAL', 'Contractor', 1, 'INACTIVE', 1);\n`;
  sql += `INSERT INTO employees VALUES (999, 'phantom_00', 'REDACTED', 'EXECUTIVE', 'Consultant', 5, 'ACTIVE', 6);\n`;

  for (let i = 1; i <= 250; i++) {
    if ([13, 42, 77, 99, 105, 200, 999].includes(i)) continue; 

    const fname = firstNames[Math.floor(random() * firstNames.length)];
    const lname = lastNames[Math.floor(random() * lastNames.length)];
    const dept = depts[Math.floor(random() * depts.length)];
    const username = `${fname.charAt(0).toLowerCase()}${lname.toLowerCase()}_${i}`;
    const clearance = Math.floor(random() * 3) + 1;
    const locId = Math.floor(random() * 30) + 1;
    
    sql += `INSERT INTO employees VALUES (${i}, '${username}', '${fname} ${lname}', '${dept}', 'Staff', ${clearance}, 'ACTIVE', ${locId});\n`;
  }

  // generowanie logów dostępu z losowymi danymi
  let logId = 1;
  const startDate = new Date('2026-01-12T08:00:00Z').getTime();

  for (let i = 0; i < 2500; i++) {
    const empId = Math.floor(random() * 250) + 1;
    if (empId === 999) continue;

    const locId = Math.floor(random() * 30) + 1;
    const timeOffset = Math.floor(random() * 30 * 24 * 60 * 60 * 1000); 
    const dateStr = new Date(startDate + timeOffset).toISOString().replace('T', ' ').substring(0, 19);
    
    const action = random() > 0.5 ? 'ENTER' : 'EXIT';
    const granted = random() > 0.1 ? 1 : 0; 

    sql += `INSERT INTO access_logs VALUES (${logId++}, ${empId}, ${locId}, '${action}', '${dateStr}', ${granted});\n`;
  }

  // IGŁY -> kluczowe wpisy w logach
  sql += `INSERT INTO access_logs VALUES (${logId++}, 77, 4, 'EXIT', '2026-02-12 03:42:00', 1);\n`;
  sql += `INSERT INTO access_logs VALUES (${logId++}, 13, 4, 'ENTER', '2026-02-12 03:17:00', 1);\n`;
  sql += `INSERT INTO access_logs VALUES (${logId++}, 13, 4, 'EXIT', '2026-02-12 04:10:00', 1);\n`;
  for(let j=0; j<65; j++) { 
    sql += `INSERT INTO access_logs VALUES (${logId++}, 200, 5, 'ENTER', '2026-02-11 20:${j < 10 ? '0'+j : j}:00', 0);\n`;
  }
  sql += `INSERT INTO access_logs VALUES (${logId++}, 99, 4, 'ENTER', '2026-02-12 02:15:00', 1);\n`; 
  sql += `INSERT INTO access_logs VALUES (${logId++}, 13, 3, 'ENTER', '2026-02-11 14:20:00', 1);\n`; 
  sql += `INSERT INTO access_logs VALUES (${logId}, 77, 22, 'ENTER', '2026-02-12 03:45:00', 1);\n`; 

  // wstawianie przykładowych wiadomości
  const subjects = ['Meeting tomorrow', 'Weekly Report', 'Lunch?', 'Server reboot notice', 'Project Update', 'Welcome new hire', 'Invoice attached'];
  const bodies = [
    'Please review the attached documents.', 
    'Are we still on for lunch at the cafeteria?', 
    'The servers in Alpha room will be down for 15 mins.', 
    'Good job on the quarterly report.',
    'I need clearance for Sector C.',
    'Do not forget to lock your terminals.'
  ];
  
  let msgId = 1;
  for (let i = 0; i < 500; i++) {
    const sId = Math.floor(random() * 250) + 1;
    const rId = Math.floor(random() * 250) + 1;
    const timeOffset = Math.floor(random() * 30 * 24 * 60 * 60 * 1000);
    const dateStr = new Date(startDate + timeOffset).toISOString().replace('T', ' ').substring(0, 19);
    const sub = subjects[Math.floor(random() * subjects.length)];
    const bod = bodies[Math.floor(random() * bodies.length)];
    const isEnc = random() > 0.9 ? 1 : 0; 

    sql += `INSERT INTO messages VALUES (${msgId++}, ${sId}, ${rId}, '${dateStr}', '${sub}', '${bod}', ${isEnc});\n`;
  }

  // IGŁY -> kluczowe wiadomości
  sql += `INSERT INTO messages VALUES (${msgId++}, 105, 77, '2026-02-11 18:30:00', 'Project EchoLocate', 'EchoLocate: Cyfrowy Straznik Bioakustyki zostal skompromitowany. Zmieniaja go w bron. Uciekaj.', 1);\n`;
  sql += `INSERT INTO messages VALUES (${msgId++}, 77, 105, '2026-02-12 03:40:00', 'THE_TRUTH_IS_OUT', 'Zabieram dane projektu. Uciekam z NEXUS. Kod do archiwum to ECH0_V4NCE.', 1);\n`;
  sql += `INSERT INTO messages VALUES (${msgId}, 13, 42, '2026-02-12 04:15:00', 'Wipe protocols', 'Ensure logs for Sector B are purged by morning.', 1);\n`;

  // wstawianie przykładowych incydentów
  const severities = ['LOW', 'MEDIUM', 'HIGH'];
  const incidentDesc = [
    'HVAC system malfunction.',
    'Unauthorized access attempt blocked.',
    'Power fluctuation detected.',
    'Door sensor failure.',
    'Network timeout.',
    'Coffee machine fire.'
  ];

  let incId = 1;
  for (let i = 0; i < 50; i++) {
    const locId = Math.floor(random() * 30) + 1;
    const timeOffset = Math.floor(random() * 30 * 24 * 60 * 60 * 1000);
    const dateStr = new Date(startDate + timeOffset).toISOString().replace('T', ' ').substring(0, 19);
    const sev = severities[Math.floor(random() * severities.length)];
    const desc = incidentDesc[Math.floor(random() * incidentDesc.length)];

    sql += `INSERT INTO incidents VALUES (${incId++}, ${locId}, '${dateStr}', '${sev}', '${desc}');\n`;
  }

  // IGŁY -> kluczowe incydenty
  sql += `INSERT INTO incidents VALUES (${incId++}, 3, '2026-02-11 14:22:00', 'LOW', 'Temperature spike in Server Room Alpha.');\n`;
  sql += `INSERT INTO incidents VALUES (${incId}, 4, '2026-02-12 03:45:00', 'CRITICAL', 'Unauthorized data extraction detected on terminal ORC-01.');\n`;

  sql += "COMMIT;\n";
  return sql;
};