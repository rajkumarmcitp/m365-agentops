INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-001'
FROM m365_control_catalog WHERE control_id = 'TG-ID-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-ID-001'
FROM m365_control_catalog WHERE control_id = 'TG-ID-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-ID-002'
FROM m365_control_catalog WHERE control_id = 'TG-ID-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-ID-002'
FROM m365_control_catalog WHERE control_id = 'TG-ID-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ID-002'
FROM m365_control_catalog WHERE control_id = 'TG-ID-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-ID-003'
FROM m365_control_catalog WHERE control_id = 'TG-ID-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-ID-003'
FROM m365_control_catalog WHERE control_id = 'TG-ID-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-ID-004'
FROM m365_control_catalog WHERE control_id = 'TG-ID-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-ID-004'
FROM m365_control_catalog WHERE control_id = 'TG-ID-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-ID-005'
FROM m365_control_catalog WHERE control_id = 'TG-ID-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-ID-005'
FROM m365_control_catalog WHERE control_id = 'TG-ID-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-ID-005'
FROM m365_control_catalog WHERE control_id = 'TG-ID-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-ID-006'
FROM m365_control_catalog WHERE control_id = 'TG-ID-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-ID-006'
FROM m365_control_catalog WHERE control_id = 'TG-ID-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ID-006'
FROM m365_control_catalog WHERE control_id = 'TG-ID-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-ID-007'
FROM m365_control_catalog WHERE control_id = 'TG-ID-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-ID-007'
FROM m365_control_catalog WHERE control_id = 'TG-ID-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-ID-007'
FROM m365_control_catalog WHERE control_id = 'TG-ID-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-ID-008'
FROM m365_control_catalog WHERE control_id = 'TG-ID-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-ID-008'
FROM m365_control_catalog WHERE control_id = 'TG-ID-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ID-009'
FROM m365_control_catalog WHERE control_id = 'TG-ID-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-ID-009'
FROM m365_control_catalog WHERE control_id = 'TG-ID-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-009'
FROM m365_control_catalog WHERE control_id = 'TG-ID-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-ID-010'
FROM m365_control_catalog WHERE control_id = 'TG-ID-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-010'
FROM m365_control_catalog WHERE control_id = 'TG-ID-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-ID-011'
FROM m365_control_catalog WHERE control_id = 'TG-ID-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-ID-011'
FROM m365_control_catalog WHERE control_id = 'TG-ID-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-ID-012'
FROM m365_control_catalog WHERE control_id = 'TG-ID-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-ID-012'
FROM m365_control_catalog WHERE control_id = 'TG-ID-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-ID-012'
FROM m365_control_catalog WHERE control_id = 'TG-ID-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-ID-012'
FROM m365_control_catalog WHERE control_id = 'TG-ID-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-ID-013'
FROM m365_control_catalog WHERE control_id = 'TG-ID-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ID-013'
FROM m365_control_catalog WHERE control_id = 'TG-ID-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-ID-013'
FROM m365_control_catalog WHERE control_id = 'TG-ID-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-ID-014'
FROM m365_control_catalog WHERE control_id = 'TG-ID-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ID-014'
FROM m365_control_catalog WHERE control_id = 'TG-ID-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Secondary', 'Mapping from TG-ID-014'
FROM m365_control_catalog WHERE control_id = 'TG-ID-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-ID-014'
FROM m365_control_catalog WHERE control_id = 'TG-ID-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-ID-015'
FROM m365_control_catalog WHERE control_id = 'TG-ID-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-ID-015'
FROM m365_control_catalog WHERE control_id = 'TG-ID-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-ID-016'
FROM m365_control_catalog WHERE control_id = 'TG-ID-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-ID-016'
FROM m365_control_catalog WHERE control_id = 'TG-ID-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-ID-016'
FROM m365_control_catalog WHERE control_id = 'TG-ID-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-ID-016'
FROM m365_control_catalog WHERE control_id = 'TG-ID-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-ID-017'
FROM m365_control_catalog WHERE control_id = 'TG-ID-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-017'
FROM m365_control_catalog WHERE control_id = 'TG-ID-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ID-018'
FROM m365_control_catalog WHERE control_id = 'TG-ID-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-ID-018'
FROM m365_control_catalog WHERE control_id = 'TG-ID-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-018'
FROM m365_control_catalog WHERE control_id = 'TG-ID-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-ID-019'
FROM m365_control_catalog WHERE control_id = 'TG-ID-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-ID-019'
FROM m365_control_catalog WHERE control_id = 'TG-ID-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-020'
FROM m365_control_catalog WHERE control_id = 'TG-ID-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-ID-020'
FROM m365_control_catalog WHERE control_id = 'TG-ID-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-ID-021'
FROM m365_control_catalog WHERE control_id = 'TG-ID-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-ID-021'
FROM m365_control_catalog WHERE control_id = 'TG-ID-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-ID-021'
FROM m365_control_catalog WHERE control_id = 'TG-ID-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-ID-022'
FROM m365_control_catalog WHERE control_id = 'TG-ID-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-ID-022'
FROM m365_control_catalog WHERE control_id = 'TG-ID-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-ID-022'
FROM m365_control_catalog WHERE control_id = 'TG-ID-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-ID-023'
FROM m365_control_catalog WHERE control_id = 'TG-ID-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-ID-023'
FROM m365_control_catalog WHERE control_id = 'TG-ID-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-ID-023'
FROM m365_control_catalog WHERE control_id = 'TG-ID-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-ID-024'
FROM m365_control_catalog WHERE control_id = 'TG-ID-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-ID-024'
FROM m365_control_catalog WHERE control_id = 'TG-ID-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-ID-025'
FROM m365_control_catalog WHERE control_id = 'TG-ID-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-ID-025'
FROM m365_control_catalog WHERE control_id = 'TG-ID-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-ID-026'
FROM m365_control_catalog WHERE control_id = 'TG-ID-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-ID-026'
FROM m365_control_catalog WHERE control_id = 'TG-ID-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-ID-026'
FROM m365_control_catalog WHERE control_id = 'TG-ID-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-ID-027'
FROM m365_control_catalog WHERE control_id = 'TG-ID-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ID-027'
FROM m365_control_catalog WHERE control_id = 'TG-ID-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ID-028'
FROM m365_control_catalog WHERE control_id = 'TG-ID-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-ID-028'
FROM m365_control_catalog WHERE control_id = 'TG-ID-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-ID-029'
FROM m365_control_catalog WHERE control_id = 'TG-ID-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ID-030'
FROM m365_control_catalog WHERE control_id = 'TG-ID-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-ID-031'
FROM m365_control_catalog WHERE control_id = 'TG-ID-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-ID-031'
FROM m365_control_catalog WHERE control_id = 'TG-ID-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ID-032'
FROM m365_control_catalog WHERE control_id = 'TG-ID-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-032'
FROM m365_control_catalog WHERE control_id = 'TG-ID-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-ID-033'
FROM m365_control_catalog WHERE control_id = 'TG-ID-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-033'
FROM m365_control_catalog WHERE control_id = 'TG-ID-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-ID-034'
FROM m365_control_catalog WHERE control_id = 'TG-ID-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-ID-034'
FROM m365_control_catalog WHERE control_id = 'TG-ID-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ID-034'
FROM m365_control_catalog WHERE control_id = 'TG-ID-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-ID-035'
FROM m365_control_catalog WHERE control_id = 'TG-ID-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-ID-035'
FROM m365_control_catalog WHERE control_id = 'TG-ID-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-ID-036'
FROM m365_control_catalog WHERE control_id = 'TG-ID-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-036'
FROM m365_control_catalog WHERE control_id = 'TG-ID-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-ID-037'
FROM m365_control_catalog WHERE control_id = 'TG-ID-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-ID-037'
FROM m365_control_catalog WHERE control_id = 'TG-ID-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Secondary', 'Mapping from TG-ID-037'
FROM m365_control_catalog WHERE control_id = 'TG-ID-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-ID-038'
FROM m365_control_catalog WHERE control_id = 'TG-ID-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-ID-038'
FROM m365_control_catalog WHERE control_id = 'TG-ID-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-ID-038'
FROM m365_control_catalog WHERE control_id = 'TG-ID-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-ID-039'
FROM m365_control_catalog WHERE control_id = 'TG-ID-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-ID-039'
FROM m365_control_catalog WHERE control_id = 'TG-ID-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-ID-040'
FROM m365_control_catalog WHERE control_id = 'TG-ID-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-ID-040'
FROM m365_control_catalog WHERE control_id = 'TG-ID-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-ID-040'
FROM m365_control_catalog WHERE control_id = 'TG-ID-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-ID-041'
FROM m365_control_catalog WHERE control_id = 'TG-ID-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-ID-041'
FROM m365_control_catalog WHERE control_id = 'TG-ID-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-ID-042'
FROM m365_control_catalog WHERE control_id = 'TG-ID-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-ID-042'
FROM m365_control_catalog WHERE control_id = 'TG-ID-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-042'
FROM m365_control_catalog WHERE control_id = 'TG-ID-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-ID-043'
FROM m365_control_catalog WHERE control_id = 'TG-ID-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-ID-043'
FROM m365_control_catalog WHERE control_id = 'TG-ID-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-ID-044'
FROM m365_control_catalog WHERE control_id = 'TG-ID-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-ID-044'
FROM m365_control_catalog WHERE control_id = 'TG-ID-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-ID-045'
FROM m365_control_catalog WHERE control_id = 'TG-ID-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-ID-045'
FROM m365_control_catalog WHERE control_id = 'TG-ID-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-045'
FROM m365_control_catalog WHERE control_id = 'TG-ID-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-ID-046'
FROM m365_control_catalog WHERE control_id = 'TG-ID-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-ID-046'
FROM m365_control_catalog WHERE control_id = 'TG-ID-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-ID-046'
FROM m365_control_catalog WHERE control_id = 'TG-ID-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ID-046'
FROM m365_control_catalog WHERE control_id = 'TG-ID-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-ID-047'
FROM m365_control_catalog WHERE control_id = 'TG-ID-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Secondary', 'Mapping from TG-ID-047'
FROM m365_control_catalog WHERE control_id = 'TG-ID-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-ID-048'
FROM m365_control_catalog WHERE control_id = 'TG-ID-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-ID-048'
FROM m365_control_catalog WHERE control_id = 'TG-ID-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-ID-049'
FROM m365_control_catalog WHERE control_id = 'TG-ID-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-ID-049'
FROM m365_control_catalog WHERE control_id = 'TG-ID-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-ID-049'
FROM m365_control_catalog WHERE control_id = 'TG-ID-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-ID-049'
FROM m365_control_catalog WHERE control_id = 'TG-ID-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-050'
FROM m365_control_catalog WHERE control_id = 'TG-ID-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-ID-050'
FROM m365_control_catalog WHERE control_id = 'TG-ID-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-ID-050'
FROM m365_control_catalog WHERE control_id = 'TG-ID-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-ID-051'
FROM m365_control_catalog WHERE control_id = 'TG-ID-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-ID-051'
FROM m365_control_catalog WHERE control_id = 'TG-ID-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ID-052'
FROM m365_control_catalog WHERE control_id = 'TG-ID-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-ID-052'
FROM m365_control_catalog WHERE control_id = 'TG-ID-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-ID-053'
FROM m365_control_catalog WHERE control_id = 'TG-ID-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-053'
FROM m365_control_catalog WHERE control_id = 'TG-ID-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-ID-053'
FROM m365_control_catalog WHERE control_id = 'TG-ID-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-ID-054'
FROM m365_control_catalog WHERE control_id = 'TG-ID-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-ID-054'
FROM m365_control_catalog WHERE control_id = 'TG-ID-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-ID-054'
FROM m365_control_catalog WHERE control_id = 'TG-ID-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-ID-055'
FROM m365_control_catalog WHERE control_id = 'TG-ID-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-ID-055'
FROM m365_control_catalog WHERE control_id = 'TG-ID-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-ID-056'
FROM m365_control_catalog WHERE control_id = 'TG-ID-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-ID-056'
FROM m365_control_catalog WHERE control_id = 'TG-ID-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-ID-056'
FROM m365_control_catalog WHERE control_id = 'TG-ID-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ID-057'
FROM m365_control_catalog WHERE control_id = 'TG-ID-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-ID-057'
FROM m365_control_catalog WHERE control_id = 'TG-ID-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-ID-057'
FROM m365_control_catalog WHERE control_id = 'TG-ID-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-058'
FROM m365_control_catalog WHERE control_id = 'TG-ID-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-ID-058'
FROM m365_control_catalog WHERE control_id = 'TG-ID-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-ID-058'
FROM m365_control_catalog WHERE control_id = 'TG-ID-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-ID-059'
FROM m365_control_catalog WHERE control_id = 'TG-ID-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-ID-059'
FROM m365_control_catalog WHERE control_id = 'TG-ID-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-ID-060'
FROM m365_control_catalog WHERE control_id = 'TG-ID-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-ID-060'
FROM m365_control_catalog WHERE control_id = 'TG-ID-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ID-060'
FROM m365_control_catalog WHERE control_id = 'TG-ID-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Secondary', 'Mapping from TG-ID-061'
FROM m365_control_catalog WHERE control_id = 'TG-ID-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-ID-061'
FROM m365_control_catalog WHERE control_id = 'TG-ID-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-ID-061'
FROM m365_control_catalog WHERE control_id = 'TG-ID-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-061'
FROM m365_control_catalog WHERE control_id = 'TG-ID-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-ID-062'
FROM m365_control_catalog WHERE control_id = 'TG-ID-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ID-062'
FROM m365_control_catalog WHERE control_id = 'TG-ID-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ID-063'
FROM m365_control_catalog WHERE control_id = 'TG-ID-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-ID-063'
FROM m365_control_catalog WHERE control_id = 'TG-ID-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-ID-063'
FROM m365_control_catalog WHERE control_id = 'TG-ID-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-ID-064'
FROM m365_control_catalog WHERE control_id = 'TG-ID-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-ID-064'
FROM m365_control_catalog WHERE control_id = 'TG-ID-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-ID-064'
FROM m365_control_catalog WHERE control_id = 'TG-ID-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-ID-065'
FROM m365_control_catalog WHERE control_id = 'TG-ID-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-ID-065'
FROM m365_control_catalog WHERE control_id = 'TG-ID-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-ID-065'
FROM m365_control_catalog WHERE control_id = 'TG-ID-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-ID-066'
FROM m365_control_catalog WHERE control_id = 'TG-ID-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-ID-066'
FROM m365_control_catalog WHERE control_id = 'TG-ID-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-066'
FROM m365_control_catalog WHERE control_id = 'TG-ID-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ID-067'
FROM m365_control_catalog WHERE control_id = 'TG-ID-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-ID-067'
FROM m365_control_catalog WHERE control_id = 'TG-ID-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-ID-067'
FROM m365_control_catalog WHERE control_id = 'TG-ID-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-ID-068'
FROM m365_control_catalog WHERE control_id = 'TG-ID-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-ID-068'
FROM m365_control_catalog WHERE control_id = 'TG-ID-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-ID-068'
FROM m365_control_catalog WHERE control_id = 'TG-ID-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ID-069'
FROM m365_control_catalog WHERE control_id = 'TG-ID-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-ID-069'
FROM m365_control_catalog WHERE control_id = 'TG-ID-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-ID-070'
FROM m365_control_catalog WHERE control_id = 'TG-ID-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-ID-070'
FROM m365_control_catalog WHERE control_id = 'TG-ID-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AUTH-001'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Secondary', 'Mapping from TG-AUTH-001'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-AUTH-002'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AUTH-002'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-AUTH-003'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-AUTH-003'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-AUTH-003'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AUTH-003'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-AUTH-004'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-AUTH-004'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-AUTH-005'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-AUTH-005'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-AUTH-006'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-AUTH-006'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-AUTH-007'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-AUTH-007'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-AUTH-007'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AUTH-008'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-AUTH-008'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-AUTH-009'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-AUTH-009'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Secondary', 'Mapping from TG-AUTH-009'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-AUTH-009'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-AUTH-010'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-AUTH-010'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-AUTH-011'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-AUTH-011'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-AUTH-011'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-AUTH-012'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-AUTH-012'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Secondary', 'Mapping from TG-AUTH-012'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-AUTH-013'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-AUTH-013'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-AUTH-013'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AUTH-014'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-AUTH-014'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-AUTH-014'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-AUTH-014'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-AUTH-015'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-AUTH-015'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-AUTH-015'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-AUTH-015'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-AUTH-016'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-AUTH-016'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-AUTH-017'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-AUTH-018'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-AUTH-018'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-AUTH-019'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-AUTH-019'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-AUTH-020'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-AUTH-020'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-AUTH-020'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-AUTH-021'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-AUTH-022'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-AUTH-022'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-AUTH-023'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-AUTH-023'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-AUTH-023'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-AUTH-024'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AUTH-024'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-AUTH-025'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-AUTH-025'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-AUTH-026'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-AUTH-026'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-AUTH-026'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-AUTH-027'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-AUTH-027'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-AUTH-027'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-AUTH-028'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-AUTH-028'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-AUTH-029'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-AUTH-029'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-AUTH-030'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-AUTH-030'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-AUTH-030'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Secondary', 'Mapping from TG-AUTH-031'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-AUTH-031'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-AUTH-032'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-AUTH-032'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-AUTH-032'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-AUTH-033'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-AUTH-033'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-AUTH-033'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-AUTH-034'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-AUTH-034'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-AUTH-034'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-AUTH-035'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-AUTH-035'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-AUTH-035'
FROM m365_control_catalog WHERE control_id = 'TG-AUTH-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-CA-001'
FROM m365_control_catalog WHERE control_id = 'TG-CA-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-CA-001'
FROM m365_control_catalog WHERE control_id = 'TG-CA-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-CA-002'
FROM m365_control_catalog WHERE control_id = 'TG-CA-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-CA-002'
FROM m365_control_catalog WHERE control_id = 'TG-CA-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-CA-002'
FROM m365_control_catalog WHERE control_id = 'TG-CA-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-CA-003'
FROM m365_control_catalog WHERE control_id = 'TG-CA-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-CA-003'
FROM m365_control_catalog WHERE control_id = 'TG-CA-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-CA-003'
FROM m365_control_catalog WHERE control_id = 'TG-CA-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Secondary', 'Mapping from TG-CA-004'
FROM m365_control_catalog WHERE control_id = 'TG-CA-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-CA-004'
FROM m365_control_catalog WHERE control_id = 'TG-CA-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-CA-004'
FROM m365_control_catalog WHERE control_id = 'TG-CA-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-CA-005'
FROM m365_control_catalog WHERE control_id = 'TG-CA-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-CA-005'
FROM m365_control_catalog WHERE control_id = 'TG-CA-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-CA-005'
FROM m365_control_catalog WHERE control_id = 'TG-CA-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-CA-006'
FROM m365_control_catalog WHERE control_id = 'TG-CA-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-CA-006'
FROM m365_control_catalog WHERE control_id = 'TG-CA-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-CA-007'
FROM m365_control_catalog WHERE control_id = 'TG-CA-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-CA-007'
FROM m365_control_catalog WHERE control_id = 'TG-CA-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-CA-008'
FROM m365_control_catalog WHERE control_id = 'TG-CA-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-CA-008'
FROM m365_control_catalog WHERE control_id = 'TG-CA-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-CA-008'
FROM m365_control_catalog WHERE control_id = 'TG-CA-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-CA-009'
FROM m365_control_catalog WHERE control_id = 'TG-CA-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-CA-009'
FROM m365_control_catalog WHERE control_id = 'TG-CA-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-CA-010'
FROM m365_control_catalog WHERE control_id = 'TG-CA-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-CA-010'
FROM m365_control_catalog WHERE control_id = 'TG-CA-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-CA-010'
FROM m365_control_catalog WHERE control_id = 'TG-CA-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-CA-010'
FROM m365_control_catalog WHERE control_id = 'TG-CA-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-CA-011'
FROM m365_control_catalog WHERE control_id = 'TG-CA-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-011'
FROM m365_control_catalog WHERE control_id = 'TG-CA-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-CA-011'
FROM m365_control_catalog WHERE control_id = 'TG-CA-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-CA-011'
FROM m365_control_catalog WHERE control_id = 'TG-CA-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-CA-012'
FROM m365_control_catalog WHERE control_id = 'TG-CA-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-CA-012'
FROM m365_control_catalog WHERE control_id = 'TG-CA-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-013'
FROM m365_control_catalog WHERE control_id = 'TG-CA-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-CA-013'
FROM m365_control_catalog WHERE control_id = 'TG-CA-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-CA-014'
FROM m365_control_catalog WHERE control_id = 'TG-CA-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-CA-015'
FROM m365_control_catalog WHERE control_id = 'TG-CA-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-016'
FROM m365_control_catalog WHERE control_id = 'TG-CA-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-CA-016'
FROM m365_control_catalog WHERE control_id = 'TG-CA-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-CA-017'
FROM m365_control_catalog WHERE control_id = 'TG-CA-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-018'
FROM m365_control_catalog WHERE control_id = 'TG-CA-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-CA-018'
FROM m365_control_catalog WHERE control_id = 'TG-CA-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-CA-018'
FROM m365_control_catalog WHERE control_id = 'TG-CA-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-CA-019'
FROM m365_control_catalog WHERE control_id = 'TG-CA-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-CA-019'
FROM m365_control_catalog WHERE control_id = 'TG-CA-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-CA-019'
FROM m365_control_catalog WHERE control_id = 'TG-CA-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-CA-020'
FROM m365_control_catalog WHERE control_id = 'TG-CA-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-CA-020'
FROM m365_control_catalog WHERE control_id = 'TG-CA-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-CA-021'
FROM m365_control_catalog WHERE control_id = 'TG-CA-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-CA-021'
FROM m365_control_catalog WHERE control_id = 'TG-CA-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-CA-022'
FROM m365_control_catalog WHERE control_id = 'TG-CA-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-CA-022'
FROM m365_control_catalog WHERE control_id = 'TG-CA-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-CA-022'
FROM m365_control_catalog WHERE control_id = 'TG-CA-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-CA-023'
FROM m365_control_catalog WHERE control_id = 'TG-CA-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-CA-023'
FROM m365_control_catalog WHERE control_id = 'TG-CA-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-CA-023'
FROM m365_control_catalog WHERE control_id = 'TG-CA-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-CA-024'
FROM m365_control_catalog WHERE control_id = 'TG-CA-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-CA-024'
FROM m365_control_catalog WHERE control_id = 'TG-CA-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-CA-024'
FROM m365_control_catalog WHERE control_id = 'TG-CA-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-CA-025'
FROM m365_control_catalog WHERE control_id = 'TG-CA-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-CA-025'
FROM m365_control_catalog WHERE control_id = 'TG-CA-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-CA-025'
FROM m365_control_catalog WHERE control_id = 'TG-CA-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-CA-026'
FROM m365_control_catalog WHERE control_id = 'TG-CA-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-CA-026'
FROM m365_control_catalog WHERE control_id = 'TG-CA-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-CA-026'
FROM m365_control_catalog WHERE control_id = 'TG-CA-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-CA-027'
FROM m365_control_catalog WHERE control_id = 'TG-CA-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-CA-027'
FROM m365_control_catalog WHERE control_id = 'TG-CA-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Secondary', 'Mapping from TG-CA-027'
FROM m365_control_catalog WHERE control_id = 'TG-CA-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-CA-028'
FROM m365_control_catalog WHERE control_id = 'TG-CA-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-CA-028'
FROM m365_control_catalog WHERE control_id = 'TG-CA-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-CA-028'
FROM m365_control_catalog WHERE control_id = 'TG-CA-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-CA-029'
FROM m365_control_catalog WHERE control_id = 'TG-CA-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-CA-029'
FROM m365_control_catalog WHERE control_id = 'TG-CA-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-CA-030'
FROM m365_control_catalog WHERE control_id = 'TG-CA-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-CA-030'
FROM m365_control_catalog WHERE control_id = 'TG-CA-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-CA-031'
FROM m365_control_catalog WHERE control_id = 'TG-CA-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-CA-031'
FROM m365_control_catalog WHERE control_id = 'TG-CA-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-CA-032'
FROM m365_control_catalog WHERE control_id = 'TG-CA-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-CA-032'
FROM m365_control_catalog WHERE control_id = 'TG-CA-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-CA-032'
FROM m365_control_catalog WHERE control_id = 'TG-CA-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-CA-033'
FROM m365_control_catalog WHERE control_id = 'TG-CA-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-CA-033'
FROM m365_control_catalog WHERE control_id = 'TG-CA-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-CA-034'
FROM m365_control_catalog WHERE control_id = 'TG-CA-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-CA-034'
FROM m365_control_catalog WHERE control_id = 'TG-CA-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-CA-035'
FROM m365_control_catalog WHERE control_id = 'TG-CA-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-CA-035'
FROM m365_control_catalog WHERE control_id = 'TG-CA-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-CA-036'
FROM m365_control_catalog WHERE control_id = 'TG-CA-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-CA-036'
FROM m365_control_catalog WHERE control_id = 'TG-CA-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-CA-037'
FROM m365_control_catalog WHERE control_id = 'TG-CA-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-CA-037'
FROM m365_control_catalog WHERE control_id = 'TG-CA-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-CA-038'
FROM m365_control_catalog WHERE control_id = 'TG-CA-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-CA-038'
FROM m365_control_catalog WHERE control_id = 'TG-CA-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-CA-039'
FROM m365_control_catalog WHERE control_id = 'TG-CA-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-CA-039'
FROM m365_control_catalog WHERE control_id = 'TG-CA-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-CA-039'
FROM m365_control_catalog WHERE control_id = 'TG-CA-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-CA-039'
FROM m365_control_catalog WHERE control_id = 'TG-CA-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-CA-040'
FROM m365_control_catalog WHERE control_id = 'TG-CA-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-CA-040'
FROM m365_control_catalog WHERE control_id = 'TG-CA-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-CA-041'
FROM m365_control_catalog WHERE control_id = 'TG-CA-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-CA-041'
FROM m365_control_catalog WHERE control_id = 'TG-CA-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-CA-042'
FROM m365_control_catalog WHERE control_id = 'TG-CA-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-CA-042'
FROM m365_control_catalog WHERE control_id = 'TG-CA-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-CA-043'
FROM m365_control_catalog WHERE control_id = 'TG-CA-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-CA-043'
FROM m365_control_catalog WHERE control_id = 'TG-CA-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-CA-043'
FROM m365_control_catalog WHERE control_id = 'TG-CA-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-CA-044'
FROM m365_control_catalog WHERE control_id = 'TG-CA-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-CA-044'
FROM m365_control_catalog WHERE control_id = 'TG-CA-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-044'
FROM m365_control_catalog WHERE control_id = 'TG-CA-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-CA-045'
FROM m365_control_catalog WHERE control_id = 'TG-CA-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-CA-045'
FROM m365_control_catalog WHERE control_id = 'TG-CA-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-CA-045'
FROM m365_control_catalog WHERE control_id = 'TG-CA-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Secondary', 'Mapping from TG-CA-045'
FROM m365_control_catalog WHERE control_id = 'TG-CA-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-CA-046'
FROM m365_control_catalog WHERE control_id = 'TG-CA-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-CA-046'
FROM m365_control_catalog WHERE control_id = 'TG-CA-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-CA-047'
FROM m365_control_catalog WHERE control_id = 'TG-CA-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-CA-047'
FROM m365_control_catalog WHERE control_id = 'TG-CA-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-CA-048'
FROM m365_control_catalog WHERE control_id = 'TG-CA-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-CA-048'
FROM m365_control_catalog WHERE control_id = 'TG-CA-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-048'
FROM m365_control_catalog WHERE control_id = 'TG-CA-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-049'
FROM m365_control_catalog WHERE control_id = 'TG-CA-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-CA-049'
FROM m365_control_catalog WHERE control_id = 'TG-CA-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-CA-050'
FROM m365_control_catalog WHERE control_id = 'TG-CA-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-CA-050'
FROM m365_control_catalog WHERE control_id = 'TG-CA-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-CA-051'
FROM m365_control_catalog WHERE control_id = 'TG-CA-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-CA-051'
FROM m365_control_catalog WHERE control_id = 'TG-CA-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-CA-052'
FROM m365_control_catalog WHERE control_id = 'TG-CA-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-CA-052'
FROM m365_control_catalog WHERE control_id = 'TG-CA-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-CA-053'
FROM m365_control_catalog WHERE control_id = 'TG-CA-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-CA-053'
FROM m365_control_catalog WHERE control_id = 'TG-CA-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-CA-053'
FROM m365_control_catalog WHERE control_id = 'TG-CA-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-CA-054'
FROM m365_control_catalog WHERE control_id = 'TG-CA-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-CA-054'
FROM m365_control_catalog WHERE control_id = 'TG-CA-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-CA-054'
FROM m365_control_catalog WHERE control_id = 'TG-CA-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-CA-055'
FROM m365_control_catalog WHERE control_id = 'TG-CA-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Secondary', 'Mapping from TG-CA-055'
FROM m365_control_catalog WHERE control_id = 'TG-CA-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-CA-055'
FROM m365_control_catalog WHERE control_id = 'TG-CA-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-CA-056'
FROM m365_control_catalog WHERE control_id = 'TG-CA-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-CA-056'
FROM m365_control_catalog WHERE control_id = 'TG-CA-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-CA-056'
FROM m365_control_catalog WHERE control_id = 'TG-CA-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-CA-056'
FROM m365_control_catalog WHERE control_id = 'TG-CA-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-CA-057'
FROM m365_control_catalog WHERE control_id = 'TG-CA-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-CA-057'
FROM m365_control_catalog WHERE control_id = 'TG-CA-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-CA-058'
FROM m365_control_catalog WHERE control_id = 'TG-CA-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-CA-058'
FROM m365_control_catalog WHERE control_id = 'TG-CA-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-CA-059'
FROM m365_control_catalog WHERE control_id = 'TG-CA-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-CA-059'
FROM m365_control_catalog WHERE control_id = 'TG-CA-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-CA-059'
FROM m365_control_catalog WHERE control_id = 'TG-CA-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-CA-060'
FROM m365_control_catalog WHERE control_id = 'TG-CA-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-CA-060'
FROM m365_control_catalog WHERE control_id = 'TG-CA-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Secondary', 'Mapping from TG-CA-060'
FROM m365_control_catalog WHERE control_id = 'TG-CA-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-CA-060'
FROM m365_control_catalog WHERE control_id = 'TG-CA-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-APP-001'
FROM m365_control_catalog WHERE control_id = 'TG-APP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-APP-001'
FROM m365_control_catalog WHERE control_id = 'TG-APP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-001'
FROM m365_control_catalog WHERE control_id = 'TG-APP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-APP-002'
FROM m365_control_catalog WHERE control_id = 'TG-APP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-APP-002'
FROM m365_control_catalog WHERE control_id = 'TG-APP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-APP-003'
FROM m365_control_catalog WHERE control_id = 'TG-APP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-003'
FROM m365_control_catalog WHERE control_id = 'TG-APP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-APP-004'
FROM m365_control_catalog WHERE control_id = 'TG-APP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-APP-004'
FROM m365_control_catalog WHERE control_id = 'TG-APP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-APP-005'
FROM m365_control_catalog WHERE control_id = 'TG-APP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-APP-005'
FROM m365_control_catalog WHERE control_id = 'TG-APP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-APP-006'
FROM m365_control_catalog WHERE control_id = 'TG-APP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-APP-006'
FROM m365_control_catalog WHERE control_id = 'TG-APP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-007'
FROM m365_control_catalog WHERE control_id = 'TG-APP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-APP-007'
FROM m365_control_catalog WHERE control_id = 'TG-APP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-APP-008'
FROM m365_control_catalog WHERE control_id = 'TG-APP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-APP-008'
FROM m365_control_catalog WHERE control_id = 'TG-APP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-APP-008'
FROM m365_control_catalog WHERE control_id = 'TG-APP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-APP-009'
FROM m365_control_catalog WHERE control_id = 'TG-APP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-APP-009'
FROM m365_control_catalog WHERE control_id = 'TG-APP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-APP-009'
FROM m365_control_catalog WHERE control_id = 'TG-APP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-APP-010'
FROM m365_control_catalog WHERE control_id = 'TG-APP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-010'
FROM m365_control_catalog WHERE control_id = 'TG-APP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-011'
FROM m365_control_catalog WHERE control_id = 'TG-APP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-APP-011'
FROM m365_control_catalog WHERE control_id = 'TG-APP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-APP-011'
FROM m365_control_catalog WHERE control_id = 'TG-APP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-APP-011'
FROM m365_control_catalog WHERE control_id = 'TG-APP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-APP-012'
FROM m365_control_catalog WHERE control_id = 'TG-APP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-APP-012'
FROM m365_control_catalog WHERE control_id = 'TG-APP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-APP-012'
FROM m365_control_catalog WHERE control_id = 'TG-APP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-013'
FROM m365_control_catalog WHERE control_id = 'TG-APP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-APP-013'
FROM m365_control_catalog WHERE control_id = 'TG-APP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-APP-013'
FROM m365_control_catalog WHERE control_id = 'TG-APP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-APP-013'
FROM m365_control_catalog WHERE control_id = 'TG-APP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-APP-014'
FROM m365_control_catalog WHERE control_id = 'TG-APP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-APP-015'
FROM m365_control_catalog WHERE control_id = 'TG-APP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-015'
FROM m365_control_catalog WHERE control_id = 'TG-APP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-APP-015'
FROM m365_control_catalog WHERE control_id = 'TG-APP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-APP-016'
FROM m365_control_catalog WHERE control_id = 'TG-APP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-APP-016'
FROM m365_control_catalog WHERE control_id = 'TG-APP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-APP-017'
FROM m365_control_catalog WHERE control_id = 'TG-APP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-APP-017'
FROM m365_control_catalog WHERE control_id = 'TG-APP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-APP-018'
FROM m365_control_catalog WHERE control_id = 'TG-APP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-APP-018'
FROM m365_control_catalog WHERE control_id = 'TG-APP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Secondary', 'Mapping from TG-APP-019'
FROM m365_control_catalog WHERE control_id = 'TG-APP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-APP-019'
FROM m365_control_catalog WHERE control_id = 'TG-APP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-APP-019'
FROM m365_control_catalog WHERE control_id = 'TG-APP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-APP-020'
FROM m365_control_catalog WHERE control_id = 'TG-APP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-APP-020'
FROM m365_control_catalog WHERE control_id = 'TG-APP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-APP-020'
FROM m365_control_catalog WHERE control_id = 'TG-APP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-021'
FROM m365_control_catalog WHERE control_id = 'TG-APP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-APP-021'
FROM m365_control_catalog WHERE control_id = 'TG-APP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-APP-021'
FROM m365_control_catalog WHERE control_id = 'TG-APP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-APP-022'
FROM m365_control_catalog WHERE control_id = 'TG-APP-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-APP-023'
FROM m365_control_catalog WHERE control_id = 'TG-APP-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-APP-023'
FROM m365_control_catalog WHERE control_id = 'TG-APP-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-APP-024'
FROM m365_control_catalog WHERE control_id = 'TG-APP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-APP-024'
FROM m365_control_catalog WHERE control_id = 'TG-APP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-APP-024'
FROM m365_control_catalog WHERE control_id = 'TG-APP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-APP-024'
FROM m365_control_catalog WHERE control_id = 'TG-APP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-APP-025'
FROM m365_control_catalog WHERE control_id = 'TG-APP-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-025'
FROM m365_control_catalog WHERE control_id = 'TG-APP-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-APP-025'
FROM m365_control_catalog WHERE control_id = 'TG-APP-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-026'
FROM m365_control_catalog WHERE control_id = 'TG-APP-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-APP-026'
FROM m365_control_catalog WHERE control_id = 'TG-APP-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-027'
FROM m365_control_catalog WHERE control_id = 'TG-APP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-APP-027'
FROM m365_control_catalog WHERE control_id = 'TG-APP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-APP-027'
FROM m365_control_catalog WHERE control_id = 'TG-APP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-APP-028'
FROM m365_control_catalog WHERE control_id = 'TG-APP-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-APP-028'
FROM m365_control_catalog WHERE control_id = 'TG-APP-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-APP-029'
FROM m365_control_catalog WHERE control_id = 'TG-APP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-APP-029'
FROM m365_control_catalog WHERE control_id = 'TG-APP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-APP-029'
FROM m365_control_catalog WHERE control_id = 'TG-APP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-APP-029'
FROM m365_control_catalog WHERE control_id = 'TG-APP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-APP-030'
FROM m365_control_catalog WHERE control_id = 'TG-APP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-APP-030'
FROM m365_control_catalog WHERE control_id = 'TG-APP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Secondary', 'Mapping from TG-APP-030'
FROM m365_control_catalog WHERE control_id = 'TG-APP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-APP-030'
FROM m365_control_catalog WHERE control_id = 'TG-APP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-APP-031'
FROM m365_control_catalog WHERE control_id = 'TG-APP-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-APP-031'
FROM m365_control_catalog WHERE control_id = 'TG-APP-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-APP-032'
FROM m365_control_catalog WHERE control_id = 'TG-APP-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-APP-032'
FROM m365_control_catalog WHERE control_id = 'TG-APP-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-APP-033'
FROM m365_control_catalog WHERE control_id = 'TG-APP-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-APP-033'
FROM m365_control_catalog WHERE control_id = 'TG-APP-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-APP-033'
FROM m365_control_catalog WHERE control_id = 'TG-APP-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-APP-033'
FROM m365_control_catalog WHERE control_id = 'TG-APP-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-APP-034'
FROM m365_control_catalog WHERE control_id = 'TG-APP-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-APP-034'
FROM m365_control_catalog WHERE control_id = 'TG-APP-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-APP-035'
FROM m365_control_catalog WHERE control_id = 'TG-APP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-035'
FROM m365_control_catalog WHERE control_id = 'TG-APP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-APP-036'
FROM m365_control_catalog WHERE control_id = 'TG-APP-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-036'
FROM m365_control_catalog WHERE control_id = 'TG-APP-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-APP-037'
FROM m365_control_catalog WHERE control_id = 'TG-APP-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-APP-037'
FROM m365_control_catalog WHERE control_id = 'TG-APP-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-APP-038'
FROM m365_control_catalog WHERE control_id = 'TG-APP-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-APP-038'
FROM m365_control_catalog WHERE control_id = 'TG-APP-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-APP-039'
FROM m365_control_catalog WHERE control_id = 'TG-APP-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Secondary', 'Mapping from TG-APP-040'
FROM m365_control_catalog WHERE control_id = 'TG-APP-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-APP-040'
FROM m365_control_catalog WHERE control_id = 'TG-APP-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-APP-040'
FROM m365_control_catalog WHERE control_id = 'TG-APP-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-APP-041'
FROM m365_control_catalog WHERE control_id = 'TG-APP-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-APP-041'
FROM m365_control_catalog WHERE control_id = 'TG-APP-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-APP-042'
FROM m365_control_catalog WHERE control_id = 'TG-APP-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-042'
FROM m365_control_catalog WHERE control_id = 'TG-APP-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-APP-043'
FROM m365_control_catalog WHERE control_id = 'TG-APP-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-APP-043'
FROM m365_control_catalog WHERE control_id = 'TG-APP-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-044'
FROM m365_control_catalog WHERE control_id = 'TG-APP-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-APP-044'
FROM m365_control_catalog WHERE control_id = 'TG-APP-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-APP-045'
FROM m365_control_catalog WHERE control_id = 'TG-APP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-APP-045'
FROM m365_control_catalog WHERE control_id = 'TG-APP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-045'
FROM m365_control_catalog WHERE control_id = 'TG-APP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-APP-045'
FROM m365_control_catalog WHERE control_id = 'TG-APP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-APP-046'
FROM m365_control_catalog WHERE control_id = 'TG-APP-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-APP-046'
FROM m365_control_catalog WHERE control_id = 'TG-APP-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-APP-047'
FROM m365_control_catalog WHERE control_id = 'TG-APP-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-047'
FROM m365_control_catalog WHERE control_id = 'TG-APP-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-APP-047'
FROM m365_control_catalog WHERE control_id = 'TG-APP-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-APP-048'
FROM m365_control_catalog WHERE control_id = 'TG-APP-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-APP-048'
FROM m365_control_catalog WHERE control_id = 'TG-APP-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-APP-048'
FROM m365_control_catalog WHERE control_id = 'TG-APP-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Secondary', 'Mapping from TG-APP-049'
FROM m365_control_catalog WHERE control_id = 'TG-APP-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-APP-049'
FROM m365_control_catalog WHERE control_id = 'TG-APP-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-049'
FROM m365_control_catalog WHERE control_id = 'TG-APP-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-APP-050'
FROM m365_control_catalog WHERE control_id = 'TG-APP-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-050'
FROM m365_control_catalog WHERE control_id = 'TG-APP-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-APP-050'
FROM m365_control_catalog WHERE control_id = 'TG-APP-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-APP-050'
FROM m365_control_catalog WHERE control_id = 'TG-APP-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-APP-051'
FROM m365_control_catalog WHERE control_id = 'TG-APP-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-APP-051'
FROM m365_control_catalog WHERE control_id = 'TG-APP-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-051'
FROM m365_control_catalog WHERE control_id = 'TG-APP-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-APP-051'
FROM m365_control_catalog WHERE control_id = 'TG-APP-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-APP-052'
FROM m365_control_catalog WHERE control_id = 'TG-APP-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-052'
FROM m365_control_catalog WHERE control_id = 'TG-APP-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-APP-052'
FROM m365_control_catalog WHERE control_id = 'TG-APP-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-052'
FROM m365_control_catalog WHERE control_id = 'TG-APP-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-APP-053'
FROM m365_control_catalog WHERE control_id = 'TG-APP-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-APP-053'
FROM m365_control_catalog WHERE control_id = 'TG-APP-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-APP-054'
FROM m365_control_catalog WHERE control_id = 'TG-APP-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-APP-054'
FROM m365_control_catalog WHERE control_id = 'TG-APP-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-APP-055'
FROM m365_control_catalog WHERE control_id = 'TG-APP-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-APP-056'
FROM m365_control_catalog WHERE control_id = 'TG-APP-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-APP-056'
FROM m365_control_catalog WHERE control_id = 'TG-APP-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-056'
FROM m365_control_catalog WHERE control_id = 'TG-APP-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-057'
FROM m365_control_catalog WHERE control_id = 'TG-APP-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-APP-058'
FROM m365_control_catalog WHERE control_id = 'TG-APP-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-APP-058'
FROM m365_control_catalog WHERE control_id = 'TG-APP-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-APP-058'
FROM m365_control_catalog WHERE control_id = 'TG-APP-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Secondary', 'Mapping from TG-APP-059'
FROM m365_control_catalog WHERE control_id = 'TG-APP-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-APP-059'
FROM m365_control_catalog WHERE control_id = 'TG-APP-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-APP-060'
FROM m365_control_catalog WHERE control_id = 'TG-APP-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-060'
FROM m365_control_catalog WHERE control_id = 'TG-APP-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-APP-061'
FROM m365_control_catalog WHERE control_id = 'TG-APP-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-APP-061'
FROM m365_control_catalog WHERE control_id = 'TG-APP-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-APP-062'
FROM m365_control_catalog WHERE control_id = 'TG-APP-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-APP-062'
FROM m365_control_catalog WHERE control_id = 'TG-APP-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-APP-062'
FROM m365_control_catalog WHERE control_id = 'TG-APP-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-APP-062'
FROM m365_control_catalog WHERE control_id = 'TG-APP-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-APP-063'
FROM m365_control_catalog WHERE control_id = 'TG-APP-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-APP-063'
FROM m365_control_catalog WHERE control_id = 'TG-APP-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-APP-063'
FROM m365_control_catalog WHERE control_id = 'TG-APP-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Secondary', 'Mapping from TG-APP-064'
FROM m365_control_catalog WHERE control_id = 'TG-APP-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-APP-064'
FROM m365_control_catalog WHERE control_id = 'TG-APP-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-APP-065'
FROM m365_control_catalog WHERE control_id = 'TG-APP-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-APP-065'
FROM m365_control_catalog WHERE control_id = 'TG-APP-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-APP-065'
FROM m365_control_catalog WHERE control_id = 'TG-APP-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-APP-066'
FROM m365_control_catalog WHERE control_id = 'TG-APP-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-APP-066'
FROM m365_control_catalog WHERE control_id = 'TG-APP-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-APP-067'
FROM m365_control_catalog WHERE control_id = 'TG-APP-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-APP-067'
FROM m365_control_catalog WHERE control_id = 'TG-APP-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-APP-068'
FROM m365_control_catalog WHERE control_id = 'TG-APP-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-APP-068'
FROM m365_control_catalog WHERE control_id = 'TG-APP-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-APP-068'
FROM m365_control_catalog WHERE control_id = 'TG-APP-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-APP-069'
FROM m365_control_catalog WHERE control_id = 'TG-APP-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-APP-069'
FROM m365_control_catalog WHERE control_id = 'TG-APP-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-APP-069'
FROM m365_control_catalog WHERE control_id = 'TG-APP-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-APP-069'
FROM m365_control_catalog WHERE control_id = 'TG-APP-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-APP-070'
FROM m365_control_catalog WHERE control_id = 'TG-APP-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-APP-070'
FROM m365_control_catalog WHERE control_id = 'TG-APP-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-APP-071'
FROM m365_control_catalog WHERE control_id = 'TG-APP-071';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-APP-071'
FROM m365_control_catalog WHERE control_id = 'TG-APP-071';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-APP-072'
FROM m365_control_catalog WHERE control_id = 'TG-APP-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-APP-072'
FROM m365_control_catalog WHERE control_id = 'TG-APP-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-APP-072'
FROM m365_control_catalog WHERE control_id = 'TG-APP-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-APP-072'
FROM m365_control_catalog WHERE control_id = 'TG-APP-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-APP-073'
FROM m365_control_catalog WHERE control_id = 'TG-APP-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-APP-073'
FROM m365_control_catalog WHERE control_id = 'TG-APP-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-APP-074'
FROM m365_control_catalog WHERE control_id = 'TG-APP-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-APP-074'
FROM m365_control_catalog WHERE control_id = 'TG-APP-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-APP-074'
FROM m365_control_catalog WHERE control_id = 'TG-APP-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-APP-075'
FROM m365_control_catalog WHERE control_id = 'TG-APP-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-APP-075'
FROM m365_control_catalog WHERE control_id = 'TG-APP-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-APP-076'
FROM m365_control_catalog WHERE control_id = 'TG-APP-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-APP-076'
FROM m365_control_catalog WHERE control_id = 'TG-APP-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-APP-076'
FROM m365_control_catalog WHERE control_id = 'TG-APP-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-APP-077'
FROM m365_control_catalog WHERE control_id = 'TG-APP-077';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-APP-077'
FROM m365_control_catalog WHERE control_id = 'TG-APP-077';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-APP-077'
FROM m365_control_catalog WHERE control_id = 'TG-APP-077';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-APP-078'
FROM m365_control_catalog WHERE control_id = 'TG-APP-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-APP-078'
FROM m365_control_catalog WHERE control_id = 'TG-APP-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-APP-078'
FROM m365_control_catalog WHERE control_id = 'TG-APP-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-APP-079'
FROM m365_control_catalog WHERE control_id = 'TG-APP-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-APP-079'
FROM m365_control_catalog WHERE control_id = 'TG-APP-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-APP-079'
FROM m365_control_catalog WHERE control_id = 'TG-APP-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-APP-080'
FROM m365_control_catalog WHERE control_id = 'TG-APP-080';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-APP-080'
FROM m365_control_catalog WHERE control_id = 'TG-APP-080';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-APP-080'
FROM m365_control_catalog WHERE control_id = 'TG-APP-080';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-ROLE-001'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ROLE-001'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ROLE-002'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-ROLE-002'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-ROLE-003'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-ROLE-003'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-ROLE-003'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-ROLE-004'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-ROLE-004'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ROLE-005'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-ROLE-005'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-ROLE-006'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-ROLE-006'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-ROLE-007'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-ROLE-007'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ROLE-007'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ROLE-007'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-ROLE-008'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ROLE-008'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-ROLE-008'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ROLE-008'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-ROLE-009'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-ROLE-009'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-ROLE-009'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-ROLE-010'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-ROLE-010'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-ROLE-011'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Secondary', 'Mapping from TG-ROLE-011'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-ROLE-011'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-ROLE-011'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-ROLE-012'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-ROLE-012'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-ROLE-013'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-ROLE-013'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-ROLE-013'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-ROLE-014'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-ROLE-014'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-ROLE-015'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-ROLE-016'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-ROLE-016'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-ROLE-017'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-ROLE-017'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-ROLE-018'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Secondary', 'Mapping from TG-ROLE-018'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-ROLE-018'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ROLE-019'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-ROLE-019'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-ROLE-020'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-ROLE-020'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ROLE-020'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ROLE-021'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-ROLE-021'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-ROLE-022'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-ROLE-022'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-ROLE-023'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-ROLE-023'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-ROLE-023'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-ROLE-024'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-ROLE-024'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-ROLE-025'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-ROLE-025'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-ROLE-026'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ROLE-026'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-ROLE-027'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-ROLE-027'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-ROLE-027'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ROLE-028'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-ROLE-028'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-ROLE-028'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-ROLE-029'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ROLE-029'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ROLE-029'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ROLE-030'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-ROLE-030'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-ROLE-030'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-ROLE-030'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Secondary', 'Mapping from TG-ROLE-031'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-ROLE-031'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-ROLE-031'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-ROLE-032'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-ROLE-033'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-ROLE-033'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-ROLE-033'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ROLE-034'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-ROLE-034'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-ROLE-035'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-ROLE-035'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-ROLE-036'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-ROLE-036'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-ROLE-036'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-ROLE-037'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-ROLE-037'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-ROLE-038'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Secondary', 'Mapping from TG-ROLE-038'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-ROLE-038'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-ROLE-039'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ROLE-039'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-ROLE-039'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-ROLE-040'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-ROLE-040'
FROM m365_control_catalog WHERE control_id = 'TG-ROLE-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DEV-001'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-DEV-001'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-DEV-001'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DEV-002'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-DEV-002'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DEV-003'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-DEV-003'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-DEV-003'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-DEV-004'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-DEV-004'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-DEV-005'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-DEV-005'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DEV-005'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-DEV-006'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEV-006'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-DEV-006'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-DEV-007'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-DEV-007'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DEV-007'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-DEV-008'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-DEV-008'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-DEV-008'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEV-009'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-DEV-009'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-DEV-009'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-DEV-009'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEV-010'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEV-010'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-DEV-011'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-DEV-011'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-DEV-011'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DEV-012'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DEV-012'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Secondary', 'Mapping from TG-DEV-012'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-DEV-013'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-DEV-014'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-DEV-014'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEV-015'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-DEV-015'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-DEV-015'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-DEV-016'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEV-016'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-DEV-017'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-DEV-017'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-DEV-018'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEV-018'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-DEV-018'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-DEV-019'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DEV-019'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEV-019'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-DEV-020'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-DEV-020'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-DEV-020'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-DEV-021'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DEV-021'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEV-022'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DEV-022'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-DEV-023'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-DEV-023'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-DEV-024'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-DEV-024'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-DEV-024'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEV-025'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-DEV-025'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-DEV-025'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-DEV-026'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-DEV-026'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-DEV-026'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEV-026'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-DEV-027'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Secondary', 'Mapping from TG-DEV-027'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Secondary', 'Mapping from TG-DEV-027'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-DEV-027'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-DEV-028'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-DEV-028'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-DEV-029'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-DEV-029'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DEV-029'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-DEV-030'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DEV-030'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-DEV-030'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Secondary', 'Mapping from TG-DEV-031'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-DEV-031'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DEV-031'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-DEV-032'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-DEV-032'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-DEV-032'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-DEV-032'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-DEV-033'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DEV-033'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-DEV-033'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-DEV-034'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-DEV-034'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-DEV-034'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-DEV-035'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEV-035'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-DEV-036'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-DEV-036'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-DEV-037'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-DEV-037'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DEV-037'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DEV-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-DEV-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-DEV-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEV-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DEV-039'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-DEV-039'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-DEV-040'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-DEV-040'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-DEV-041'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-DEV-041'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEV-042'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-DEV-042'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-DEV-042'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-DEV-043'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-DEV-043'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-DEV-043'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEV-044'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEV-044'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DEV-044'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-DEV-045'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-DEV-045'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-DEV-045'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-DEV-046'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEV-046'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-DEV-047'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-DEV-047'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-DEV-047'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-DEV-048'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEV-048'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-DEV-049'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-DEV-049'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEV-049'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEV-050'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-DEV-050'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-DEV-051'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-DEV-051'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-DEV-052'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEV-052'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEV-053'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-DEV-053'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-DEV-053'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DEV-054'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DEV-054'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-DEV-055'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEV-055'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-DEV-055'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-DEV-055'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-DEV-056'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-DEV-056'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-DEV-056'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-DEV-057'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEV-057'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-DEV-057'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-DEV-058'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEV-058'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-DEV-059'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-DEV-059'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-DEV-060'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-DEV-060'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEV-060'
FROM m365_control_catalog WHERE control_id = 'TG-DEV-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-EXO-001'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-001'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-EXO-002'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-EXO-002'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-EXO-003'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-EXO-003'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-EXO-003'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-EXO-003'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-EXO-004'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-EXO-004'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-EXO-005'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-EXO-005'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-EXO-006'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Secondary', 'Mapping from TG-EXO-006'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-EXO-007'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-EXO-007'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-EXO-008'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-EXO-008'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-EXO-009'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-EXO-009'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-EXO-010'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-EXO-010'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-EXO-010'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-EXO-011'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-EXO-011'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-EXO-011'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-EXO-012'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-012'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-EXO-012'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-EXO-012'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-EXO-013'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-EXO-013'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-EXO-014'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-EXO-014'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-EXO-015'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-EXO-015'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-EXO-016'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-EXO-016'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-EXO-017'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-EXO-017'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-EXO-017'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-EXO-018'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-EXO-019'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-EXO-019'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-EXO-019'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-EXO-020'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-EXO-020'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-EXO-020'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-EXO-021'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-EXO-021'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-EXO-021'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-EXO-022'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-EXO-022'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-EXO-022'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-EXO-023'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-EXO-023'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-EXO-023'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-EXO-024'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-EXO-024'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-EXO-025'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-EXO-025'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-EXO-025'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-EXO-026'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-EXO-026'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-EXO-027'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Secondary', 'Mapping from TG-EXO-027'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-EXO-027'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-EXO-028'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-EXO-029'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-EXO-029'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-EXO-029'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-EXO-030'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-EXO-030'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-EXO-030'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-EXO-030'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-EXO-031'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-EXO-031'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-EXO-032'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-EXO-032'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-EXO-032'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-EXO-033'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-EXO-033'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-EXO-033'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-EXO-034'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-EXO-034'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-EXO-035'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Secondary', 'Mapping from TG-EXO-035'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-EXO-035'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-EXO-036'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-EXO-036'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-EXO-036'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-EXO-037'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-EXO-037'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-037'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-EXO-038'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-EXO-038'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-EXO-039'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-EXO-039'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Secondary', 'Mapping from TG-EXO-039'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-EXO-040'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-EXO-040'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-EXO-040'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-EXO-041'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-EXO-041'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-EXO-042'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Secondary', 'Mapping from TG-EXO-042'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-EXO-042'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-EXO-043'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-EXO-044'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-EXO-044'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-EXO-045'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-EXO-045'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-EXO-046'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-EXO-046'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Secondary', 'Mapping from TG-EXO-046'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-EXO-046'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-EXO-047'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-EXO-047'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-EXO-047'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-EXO-047'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-EXO-048'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-049'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Secondary', 'Mapping from TG-EXO-049'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-EXO-049'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-EXO-050'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-EXO-050'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-EXO-050'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-EXO-050'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-EXO-051'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-EXO-051'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-EXO-052'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-EXO-052'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-EXO-053'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-EXO-053'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-053'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-EXO-053'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-EXO-054'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-EXO-054'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-EXO-055'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-EXO-055'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-EXO-055'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-EXO-055'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-EXO-056'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-EXO-056'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-EXO-056'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-EXO-056'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-EXO-057'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-EXO-057'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-EXO-057'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-EXO-058'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-EXO-058'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-EXO-059'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-EXO-059'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-EXO-060'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-EXO-061'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-EXO-061'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-EXO-061'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-EXO-062'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-EXO-062'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-EXO-063'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-EXO-063'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-EXO-064'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-EXO-064'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-EXO-064'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-EXO-064'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-EXO-065'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-EXO-065'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-EXO-065'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-EXO-066'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-066'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-EXO-066'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-EXO-066'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-EXO-067'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-EXO-067'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-EXO-067'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-068'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-EXO-068'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-EXO-068'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-EXO-069'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-EXO-069'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Secondary', 'Mapping from TG-EXO-069'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-EXO-070'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-EXO-070'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-EXO-071'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-071';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-EXO-072'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-EXO-072'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-EXO-072'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-EXO-072'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-EXO-073'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-EXO-073'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Secondary', 'Mapping from TG-EXO-073'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-EXO-073'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-EXO-074'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-EXO-074'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-EXO-074'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-EXO-075'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-EXO-075'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-EXO-075'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-EXO-075'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-EXO-076'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Secondary', 'Mapping from TG-EXO-076'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-EXO-076'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-EXO-077'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-077';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-EXO-077'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-077';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-EXO-078'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-EXO-078'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-EXO-078'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-EXO-079'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-EXO-079'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-EXO-079'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-EXO-079'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-EXO-080'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-080';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-EXO-080'
FROM m365_control_catalog WHERE control_id = 'TG-EXO-080';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-SPO-001'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-SPO-001'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-SPO-001'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Secondary', 'Mapping from TG-SPO-002'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-SPO-002'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-SPO-002'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-002'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-SPO-003'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-SPO-003'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-SPO-003'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Secondary', 'Mapping from TG-SPO-004'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-SPO-004'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-SPO-005'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-SPO-005'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-005'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-SPO-005'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-SPO-006'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-SPO-006'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-SPO-006'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-SPO-006'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-SPO-007'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-SPO-007'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-SPO-007'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-SPO-008'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-SPO-008'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-SPO-008'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-SPO-008'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-SPO-009'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-SPO-009'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-SPO-010'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-SPO-010'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-SPO-011'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-SPO-011'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-SPO-012'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-SPO-012'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-SPO-013'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-SPO-013'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-SPO-014'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-SPO-014'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-SPO-015'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-SPO-015'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-SPO-016'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-SPO-016'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-SPO-016'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-SPO-016'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-SPO-017'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-SPO-017'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-SPO-018'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-SPO-018'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-SPO-018'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-SPO-019'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-SPO-019'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-SPO-019'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-SPO-020'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Secondary', 'Mapping from TG-SPO-020'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-SPO-021'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-SPO-021'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-SPO-022'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-SPO-022'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Secondary', 'Mapping from TG-SPO-023'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-SPO-023'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-SPO-023'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-SPO-024'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-SPO-024'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Secondary', 'Mapping from TG-SPO-024'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-SPO-025'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-SPO-026'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-SPO-026'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-SPO-027'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-SPO-027'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-SPO-028'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-SPO-028'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-SPO-029'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-SPO-029'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-SPO-029'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-SPO-030'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-SPO-030'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-SPO-030'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-031'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-SPO-031'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-SPO-032'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-SPO-032'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-SPO-033'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-SPO-033'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-SPO-033'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-034'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-SPO-034'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-SPO-034'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-SPO-035'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-SPO-035'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-SPO-036'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-SPO-036'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-SPO-037'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-SPO-037'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-038'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-SPO-038'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-SPO-039'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-SPO-039'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-040'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-SPO-040'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-SPO-040'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-041'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-SPO-041'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-SPO-041'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-SPO-041'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-SPO-042'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-SPO-042'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-SPO-042'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-SPO-043'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-SPO-043'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-SPO-044'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-SPO-044'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-SPO-044'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-SPO-045'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-SPO-045'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-SPO-045'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-SPO-046'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-SPO-046'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-SPO-047'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-SPO-047'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-SPO-047'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-SPO-048'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-SPO-048'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-SPO-048'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-SPO-049'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-SPO-049'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-SPO-050'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-SPO-050'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-SPO-051'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-SPO-051'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-SPO-051'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-SPO-052'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-SPO-052'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-SPO-053'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-SPO-053'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-SPO-053'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-SPO-054'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-SPO-054'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-SPO-055'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-SPO-055'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-SPO-055'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-SPO-056'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-SPO-056'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-SPO-057'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-SPO-057'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-SPO-057'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-SPO-058'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-SPO-058'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-SPO-059'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-SPO-059'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-SPO-059'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-SPO-060'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-SPO-060'
FROM m365_control_catalog WHERE control_id = 'TG-SPO-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-TEAMS-001'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-TEAMS-001'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-TEAMS-002'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-TEAMS-002'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-TEAMS-003'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-TEAMS-003'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-TEAMS-003'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-TEAMS-003'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-TEAMS-004'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-TEAMS-004'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-TEAMS-004'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-TEAMS-005'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-TEAMS-005'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-005'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-TEAMS-006'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-TEAMS-006'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-TEAMS-006'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-TEAMS-007'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-TEAMS-007'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-TEAMS-008'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-TEAMS-008'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-TEAMS-009'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-TEAMS-009'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-TEAMS-010'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-TEAMS-010'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-TEAMS-011'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-TEAMS-011'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-TEAMS-011'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-TEAMS-011'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-TEAMS-012'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-012'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-TEAMS-012'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-TEAMS-013'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-TEAMS-013'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-014'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-TEAMS-014'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-015'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-TEAMS-015'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-TEAMS-015'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-TEAMS-015'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-TEAMS-016'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-016'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-TEAMS-017'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-TEAMS-017'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-TEAMS-018'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-TEAMS-018'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-TEAMS-018'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-TEAMS-019'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-TEAMS-019'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-TEAMS-020'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-TEAMS-020'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-TEAMS-020'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-TEAMS-021'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-TEAMS-021'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Secondary', 'Mapping from TG-TEAMS-022'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-TEAMS-022'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-TEAMS-022'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-TEAMS-023'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Secondary', 'Mapping from TG-TEAMS-023'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-TEAMS-024'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-TEAMS-024'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-025'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-TEAMS-025'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-TEAMS-025'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-TEAMS-026'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-TEAMS-026'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-TEAMS-026'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-TEAMS-027'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-TEAMS-027'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-TEAMS-027'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-TEAMS-028'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-TEAMS-028'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-TEAMS-028'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-TEAMS-029'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-TEAMS-029'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-TEAMS-029'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-TEAMS-030'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-TEAMS-030'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-TEAMS-030'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-TEAMS-031'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-TEAMS-032'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-TEAMS-032'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-TEAMS-032'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-TEAMS-033'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-TEAMS-033'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-TEAMS-033'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-TEAMS-033'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-TEAMS-034'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-TEAMS-034'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-035'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-TEAMS-035'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-TEAMS-035'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-TEAMS-035'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-TEAMS-036'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-TEAMS-036'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-TEAMS-037'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-TEAMS-037'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-TEAMS-038'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-TEAMS-038'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-TEAMS-039'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-TEAMS-039'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-TEAMS-039'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-TEAMS-040'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-TEAMS-040'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-TEAMS-041'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-TEAMS-041'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-TEAMS-041'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-TEAMS-041'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-TEAMS-042'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-TEAMS-042'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-TEAMS-042'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-TEAMS-042'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-TEAMS-043'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-TEAMS-043'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Secondary', 'Mapping from TG-TEAMS-043'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-TEAMS-044'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-TEAMS-044'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-TEAMS-044'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-TEAMS-045'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-TEAMS-045'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-TEAMS-045'
FROM m365_control_catalog WHERE control_id = 'TG-TEAMS-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-PUR-001'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-PUR-001'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-PUR-001'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-PUR-001'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-PUR-002'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-PUR-002'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-PUR-003'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-PUR-003'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-PUR-003'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-PUR-003'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-PUR-004'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-PUR-004'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-PUR-004'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-PUR-005'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-PUR-005'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-PUR-006'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-PUR-006'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-PUR-006'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-PUR-007'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-PUR-007'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-PUR-007'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-PUR-008'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-PUR-008'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-PUR-009'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-PUR-009'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-PUR-010'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-PUR-011'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-PUR-011'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-PUR-011'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-PUR-011'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-PUR-012'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-PUR-012'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-PUR-013'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-PUR-013'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-PUR-013'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-PUR-014'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Secondary', 'Mapping from TG-PUR-014'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-PUR-015'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-PUR-015'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-PUR-016'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-PUR-016'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-PUR-016'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-PUR-017'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Secondary', 'Mapping from TG-PUR-017'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-PUR-017'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-PUR-017'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-PUR-018'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-PUR-018'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-PUR-019'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-PUR-019'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-PUR-020'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-PUR-021'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-PUR-021'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Secondary', 'Mapping from TG-PUR-022'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-PUR-022'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-PUR-023'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-PUR-023'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-PUR-023'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-PUR-023'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-PUR-024'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-PUR-024'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-PUR-025'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-PUR-025'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-PUR-025'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-PUR-026'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-PUR-026'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-PUR-027'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-PUR-027'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-PUR-028'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-PUR-029'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-PUR-029'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-PUR-030'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-PUR-030'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-PUR-031'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-PUR-031'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-PUR-032'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-PUR-032'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-PUR-033'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-PUR-033'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-PUR-033'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-PUR-033'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-PUR-034'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-PUR-034'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-PUR-034'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-PUR-035'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-PUR-035'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-PUR-036'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-PUR-036'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-PUR-036'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-PUR-037'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-PUR-037'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-PUR-038'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Secondary', 'Mapping from TG-PUR-038'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-PUR-038'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-PUR-039'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Secondary', 'Mapping from TG-PUR-039'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-PUR-039'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-PUR-040'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-PUR-040'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-PUR-041'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-PUR-041'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-PUR-042'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-PUR-042'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-PUR-042'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-PUR-043'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-PUR-043'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-PUR-043'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-PUR-044'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-PUR-044'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-PUR-044'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Secondary', 'Mapping from TG-PUR-044'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-PUR-045'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-PUR-045'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-PUR-046'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-PUR-046'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-PUR-046'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-PUR-047'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-PUR-047'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-PUR-048'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-PUR-048'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-PUR-049'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-PUR-049'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-PUR-049'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-PUR-050'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-PUR-051'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-PUR-051'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-PUR-051'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-PUR-052'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-PUR-052'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-PUR-052'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-PUR-053'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-PUR-053'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Secondary', 'Mapping from TG-PUR-053'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-PUR-054'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-PUR-054'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-PUR-054'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-PUR-055'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-PUR-055'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-PUR-055'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-PUR-055'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-PUR-056'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-PUR-057'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-PUR-057'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-PUR-057'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-PUR-058'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-PUR-058'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-PUR-058'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-PUR-059'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-PUR-059'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Secondary', 'Mapping from TG-PUR-059'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-PUR-059'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-PUR-060'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-PUR-060'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-PUR-061'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-PUR-061'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-PUR-062'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-PUR-062'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-PUR-062'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-PUR-063'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-PUR-063'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-PUR-063'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-PUR-063'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-PUR-064'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-PUR-064'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-PUR-064'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-PUR-065'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-PUR-065'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-PUR-066'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-PUR-066'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-PUR-067'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-PUR-067'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-PUR-067'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-PUR-068'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-PUR-068'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-PUR-069'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-PUR-069'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Secondary', 'Mapping from TG-PUR-069'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-PUR-070'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-PUR-070'
FROM m365_control_catalog WHERE control_id = 'TG-PUR-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-DEF-001'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-DEF-001'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-DEF-002'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-DEF-002'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-DEF-002'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DEF-003'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DEF-003'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-DEF-003'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-DEF-004'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEF-004'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-DEF-005'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-DEF-005'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-DEF-006'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-DEF-006'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DEF-006'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-DEF-006'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-DEF-007'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEF-007'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DEF-007'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-DEF-007'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-DEF-008'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-DEF-008'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-DEF-009'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEF-009'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-DEF-009'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEF-010'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-DEF-010'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-DEF-010'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-DEF-010'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEF-011'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEF-011'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-DEF-012'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DEF-012'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-DEF-013'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEF-013'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Secondary', 'Mapping from TG-DEF-014'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEF-014'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-DEF-014'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-DEF-015'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-DEF-015'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-DEF-016'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEF-016'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DEF-017'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DEF-017'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEF-018'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-DEF-018'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-DEF-019'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-DEF-019'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-DEF-019'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-DEF-020'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-DEF-020'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-DEF-020'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-DEF-021'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEF-021'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-DEF-022'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-DEF-023'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEF-023'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-DEF-023'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEF-024'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-DEF-024'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-DEF-024'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DEF-025'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-DEF-025'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-DEF-026'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-DEF-026'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-DEF-027'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-DEF-027'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-DEF-028'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Secondary', 'Mapping from TG-DEF-028'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-DEF-029'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEF-029'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-DEF-029'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-DEF-030'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Secondary', 'Mapping from TG-DEF-030'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-DEF-030'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEF-030'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEF-031'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-DEF-031'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-DEF-031'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DEF-032'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-DEF-032'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Secondary', 'Mapping from TG-DEF-032'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DEF-033'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEF-033'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DEF-033'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-DEF-034'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-DEF-034'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEF-035'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-DEF-035'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-DEF-036'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Secondary', 'Mapping from TG-DEF-036'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-DEF-036'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-DEF-037'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Secondary', 'Mapping from TG-DEF-037'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DEF-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEF-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Secondary', 'Mapping from TG-DEF-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DEF-038'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-DEF-039'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEF-039'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-DEF-040'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-DEF-040'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-DEF-040'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-DEF-040'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEF-041'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-DEF-041'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-DEF-041'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-DEF-042'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEF-042'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-DEF-042'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-DEF-043'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-DEF-043'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-DEF-043'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DEF-044'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-DEF-044'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-DEF-045'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-DEF-045'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-DEF-046'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-DEF-046'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-DEF-047'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DEF-047'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-DEF-047'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-DEF-048'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-DEF-048'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-DEF-048'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DEF-049'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-DEF-049'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Secondary', 'Mapping from TG-DEF-050'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-DEF-050'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-DEF-051'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-DEF-051'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEF-052'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-DEF-052'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-DEF-053'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-DEF-053'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DEF-054'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-DEF-054'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-DEF-054'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEF-055'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-DEF-055'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-DEF-056'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-DEF-056'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-DEF-056'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-DEF-057'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Secondary', 'Mapping from TG-DEF-057'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DEF-057'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEF-058'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DEF-058'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-DEF-058'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-DEF-059'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DEF-059'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-DEF-059'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DEF-060'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-DEF-060'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DEF-060'
FROM m365_control_catalog WHERE control_id = 'TG-DEF-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-INT-001'
FROM m365_control_catalog WHERE control_id = 'TG-INT-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-INT-001'
FROM m365_control_catalog WHERE control_id = 'TG-INT-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-INT-001'
FROM m365_control_catalog WHERE control_id = 'TG-INT-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-001'
FROM m365_control_catalog WHERE control_id = 'TG-INT-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-002'
FROM m365_control_catalog WHERE control_id = 'TG-INT-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-INT-002'
FROM m365_control_catalog WHERE control_id = 'TG-INT-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-INT-003'
FROM m365_control_catalog WHERE control_id = 'TG-INT-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-INT-003'
FROM m365_control_catalog WHERE control_id = 'TG-INT-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-INT-004'
FROM m365_control_catalog WHERE control_id = 'TG-INT-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-INT-004'
FROM m365_control_catalog WHERE control_id = 'TG-INT-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-INT-004'
FROM m365_control_catalog WHERE control_id = 'TG-INT-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-INT-005'
FROM m365_control_catalog WHERE control_id = 'TG-INT-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-005'
FROM m365_control_catalog WHERE control_id = 'TG-INT-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-INT-005'
FROM m365_control_catalog WHERE control_id = 'TG-INT-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-INT-006'
FROM m365_control_catalog WHERE control_id = 'TG-INT-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-INT-006'
FROM m365_control_catalog WHERE control_id = 'TG-INT-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-INT-007'
FROM m365_control_catalog WHERE control_id = 'TG-INT-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-INT-007'
FROM m365_control_catalog WHERE control_id = 'TG-INT-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-007'
FROM m365_control_catalog WHERE control_id = 'TG-INT-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-INT-008'
FROM m365_control_catalog WHERE control_id = 'TG-INT-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-INT-008'
FROM m365_control_catalog WHERE control_id = 'TG-INT-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-INT-009'
FROM m365_control_catalog WHERE control_id = 'TG-INT-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-INT-009'
FROM m365_control_catalog WHERE control_id = 'TG-INT-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-INT-009'
FROM m365_control_catalog WHERE control_id = 'TG-INT-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-010'
FROM m365_control_catalog WHERE control_id = 'TG-INT-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-010'
FROM m365_control_catalog WHERE control_id = 'TG-INT-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-INT-010'
FROM m365_control_catalog WHERE control_id = 'TG-INT-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-INT-011'
FROM m365_control_catalog WHERE control_id = 'TG-INT-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-INT-011'
FROM m365_control_catalog WHERE control_id = 'TG-INT-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-011'
FROM m365_control_catalog WHERE control_id = 'TG-INT-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-INT-011'
FROM m365_control_catalog WHERE control_id = 'TG-INT-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-012'
FROM m365_control_catalog WHERE control_id = 'TG-INT-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-INT-012'
FROM m365_control_catalog WHERE control_id = 'TG-INT-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-INT-012'
FROM m365_control_catalog WHERE control_id = 'TG-INT-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-013'
FROM m365_control_catalog WHERE control_id = 'TG-INT-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-INT-013'
FROM m365_control_catalog WHERE control_id = 'TG-INT-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-INT-013'
FROM m365_control_catalog WHERE control_id = 'TG-INT-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-INT-014'
FROM m365_control_catalog WHERE control_id = 'TG-INT-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-INT-014'
FROM m365_control_catalog WHERE control_id = 'TG-INT-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-INT-014'
FROM m365_control_catalog WHERE control_id = 'TG-INT-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-015'
FROM m365_control_catalog WHERE control_id = 'TG-INT-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-INT-015'
FROM m365_control_catalog WHERE control_id = 'TG-INT-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-016'
FROM m365_control_catalog WHERE control_id = 'TG-INT-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-INT-016'
FROM m365_control_catalog WHERE control_id = 'TG-INT-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-INT-016'
FROM m365_control_catalog WHERE control_id = 'TG-INT-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-INT-016'
FROM m365_control_catalog WHERE control_id = 'TG-INT-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-017'
FROM m365_control_catalog WHERE control_id = 'TG-INT-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-INT-017'
FROM m365_control_catalog WHERE control_id = 'TG-INT-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-017'
FROM m365_control_catalog WHERE control_id = 'TG-INT-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-INT-018'
FROM m365_control_catalog WHERE control_id = 'TG-INT-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-INT-019'
FROM m365_control_catalog WHERE control_id = 'TG-INT-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-INT-019'
FROM m365_control_catalog WHERE control_id = 'TG-INT-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-INT-019'
FROM m365_control_catalog WHERE control_id = 'TG-INT-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-INT-020'
FROM m365_control_catalog WHERE control_id = 'TG-INT-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-020'
FROM m365_control_catalog WHERE control_id = 'TG-INT-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Secondary', 'Mapping from TG-INT-020'
FROM m365_control_catalog WHERE control_id = 'TG-INT-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-INT-020'
FROM m365_control_catalog WHERE control_id = 'TG-INT-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-INT-021'
FROM m365_control_catalog WHERE control_id = 'TG-INT-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-INT-021'
FROM m365_control_catalog WHERE control_id = 'TG-INT-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-INT-021'
FROM m365_control_catalog WHERE control_id = 'TG-INT-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-INT-022'
FROM m365_control_catalog WHERE control_id = 'TG-INT-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-INT-022'
FROM m365_control_catalog WHERE control_id = 'TG-INT-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-INT-023'
FROM m365_control_catalog WHERE control_id = 'TG-INT-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-INT-023'
FROM m365_control_catalog WHERE control_id = 'TG-INT-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-023'
FROM m365_control_catalog WHERE control_id = 'TG-INT-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Secondary', 'Mapping from TG-INT-024'
FROM m365_control_catalog WHERE control_id = 'TG-INT-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-INT-024'
FROM m365_control_catalog WHERE control_id = 'TG-INT-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-INT-025'
FROM m365_control_catalog WHERE control_id = 'TG-INT-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-INT-025'
FROM m365_control_catalog WHERE control_id = 'TG-INT-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-025'
FROM m365_control_catalog WHERE control_id = 'TG-INT-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-INT-026'
FROM m365_control_catalog WHERE control_id = 'TG-INT-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-INT-026'
FROM m365_control_catalog WHERE control_id = 'TG-INT-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-INT-027'
FROM m365_control_catalog WHERE control_id = 'TG-INT-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-INT-027'
FROM m365_control_catalog WHERE control_id = 'TG-INT-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-INT-028'
FROM m365_control_catalog WHERE control_id = 'TG-INT-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Mapping from TG-INT-028'
FROM m365_control_catalog WHERE control_id = 'TG-INT-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-INT-028'
FROM m365_control_catalog WHERE control_id = 'TG-INT-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-INT-029'
FROM m365_control_catalog WHERE control_id = 'TG-INT-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-INT-029'
FROM m365_control_catalog WHERE control_id = 'TG-INT-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-INT-030'
FROM m365_control_catalog WHERE control_id = 'TG-INT-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-INT-030'
FROM m365_control_catalog WHERE control_id = 'TG-INT-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-030'
FROM m365_control_catalog WHERE control_id = 'TG-INT-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-INT-031'
FROM m365_control_catalog WHERE control_id = 'TG-INT-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-INT-031'
FROM m365_control_catalog WHERE control_id = 'TG-INT-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-INT-031'
FROM m365_control_catalog WHERE control_id = 'TG-INT-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-INT-032'
FROM m365_control_catalog WHERE control_id = 'TG-INT-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-INT-032'
FROM m365_control_catalog WHERE control_id = 'TG-INT-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-033'
FROM m365_control_catalog WHERE control_id = 'TG-INT-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-INT-033'
FROM m365_control_catalog WHERE control_id = 'TG-INT-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-INT-034'
FROM m365_control_catalog WHERE control_id = 'TG-INT-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-INT-034'
FROM m365_control_catalog WHERE control_id = 'TG-INT-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-INT-035'
FROM m365_control_catalog WHERE control_id = 'TG-INT-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-INT-035'
FROM m365_control_catalog WHERE control_id = 'TG-INT-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-INT-036'
FROM m365_control_catalog WHERE control_id = 'TG-INT-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-INT-037'
FROM m365_control_catalog WHERE control_id = 'TG-INT-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-INT-037'
FROM m365_control_catalog WHERE control_id = 'TG-INT-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-037'
FROM m365_control_catalog WHERE control_id = 'TG-INT-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-038'
FROM m365_control_catalog WHERE control_id = 'TG-INT-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-INT-038'
FROM m365_control_catalog WHERE control_id = 'TG-INT-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-INT-039'
FROM m365_control_catalog WHERE control_id = 'TG-INT-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-039'
FROM m365_control_catalog WHERE control_id = 'TG-INT-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-040'
FROM m365_control_catalog WHERE control_id = 'TG-INT-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-040'
FROM m365_control_catalog WHERE control_id = 'TG-INT-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-INT-041'
FROM m365_control_catalog WHERE control_id = 'TG-INT-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-041'
FROM m365_control_catalog WHERE control_id = 'TG-INT-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-INT-042'
FROM m365_control_catalog WHERE control_id = 'TG-INT-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-INT-042'
FROM m365_control_catalog WHERE control_id = 'TG-INT-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-INT-042'
FROM m365_control_catalog WHERE control_id = 'TG-INT-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-INT-043'
FROM m365_control_catalog WHERE control_id = 'TG-INT-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-INT-043'
FROM m365_control_catalog WHERE control_id = 'TG-INT-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-INT-044'
FROM m365_control_catalog WHERE control_id = 'TG-INT-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-INT-044'
FROM m365_control_catalog WHERE control_id = 'TG-INT-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-INT-044'
FROM m365_control_catalog WHERE control_id = 'TG-INT-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-INT-044'
FROM m365_control_catalog WHERE control_id = 'TG-INT-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-INT-045'
FROM m365_control_catalog WHERE control_id = 'TG-INT-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-INT-045'
FROM m365_control_catalog WHERE control_id = 'TG-INT-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-INT-046'
FROM m365_control_catalog WHERE control_id = 'TG-INT-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-INT-046'
FROM m365_control_catalog WHERE control_id = 'TG-INT-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-INT-047'
FROM m365_control_catalog WHERE control_id = 'TG-INT-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-047'
FROM m365_control_catalog WHERE control_id = 'TG-INT-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-INT-047'
FROM m365_control_catalog WHERE control_id = 'TG-INT-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-INT-048'
FROM m365_control_catalog WHERE control_id = 'TG-INT-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-048'
FROM m365_control_catalog WHERE control_id = 'TG-INT-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-INT-048'
FROM m365_control_catalog WHERE control_id = 'TG-INT-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-INT-049'
FROM m365_control_catalog WHERE control_id = 'TG-INT-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-INT-049'
FROM m365_control_catalog WHERE control_id = 'TG-INT-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-INT-049'
FROM m365_control_catalog WHERE control_id = 'TG-INT-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-050'
FROM m365_control_catalog WHERE control_id = 'TG-INT-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-INT-050'
FROM m365_control_catalog WHERE control_id = 'TG-INT-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-050'
FROM m365_control_catalog WHERE control_id = 'TG-INT-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-INT-051'
FROM m365_control_catalog WHERE control_id = 'TG-INT-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-INT-051'
FROM m365_control_catalog WHERE control_id = 'TG-INT-051';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-052'
FROM m365_control_catalog WHERE control_id = 'TG-INT-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-INT-052'
FROM m365_control_catalog WHERE control_id = 'TG-INT-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-INT-052'
FROM m365_control_catalog WHERE control_id = 'TG-INT-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-052'
FROM m365_control_catalog WHERE control_id = 'TG-INT-052';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-INT-053'
FROM m365_control_catalog WHERE control_id = 'TG-INT-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-INT-053'
FROM m365_control_catalog WHERE control_id = 'TG-INT-053';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-INT-054'
FROM m365_control_catalog WHERE control_id = 'TG-INT-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-054'
FROM m365_control_catalog WHERE control_id = 'TG-INT-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-INT-054'
FROM m365_control_catalog WHERE control_id = 'TG-INT-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Secondary', 'Mapping from TG-INT-054'
FROM m365_control_catalog WHERE control_id = 'TG-INT-054';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-055'
FROM m365_control_catalog WHERE control_id = 'TG-INT-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-INT-055'
FROM m365_control_catalog WHERE control_id = 'TG-INT-055';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-056'
FROM m365_control_catalog WHERE control_id = 'TG-INT-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-INT-056'
FROM m365_control_catalog WHERE control_id = 'TG-INT-056';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-INT-057'
FROM m365_control_catalog WHERE control_id = 'TG-INT-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-INT-057'
FROM m365_control_catalog WHERE control_id = 'TG-INT-057';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-INT-058'
FROM m365_control_catalog WHERE control_id = 'TG-INT-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-INT-058'
FROM m365_control_catalog WHERE control_id = 'TG-INT-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-INT-058'
FROM m365_control_catalog WHERE control_id = 'TG-INT-058';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-INT-059'
FROM m365_control_catalog WHERE control_id = 'TG-INT-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-059'
FROM m365_control_catalog WHERE control_id = 'TG-INT-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-INT-059'
FROM m365_control_catalog WHERE control_id = 'TG-INT-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-INT-059'
FROM m365_control_catalog WHERE control_id = 'TG-INT-059';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-INT-060'
FROM m365_control_catalog WHERE control_id = 'TG-INT-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-INT-060'
FROM m365_control_catalog WHERE control_id = 'TG-INT-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-INT-060'
FROM m365_control_catalog WHERE control_id = 'TG-INT-060';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-INT-061'
FROM m365_control_catalog WHERE control_id = 'TG-INT-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-INT-061'
FROM m365_control_catalog WHERE control_id = 'TG-INT-061';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-INT-062'
FROM m365_control_catalog WHERE control_id = 'TG-INT-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-062'
FROM m365_control_catalog WHERE control_id = 'TG-INT-062';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-063'
FROM m365_control_catalog WHERE control_id = 'TG-INT-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-INT-063'
FROM m365_control_catalog WHERE control_id = 'TG-INT-063';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-INT-064'
FROM m365_control_catalog WHERE control_id = 'TG-INT-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-INT-064'
FROM m365_control_catalog WHERE control_id = 'TG-INT-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-INT-064'
FROM m365_control_catalog WHERE control_id = 'TG-INT-064';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-INT-065'
FROM m365_control_catalog WHERE control_id = 'TG-INT-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-INT-065'
FROM m365_control_catalog WHERE control_id = 'TG-INT-065';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Secondary', 'Mapping from TG-INT-066'
FROM m365_control_catalog WHERE control_id = 'TG-INT-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-INT-066'
FROM m365_control_catalog WHERE control_id = 'TG-INT-066';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-INT-067'
FROM m365_control_catalog WHERE control_id = 'TG-INT-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-INT-067'
FROM m365_control_catalog WHERE control_id = 'TG-INT-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-INT-067'
FROM m365_control_catalog WHERE control_id = 'TG-INT-067';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-INT-068'
FROM m365_control_catalog WHERE control_id = 'TG-INT-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Secondary', 'Mapping from TG-INT-068'
FROM m365_control_catalog WHERE control_id = 'TG-INT-068';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-INT-069'
FROM m365_control_catalog WHERE control_id = 'TG-INT-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-INT-069'
FROM m365_control_catalog WHERE control_id = 'TG-INT-069';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Secondary', 'Mapping from TG-INT-070'
FROM m365_control_catalog WHERE control_id = 'TG-INT-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-INT-070'
FROM m365_control_catalog WHERE control_id = 'TG-INT-070';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-INT-071'
FROM m365_control_catalog WHERE control_id = 'TG-INT-071';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-071'
FROM m365_control_catalog WHERE control_id = 'TG-INT-071';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-INT-072'
FROM m365_control_catalog WHERE control_id = 'TG-INT-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-INT-072'
FROM m365_control_catalog WHERE control_id = 'TG-INT-072';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-INT-073'
FROM m365_control_catalog WHERE control_id = 'TG-INT-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-INT-073'
FROM m365_control_catalog WHERE control_id = 'TG-INT-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-INT-073'
FROM m365_control_catalog WHERE control_id = 'TG-INT-073';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-INT-074'
FROM m365_control_catalog WHERE control_id = 'TG-INT-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-INT-074'
FROM m365_control_catalog WHERE control_id = 'TG-INT-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-INT-074'
FROM m365_control_catalog WHERE control_id = 'TG-INT-074';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-INT-075'
FROM m365_control_catalog WHERE control_id = 'TG-INT-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-INT-075'
FROM m365_control_catalog WHERE control_id = 'TG-INT-075';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-INT-076'
FROM m365_control_catalog WHERE control_id = 'TG-INT-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-INT-076'
FROM m365_control_catalog WHERE control_id = 'TG-INT-076';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-INT-077'
FROM m365_control_catalog WHERE control_id = 'TG-INT-077';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-INT-077'
FROM m365_control_catalog WHERE control_id = 'TG-INT-077';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-INT-078'
FROM m365_control_catalog WHERE control_id = 'TG-INT-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-INT-078'
FROM m365_control_catalog WHERE control_id = 'TG-INT-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-INT-078'
FROM m365_control_catalog WHERE control_id = 'TG-INT-078';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-INT-079'
FROM m365_control_catalog WHERE control_id = 'TG-INT-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-INT-079'
FROM m365_control_catalog WHERE control_id = 'TG-INT-079';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-INT-080'
FROM m365_control_catalog WHERE control_id = 'TG-INT-080';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-INT-080'
FROM m365_control_catalog WHERE control_id = 'TG-INT-080';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-DLP-001'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DLP-001'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Secondary', 'Mapping from TG-DLP-001'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-DLP-001'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-DLP-002'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-DLP-002'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DLP-002'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DLP-003'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Secondary', 'Mapping from TG-DLP-003'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-DLP-003'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DLP-004'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DLP-004'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.1', 'Primary', 'Mapping from TG-DLP-005'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-DLP-005'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DLP-005'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-DLP-006'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-DLP-006'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DLP-006'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-DLP-007'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DLP-007'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DLP-008'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-DLP-008'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-DLP-009'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-DLP-010'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-DLP-010'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DLP-011'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-DLP-011'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-DLP-011'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-DLP-012'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-DLP-012'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-DLP-012'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-DLP-013'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-DLP-013'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-DLP-013'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-DLP-013'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-DLP-014'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-DLP-014'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-DLP-015'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-DLP-016'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-DLP-016'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-DLP-016'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-DLP-017'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-DLP-017'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DLP-018'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-DLP-018'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Secondary', 'Mapping from TG-DLP-019'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Secondary', 'Mapping from TG-DLP-019'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-DLP-020'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DLP-020'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-DLP-020'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-DLP-021'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-DLP-021'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Secondary', 'Mapping from TG-DLP-021'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-DLP-021'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-DLP-022'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-DLP-022'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DLP-023'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-DLP-024'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Secondary', 'Mapping from TG-DLP-024'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-DLP-025'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-DLP-025'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-DLP-026'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-DLP-027'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-DLP-027'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-DLP-028'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-DLP-028'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-DLP-029'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-DLP-029'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DLP-029'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-DLP-029'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-DLP-030'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-DLP-030'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Secondary', 'Mapping from TG-DLP-030'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-DLP-031'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-DLP-031'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-DLP-032'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-DLP-032'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-DLP-033'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-DLP-033'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-DLP-034'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-DLP-034'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-DLP-035'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-DLP-035'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-DLP-035'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-DLP-035'
FROM m365_control_catalog WHERE control_id = 'TG-DLP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-AUD-001'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AUD-001'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-AUD-002'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-AUD-002'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-AUD-003'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-AUD-003'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-AUD-003'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-AUD-004'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-AUD-004'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-AUD-005'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-AUD-005'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-AUD-006'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-AUD-006'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-AUD-007'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-AUD-007'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-AUD-008'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-AUD-008'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-AUD-008'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-AUD-009'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-AUD-009'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-AUD-010'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-AUD-010'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-AUD-010'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-AUD-010'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-AUD-011'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-AUD-011'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-AUD-011'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-AUD-012'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-AUD-012'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-AUD-013'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-AUD-013'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-AUD-013'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-AUD-014'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-AUD-014'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-AUD-015'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-AUD-015'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Secondary', 'Mapping from TG-AUD-016'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-AUD-016'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-AUD-016'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-AUD-017'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AUD-017'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-AUD-018'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AUD-018'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-AUD-019'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Secondary', 'Mapping from TG-AUD-019'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-AUD-020'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-AUD-020'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-AUD-020'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-AUD-021'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-AUD-021'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-AUD-021'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-AUD-021'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-AUD-022'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AUD-022'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-AUD-022'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-AUD-023'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-AUD-023'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-AUD-024'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.2', 'Primary', 'Mapping from TG-AUD-024'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-AUD-024'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-AUD-024'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-AUD-025'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-AUD-025'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-AUD-026'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-AUD-026'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-AUD-026'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-AUD-027'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-AUD-027'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-AUD-027'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-AUD-028'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-AUD-028'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-AUD-028'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-AUD-029'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-AUD-029'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-AUD-029'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Secondary', 'Mapping from TG-AUD-030'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-AUD-030'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AUD-030'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-AUD-030'
FROM m365_control_catalog WHERE control_id = 'TG-AUD-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Secondary', 'Mapping from TG-MON-001'
FROM m365_control_catalog WHERE control_id = 'TG-MON-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-MON-001'
FROM m365_control_catalog WHERE control_id = 'TG-MON-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-MON-001'
FROM m365_control_catalog WHERE control_id = 'TG-MON-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-MON-002'
FROM m365_control_catalog WHERE control_id = 'TG-MON-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-MON-002'
FROM m365_control_catalog WHERE control_id = 'TG-MON-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-MON-003'
FROM m365_control_catalog WHERE control_id = 'TG-MON-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-003'
FROM m365_control_catalog WHERE control_id = 'TG-MON-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-MON-003'
FROM m365_control_catalog WHERE control_id = 'TG-MON-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-MON-003'
FROM m365_control_catalog WHERE control_id = 'TG-MON-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-MON-004'
FROM m365_control_catalog WHERE control_id = 'TG-MON-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-MON-004'
FROM m365_control_catalog WHERE control_id = 'TG-MON-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-MON-005'
FROM m365_control_catalog WHERE control_id = 'TG-MON-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Secondary', 'Mapping from TG-MON-005'
FROM m365_control_catalog WHERE control_id = 'TG-MON-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-006'
FROM m365_control_catalog WHERE control_id = 'TG-MON-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-MON-006'
FROM m365_control_catalog WHERE control_id = 'TG-MON-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-MON-006'
FROM m365_control_catalog WHERE control_id = 'TG-MON-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-MON-007'
FROM m365_control_catalog WHERE control_id = 'TG-MON-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-MON-007'
FROM m365_control_catalog WHERE control_id = 'TG-MON-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-MON-007'
FROM m365_control_catalog WHERE control_id = 'TG-MON-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-MON-008'
FROM m365_control_catalog WHERE control_id = 'TG-MON-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-MON-008'
FROM m365_control_catalog WHERE control_id = 'TG-MON-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-MON-008'
FROM m365_control_catalog WHERE control_id = 'TG-MON-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-MON-008'
FROM m365_control_catalog WHERE control_id = 'TG-MON-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Secondary', 'Mapping from TG-MON-009'
FROM m365_control_catalog WHERE control_id = 'TG-MON-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-MON-009'
FROM m365_control_catalog WHERE control_id = 'TG-MON-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-MON-009'
FROM m365_control_catalog WHERE control_id = 'TG-MON-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-MON-009'
FROM m365_control_catalog WHERE control_id = 'TG-MON-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-010'
FROM m365_control_catalog WHERE control_id = 'TG-MON-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-MON-010'
FROM m365_control_catalog WHERE control_id = 'TG-MON-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-MON-010'
FROM m365_control_catalog WHERE control_id = 'TG-MON-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-MON-010'
FROM m365_control_catalog WHERE control_id = 'TG-MON-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-MON-011'
FROM m365_control_catalog WHERE control_id = 'TG-MON-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-MON-011'
FROM m365_control_catalog WHERE control_id = 'TG-MON-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-MON-012'
FROM m365_control_catalog WHERE control_id = 'TG-MON-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-MON-012'
FROM m365_control_catalog WHERE control_id = 'TG-MON-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-MON-012'
FROM m365_control_catalog WHERE control_id = 'TG-MON-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-MON-013'
FROM m365_control_catalog WHERE control_id = 'TG-MON-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-013'
FROM m365_control_catalog WHERE control_id = 'TG-MON-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-MON-013'
FROM m365_control_catalog WHERE control_id = 'TG-MON-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-MON-013'
FROM m365_control_catalog WHERE control_id = 'TG-MON-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-MON-014'
FROM m365_control_catalog WHERE control_id = 'TG-MON-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-MON-014'
FROM m365_control_catalog WHERE control_id = 'TG-MON-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-MON-015'
FROM m365_control_catalog WHERE control_id = 'TG-MON-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Secondary', 'Mapping from TG-MON-015'
FROM m365_control_catalog WHERE control_id = 'TG-MON-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-MON-016'
FROM m365_control_catalog WHERE control_id = 'TG-MON-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-MON-016'
FROM m365_control_catalog WHERE control_id = 'TG-MON-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-MON-016'
FROM m365_control_catalog WHERE control_id = 'TG-MON-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-MON-016'
FROM m365_control_catalog WHERE control_id = 'TG-MON-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-MON-017'
FROM m365_control_catalog WHERE control_id = 'TG-MON-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-MON-017'
FROM m365_control_catalog WHERE control_id = 'TG-MON-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-MON-018'
FROM m365_control_catalog WHERE control_id = 'TG-MON-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-MON-018'
FROM m365_control_catalog WHERE control_id = 'TG-MON-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-MON-018'
FROM m365_control_catalog WHERE control_id = 'TG-MON-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-MON-018'
FROM m365_control_catalog WHERE control_id = 'TG-MON-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-MON-019'
FROM m365_control_catalog WHERE control_id = 'TG-MON-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-MON-019'
FROM m365_control_catalog WHERE control_id = 'TG-MON-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-MON-019'
FROM m365_control_catalog WHERE control_id = 'TG-MON-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-MON-020'
FROM m365_control_catalog WHERE control_id = 'TG-MON-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-MON-020'
FROM m365_control_catalog WHERE control_id = 'TG-MON-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-MON-021'
FROM m365_control_catalog WHERE control_id = 'TG-MON-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-MON-021'
FROM m365_control_catalog WHERE control_id = 'TG-MON-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-MON-021'
FROM m365_control_catalog WHERE control_id = 'TG-MON-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-MON-022'
FROM m365_control_catalog WHERE control_id = 'TG-MON-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-MON-022'
FROM m365_control_catalog WHERE control_id = 'TG-MON-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-MON-023'
FROM m365_control_catalog WHERE control_id = 'TG-MON-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-MON-023'
FROM m365_control_catalog WHERE control_id = 'TG-MON-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-MON-024'
FROM m365_control_catalog WHERE control_id = 'TG-MON-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-024'
FROM m365_control_catalog WHERE control_id = 'TG-MON-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-MON-024'
FROM m365_control_catalog WHERE control_id = 'TG-MON-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-MON-025'
FROM m365_control_catalog WHERE control_id = 'TG-MON-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-025'
FROM m365_control_catalog WHERE control_id = 'TG-MON-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-MON-026'
FROM m365_control_catalog WHERE control_id = 'TG-MON-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-MON-026'
FROM m365_control_catalog WHERE control_id = 'TG-MON-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-MON-026'
FROM m365_control_catalog WHERE control_id = 'TG-MON-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-027'
FROM m365_control_catalog WHERE control_id = 'TG-MON-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-MON-027'
FROM m365_control_catalog WHERE control_id = 'TG-MON-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-MON-027'
FROM m365_control_catalog WHERE control_id = 'TG-MON-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-MON-028'
FROM m365_control_catalog WHERE control_id = 'TG-MON-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Secondary', 'Mapping from TG-MON-028'
FROM m365_control_catalog WHERE control_id = 'TG-MON-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-MON-028'
FROM m365_control_catalog WHERE control_id = 'TG-MON-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-MON-028'
FROM m365_control_catalog WHERE control_id = 'TG-MON-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-MON-029'
FROM m365_control_catalog WHERE control_id = 'TG-MON-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-029'
FROM m365_control_catalog WHERE control_id = 'TG-MON-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Secondary', 'Mapping from TG-MON-029'
FROM m365_control_catalog WHERE control_id = 'TG-MON-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-MON-030'
FROM m365_control_catalog WHERE control_id = 'TG-MON-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-MON-030'
FROM m365_control_catalog WHERE control_id = 'TG-MON-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-MON-031'
FROM m365_control_catalog WHERE control_id = 'TG-MON-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-MON-031'
FROM m365_control_catalog WHERE control_id = 'TG-MON-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-MON-031'
FROM m365_control_catalog WHERE control_id = 'TG-MON-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-MON-032'
FROM m365_control_catalog WHERE control_id = 'TG-MON-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-MON-032'
FROM m365_control_catalog WHERE control_id = 'TG-MON-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-MON-032'
FROM m365_control_catalog WHERE control_id = 'TG-MON-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-MON-033'
FROM m365_control_catalog WHERE control_id = 'TG-MON-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-MON-033'
FROM m365_control_catalog WHERE control_id = 'TG-MON-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-MON-034'
FROM m365_control_catalog WHERE control_id = 'TG-MON-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Mapping from TG-MON-034'
FROM m365_control_catalog WHERE control_id = 'TG-MON-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-MON-035'
FROM m365_control_catalog WHERE control_id = 'TG-MON-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-MON-035'
FROM m365_control_catalog WHERE control_id = 'TG-MON-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Mapping from TG-NET-001'
FROM m365_control_catalog WHERE control_id = 'TG-NET-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-NET-001'
FROM m365_control_catalog WHERE control_id = 'TG-NET-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-NET-002'
FROM m365_control_catalog WHERE control_id = 'TG-NET-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-NET-002'
FROM m365_control_catalog WHERE control_id = 'TG-NET-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-NET-003'
FROM m365_control_catalog WHERE control_id = 'TG-NET-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-NET-003'
FROM m365_control_catalog WHERE control_id = 'TG-NET-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-NET-003'
FROM m365_control_catalog WHERE control_id = 'TG-NET-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-NET-003'
FROM m365_control_catalog WHERE control_id = 'TG-NET-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-NET-004'
FROM m365_control_catalog WHERE control_id = 'TG-NET-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-NET-004'
FROM m365_control_catalog WHERE control_id = 'TG-NET-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-NET-005'
FROM m365_control_catalog WHERE control_id = 'TG-NET-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-NET-005'
FROM m365_control_catalog WHERE control_id = 'TG-NET-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-NET-005'
FROM m365_control_catalog WHERE control_id = 'TG-NET-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-NET-005'
FROM m365_control_catalog WHERE control_id = 'TG-NET-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-NET-006'
FROM m365_control_catalog WHERE control_id = 'TG-NET-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-NET-006'
FROM m365_control_catalog WHERE control_id = 'TG-NET-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-NET-006'
FROM m365_control_catalog WHERE control_id = 'TG-NET-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-NET-007'
FROM m365_control_catalog WHERE control_id = 'TG-NET-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-NET-007'
FROM m365_control_catalog WHERE control_id = 'TG-NET-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-NET-007'
FROM m365_control_catalog WHERE control_id = 'TG-NET-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-NET-008'
FROM m365_control_catalog WHERE control_id = 'TG-NET-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-NET-008'
FROM m365_control_catalog WHERE control_id = 'TG-NET-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-NET-008'
FROM m365_control_catalog WHERE control_id = 'TG-NET-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-NET-009'
FROM m365_control_catalog WHERE control_id = 'TG-NET-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-NET-010'
FROM m365_control_catalog WHERE control_id = 'TG-NET-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-NET-010'
FROM m365_control_catalog WHERE control_id = 'TG-NET-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-NET-010'
FROM m365_control_catalog WHERE control_id = 'TG-NET-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-NET-011'
FROM m365_control_catalog WHERE control_id = 'TG-NET-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-NET-012'
FROM m365_control_catalog WHERE control_id = 'TG-NET-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-NET-012'
FROM m365_control_catalog WHERE control_id = 'TG-NET-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-NET-012'
FROM m365_control_catalog WHERE control_id = 'TG-NET-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-NET-013'
FROM m365_control_catalog WHERE control_id = 'TG-NET-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-NET-013'
FROM m365_control_catalog WHERE control_id = 'TG-NET-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-NET-013'
FROM m365_control_catalog WHERE control_id = 'TG-NET-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-NET-014'
FROM m365_control_catalog WHERE control_id = 'TG-NET-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Secondary', 'Mapping from TG-NET-014'
FROM m365_control_catalog WHERE control_id = 'TG-NET-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-NET-015'
FROM m365_control_catalog WHERE control_id = 'TG-NET-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-NET-015'
FROM m365_control_catalog WHERE control_id = 'TG-NET-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-NET-016'
FROM m365_control_catalog WHERE control_id = 'TG-NET-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-NET-016'
FROM m365_control_catalog WHERE control_id = 'TG-NET-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-NET-016'
FROM m365_control_catalog WHERE control_id = 'TG-NET-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-NET-017'
FROM m365_control_catalog WHERE control_id = 'TG-NET-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-NET-017'
FROM m365_control_catalog WHERE control_id = 'TG-NET-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-NET-018'
FROM m365_control_catalog WHERE control_id = 'TG-NET-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-NET-018'
FROM m365_control_catalog WHERE control_id = 'TG-NET-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-NET-018'
FROM m365_control_catalog WHERE control_id = 'TG-NET-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-NET-018'
FROM m365_control_catalog WHERE control_id = 'TG-NET-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-NET-019'
FROM m365_control_catalog WHERE control_id = 'TG-NET-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-NET-019'
FROM m365_control_catalog WHERE control_id = 'TG-NET-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-NET-019'
FROM m365_control_catalog WHERE control_id = 'TG-NET-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-NET-020'
FROM m365_control_catalog WHERE control_id = 'TG-NET-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-NET-020'
FROM m365_control_catalog WHERE control_id = 'TG-NET-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-NET-021'
FROM m365_control_catalog WHERE control_id = 'TG-NET-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-NET-021'
FROM m365_control_catalog WHERE control_id = 'TG-NET-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-NET-021'
FROM m365_control_catalog WHERE control_id = 'TG-NET-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-NET-021'
FROM m365_control_catalog WHERE control_id = 'TG-NET-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-NET-022'
FROM m365_control_catalog WHERE control_id = 'TG-NET-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-NET-022'
FROM m365_control_catalog WHERE control_id = 'TG-NET-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-NET-023'
FROM m365_control_catalog WHERE control_id = 'TG-NET-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Primary', 'Mapping from TG-NET-023'
FROM m365_control_catalog WHERE control_id = 'TG-NET-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-NET-024'
FROM m365_control_catalog WHERE control_id = 'TG-NET-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-NET-024'
FROM m365_control_catalog WHERE control_id = 'TG-NET-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Secondary', 'Mapping from TG-NET-025'
FROM m365_control_catalog WHERE control_id = 'TG-NET-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-NET-025'
FROM m365_control_catalog WHERE control_id = 'TG-NET-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-NET-025'
FROM m365_control_catalog WHERE control_id = 'TG-NET-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-NET-026'
FROM m365_control_catalog WHERE control_id = 'TG-NET-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-NET-026'
FROM m365_control_catalog WHERE control_id = 'TG-NET-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-NET-026'
FROM m365_control_catalog WHERE control_id = 'TG-NET-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-NET-026'
FROM m365_control_catalog WHERE control_id = 'TG-NET-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-NET-027'
FROM m365_control_catalog WHERE control_id = 'TG-NET-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-NET-027'
FROM m365_control_catalog WHERE control_id = 'TG-NET-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-NET-028'
FROM m365_control_catalog WHERE control_id = 'TG-NET-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-NET-028'
FROM m365_control_catalog WHERE control_id = 'TG-NET-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-NET-028'
FROM m365_control_catalog WHERE control_id = 'TG-NET-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-NET-029'
FROM m365_control_catalog WHERE control_id = 'TG-NET-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-NET-029'
FROM m365_control_catalog WHERE control_id = 'TG-NET-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Secondary', 'Mapping from TG-NET-029'
FROM m365_control_catalog WHERE control_id = 'TG-NET-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-NET-030'
FROM m365_control_catalog WHERE control_id = 'TG-NET-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Secondary', 'Mapping from TG-NET-030'
FROM m365_control_catalog WHERE control_id = 'TG-NET-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-GOV-001'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-GOV-001'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Secondary', 'Mapping from TG-GOV-001'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-GOV-002'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Secondary', 'Mapping from TG-GOV-002'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-GOV-003'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-GOV-003'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-GOV-003'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Secondary', 'Mapping from TG-GOV-003'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-GOV-004'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-GOV-004'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-GOV-005'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-GOV-005'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-GOV-006'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-GOV-006'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-GOV-006'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-GOV-007'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-GOV-007'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-GOV-008'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-GOV-008'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-GOV-008'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Mapping from TG-GOV-009'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-GOV-009'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-GOV-009'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-GOV-010'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-GOV-010'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-GOV-010'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-GOV-011'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-GOV-011'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-GOV-011'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-GOV-012'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-GOV-012'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Mapping from TG-GOV-013'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-GOV-013'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-GOV-013'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-GOV-014'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-GOV-014'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-GOV-015'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-GOV-015'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Secondary', 'Mapping from TG-GOV-016'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-GOV-016'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-GOV-016'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-GOV-016'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-GOV-017'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-GOV-017'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-GOV-017'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-GOV-017'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-GOV-018'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-GOV-018'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-GOV-019'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-GOV-019'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Secondary', 'Mapping from TG-GOV-020'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-GOV-020'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-GOV-020'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-GOV-020'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Primary', 'Mapping from TG-GOV-021'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-GOV-021'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-GOV-022'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Mapping from TG-GOV-022'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-GOV-023'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-GOV-023'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-GOV-023'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-GOV-023'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-GOV-024'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-GOV-024'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-GOV-024'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-GOV-025'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-GOV-025'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-GOV-026'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-GOV-026'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-GOV-027'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Secondary', 'Mapping from TG-GOV-027'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-GOV-027'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-GOV-028'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-GOV-028'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-GOV-029'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-GOV-029'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-GOV-029'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Secondary', 'Mapping from TG-GOV-030'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-GOV-030'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Secondary', 'Mapping from TG-GOV-031'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-GOV-031'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-GOV-032'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-GOV-032'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-GOV-033'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-GOV-033'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-GOV-033'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-GOV-033'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-GOV-034'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-GOV-035'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-GOV-035'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Mapping from TG-GOV-036'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-GOV-036'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-GOV-037'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-GOV-037'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-GOV-038'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-GOV-038'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Primary', 'Mapping from TG-GOV-038'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-GOV-039'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-GOV-039'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-GOV-039'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-GOV-039'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-GOV-040'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-GOV-040'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-GOV-040'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Secondary', 'Mapping from TG-GOV-040'
FROM m365_control_catalog WHERE control_id = 'TG-GOV-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-BKP-001'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-BKP-001'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-BKP-002'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-BKP-002'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-BKP-002'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-BKP-002'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-BKP-003'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-BKP-003'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-BKP-003'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-BKP-004'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-BKP-004'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'Mapping from TG-BKP-004'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-BKP-004'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-BKP-005'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-BKP-005'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-BKP-006'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-BKP-006'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-BKP-006'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Primary', 'Mapping from TG-BKP-007'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-BKP-007'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-BKP-008'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-BKP-008'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-BKP-008'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Secondary', 'Mapping from TG-BKP-008'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-BKP-009'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-BKP-009'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-BKP-010'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-BKP-010'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-BKP-010'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-BKP-011'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-BKP-011'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-BKP-012'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-BKP-012'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-BKP-013'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-BKP-013'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-BKP-013'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-BKP-014'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-BKP-014'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-BKP-014'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-BKP-015'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-BKP-015'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-BKP-015'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-BKP-016'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-BKP-017'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-BKP-017'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-BKP-017'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-BKP-018'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-BKP-018'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-BKP-018'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-BKP-019'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-BKP-019'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-BKP-019'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-BKP-020'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-BKP-020'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-BKP-020'
FROM m365_control_catalog WHERE control_id = 'TG-BKP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-COMP-001'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-COMP-001'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-COMP-001'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-COMP-002'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-COMP-002'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-COMP-003'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-COMP-004'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '3.1.1', 'Primary', 'Mapping from TG-COMP-004'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-COMP-004'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-COMP-004'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-COMP-005'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-COMP-005'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-COMP-005'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.3', 'Primary', 'Mapping from TG-COMP-005'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-COMP-006'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-COMP-006'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-COMP-007'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-COMP-007'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-COMP-007'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-COMP-008'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Mapping from TG-COMP-008'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-COMP-009'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-COMP-009'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-COMP-010'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-COMP-010'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.10', 'Primary', 'Mapping from TG-COMP-011'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-COMP-011'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-COMP-012'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-COMP-012'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-COMP-013'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Secondary', 'Mapping from TG-COMP-013'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-COMP-014'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-COMP-014'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-COMP-014'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Mapping from TG-COMP-015'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-COMP-015'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-COMP-016'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-COMP-016'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-COMP-017'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-COMP-017'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-COMP-017'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-COMP-018'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-COMP-018'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Secondary', 'Mapping from TG-COMP-018'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Primary', 'Mapping from TG-COMP-019'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-COMP-020'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-COMP-020'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Mapping from TG-COMP-021'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-COMP-021'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Secondary', 'Mapping from TG-COMP-022'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-COMP-022'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-COMP-023'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Secondary', 'Mapping from TG-COMP-023'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-COMP-024'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-COMP-024'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-COMP-024'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-COMP-025'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-COMP-026'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-COMP-026'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-COMP-027'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-COMP-027'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-COMP-027'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-COMP-027'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-COMP-028'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.7', 'Secondary', 'Mapping from TG-COMP-028'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Secondary', 'Mapping from TG-COMP-029'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-COMP-029'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-COMP-029'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-COMP-029'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Secondary', 'Mapping from TG-COMP-030'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-COMP-030'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-COMP-030'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-COMP-031'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Secondary', 'Mapping from TG-COMP-031'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-COMP-031'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-031';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-COMP-032'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Secondary', 'Mapping from TG-COMP-032'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Secondary', 'Mapping from TG-COMP-032'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-032';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-COMP-033'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-033';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-COMP-034'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-COMP-034'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-034';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-COMP-035'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Primary', 'Mapping from TG-COMP-035'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-COMP-035'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-035';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-COMP-036'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-COMP-036'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-COMP-036'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-036';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Secondary', 'Mapping from TG-COMP-037'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-COMP-037'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-037';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-COMP-038'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-COMP-038'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-COMP-038'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-038';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Secondary', 'Mapping from TG-COMP-039'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Secondary', 'Mapping from TG-COMP-039'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-039';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-COMP-040'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Secondary', 'Mapping from TG-COMP-040'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-COMP-040'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-040';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-COMP-041'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '116', 'Primary', 'Mapping from TG-COMP-041'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Primary', 'Mapping from TG-COMP-041'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-041';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.8', 'Primary', 'Mapping from TG-COMP-042'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-COMP-042'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-COMP-042'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-COMP-042'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-042';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-COMP-043'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-COMP-043'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-COMP-043'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-043';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-COMP-044'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.2.1', 'Secondary', 'Mapping from TG-COMP-044'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-044';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-COMP-045'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-COMP-045'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-COMP-045'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-COMP-045'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-045';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-COMP-046'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-COMP-046'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-COMP-046'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-046';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.4.2', 'Secondary', 'Mapping from TG-COMP-047'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Primary', 'Mapping from TG-COMP-047'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-COMP-047'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-047';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-COMP-048'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Secondary', 'Mapping from TG-COMP-048'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-COMP-048'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.12.4', 'Secondary', 'Mapping from TG-COMP-048'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-048';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-COMP-049'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Secondary', 'Mapping from TG-COMP-049'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-049';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-COMP-050'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-COMP-050'
FROM m365_control_catalog WHERE control_id = 'TG-COMP-050';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-AI-001'
FROM m365_control_catalog WHERE control_id = 'TG-AI-001';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Secondary', 'Mapping from TG-AI-002'
FROM m365_control_catalog WHERE control_id = 'TG-AI-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Primary', 'Mapping from TG-AI-002'
FROM m365_control_catalog WHERE control_id = 'TG-AI-002';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AI-003'
FROM m365_control_catalog WHERE control_id = 'TG-AI-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Secondary', 'Mapping from TG-AI-003'
FROM m365_control_catalog WHERE control_id = 'TG-AI-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.2', 'Secondary', 'Mapping from TG-AI-003'
FROM m365_control_catalog WHERE control_id = 'TG-AI-003';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-AI-004'
FROM m365_control_catalog WHERE control_id = 'TG-AI-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-AI-004'
FROM m365_control_catalog WHERE control_id = 'TG-AI-004';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Primary', 'Mapping from TG-AI-005'
FROM m365_control_catalog WHERE control_id = 'TG-AI-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Primary', 'Mapping from TG-AI-005'
FROM m365_control_catalog WHERE control_id = 'TG-AI-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-AI-005'
FROM m365_control_catalog WHERE control_id = 'TG-AI-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AI-005'
FROM m365_control_catalog WHERE control_id = 'TG-AI-005';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Primary', 'Mapping from TG-AI-006'
FROM m365_control_catalog WHERE control_id = 'TG-AI-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.10.2', 'Primary', 'Mapping from TG-AI-006'
FROM m365_control_catalog WHERE control_id = 'TG-AI-006';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Mapping from TG-AI-007'
FROM m365_control_catalog WHERE control_id = 'TG-AI-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-AI-007'
FROM m365_control_catalog WHERE control_id = 'TG-AI-007';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.1.1', 'Secondary', 'Mapping from TG-AI-008'
FROM m365_control_catalog WHERE control_id = 'TG-AI-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-AI-008'
FROM m365_control_catalog WHERE control_id = 'TG-AI-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-AI-008'
FROM m365_control_catalog WHERE control_id = 'TG-AI-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-AI-008'
FROM m365_control_catalog WHERE control_id = 'TG-AI-008';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Secondary', 'Mapping from TG-AI-009'
FROM m365_control_catalog WHERE control_id = 'TG-AI-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Networks', 'Primary', 'Mapping from TG-AI-009'
FROM m365_control_catalog WHERE control_id = 'TG-AI-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Mapping from TG-AI-009'
FROM m365_control_catalog WHERE control_id = 'TG-AI-009';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-3', 'Primary', 'Mapping from TG-AI-010'
FROM m365_control_catalog WHERE control_id = 'TG-AI-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AI-010'
FROM m365_control_catalog WHERE control_id = 'TG-AI-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Mapping from TG-AI-010'
FROM m365_control_catalog WHERE control_id = 'TG-AI-010';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-2', 'Primary', 'Mapping from TG-AI-011'
FROM m365_control_catalog WHERE control_id = 'TG-AI-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '6.1.1', 'Secondary', 'Mapping from TG-AI-011'
FROM m365_control_catalog WHERE control_id = 'TG-AI-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-AI-011'
FROM m365_control_catalog WHERE control_id = 'TG-AI-011';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-AI-012'
FROM m365_control_catalog WHERE control_id = 'TG-AI-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Secondary', 'Mapping from TG-AI-012'
FROM m365_control_catalog WHERE control_id = 'TG-AI-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Primary', 'Mapping from TG-AI-012'
FROM m365_control_catalog WHERE control_id = 'TG-AI-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.3', 'Primary', 'Mapping from TG-AI-012'
FROM m365_control_catalog WHERE control_id = 'TG-AI-012';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'Mapping from TG-AI-013'
FROM m365_control_catalog WHERE control_id = 'TG-AI-013';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Secondary', 'Mapping from TG-AI-014'
FROM m365_control_catalog WHERE control_id = 'TG-AI-014';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AI-015'
FROM m365_control_catalog WHERE control_id = 'TG-AI-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Primary', 'Mapping from TG-AI-015'
FROM m365_control_catalog WHERE control_id = 'TG-AI-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Mapping from TG-AI-015'
FROM m365_control_catalog WHERE control_id = 'TG-AI-015';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Devices', 'Primary', 'Mapping from TG-AI-016'
FROM m365_control_catalog WHERE control_id = 'TG-AI-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-AI-016'
FROM m365_control_catalog WHERE control_id = 'TG-AI-016';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.8.2', 'Secondary', 'Mapping from TG-AI-017'
FROM m365_control_catalog WHERE control_id = 'TG-AI-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '2.1.6', 'Secondary', 'Mapping from TG-AI-017'
FROM m365_control_catalog WHERE control_id = 'TG-AI-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Mapping from TG-AI-017'
FROM m365_control_catalog WHERE control_id = 'TG-AI-017';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '321', 'Primary', 'Mapping from TG-AI-018'
FROM m365_control_catalog WHERE control_id = 'TG-AI-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SC-7', 'Primary', 'Mapping from TG-AI-018'
FROM m365_control_catalog WHERE control_id = 'TG-AI-018';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-3', 'Secondary', 'Mapping from TG-AI-019'
FROM m365_control_catalog WHERE control_id = 'TG-AI-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-AI-019'
FROM m365_control_catalog WHERE control_id = 'TG-AI-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Mapping from TG-AI-019'
FROM m365_control_catalog WHERE control_id = 'TG-AI-019';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Identity', 'Secondary', 'Mapping from TG-AI-020'
FROM m365_control_catalog WHERE control_id = 'TG-AI-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC7.2', 'Primary', 'Mapping from TG-AI-020'
FROM m365_control_catalog WHERE control_id = 'TG-AI-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Primary', 'Mapping from TG-AI-020'
FROM m365_control_catalog WHERE control_id = 'TG-AI-020';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Applications', 'Secondary', 'Mapping from TG-AI-021'
FROM m365_control_catalog WHERE control_id = 'TG-AI-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '109', 'Secondary', 'Mapping from TG-AI-021'
FROM m365_control_catalog WHERE control_id = 'TG-AI-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Mapping from TG-AI-021'
FROM m365_control_catalog WHERE control_id = 'TG-AI-021';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'SOC2', 'CC6.2', 'Primary', 'Mapping from TG-AI-022'
FROM m365_control_catalog WHERE control_id = 'TG-AI-022';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Mapping from TG-AI-023'
FROM m365_control_catalog WHERE control_id = 'TG-AI-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.19', 'Secondary', 'Mapping from TG-AI-023'
FROM m365_control_catalog WHERE control_id = 'TG-AI-023';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Mapping from TG-AI-024'
FROM m365_control_catalog WHERE control_id = 'TG-AI-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Data', 'Primary', 'Mapping from TG-AI-024'
FROM m365_control_catalog WHERE control_id = 'TG-AI-024';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Zero Trust', 'Infrastructure', 'Primary', 'Mapping from TG-AI-025'
FROM m365_control_catalog WHERE control_id = 'TG-AI-025';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-2', 'Primary', 'Mapping from TG-AI-026'
FROM m365_control_catalog WHERE control_id = 'TG-AI-026';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '320', 'Secondary', 'Mapping from TG-AI-027'
FROM m365_control_catalog WHERE control_id = 'TG-AI-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Mapping from TG-AI-027'
FROM m365_control_catalog WHERE control_id = 'TG-AI-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'ISO', 'A.5.3', 'Primary', 'Mapping from TG-AI-027'
FROM m365_control_catalog WHERE control_id = 'TG-AI-027';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-AI-028'
FROM m365_control_catalog WHERE control_id = 'TG-AI-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'AC-12', 'Primary', 'Mapping from TG-AI-028'
FROM m365_control_catalog WHERE control_id = 'TG-AI-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'SC.L2.3.13', 'Primary', 'Mapping from TG-AI-028'
FROM m365_control_catalog WHERE control_id = 'TG-AI-028';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '8.2.1', 'Secondary', 'Mapping from TG-AI-029'
FROM m365_control_catalog WHERE control_id = 'TG-AI-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'CM-3', 'Primary', 'Mapping from TG-AI-029'
FROM m365_control_catalog WHERE control_id = 'TG-AI-029';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '7.2.1', 'Primary', 'Mapping from TG-AI-030'
FROM m365_control_catalog WHERE control_id = 'TG-AI-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'Secure Score', '104', 'Primary', 'Mapping from TG-AI-030'
FROM m365_control_catalog WHERE control_id = 'TG-AI-030';

INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CMMC', 'AC.L2.1.1', 'Secondary', 'Mapping from TG-AI-030'
FROM m365_control_catalog WHERE control_id = 'TG-AI-030';

