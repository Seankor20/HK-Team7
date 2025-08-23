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

### **Profiles Table**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
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

### **Quizzes Table**
```sql
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own quiz results" ON quizzes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" ON quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow public read access for leaderboard
CREATE POLICY "Anyone can view quiz results for leaderboard" ON quizzes
  FOR SELECT USING (true);
```

### **Chat Messages Table**
```sql
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
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
- ✅ **User Profiles** - Store and manage user information
- ✅ **Quiz Results** - Save and track quiz scores
- ✅ **Leaderboard** - Display top quiz performers
- ✅ **Chat History** - Store AI chat conversations
- ✅ **Real-time Updates** - Live data synchronization

## 🚨 **Security Notes**

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Public read access is limited to necessary data (leaderboard)
- Environment variables keep your keys secure

## 🔧 **Troubleshooting**

**Common Issues:**
- **Connection Error**: Check your environment variables
- **Table Not Found**: Run the SQL commands in Supabase
- **Permission Denied**: Check RLS policies
- **Type Errors**: Ensure TypeScript types match your schema

## 📚 **Next Steps**

1. **Update Quiz Component** - Save results to database
2. **Add Authentication UI** - Login/signup forms
3. **Implement Leaderboard** - Show top scores
4. **Add Chat History** - Store AI conversations
5. **User Profiles** - Manage user information

Your Supabase integration is now ready! 🎉
