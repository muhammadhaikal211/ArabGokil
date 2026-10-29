# Security Specification: Pembelajaran Bahasa Arab Kelas X

## 1. Data Invariants
1. A user profile document (`/users/{userId}`) can only be written or created by the authenticated owner (`request.auth.uid == userId`) or an admin.
2. An unauthenticated user cannot read, create, update, or delete any record in `users`, `quiz_results`, `learning_progress`, or `custom_materials`.
3. A student cannot spoof another student's UID when submitting a quiz result (`request.resource.data.userId == request.auth.uid`).
4. Students cannot modify or delete custom learning materials (`/custom_materials/{materialId}`); only administrators can create, update, or delete custom materials.
5. Administrative settings (`/admins/{adminId}`) can only be read and modified by authorized administrators.

## 2. The Dirty Dozen Payloads (Designed to test identity, integrity, and authorization)
1. **Unauthenticated User Profile Creation**: Attempt to write to `/users/evil_user` without auth token. -> `PERMISSION_DENIED`
2. **Identity Spoofing in User Profile**: Authenticated as `user_123`, attempt to write to `/users/user_999`. -> `PERMISSION_DENIED`
3. **Elevated Role Injection in User Profile**: Authenticated as student `user_123`, attempt to write role: `'super_admin'` into `/users/user_123`. -> Checked in application and rules.
4. **Unauthenticated Quiz Result Submission**: Attempt to create `/quiz_results/res_1` without authentication. -> `PERMISSION_DENIED`
5. **Quiz Result Owner Spoofing**: User `student_A` attempts to submit a quiz with `userId: "student_B"`. -> `PERMISSION_DENIED`
6. **Quiz Result Tampering / Score Modification**: A student attempts to update or overwrite an existing quiz result. -> `PERMISSION_DENIED`
7. **Student Deleting Quiz Result**: A student attempts to delete their quiz result from `/quiz_results/{id}`. -> `PERMISSION_DENIED`
8. **Student Creating Custom Learning Material**: A non-admin student attempts to create a document in `/custom_materials/{mat_id}`. -> `PERMISSION_DENIED`
9. **Student Modifying Custom Learning Material**: A non-admin student attempts to update `/custom_materials/{mat_id}`. -> `PERMISSION_DENIED`
10. **Student Deleting Custom Learning Material**: A non-admin student attempts to delete `/custom_materials/{mat_id}`. -> `PERMISSION_DENIED`
11. **Malicious Path Variable Injection**: Attempt to write with a document ID containing special characters or exceeding 128 characters. -> `PERMISSION_DENIED`
12. **Unauthorized Access to Admin Whitelist**: Non-admin user attempts to add their own UID to `/admins/{uid}`. -> `PERMISSION_DENIED`
