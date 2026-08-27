export interface Evidence {
  id: string;
  title: string;
  type: string;
  sourceLevel: number;
  description: string;
  storyDescription: string;
  imagePath: string;
}

export const EVIDENCE_DB: Record<string, Evidence> = {
  "EVD_ORACLE_LAB_LOC": {
    id: "EVD_ORACLE_LAB_LOC",
    title: "SERVER ROOM 03 SCHEMATIC",
    type: "BLUEPRINT",
    sourceLevel: 2,
    description: "Map of the Core Sector indicating Oracle's workspace.",
    storyDescription: "Workspace assignment confirms ORACLE operated directly from SERVER_ROOM_03. This is a highly restricted zone. Why would the Chief Security Architect isolate himself down here instead of the Executive floors?",
    imagePath: "/assets/evidence/evidence_01.png"
  },
  "EVD_SERVER_LOG_CONTRADICTION": {
    id: "EVD_SERVER_LOG_CONTRADICTION",
    title: "ACCESS LOG CONTRADICTION",
    type: "SYSTEM LOG",
    sourceLevel: 3,
    description: "Discrepancy found in physical access vs system logs.",
    storyDescription: "The official report says ORACLE left the building. But the physical door logs prove someone entered his lab late at night and never triggered the exit sensors. The official narrative is a lie.",
    imagePath: "/assets/evidence/evidence_02.png"
  },
  "EVD_GHOST_PROFILE": {
    id: "EVD_GHOST_PROFILE",
    title: "MARTIN VALE PROFILE",
    type: "PERSONNEL FILE",
    sourceLevel: 5,
    description: "Security clearance level 5 personnel file.",
    storyDescription: "Martin Vale. High-level security operative. His credentials were used near the lab around the time of the disappearance. He has the clearance to bypass the cameras, but does he have the motive?",
    imagePath: "/assets/evidence/evidence_03.png"
  },
  "EVD_ECHO_DOC": {
    id: "EVD_ECHO_DOC",
    title: "ORACLE'S WARNING",
    type: "ENCRYPTED MESSAGE",
    sourceLevel: 7,
    description: "A hidden message fragment found in the database.",
    storyDescription: "«If you are reading this, do not trust the logs.»\n\nORACLE knew they were coming for him. He intentionally left breadcrumbs in the database structure itself. He knew someone like me would look.",
    imagePath: "/assets/evidence/evidence_04.png"
  },
  "EVD_ARCHIVE_LOG": {
    id: "EVD_ARCHIVE_LOG",
    title: "THE SMOKESCREEN",
    type: "TRAFFIC ANALYSIS",
    sourceLevel: 9,
    description: "Analysis of failed authentication attempts.",
    storyDescription: "Hundreds of failed login attempts from a single ghost terminal. It's a classic smokescreen. Someone generated a massive amount of noise in the access logs to hide a single, surgical entry into the server room.",
    imagePath: "/assets/evidence/evidence_05.png"
  },
  "EVD_EXECUTIVE_PURGE": {
    id: "EVD_EXECUTIVE_PURGE",
    title: "EXECUTIVE PURGE ORDER",
    type: "AUDIT TRAIL",
    sourceLevel: 12,
    description: "Record of a manual deletion of security logs.",
    storyDescription: "Elias Voss. CTO of Nexus and ORACLE's own brother. Elias used his executive override to manually purge the security logs from the night of the incident. This isn't just a cover-up; it's a family betrayal.",
    imagePath: "/assets/evidence/evidence_06.png"
  },
  "EVD_CCTV_ALPHA": {
    id: "EVD_CCTV_ALPHA",
    title: "EXTRACTION ROUTE",
    type: "COMMUNICATION INTERCEPT",
    sourceLevel: 14,
    description: "Message intercept between Vale and ORACLE.",
    storyDescription: "«Extraction route clear.»\n\nMartin Vale wasn't hunting ORACLE. He was helping him escape. The security operative smuggled the Architect out right under the Executive board's noses.",
    imagePath: "/assets/evidence/evidence_07.png"
  },
  "EVD_DEAD_MAN": {
    id: "EVD_DEAD_MAN",
    title: "PROJECT MIRROR EXPOSED",
    type: "CLASSIFIED MEMO",
    sourceLevel: 15,
    description: "Intercepted communication confirming Project Mirror.",
    storyDescription: "PROJECT MIRROR. An unsanctioned, highly illegal data-harvesting operation run by Elias Voss. ORACLE found out about it and was about to blow the whistle. That's why he had to disappear.",
    imagePath: "/assets/evidence/evidence_08.png"
  },
  "EVD_NODE_07": {
    id: "EVD_NODE_07",
    title: "NODE 07 ARCHITECTURE",
    type: "NETWORK DIAGRAM",
    sourceLevel: 18,
    description: "Map of the hidden infrastructure node.",
    storyDescription: "A completely off-the-books server cluster buried deep within the Nexus network topology. This is where PROJECT MIRROR lives. This is the beating heart of the conspiracy.",
    imagePath: "/assets/evidence/evidence_09.png"
  },
  "EVD_AUDIT_TRAIL": {
    id: "EVD_AUDIT_TRAIL",
    title: "THE TRIGGER TRAP",
    type: "DATABASE TRIGGER LOG",
    sourceLevel: 21,
    description: "Results of the manual trigger injection.",
    storyDescription: "The trap worked. We caught the executives actively trying to delete references to ORACLE in real-time. We now have undeniable proof of evidence tampering at the highest level.",
    imagePath: "/assets/evidence/evidence_10.png"
  },
  "EVD_FINAL_PROTOCOL": {
    id: "EVD_FINAL_PROTOCOL",
    title: "ORACLE'S KEY",
    type: "DECRYPTED PAYLOAD",
    sourceLevel: 30,
    description: "The final piece of the puzzle.",
    storyDescription: "I have it. The exact parameters needed to shut down Project Mirror and expose Elias Voss. ORACLE didn't just leave a trail; he left a weapon. Now I just need to pull the trigger.",
    imagePath: "/assets/evidence/evidence_11.png"
  }
};