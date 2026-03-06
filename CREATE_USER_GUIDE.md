# 👤 How to Create Users in Prisma

## 📋 User Table Fields

Based on the Prisma schema, here's what you need to fill in the `users` table:

### Required Fields:
- **id** (UUID) - Unique identifier
- **companyId** (UUID) - Reference to company
- **role** (String) - User role: `owner`, `hr`, `manager`, or `employee`

### Optional Fields:
- **email** (String) - User's email address
- **createdAt** (DateTime) - Auto-generated
- **updatedAt** (DateTime) - Auto-generated

---

## 🚀 Method 1: Using Prisma Studio (Easiest)

### Step 1: Open Prisma Studio
```bash
cd backend
npx prisma studio
```

This opens a GUI at **http://localhost:5555**

### Step 2: Create a Company First

1. Click on **"companies"** table
2. Click **"Add record"**
3. Fill in:
   - **id**: Leave blank (auto-generated) OR use: `gen_random_uuid()`
   - **name**: `"My Company"`
   - **plan**: `"starter"` (or `"pro"`, `"enterprise"`)
   - **configJson**: `{}` (default)
4. Click **"Save 1 change"**
5. **Copy the generated company ID** (you'll need this)

### Step 3: Create a User

1. Click on **"users"** table
2. Click **"Add record"**
3. Fill in:
   - **id**: Generate a UUID (see below)
   - **companyId**: Paste the company ID from Step 2
   - **role**: Choose one:
     - `owner` - Full access
     - `hr` - HR access
     - `manager` - Manager access
     - `employee` - Employee access
   - **email**: `admin@example.com`
4. Click **"Save 1 change"**

### How to Generate UUID:
```bash
# In terminal:
node -e "console.log(require('crypto').randomUUID())"
```

Or use an online UUID generator: https://www.uuidgenerator.net/

---

## 🔧 Method 2: Using SQL (Direct Database)

### Step 1: Connect to Database
```bash
cd backend
npx prisma db execute --stdin
```

### Step 2: Create Company
```sql
INSERT INTO companies (id, name, plan, config_json, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'My Company',
  'starter',
  '{}',
  NOW(),
  NOW()
)
RETURNING id;
```

**Copy the returned ID!**

### Step 3: Create User
```sql
INSERT INTO users (id, company_id, role, email, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'PASTE-COMPANY-ID-HERE',
  'owner',
  'admin@example.com',
  NOW(),
  NOW()
);
```

---

## 💻 Method 3: Using Node.js Script

Create a file `backend/scripts/create-user.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser() {
  try {
    // Create company
    const company = await prisma.company.create({
      data: {
        name: 'My Company',
        plan: 'starter',
        configJson: {},
      },
    });

    console.log('✅ Company created:', company.id);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        companyId: company.id,
        role: 'owner',
        email: 'admin@example.com',
      },
    });

    console.log('✅ User created:', user.id);
    console.log('\n📧 Email:', user.email);
    console.log('🔑 Role:', user.role);
    console.log('🏢 Company ID:', user.companyId);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
```

Run it:
```bash
cd backend
node scripts/create-user.js
```

---

## 🔐 Important Notes

### ⚠️ Password Field Missing!

The current schema **doesn't have a password field** in the User table. This means:

1. **Authentication is not fully implemented** in the backend
2. You need to add a password field to the schema

### To Add Password Field:

Edit `backend/prisma/schema.prisma`:

```prisma
model User {
  id         String          @id @db.Uuid
  companyId  String          @map("company_id") @db.Uuid
  role       String
  email      String?
  password   String?         // ADD THIS LINE
  createdAt  DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt  DateTime        @default(now()) @map("updated_at") @db.Timestamptz(6)
  company    Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)
  layout     DashboardLayout?

  @@map("users")
}
```

Then run migration:
```bash
cd backend
npx prisma migrate dev --name add_user_password
```

---

## 🎯 Quick Setup Example

Here's a complete example to get you started:

### 1. Open Prisma Studio
```bash
cd backend
npx prisma studio
```

### 2. Create Company
- Table: **companies**
- Click: **Add record**
- Fill:
  - name: `Demo Company`
  - plan: `starter`
- Save and **copy the ID**

### 3. Create User
- Table: **users**
- Click: **Add record**
- Fill:
  - id: `550e8400-e29b-41d4-a716-446655440000` (or generate new)
  - companyId: `<paste-company-id>`
  - role: `owner`
  - email: `admin@demo.com`
- Save

### 4. Test Login
Go to http://localhost:3000/login and try logging in with:
- Email: `admin@demo.com`
- Password: (won't work yet - see note above)

---

## 🔄 Alternative: Mock Authentication

For testing, you can temporarily bypass authentication:

### Option 1: Auto-login in Development

Edit `frontend/src/components/ProtectedRoute.tsx`:

```typescript
// Add this at the top of checkAuth function:
if (process.env.NODE_ENV === 'development') {
  setUser({
    id: '550e8400-e29b-41d4-a716-446655440000',
    companyId: 'YOUR-COMPANY-ID',
    role: 'owner',
    email: 'admin@demo.com',
  });
  setLoading(false);
  return;
}
```

### Option 2: Skip Login Page

Edit `frontend/src/app/layout.tsx` to remove ProtectedRoute temporarily.

---

## 📊 User Roles Explained

| Role | Access Level | Can Do |
|------|-------------|--------|
| **owner** | Full access | Everything - configure formulas, approve changes, view all data |
| **hr** | HR access | View all employees, manage risk flags, no salary data |
| **manager** | Team access | View/rate own team, request formula overrides |
| **employee** | Self access | View own scorecard, submit peer feedback |

---

## ✅ Verification Checklist

After creating a user, verify:

- [ ] Company exists in `companies` table
- [ ] User exists in `users` table
- [ ] User's `companyId` matches company's `id`
- [ ] User has valid `role` (owner/hr/manager/employee)
- [ ] User has `email` set
- [ ] Can see user in Prisma Studio

---

## 🆘 Troubleshooting

### Error: "Foreign key constraint failed"
**Solution:** Make sure the `companyId` in users table matches an existing company `id`

### Error: "Unique constraint failed"
**Solution:** The user `id` must be unique. Generate a new UUID.

### Error: "Invalid UUID"
**Solution:** Make sure you're using a valid UUID format:
```
550e8400-e29b-41d4-a716-446655440000
```

### Can't login after creating user
**Solution:** The backend needs password authentication implemented. See "Password Field Missing" section above.

---

## 🎉 Summary

**Minimum Required Data:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "companyId": "YOUR-COMPANY-ID",
  "role": "owner",
  "email": "admin@example.com"
}
```

**Recommended Method:** Use Prisma Studio (Method 1) - it's the easiest!

---

**Next Steps:**
1. Create a company
2. Create a user with that company ID
3. Add password field to schema (if needed)
4. Test login at http://localhost:3000/login

---

**Version:** 1.0.0  
**Last Updated:** March 4, 2026
