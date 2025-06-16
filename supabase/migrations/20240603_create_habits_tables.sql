-- 创建习惯表
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '⭐',
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  target_frequency INTEGER DEFAULT 1, -- 每天目标次数
  reminder_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建习惯记录表
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建奖励表
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'item',
  icon TEXT NOT NULL DEFAULT '🎁',
  is_active BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT -1, -- -1 表示无限库存
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建兑换记录表
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, fulfilled, cancelled
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- 创建社区帖子表（扩展现有posts表）
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 创建评论点赞表
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- 创建帖子点赞表
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 启用行级安全策略
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 习惯表策略
CREATE POLICY "Users can manage their own habits" ON public.habits
  FOR ALL USING (auth.uid() = user_id);

-- 习惯记录表策略
CREATE POLICY "Users can manage their own habit logs" ON public.habit_logs
  FOR ALL USING (auth.uid() = user_id);

-- 奖励表策略（所有人可读，只有管理员可写）
CREATE POLICY "Anyone can read rewards" ON public.rewards
  FOR SELECT USING (true);

-- 兑换记录策略
CREATE POLICY "Users can manage their own redemptions" ON public.redemptions
  FOR ALL USING (auth.uid() = user_id);

-- 点赞策略
CREATE POLICY "Users can manage their own likes" ON public.comment_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own post likes" ON public.post_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read likes" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read post likes" ON public.post_likes
  FOR SELECT USING (true);

-- 创建更新时间戳触发器
CREATE TRIGGER handle_habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 插入默认奖励
INSERT INTO public.rewards (name, description, points_required, category, icon) VALUES
('精美贴纸套装', '包含50张可爱卡通贴纸，可以装饰日记本和作业本', 50, 'item', '🎨'),
('小玩具汽车', '合金材质小汽车模型，做工精细，适合收藏', 100, 'item', '🚗'),
('亲子电影时光', '和爸爸妈妈一起看一场喜欢的电影，还有爆米花哦', 80, 'experience', '🎬'),
('周末晚睡30分钟', '周末可以比平时晚睡30分钟的特殊权限', 60, 'privilege', '🌙'),
('儿童绘本', '精选优质儿童绘本，培养阅读兴趣', 120, 'item', '📚'),
('游乐园一日游', '和家人一起去游乐园玩一整天', 300, 'experience', '🎡')
ON CONFLICT DO NOTHING;
