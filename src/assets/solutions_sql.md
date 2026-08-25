# NEXUS_OS // QUERY_PROTOCOL
# CLASSIFIED: MASTER SOLUTIONS CHEAT SHEET (LVL 1-30)

## AKT I — THE DISAPPEARANCE
**LVL 1:**
`SELECT full_name, status FROM employees WHERE username = 'oracle_01';`

**LVL 2:**
`SELECT name, sector FROM locations WHERE id = 3;`

**LVL 3:**
`SELECT action_type, location_id FROM access_logs WHERE location_id = 3 AND action_type = 'ENTER' AND created_at BETWEEN '2026-02-12 23:00:00' AND '2026-02-12 23:59:59';`

**LVL 4:**
`SELECT description FROM incidents WHERE location_id = 3 AND severity = 'CRITICAL';`

**LVL 5:**
`SELECT full_name FROM employees WHERE department = 'SECURITY' AND clearance_level = 5;`

## AKT II — SOMEONE IS LYING
**LVL 6:**
`SELECT body FROM messages WHERE sender_id = (SELECT id FROM employees WHERE full_name = 'Martin Vale') AND body LIKE '%shift%';`

**LVL 7:**
`SELECT body FROM messages WHERE sender_id = 77 AND body LIKE '%trust%';`

**LVL 8:**
`SELECT employee_id FROM access_logs WHERE location_id = 3 AND action_type = 'ENTER' AND created_at LIKE '2026-02-12%' INTERSECT SELECT sender_id FROM messages;`

**LVL 9:**
`SELECT employee_id FROM access_logs WHERE access_granted = 0 EXCEPT SELECT employee_id FROM access_logs WHERE access_granted = 1;`

**LVL 10:**
`SELECT employee_id FROM access_logs WHERE access_granted = 0 GROUP BY employee_id ORDER BY COUNT(*) DESC LIMIT 1;`

## AKT III — THE MIRROR
**LVL 11:**
`SELECT employee_id FROM access_logs WHERE location_id = 3 AND created_at LIKE '2026-02-12%' GROUP BY employee_id HAVING COUNT(*) > 1;`

**LVL 12:**
`SELECT e.full_name FROM employees e JOIN audit_logs a ON e.id = a.employee_id WHERE a.action = 'PURGE';`

**LVL 13:**
`SELECT full_name FROM employees WHERE department = 'SECURITY' AND id IN (SELECT employee_id FROM access_logs WHERE location_id = 3 AND created_at BETWEEN '2026-02-12 23:47:00' AND '2026-02-13 00:31:00');`

**LVL 14:**
`SELECT subject FROM messages WHERE sender_id = 13 AND receiver_id = 77 AND is_encrypted = 1;`

**LVL 15:**
`SELECT s.full_name AS sender, r.full_name AS receiver FROM messages m JOIN employees s ON m.sender_id = s.id JOIN employees r ON m.receiver_id = r.id WHERE m.subject = 'PROJECT MIRROR' AND EXISTS (SELECT 1 FROM incidents i WHERE i.location_id = 3 AND i.severity = 'WARNING');`

## AKT IV — ORACLE'S LAST QUERY
**LVL 16:**
`SELECT e.full_name FROM employees e JOIN access_logs a ON e.id = a.employee_id WHERE a.location_id = 3 AND a.created_at >= '2026-02-12 00:00:00' AND a.created_at <= '2026-02-13 23:59:59' GROUP BY e.id HAVING MIN(a.created_at) <= '2026-02-12 23:47:00' AND MAX(a.created_at) >= '2026-02-13 00:31:00';`

**LVL 17:**
`SELECT project_code FROM internal_projects EXCEPT SELECT target FROM audit_logs;`

**LVL 18:**
`WITH RECURSIVE node_path AS (SELECT id, node_name, parent_id FROM infrastructure_nodes WHERE node_name = 'NODE_07' UNION ALL SELECT n.id, n.node_name, n.parent_id FROM infrastructure_nodes n JOIN node_path p ON n.id = p.parent_id) SELECT node_name FROM node_path;`

**LVL 19:**
`SELECT id FROM infrastructure_nodes EXCEPT SELECT parent_id FROM infrastructure_nodes WHERE parent_id IS NOT NULL;`

**LVL 20:**
`SELECT triggered_by FROM audit_logs INTERSECT SELECT employee_id FROM access_logs WHERE location_id = 3 AND action_type = 'ENTER' EXCEPT SELECT employee_id FROM access_logs WHERE access_granted = 0;`

**LVL 21:**
`CREATE TRIGGER ghost_tracker AFTER DELETE ON messages BEGIN INSERT INTO audit_logs (employee_id, triggered_by, action, target, created_at) VALUES (OLD.sender_id, OLD.sender_id, 'DELETE_MSG', OLD.subject, datetime('now')); END;`

**LVL 22:**
`WITH top_hackers AS (SELECT employee_id FROM access_logs WHERE access_granted = 0 GROUP BY employee_id ORDER BY COUNT(*) DESC LIMIT 3) SELECT e.full_name FROM employees e JOIN audit_logs a ON e.id = a.triggered_by WHERE a.target = 'oracle_01' AND a.action = 'DELETE' AND e.id IN (SELECT employee_id FROM top_hackers);`

**LVL 23:**
`SELECT subject FROM messages WHERE is_encrypted = 1 EXCEPT SELECT m.subject FROM messages m JOIN employees e ON m.sender_id = e.id WHERE e.department = 'EXECUTIVE' EXCEPT SELECT m.subject FROM messages m JOIN employees e ON m.receiver_id = e.id WHERE e.department = 'IT_OPS';`

**LVL 24:**
`WITH RECURSIVE bloodline AS (SELECT id, node_name, parent_id FROM infrastructure_nodes WHERE node_name = 'ORACLE_NODE' UNION ALL SELECT n.id, n.node_name, n.parent_id FROM infrastructure_nodes n JOIN bloodline b ON n.id = b.parent_id OR n.id = b.linked_sibling_id) SELECT node_name FROM bloodline;`

**LVL 25:**
`SELECT e.full_name FROM messages m JOIN employees e ON m.sender_id = e.id WHERE m.subject = 'PROJECT MIRROR' AND e.clearance_level = 5 AND NOT EXISTS (SELECT 1 FROM access_logs a WHERE a.employee_id = e.id AND a.access_granted = 0);`

## AKT V — THE TRUTH
**LVL 26:**
`WITH OracleLogs AS (SELECT COUNT(*) as total_logs FROM access_logs a JOIN employees e ON a.employee_id = e.id WHERE e.username = 'oracle_01') SELECT e.username FROM employees e JOIN access_logs a ON e.id = a.employee_id WHERE e.username != 'oracle_01' GROUP BY e.username HAVING COUNT(*) = (SELECT total_logs FROM OracleLogs);`

**LVL 27:**
`SELECT full_name FROM (SELECT e.full_name, RANK() OVER (ORDER BY COUNT(*) DESC) as access_rank FROM employees e JOIN access_logs a ON e.id = a.employee_id WHERE a.location_id = (SELECT id FROM locations WHERE name = 'MIRROR_CORE') GROUP BY e.id) WHERE access_rank = 1;`

**LVL 28:**
`WITH stats AS (SELECT employee_id, COUNT(*) as op_count FROM audit_logs GROUP BY employee_id), avg_stats AS (SELECT AVG(op_count) as avg_op FROM stats) SELECT e.username FROM employees e JOIN stats s ON e.id = s.employee_id, avg_stats a ORDER BY ABS(s.op_count - a.avg_op) DESC LIMIT 1;` 

`WITH Amount AS (SELECT employee_id, COUNT(*) AS log_count FROM audit_logs GROUP BY employee_id), AvgAmount AS (SELECT AVG(log_count) AS avg_count FROM Amount) SELECT e.username FROM Amount a JOIN employees e ON a.employee_id = e.idCROSS JOIN AvgAmount aa ORDER BY ABS(a.log_count - aa.avg_count) DESC LIMIT 1;` 

**LVL 29:**
`WITH oracle_logs AS (SELECT a.location_id, ROW_NUMBER() OVER (ORDER BY a.created_at DESC) as rn FROM access_logs a JOIN employees e ON a.employee_id = e.id WHERE e.username = 'oracle_01') SELECT l.name FROM oracle_logs o JOIN locations l ON o.location_id = l.id WHERE o.rn = 2;`

**LVL 30:**
`SELECT (SELECT full_name FROM employees WHERE id = 77) AS full_name, (SELECT node_name FROM infrastructure_nodes WHERE node_name = 'NODE_07') AS node_name, (SELECT full_name FROM employees WHERE pos = 'CTO') AS controller;`