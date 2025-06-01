-- 插入测试用户（这里使用固定的 UUID 作为示例）
INSERT INTO auth.users (id, email)
VALUES 
  ('d0fc7e7c-6d7c-4b2a-9035-3437c8e3c47e'::uuid, 'test1@example.com'),
  ('b6a9c0e9-8f0a-4e6a-9c5b-8d1a3c2e1f4d'::uuid, 'test2@example.com')
ON CONFLICT (id) DO NOTHING;

-- 插入测试帖子
INSERT INTO public.posts (title, body, author)
VALUES 
  ('第一篇测试帖子', '这是第一篇测试帖子的内容。我们在测试数据库连接和数据插入。', 'd0fc7e7c-6d7c-4b2a-9035-3437c8e3c47e'::uuid),
  ('育儿经验分享', '分享一些关于如何培养孩子良好习惯的经验...', 'd0fc7e7c-6d7c-4b2a-9035-3437c8e3c47e'::uuid),
  ('周末活动建议', '推荐一些适合亲子互动的周末活动...', 'b6a9c0e9-8f0a-4e6a-9c5b-8d1a3c2e1f4d'::uuid);

-- 插入测试评论
INSERT INTO public.comments (post_id, body, author)
SELECT 
  posts.id,
  '这是一条测试评论，针对帖子ID: ' || posts.id,
  CASE WHEN random() > 0.5 
    THEN 'd0fc7e7c-6d7c-4b2a-9035-3437c8e3c47e'::uuid
    ELSE 'b6a9c0e9-8f0a-4e6a-9c5b-8d1a3c2e1f4d'::uuid
  END
FROM public.posts;
