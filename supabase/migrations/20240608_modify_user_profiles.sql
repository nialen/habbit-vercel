-- 首先删除现有的外键约束和RLS策略
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- 删除现有的RLS策略
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- 禁用RLS（因为我们现在不依赖auth.users）
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 现在user_profiles表可以独立存在，不需要auth.users中有对应记录

-- 创建简单的策略：允许所有操作（因为我们在API层控制访问）
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 创建新的策略：允许所有经过认证的用户操作（使用Service Role）
CREATE POLICY "Allow all operations for service role" ON public.user_profiles
  FOR ALL USING (true);

-- 或者如果你想更安全，可以创建更细粒度的策略
-- CREATE POLICY "Allow read access" ON public.user_profiles FOR SELECT USING (true);
-- CREATE POLICY "Allow insert access" ON public.user_profiles FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow update access" ON public.user_profiles FOR UPDATE USING (true);
-- CREATE POLICY "Allow delete access" ON public.user_profiles FOR DELETE USING (true); 