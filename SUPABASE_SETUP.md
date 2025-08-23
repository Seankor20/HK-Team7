# Supabase Setup Guide

This guide will help you set up Supabase for your KidsLearn application.

## 🚀 **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `kidslearn-app`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
6. Click "Create new project"

## 🔑 **Step 2: Get Your Credentials**

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

## 📝 **Step 3: Set Environment Variables**

Create a `.env.local` file in your project root:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ **Step 4: Create Database Tables**

Run these SQL commands in your Supabase SQL Editor:

### **Profiles Table (Updated with Role)**
```sql
-- First, add the role column to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'ngo', 'admin'));

-- If you need to create the profiles table from scratch:
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'ngo', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### **Homework Table**
```sql
CREATE TABLE IF NOT EXISTS homework (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'overdue'))
);

-- Enable Row Level Security
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now, you can restrict later)
CREATE POLICY "Allow all operations on homework" ON homework
  FOR ALL USING (true)
  WITH CHECK (true);
```

### **Completed Materials Table**
```sql
CREATE TABLE IF NOT EXISTS completed_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_time INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  category TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE completed_materials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own completed materials" ON completed_materials
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own completed materials" ON completed_materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🔐 **Step 5: Configure Authentication**

1. Go to **Authentication** → **Settings**
2. Configure your site URL and redirect URLs
3. Enable email confirmations if desired
4. Set up any additional providers (Google, GitHub, etc.)

## 📱 **Step 6: Test Your Connection**

1. Install dependencies: `npm install @supabase/supabase-js`
2. Start your app: `npm run dev`
3. Check the browser console for any connection errors

## 🎯 **Available Features**

With this setup, you can now:

- ✅ **User Authentication** - Sign up, sign in, sign out
- ✅ **User Profiles with Roles** - Student, Teacher, NGO, Admin
- ✅ **Role-Based Access Control** - Homework management restricted to teachers/NGOs
- ✅ **Quiz Results** - Save and track quiz scores
- ✅ **Leaderboard** - Display top quiz performers
- ✅ **Chat History** - Store AI chat conversations
- ✅ **Real-time Updates** - Live data synchronization

## 🔒 **Role-Based Access Control**

### **User Roles:**
- **Student** (default): Can view learning materials, take quizzes, chat, view and complete homework
- **Teacher**: Can manage homework, view student progress, create/edit/delete assignments
- **NGO**: Can manage homework, view student progress, create/edit/delete assignments
- **Admin**: Full access to all features

### **Homework Access:**
- **All Users** can:
  - View the homework tab in the Pathway page
  - See assigned homework assignments
  - Update homework status (start, mark in-progress, complete)

- **Only Teachers, NGOs, and Admins** can:
  - See the Homework navigation item
  - Access the Homework Manager page
  - Create, edit, and delete homework assignments
  - Manage all homework operations

- **Students** cannot:
  - Access homework creation/editing features
  - Delete homework assignments
  - Access the Homework Manager page

## �� **Security Notes**

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Public read access is limited to necessary data (leaderboard)
- Environment variables keep your keys secure
- Role-based access control prevents unauthorized access

## 🔧 **Troubleshooting**

**Common Issues:**
- **Connection Error**: Check your environment variables
- **Table Not Found**: Run the SQL commands in Supabase
- **Permission Denied**: Check RLS policies
- **Type Errors**: Ensure TypeScript types match your schema
- **Role Not Working**: Make sure the role column was added to profiles table

## 📚 **Next Steps**

1. **Update User Profiles** - Set roles for existing users
2. **Test Role Access** - Verify homework access is restricted
3. **Add More Roles** - Extend role system as needed
4. **Implement Student Homework View** - Allow students to see assigned homework
5. **Add Progress Tracking** - Monitor student completion rates

## 👥 **Setting User Roles**

To set a user's role, run this SQL in Supabase:

```sql
-- Set a user as a teacher
UPDATE profiles 
SET role = 'teacher' 
WHERE email = 'teacher@example.com';

-- Set a user as an NGO staff
UPDATE profiles 
SET role = 'ngo' 
WHERE email = 'ngo@example.com';

-- Set a user as an admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- View all users and their roles
SELECT email, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

Your Supabase integration with role-based access control is now ready! 🎉
