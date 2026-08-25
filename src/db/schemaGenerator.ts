function createPRNG(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const generateDatabaseSQL = (): string => {
  const random = createPRNG(42);
  let sql = "BEGIN TRANSACTION;\n";

  sql += `
    PRAGMA foreign_keys = ON;

    CREATE TABLE employees (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      department TEXT NOT NULL,
      pos TEXT NOT NULL,
      clearance_level INTEGER NOT NULL,
      status TEXT NOT NULL,
      assigned_location_id INTEGER,
      FOREIGN KEY (assigned_location_id) REFERENCES locations(id)
    );

    CREATE TABLE locations (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      sector TEXT NOT NULL,
      security_level INTEGER NOT NULL
    );

    CREATE TABLE access_logs (
      id INTEGER PRIMARY KEY,
      employee_id INTEGER NOT NULL,
      location_id INTEGER NOT NULL,
      action_type TEXT NOT NULL,
      created_at DATETIME NOT NULL,
      access_granted INTEGER NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (location_id) REFERENCES locations(id)
    );

    CREATE TABLE messages (
      id INTEGER PRIMARY KEY,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      created_at DATETIME NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      is_encrypted INTEGER NOT NULL,
      FOREIGN KEY (sender_id) REFERENCES employees(id),
      FOREIGN KEY (receiver_id) REFERENCES employees(id)
    );

    CREATE TABLE incidents (
      id INTEGER PRIMARY KEY,
      location_id INTEGER NOT NULL,
      created_at DATETIME NOT NULL,
      severity TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (location_id) REFERENCES locations(id)
    );

    CREATE TABLE audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      triggered_by INTEGER NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      created_at DATETIME NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (triggered_by) REFERENCES employees(id)
    );

    CREATE TABLE internal_projects (
      id INTEGER PRIMARY KEY,
      project_code TEXT UNIQUE NOT NULL,
      lead_id INTEGER NOT NULL,
      classification TEXT NOT NULL,
      status TEXT NOT NULL,
      budget INTEGER NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES employees(id)
    );

    CREATE TABLE infrastructure_nodes (
      id INTEGER PRIMARY KEY,
      node_name TEXT UNIQUE NOT NULL,
      parent_id INTEGER,
      linked_sibling_id INTEGER,
      node_type TEXT NOT NULL,
      security_level INTEGER NOT NULL,
      FOREIGN KEY (parent_id) REFERENCES infrastructure_nodes(id),
      FOREIGN KEY (linked_sibling_id) REFERENCES infrastructure_nodes(id)
    );
  `;

  // LOCATIONS
  const locations = [
    { id: 1, name: "MAIN_LOBBY", sector: "A", sec: 1 },
    { id: 2, name: "SECURITY_HQ", sector: "A", sec: 3 },
    { id: 3, name: "SERVER_ROOM_03", sector: "CORE", sec: 5 },
    { id: 4, name: "ORACLE_LAB", sector: "B", sec: 5 },
    { id: 5, name: "ARCHIVES_DEEP", sector: "C", sec: 4 },
    { id: 6, name: "EXECUTIVE_SUITE", sector: "A", sec: 5 },
    { id: 7, name: "R&D_LAB_1", sector: "B", sec: 3 },
    { id: 8, name: "R&D_LAB_2", sector: "B", sec: 3 },
    { id: 9, name: "CAFETERIA", sector: "A", sec: 1 },
    { id: 10, name: "MAINTENANCE_LEVEL_1", sector: "D", sec: 2 },
    { id: 11, name: "SERVER_ROOM_BETA", sector: "B", sec: 4 },
    { id: 12, name: "STORAGE_UNIT_7", sector: "C", sec: 2 },
    { id: 13, name: "DATA_PROCESSING", sector: "B", sec: 3 },
    { id: 14, name: "CONFERENCE_ROOM_A", sector: "A", sec: 1 },
    { id: 15, name: "CONFERENCE_ROOM_B", sector: "A", sec: 1 },
    { id: 16, name: "WASTE_MANAGEMENT", sector: "D", sec: 1 },
    { id: 17, name: "POWER_GRID_CONTROL", sector: "D", sec: 5 },
    { id: 18, name: "HR_DEPARTMENT", sector: "A", sec: 2 },
    { id: 19, name: "LEGAL_DEPARTMENT", sector: "A", sec: 3 },
    { id: 20, name: "TESTING_CHAMBER_1", sector: "C", sec: 4 },
    { id: 21, name: "TESTING_CHAMBER_2", sector: "C", sec: 4 },
    { id: 22, name: "UNDERGROUND_PARKING", sector: "E", sec: 1 },
    { id: 23, name: "HELIPAD_ACCESS", sector: "A", sec: 4 },
    { id: 24, name: "JANITOR_CLOSET_1", sector: "A", sec: 1 },
    { id: 25, name: "JANITOR_CLOSET_2", sector: "B", sec: 1 },
    { id: 26, name: "QUARANTINE_ZONE", sector: "C", sec: 5 },
    { id: 27, name: "MEDICAL_BAY", sector: "A", sec: 2 },
    { id: 28, name: "SECURITY_CHECKPOINT_1", sector: "A", sec: 2 },
    { id: 29, name: "SECURITY_CHECKPOINT_2", sector: "B", sec: 3 },
    { id: 30, name: "VENTILATION_CONTROL", sector: "D", sec: 4 },
    { id: 31, name: "MIRROR_CORE", sector: "CORE", sec: 5 },
  ];

  for (const loc of locations) {
    sql += `INSERT INTO locations VALUES (${loc.id}, '${loc.name}', '${loc.sector}', ${loc.sec});\n`;
  }

  // EMPLOYEES
  const departments = ["IT_OPS", "SECURITY", "R&D", "HR", "MAINTENANCE", "EXECUTIVE", "SPECIAL_PROJECTS", "EXTERNAL", "LEGAL", "ARCHIVES", "FINANCE", "NETWORK", "DATA_SCIENCE"];
  const positions = ["Staff", "Senior Analyst", "Engineer", "Operator", "Specialist", "Supervisor", "Manager"];
  const firstNames = ["John", "Emma", "Michael", "Sarah", "David", "Elena", "James", "Anna", "Robert", "Maria", "William", "Sophia", "Richard", "Olivia", "Charles", "Isabella", "Joseph", "Mia", "Thomas", "Amelia", "Jack", "Charlotte", "Daniel", "Harper", "Matthew", "Evelyn", "Anthony", "Abigail", "Mark", "Emily", "Paul", "Ella", "Steven", "Scarlett", "Andrew", "Grace", "Joshua", "Chloe", "Kevin", "Lily", "Nathan", "Victoria", "Edward", "Hannah", "Lucas", "Zoe", "Benjamin", "Natalie", "Samuel", "Claire"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Mitchell", "Carter", "Roberts", "Turner", "Phillips", "Campbell"];

  const specialEmployees = [
    [10, "evoss_cto", "Elias Voss", "EXECUTIVE", "CTO", 5, "ACTIVE", 6],
    [13, "mvale_13", "Martin Vale", "SECURITY", "Operations", 5, "ACTIVE", 2],
    [77, "oracle_01", "Adrian Voss", "SPECIAL_PROJECTS", "Lead Architect", 5, "ACTIVE", 3],
    [200, "hacker_200", "Unknown", "EXTERNAL", "Contractor", 1, "INACTIVE", 1],
    [999, "oracle_shadow", "Unknown", "SPECIAL_PROJECTS", "Clone", 5, "ACTIVE", 31],
    [42, "admin_sys", "Marcus Vance", "IT_OPS", "System Admin", 5, "ACTIVE", 3],
    [105, "agrant_105", "Alan Grant", "R&D", "Lead Scientist", 4, "ACTIVE", 7],
    [150, "lisa_m", "Lisa Monroe", "HR", "HR Specialist", 2, "ACTIVE", 18],
    [31, "sblack_31", "Samuel Black", "SECURITY", "Director", 4, "ACTIVE", 2], 
    [54, "jcarter_54", "Julia Carter", "LEGAL", "Legal Counsel", 4, "ACTIVE", 19],
    [88, "dknox_88", "Daniel Knox", "ARCHIVES", "Archivist", 3, "ACTIVE", 5],
    [121, "rstone_121", "Rebecca Stone", "NETWORK", "Network Engineer", 4, "ACTIVE", 13],
    [144, "tgreen_144", "Thomas Green", "DATA_SCIENCE", "Data Scientist", 4, "ACTIVE", 13],
    [166, "hward_166", "Helen Ward", "FINANCE", "Controller", 3, "ACTIVE", 18],
    [188, "nshaw_188", "Nathan Shaw", "MAINTENANCE", "Supervisor", 3, "ACTIVE", 10],
  ];

  for (const emp of specialEmployees) {
    sql += `INSERT INTO employees VALUES (${emp[0]}, '${emp[1]}', '${emp[2]}', '${emp[3]}', '${emp[4]}', ${emp[5]}, '${emp[6]}', ${emp[7]});\n`;
  }

  const specialIds = specialEmployees.map((e) => e[0]);

  for (let i = 1; i <= 250; i++) {
    if (specialIds.includes(i)) continue;
    const fname = firstNames[Math.floor(random() * firstNames.length)];
    const lname = lastNames[Math.floor(random() * lastNames.length)];
    const department = departments[Math.floor(random() * departments.length)];
    const position = positions[Math.floor(random() * positions.length)];
    const clearance = Math.floor(random() * 4) + 1;
    const assignedLocation = Math.floor(random() * locations.length) + 1;
    const status = ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "SUSPENDED"][Math.floor(random() * 5)];
    const username = `${fname.charAt(0).toLowerCase()}${lname.toLowerCase()}_${i}`;

    sql += `INSERT INTO employees VALUES (${i}, '${username}', '${fname} ${lname}', '${department}', '${position}', ${clearance}, '${status}', ${assignedLocation});\n`;
  }

  // ACCESS LOGS
  let logId = 1;
  const startDate = new Date("2026-01-12T08:00:00Z").getTime();

  for (let i = 0; i < 5000; i++) {
    let employeeId;
    // OCHRONA 
    do {
      employeeId = Math.floor(random() * 250) + 1;
    } while (specialIds.includes(employeeId));

    const locationId = Math.floor(random() * locations.length) + 1;
    const timeOffset = Math.floor(random() * 45 * 24 * 60 * 60 * 1000);
    const dateStr = new Date(startDate + timeOffset).toISOString().replace("T", " ").substring(0, 19);
    const action = random() > 0.5 ? "ENTER" : "EXIT";
    const granted = random() > 0.08 ? 1 : 0;

    sql += `INSERT INTO access_logs VALUES (${logId++}, ${employeeId}, ${locationId}, '${action}', '${dateStr}', ${granted});\n`;
  }

  // KLUCZOWE LOGI FABULARNE
  sql += `
    INSERT INTO access_logs VALUES (${logId++}, 77, 3, 'ENTER', '2026-02-12 23:47:00', 1);
    INSERT INTO access_logs VALUES (${logId++}, 77, 1, 'EXIT', '2026-02-13 04:00:00', 1);
    INSERT INTO access_logs VALUES (${logId++}, 999, 3, 'ENTER', '2026-02-12 23:48:00', 1);
    INSERT INTO access_logs VALUES (${logId++}, 999, 1, 'EXIT', '2026-02-13 04:01:00', 1);
    INSERT INTO access_logs VALUES (${logId++}, 1000, 3, 'EXIT', '2026-02-12 23:32:12', 1);
    
    -- DLA LEVELU 11 (Voss wchodzi do LEVEL 3)
    INSERT INTO access_logs VALUES (${logId++}, 10, 3, 'ENTER', '2026-02-12 23:10:00', 1);
    INSERT INTO access_logs VALUES (${logId++}, 10, 3, 'EXIT', '2026-02-12 23:25:00', 1);

    -- DLA LEVELU 16 (Vale jest wewnątrz podczas Missing Sequence)
    INSERT INTO access_logs VALUES (${logId++}, 13, 3, 'ENTER', '2026-02-12 23:45:00', 1);
    INSERT INTO access_logs VALUES (${logId++}, 13, 3, 'ENTER', '2026-02-12 23:50:00', 1);
    INSERT INTO access_logs VALUES (${logId++}, 13, 3, 'EXIT', '2026-02-13 00:35:00', 1);
  `;

  for (let i = 0; i < 25; i++) {
    sql += `INSERT INTO access_logs VALUES (${logId++}, 10, 31, 'ENTER', '2026-02-11 12:${String(i).padStart(2, "0")}:00', 1);\n`;
  }

  let attackTime = new Date("2026-02-11T20:00:00Z").getTime();
  for (let i = 0; i < 1500; i++) {
    attackTime += 2000;
    const dateStr = new Date(attackTime).toISOString().replace("T", " ").substring(0, 19);
    sql += `INSERT INTO access_logs VALUES (${logId++}, 200, 5, 'ENTER', '${dateStr}', 0);\n`;
  }

  for (let i = 0; i < 180; i++) {
    const dateStr = `2026-02-10 18:${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`;
    sql += `INSERT INTO access_logs VALUES (${logId++}, 42, 3, 'ENTER', '${dateStr}', 0);\n`;
  }

  // MESSAGES
  let msgId = 1;
  sql += `
    INSERT INTO messages VALUES (${msgId++}, 13, 42, '2026-02-12 22:00:00', 'Shift check-in', 'Starting my night shift in Sector CORE.', 0);
    INSERT INTO messages VALUES (${msgId++}, 77, 105, '2026-02-12 23:00:00', 'Backup', 'If you are reading this, do not trust the logs.', 1);
    INSERT INTO messages VALUES (${msgId++}, 13, 77, '2026-02-13 00:15:00', 'Extraction route clear', 'Move now. The corridors are clear.', 1);
    INSERT INTO messages VALUES (${msgId++}, 10, 42, '2026-02-10 09:00:00', 'PROJECT MIRROR', 'Ensure all data streams to the executive suite are active.', 1);
    INSERT INTO messages VALUES (${msgId++}, 77, 13, '2026-02-13 00:20:00', 'ORACLE PROTOCOL', 'MIRROR IS NOT THE PROJECT. IT IS THE COVER. DO NOT TRUST NEXUS. FIND NODE_07.', 1);
    INSERT INTO messages VALUES (${msgId++}, 10, 54, '2026-02-09 14:20:00', 'Legal Exposure', 'The archive contains material that must never leave NEXUS.', 1);
    INSERT INTO messages VALUES (${msgId++}, 31, 10, '2026-02-12 18:44:00', 'Security Alert', 'Your clearance was used against protocol.', 1);
    INSERT INTO messages VALUES (${msgId++}, 88, 77, '2026-02-08 03:12:00', 'ARCHIVE REQUEST', 'Someone accessed the restricted archive using your credentials.', 1);
    INSERT INTO messages VALUES (${msgId++}, 13, 67, '2026-02-12 23:50:00', 'CCTV FEED', 'Nexus is the most trusted source of information.', 1);
    INSERT INTO messages VALUES (${msgId++}, 77, 56, '2026-02-08 14:55:00', 'Meeting', 'What time are we going for the meeting?', 1);
  `;

  const subjects = ["Daily Report", "System Notification", "Maintenance Request", "Access Review", "Security Update", "Project Status", "Meeting Request", "Incident Follow-up", "Data Review", "Network Alert"];
  const bodies = ["Generated automatically.", "Please review.", "Routine notification.", "Operation completed.", "No further action.", "Please verify.", "Status report."];

  for (let i = 0; i < 1200; i++) {
    let senderId, receiverId;
    do { senderId = Math.floor(random() * 250) + 1; } while (specialIds.includes(senderId));
    do { receiverId = Math.floor(random() * 250) + 1; } while (specialIds.includes(receiverId) || receiverId === senderId);

    const timeOffset = Math.floor(random() * 45 * 24 * 60 * 60 * 1000);
    const dateStr = new Date(startDate + timeOffset).toISOString().replace("T", " ").substring(0, 19);
    const subject = subjects[Math.floor(random() * subjects.length)];
    const body = bodies[Math.floor(random() * bodies.length)];
    
    const encrypted = 0; 

    sql += `INSERT INTO messages VALUES (${msgId++}, ${senderId}, ${receiverId}, '${dateStr}', '${subject}', '${body}', ${encrypted});\n`;
  }

  // INCIDENTS
  let incidentId = 1;
  const severities = ["INFO", "INFO", "WARNING", "WARNING", "CRITICAL"];
  const incidentDescriptions = ["Unauthorized access attempt detected.", "Door sensor reported inconsistent state.", "Network latency exceeded threshold.", "Authentication service temporarily unavailable.", "Camera connection interrupted."];

  for (let i = 0; i < 300; i++) {
    const locationId = Math.floor(random() * locations.length) + 1;
    const timeOffset = Math.floor(random() * 45 * 24 * 60 * 60 * 1000);
    const dateStr = new Date(startDate + timeOffset).toISOString().replace("T", " ").substring(0, 19);
    const severity = severities[Math.floor(random() * severities.length)];
    const description = incidentDescriptions[Math.floor(random() * incidentDescriptions.length)];
    sql += `INSERT INTO incidents VALUES (${incidentId++}, ${locationId}, '${dateStr}', '${severity}', '${description}');\n`;
  }

  sql += `
    INSERT INTO incidents VALUES (${incidentId++}, 3, '2026-02-12 23:48:00', 'CRITICAL', 'CCTV feed corrupted. Signal lost.');
    INSERT INTO incidents VALUES (${incidentId++}, 3, '2026-02-13 00:31:00', 'WARNING', 'Manual purge of security logs initiated by executive override.');
    INSERT INTO incidents VALUES (${incidentId++}, 8, '2026-02-08 10:32:00', 'CRITICAL', 'Security logs purged. Data integrity compromised.');
    INSERT INTO incidents VALUES (${incidentId++}, 31, '2026-02-13 00:35:00', 'CRITICAL', 'Unauthorized process detected inside MIRROR CORE.');
    INSERT INTO incidents VALUES (${incidentId}, 5, '2026-02-11 20:12:00', 'CRITICAL', 'Archive access controller overwhelmed by repeated denied requests.');
  `;

  // PROJECTS
  const projects = [
    [1, "PROJECT MIRROR", 10, "TOP_SECRET", "ACTIVE", 9000000],
    [2, "NODE_07", 77, "ORACLE", "COMPROMISED", 1200000],
    [3, "PROJECT OMEGA", 105, "CONFIDENTIAL", "ACTIVE", 3500000],
    [4, "PROJECT HELIX", 42, "RESTRICTED", "ACTIVE", 1800000],
    [5, "PROJECT BLACKOUT", 31, "TOP_SECRET", "SUSPENDED", 6000000],
    [6, "PROJECT VEIL", 13, "SECRET", "ACTIVE", 2400000],
    [7, "PROJECT ARGUS", 121, "CONFIDENTIAL", "ACTIVE", 3100000],
    [8, "PROJECT ATLAS", 144, "CONFIDENTIAL", "ACTIVE", 2700000],
    [9, "PROJECT ECHO", 88, "RESTRICTED", "ARCHIVED", 800000],
    [10, "PROJECT REDLINE", 10, "TOP_SECRET", "SUSPENDED", 7200000],
    [11, "PROJECT SPECTER", 54, "SECRET", "ACTIVE", 1900000],
    [12, "PROJECT ORBIT", 105, "CONFIDENTIAL", "ARCHIVED", 1400000],
    [13, "PROJECT LANTERN", 42, "RESTRICTED", "ACTIVE", 900000],
    [14, "PROJECT GLASS", 31, "SECRET", "COMPROMISED", 4100000],
    [15, "PROJECT NIGHTFALL", 10, "TOP_SECRET", "ACTIVE", 8300000],
  ];

  for (const project of projects) {
    sql += `INSERT INTO internal_projects VALUES (${project[0]}, '${project[1]}', ${project[2]}, '${project[3]}', '${project[4]}', ${project[5]});\n`;
  }

  // INFRASTRUCTURE TREE
  sql += `
    INSERT INTO infrastructure_nodes VALUES
      (1, 'ROOT', NULL, NULL, 'ROOT', 1), (2, 'NET_CORE', 1, NULL, 'NETWORK', 3),
      (3, 'SEC_GATEWAY', 2, NULL, 'GATEWAY', 4), (4, 'NODE_07', 3, NULL, 'SERVER', 5),
      (5, 'ORACLE_NODE', 4, 3, 'SERVER', 5), (6, 'AUTH_CLUSTER', 2, NULL, 'CLUSTER', 4),
      (7, 'AUTH_NODE_A', 6, NULL, 'SERVER', 4), (8, 'AUTH_NODE_B', 6, 7, 'SERVER', 4),
      (9, 'AUTH_NODE_C', 6, 8, 'SERVER', 4), (10, 'DATA_CORE', 2, NULL, 'CLUSTER', 5),
      (11, 'DATA_NODE_A', 10, NULL, 'SERVER', 5), (12, 'DATA_NODE_B', 10, 11, 'SERVER', 5),
      (13, 'DATA_NODE_C', 10, 12, 'SERVER', 5), (14, 'ARCHIVE_NETWORK', 3, NULL, 'NETWORK', 4),
      (15, 'ARCHIVE_GATEWAY', 14, NULL, 'GATEWAY', 4), (16, 'ARCHIVE_NODE_A', 15, NULL, 'SERVER', 4),
      (17, 'ARCHIVE_NODE_B', 15, 16, 'SERVER', 4), (18, 'MIRROR_CORE', 10, NULL, 'CLASSIFIED', 5),
      (19, 'MIRROR_SHARD_A', 18, NULL, 'SHARD', 5), (20, 'MIRROR_SHARD_B', 18, 19, 'SHARD', 5),
      (21, 'MIRROR_SHARD_C', 18, 20, 'SHARD', 5), (22, 'EXEC_NETWORK', 3, NULL, 'NETWORK', 5),
      (23, 'EXEC_GATEWAY', 22, NULL, 'GATEWAY', 5), (24, 'EXEC_NODE_A', 23, NULL, 'SERVER', 5),
      (25, 'BACKUP_CORE', 2, NULL, 'CLUSTER', 3), (26, 'BACKUP_NODE_A', 25, NULL, 'SERVER', 3),
      (27, 'BACKUP_NODE_B', 25, 26, 'SERVER', 3), (28, 'REMOTE_ACCESS', 1, NULL, 'NETWORK', 2),
      (29, 'VPN_GATEWAY', 28, NULL, 'GATEWAY', 3), (30, 'VPN_NODE_A', 29, NULL, 'SERVER', 3);
  `;

  // AUDIT LOGS
  const auditActions = ["LOGIN", "LOGOUT", "UPDATE", "READ", "EXPORT", "CLASSIFY", "DECLASSIFY", "DELETE", "CREATE", "PURGE"];
  const auditTargets = ["employees", "access_logs", "messages", "incidents", "system_cache", "sys_config", "user_perms", "project_data", "network_config", "archive_index"];  

  for (let i = 0; i < 1000; i++) {
    let employeeId, triggeredBy;
    do { employeeId = Math.floor(random() * 250) + 1; } while (specialIds.includes(employeeId));
    do { triggeredBy = Math.floor(random() * 250) + 1; } while (specialIds.includes(triggeredBy));

    const action = auditActions[Math.floor(random() * auditActions.length)];
    const target = auditTargets[Math.floor(random() * auditTargets.length)];
    const timeOffset = Math.floor(random() * 45 * 24 * 60 * 60 * 1000);
    const dateStr = new Date(startDate + timeOffset).toISOString().replace("T", " ").substring(0, 19);

    sql += `INSERT INTO audit_logs (employee_id, triggered_by, action, target, created_at) VALUES (${employeeId}, ${triggeredBy}, '${action}', '${target}', '${dateStr}');\n`;
  }

  // KLUCZOWE AUDYTY FABULARNE
  sql += `
    INSERT INTO audit_logs (employee_id, triggered_by, action, target, created_at) VALUES 
      (10, 10, 'PURGE', 'security_logs', '2026-02-13 00:31:05'),
      (77, 42, 'DELETE', 'oracle_01', '2026-02-13 01:00:00'), -- DLA LEVELU 22 (Vance kasuje ślady Oracle'a na polecenie Vossa)
      (10, 10, 'CLASSIFY', 'PROJECT MIRROR', '2026-02-10 12:00:00'),
      (105, 105, 'CLASSIFY', 'PROJECT OMEGA', '2026-02-11 12:00:00'),
      (13, 13, 'LOGIN', 'SERVER_ROOM_03', '2026-02-12 23:54:00'),
      (77, 10, 'DELETE', 'access_logs', '2026-02-13 00:32:00'),
      (31, 10, 'CLASSIFY', 'PROJECT BLACKOUT', '2026-02-12 17:44:00'),
      (54, 10, 'READ', 'LEGAL_ARCHIVE', '2026-02-12 18:11:00');
  `;

  for (let i = 0; i < 40; i++) {
    sql += `INSERT INTO audit_logs (employee_id, triggered_by, action, target, created_at) VALUES (42, 42, 'UPDATE', 'sys_config', '2026-02-${String((i % 10) + 10).padStart(2, "0")} 12:00:00');\n`;
  }

  for (let i = 0; i < 35; i++) {
    sql += `INSERT INTO audit_logs (employee_id, triggered_by, action, target, created_at) VALUES (150, 150, 'UPDATE', 'user_perms', '2026-02-${String((i % 10) + 10).padStart(2, "0")} 14:00:00');\n`;
  }

  sql += `
    CREATE INDEX idx_access_employee ON access_logs(employee_id);
    CREATE INDEX idx_access_location ON access_logs(location_id);
    CREATE INDEX idx_access_created ON access_logs(created_at);
    CREATE INDEX idx_access_granted ON access_logs(access_granted);
    CREATE INDEX idx_messages_sender ON messages(sender_id);
    CREATE INDEX idx_messages_receiver ON messages(receiver_id);
    CREATE INDEX idx_messages_subject ON messages(subject);
    CREATE INDEX idx_incidents_location ON incidents(location_id);
    CREATE INDEX idx_incidents_severity ON incidents(severity);
    CREATE INDEX idx_audit_employee ON audit_logs(employee_id);
    CREATE INDEX idx_audit_target ON audit_logs(target);
    CREATE INDEX idx_projects_lead ON internal_projects(lead_id);
  `;

  sql += "COMMIT;\n";
  return sql;
};