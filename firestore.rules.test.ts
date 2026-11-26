/**
 * Security Rules TDD Suite (Phase 0) for Club MC Web (`firestore.rules`).
 * Run against the Firebase Emulator Suite (`@firebase/rules-unit-testing`) to verify
 * that all 12 "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid?: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Lead Create',
    collectionPath: 'leads/lead-shadow-1',
    operation: 'create',
    auth: null,
    payload: {
      id: 'lead-shadow-1',
      studentName: 'Mateo Rojas',
      ageCategory: 'Sub-13',
      parentName: 'Carlos Rojas',
      parentPhone: '+591 71234567',
      branch: 'Complejo Litoral',
      createdAtLabel: 'Hoy',
      status: 'Nuevo',
      isAdmin: true,
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Status Spoofing on Lead Create',
    collectionPath: 'leads/lead-spoof-2',
    operation: 'create',
    auth: null,
    payload: {
      id: 'lead-spoof-2',
      studentName: 'Mateo Rojas',
      ageCategory: 'Sub-13',
      parentName: 'Carlos Rojas',
      parentPhone: '+591 71234567',
      branch: 'Complejo Litoral',
      createdAtLabel: 'Hoy',
      status: 'Inscrito',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Fake Client Timestamp on Lead Create',
    collectionPath: 'leads/lead-ts-3',
    operation: 'create',
    auth: null,
    payload: {
      id: 'lead-ts-3',
      studentName: 'Mateo Rojas',
      ageCategory: 'Sub-13',
      parentName: 'Carlos Rojas',
      parentPhone: '+591 71234567',
      branch: 'Complejo Litoral',
      createdAtLabel: 'Hoy',
      status: 'Nuevo',
      createdAt: '2026-01-01T00:00:00Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'PII Scraping via leads list',
    collectionPath: 'leads',
    operation: 'list',
    auth: { uid: 'non-admin-1', email: 'visitor@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Unverified Email Admin Spoof',
    collectionPath: 'site_config/content',
    operation: 'update',
    auth: { uid: 'spoof-uid', email: 'lemuzmujiquita@gmail.com', email_verified: false },
    payload: { kind: 'content', payload: {}, updatedBy: 'spoof-uid' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Self-Assigned Admin Privilege Escalation',
    collectionPath: 'admins/attacker-uid',
    operation: 'create',
    auth: { uid: 'attacker-uid', email: 'attacker@example.com', email_verified: true },
    payload: { email: 'attacker@example.com', role: 'admin' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Unauthorized CMS Content Overwrite',
    collectionPath: 'site_config/content',
    operation: 'create',
    auth: null,
    payload: { kind: 'content', payload: {}, updatedBy: 'anon' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Path ID Poisoning',
    collectionPath: `leads/${'a'.repeat(200)}`,
    operation: 'create',
    auth: null,
    payload: { id: 'a'.repeat(200), studentName: 'Test' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Oversized String Resource Exhaustion',
    collectionPath: 'leads/lead-big-9',
    operation: 'create',
    auth: null,
    payload: {
      id: 'lead-big-9',
      studentName: 'X'.repeat(50000),
      ageCategory: 'Sub-11',
      parentName: 'Parent',
      parentPhone: '+591 70000000',
      branch: 'Litoral',
      createdAtLabel: 'Hoy',
      status: 'Nuevo',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Product Price Type Poisoning',
    collectionPath: 'products/prod-1',
    operation: 'update',
    auth: { uid: 'admin-1', email: 'lemuzmujiquita@gmail.com', email_verified: true },
    payload: { id: 'prod-1', name: 'Camiseta', category: 'camisetas', price: 'gratis' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'News Array Flood Poisoning',
    collectionPath: 'news/art-1',
    operation: 'create',
    auth: { uid: 'admin-1', email: 'lemuzmujiquita@gmail.com', email_verified: true },
    payload: { id: 'art-1', title: 'Test', content: Array(120).fill('spam') },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Immutable createdAt Tampering on Lead Update',
    collectionPath: 'leads/lead-1',
    operation: 'update',
    auth: { uid: 'admin-1', email: 'lemuzmujiquita@gmail.com', email_verified: true },
    payload: { status: 'Contactado', createdAt: '1999-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
];
