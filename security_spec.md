# Security Specification — Club MC Web Firestore Rules

## 1. Data Invariants
1. **Default-Deny Catch-All**: Any path not explicitly matched is denied for all reads and writes.
2. **Verified Admin RBAC**: Administrative writes to `site_config`, `products`, `players`, `news`, `leads`, and `admins` require an authenticated user with `request.auth.token.email_verified == true` who is either the bootstrapped owner (`lemuzmujiquita@gmail.com`) or listed in `/admins/{uid}`.
3. **PII Isolation (`leads`)**: Enrollment leads contain personal phone numbers and names. Public visitors may ONLY `create` a new lead with `status == 'Nuevo'` and `createdAt == request.time`. Only verified admins may `get`, `list`, `update`, or `delete` leads.
4. **Strict Schema & Bounds**: Every document write validates exact required and allowed keys (`hasAll` + `hasOnly`), field types, string `.size()` ceilings, array `.size()` ceilings, valid document IDs (`^[a-zA-Z0-9_\-]+$`), and server timestamps (`request.time`).
5. **Immutable Audit Fields**: `leads.createdAt` and `admins.createdAt` cannot be modified after creation.
6. **Terminal State Protection**: Once a lead reaches `status == 'Inscrito'`, only an authenticated admin can modify it (non-admins are already denied all updates).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Lead Create**: Submitting `{ ...validLead, isAdmin: true }` → MUST return `PERMISSION_DENIED`.
2. **Pre-Approved Status Spoofing on Lead Create**: Submitting a public lead with `status: 'Inscrito'` instead of `'Nuevo'` → MUST return `PERMISSION_DENIED`.
3. **Fake Client Timestamp on Lead Create**: Submitting `createdAt: '2026-01-01'` instead of `serverTimestamp()` (`request.time`) → MUST return `PERMISSION_DENIED`.
4. **PII Scraping (`leads` list/get)**: Unauthenticated or non-admin user attempts `getDocs(collection(db, 'leads'))` or `getDoc(doc(db, 'leads', 'lead-1'))` → MUST return `PERMISSION_DENIED`.
5. **Email Verification Spoof Attack**: Authenticated user with `email: 'lemuzmujiquita@gmail.com'` and `email_verified: false` attempts to write `site_config/content` → MUST return `PERMISSION_DENIED`.
6. **Self-Assigned Admin Escalation**: Non-admin authenticated user attempts to create `/admins/{ownUid}` → MUST return `PERMISSION_DENIED`.
7. **Unauthorized CMS Overwrite**: Unauthenticated or non-admin user attempts `setDoc(doc(db, 'site_config', 'content'), ...)` → MUST return `PERMISSION_DENIED`.
8. **ID Poisoning Attack**: Attempting to write `/leads/` with a 300-character ID or invalid symbols (`../admins/1`) → MUST return `PERMISSION_DENIED`.
9. **Denial-of-Wallet Oversized String**: Submitting a public lead with a 50KB `studentName` → MUST return `PERMISSION_DENIED`.
10. **Value Poisoning on Product Update**: Admin sends `price: "gratis"` (wrong type) or negative stock `-50` → MUST return `PERMISSION_DENIED`.
11. **Array Flood on News Article**: Admin sends `content` array with > 100 paragraphs or non-string first element → MUST return `PERMISSION_DENIED`.
12. **Immutable Field Tampering**: Attempting to alter `createdAt` during an admin lead status update → MUST return `PERMISSION_DENIED`.
