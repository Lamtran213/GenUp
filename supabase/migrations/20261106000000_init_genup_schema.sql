-- ============================================================================
-- GenUp Database Schema, Firebase Google Auth Sync & RLS (Supabase PostgreSQL)
-- Tuân thủ chuẩn bảo mật SRS (NFR-S01 .. NFR-S08) & Supabase Best Practices
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Bảng Tài khoản người dùng (Hỗ trợ cả Firebase Google Auth & Supabase Auth)
create table if not exists public.user_accounts (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text unique,
  email text not null unique,
  full_name text not null default '',
  avatar_url text,
  auth_provider text not null default 'google.com',
  role text not null default 'Parent' check (role in ('Parent', 'Admin', 'ContentExpert')),
  parent_pin_hash text,
  parent_summary_enabled boolean not null default true,
  notify_progress_report boolean not null default true,
  notify_study_reminder boolean not null default true,
  notify_new_content boolean not null default true,
  notify_premium_offer boolean not null default false,
  report_frequency_days int not null default 7 check (report_frequency_days in (7, 14, 30)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Nâng cấp bảng user_accounts nếu đã tạo từ bản trước (gỡ FK cứng vào auth.users để lưu được tài khoản Google từ Firebase)
alter table public.user_accounts drop constraint if exists user_accounts_id_fkey;
alter table public.user_accounts alter column id set default gen_random_uuid();
alter table public.user_accounts add column if not exists firebase_uid text unique;
alter table public.user_accounts add column if not exists avatar_url text;
alter table public.user_accounts add column if not exists auth_provider text not null default 'google.com';
alter table public.user_accounts add column if not exists updated_at timestamptz not null default now();

-- 2. Bảng Hồ sơ Học sinh THCS (Lớp 6 - 9)
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_account_id uuid not null references public.user_accounts(id) on delete cascade,
  invite_code text unique default encode(gen_random_bytes(4), 'hex'),
  nickname text not null check (length(btrim(nickname)) > 0),
  grade int not null default 7 check (grade between 6 and 9),
  interested_topics jsonb not null default '[]'::jsonb,
  avatar_gender text not null default 'Female' check (avatar_gender in ('Male', 'Female')),
  equipped_hair_id text not null default 'hair-bob',
  equipped_outfit_id text not null default 'outfit-uniform',
  equipped_accessory_id text not null default 'acc-none',
  total_xp int not null default 0 check (total_xp >= 0),
  reward_points int not null default 0 check (reward_points >= 0),
  current_streak int not null default 0 check (current_streak >= 0),
  longest_streak int not null default 0 check (longest_streak >= 0),
  last_active_date date,
  streak_milestones_claimed jsonb not null default '[]'::jsonb,
  is_onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_profiles_parent_id on public.student_profiles(parent_account_id);

-- 3. Bảng Thiết bị nhận Push Notification (Firebase Cloud Messaging)
create table if not exists public.user_devices (
  id uuid primary key default gen_random_uuid(),
  user_account_id uuid references public.user_accounts(id) on delete cascade,
  student_profile_id uuid references public.student_profiles(id) on delete cascade,
  fcm_token text not null unique,
  platform text not null default 'web' check (platform in ('web', 'android', 'ios')),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_devices_user_id on public.user_devices(user_account_id);
create index if not exists idx_user_devices_student_id on public.user_devices(student_profile_id);

-- 4. Bảng Bài học có cấu trúc (Learning Modules)
create table if not exists public.learning_modules (
  id text primary key,
  slug text not null unique,
  title text not null,
  summary text not null,
  topic_category text not null check (topic_category in ('Puberty', 'Emotion', 'Boundaries', 'CyberSafety')),
  target_min_grade int not null default 6,
  target_max_grade int not null default 9,
  estimated_minutes int not null default 5,
  xp_reward int not null default 50,
  status text not null default 'Published' check (status in ('Draft', 'PendingReview', 'Approved', 'Published')),
  order_index int not null default 1,
  created_at timestamptz not null default now()
);

-- 5. Bảng Các bước kiến thức trong bài học (Module Steps)
create table if not exists public.module_steps (
  id uuid primary key default gen_random_uuid(),
  module_id text not null references public.learning_modules(id) on delete cascade,
  step_index int not null,
  title text not null,
  content_markdown text not null,
  key_takeaway text not null default '',
  unique (module_id, step_index)
);

create index if not exists idx_module_steps_module_id on public.module_steps(module_id);

-- 6. Bảng Tình huống tương tác (Scenarios)
create table if not exists public.scenarios (
  id text primary key,
  module_id text references public.learning_modules(id) on delete set null,
  title text not null,
  topic_category text not null check (topic_category in ('Puberty', 'Emotion', 'Boundaries', 'CyberSafety')),
  context_description text not null,
  question text not null,
  xp_reward int not null default 30,
  point_reward int not null default 20,
  safety_reminder text not null,
  status text not null default 'Published' check (status in ('Draft', 'Approved', 'Published'))
);

create index if not exists idx_scenarios_module_id on public.scenarios(module_id);

-- 7. Bảng Các phương án lựa chọn trong Tình huống (Scenario Options)
create table if not exists public.scenario_options (
  id text primary key,
  scenario_id text not null references public.scenarios(id) on delete cascade,
  option_text text not null,
  is_recommended boolean not null default false,
  immediate_feedback text not null,
  detailed_explanation text not null
);

create index if not exists idx_scenario_options_scenario_id on public.scenario_options(scenario_id);

-- 8. Bảng Tiến độ Học tập của Học sinh (Learning Progresses - US-09..US-17)
create table if not exists public.learning_progresses (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  module_id text not null references public.learning_modules(id) on delete cascade,
  current_step_index int not null default 0,
  max_step_reached int not null default 0,
  status text not null default 'InProgress' check (status in ('InProgress', 'Completed')),
  first_completion_xp_granted boolean not null default false,
  last_reviewed_date date,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_profile_id, module_id)
);

create index if not exists idx_learning_progresses_student_id on public.learning_progresses(student_profile_id);
create index if not exists idx_learning_progresses_module_id on public.learning_progresses(module_id);

-- 9. Bảng Lịch sử Thực hành Tình huống (Scenario Attempts - Bảo mật NFR-S06)
create table if not exists public.scenario_attempts (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  scenario_id text not null references public.scenarios(id) on delete cascade,
  selected_option_id text not null references public.scenario_options(id) on delete restrict,
  is_recommended_choice boolean not null default false,
  first_pass_xp_granted boolean not null default false,
  attempted_at timestamptz not null default now(),
  unique (student_profile_id, scenario_id)
);

create index if not exists idx_scenario_attempts_student_id on public.scenario_attempts(student_profile_id);
create index if not exists idx_scenario_attempts_scenario_id on public.scenario_attempts(scenario_id);
create index if not exists idx_scenario_attempts_option_id on public.scenario_attempts(selected_option_id);

-- 10. Bảng Sở hữu Vật phẩm Avatar & Huy hiệu (US-27, US-28, US-29)
create table if not exists public.student_avatar_inventories (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  item_id text not null,
  purchased_at timestamptz not null default now(),
  unique (student_profile_id, item_id)
);

create index if not exists idx_avatar_inventories_student_id on public.student_avatar_inventories(student_profile_id);

create table if not exists public.student_badges (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  badge_id text not null,
  unlocked_at timestamptz not null default now(),
  unique (student_profile_id, badge_id)
);

create index if not exists idx_student_badges_student_id on public.student_badges(student_profile_id);

-- 11. Bảng Thuê bao Gói dịch vụ (Subscriptions - US-32, US-49)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  parent_account_id uuid not null references public.user_accounts(id) on delete cascade,
  plan_type text not null default 'Free' check (plan_type in ('Free', 'PremiumMonthly', 'PremiumYearly')),
  status text not null default 'Active' check (status in ('Active', 'Expired', 'Cancelled')),
  amount_paid numeric(12, 2) not null default 0,
  payment_transaction_code text unique,
  start_date timestamptz not null default now(),
  end_date timestamptz
);

create index if not exists idx_subscriptions_parent_id on public.subscriptions(parent_account_id);

-- ============================================================================
-- DỮ LIỆU KHỞI TẠO BÀI HỌC & TÌNH HUỐNG MẪU (SEED DATA)
-- ============================================================================
insert into public.learning_modules (id, slug, title, summary, topic_category, target_min_grade, target_max_grade, estimated_minutes, xp_reward, status, order_index)
values
  ('mod-puberty-01', 'thay-doi-co-the-tuoi-day-thi', 'Hiểu về sự thay đổi cơ thể ở tuổi dậy thì', 'Nhận diện những thay đổi tự nhiên về thể chất, giọng nói, làn da và cách chăm sóc vệ sinh cá nhân khoa học.', 'Puberty', 6, 9, 5, 50, 'Published', 1),
  ('mod-boundaries-01', 'ranh-gioi-co-the-va-su-dong-thuan', 'Ranh giới cơ thể & Quy tắc Nói Không', 'Xác định vùng riêng tư, phân biệt tiếp xúc an toàn - không an toàn và kỹ năng từ chối quyết đoán.', 'Boundaries', 6, 9, 6, 50, 'Published', 2),
  ('mod-emotion-01', 'quan-ly-cam-xuc-va-rung-dong-dau-doi', 'Cảm xúc tuổi mới lớn & Tình bạn lành mạnh', 'Hiểu về tâm trạng nắng mưa thất thường, sự tôn trọng trong tình bạn và cách xử lý khi bối rối.', 'Emotion', 6, 9, 5, 50, 'Published', 3),
  ('mod-cyber-01', 'an-toan-tren-khong-gian-mang', 'Bảo vệ hình ảnh & Thông tin cá nhân trên mạng', 'Nhận diện rủi ro tin nhắn lạ, thử thách độc hại trên mạng xã hội và quy tắc 3 bước ứng phó.', 'CyberSafety', 6, 9, 6, 50, 'Published', 4)
on conflict (id) do nothing;

insert into public.scenarios (id, module_id, title, topic_category, context_description, question, xp_reward, point_reward, safety_reminder, status)
values
  ('scen-puberty-01', 'mod-puberty-01', 'Khi bạn cùng lớp trêu chọc ngoại hình', 'Puberty', 'Trong giờ ra chơi, một nhóm bạn chỉ trỏ và cười đùa về việc giọng nói của Minh bị vỡ giọng và mặt nổi mụn.', 'Nếu em là Minh hoặc bạn thân của Minh, cách ứng xử nào dưới đây là phù hợp và tích cực nhất?', 30, 20, 'Thay đổi cơ thể ở tuổi dậy thì là hoàn toàn bình thường. Không ai có quyền lấy cơ thể người khác ra làm trò đùa.', 'Published'),
  ('scen-boundaries-01', 'mod-boundaries-01', 'Lời đề nghị giữ bí mật khiến em khó chịu', 'Boundaries', 'Một người quen lớn tuổi cố tình chạm vào vùng nhạy cảm của Lan và dặn: "Đừng nói với bố mẹ nhé, đây là bí mật riêng của hai chú cháu mình."', 'Trong tình huống này, Lan nên làm gì ngay lập tức?', 30, 20, 'Không bao giờ giữ những "bí mật xấu" khiến em sợ hãi hoặc khó chịu. Em hoàn toàn không có lỗi.', 'Published'),
  ('scen-emotion-01', 'mod-emotion-01', 'Khi người bạn thân đòi kiểm soát tin nhắn', 'Emotion', 'Một người bạn mới quen yêu cầu em phải đưa mật khẩu tài khoản mạng xã hội để "chứng minh sự tin tưởng".', 'Cách phản hồi nào giúp em vừa giữ được sự tôn trọng bản thân vừa đảm bảo an toàn?', 30, 20, 'Mật khẩu và tài khoản cá nhân là ranh giới riêng tư, kể cả với bạn thân.', 'Published'),
  ('scen-cyber-01', 'mod-cyber-01', 'Tài khoản lạ nhắn tin xin ảnh cá nhân', 'CyberSafety', 'Một tài khoản tự nhận là "nhà tuyển chọn người mẫu tuổi teen" nhắn tin khen em đẹp và yêu cầu gửi ảnh riêng tư để nhận quà.', 'Hành động nào an toàn nhất ngay lúc này?', 30, 20, 'Chặn, chụp bằng chứng và báo ngay cho bố mẹ/thầy cô khi gặp yêu cầu gửi hình ảnh nhạy cảm.', 'Published')
on conflict (id) do nothing;

-- ============================================================================
-- VIEW TỔNG HỢP CHO PHỤ HUYNH (TUÂN THỦ NFR-S06 & SECURITY INVOKER)
-- ============================================================================
create or replace view public.parent_child_summary_view
with (security_invoker = true) as
select
  sp.id as student_profile_id,
  sp.parent_account_id,
  sp.nickname,
  sp.grade,
  sp.total_xp,
  sp.current_streak,
  sp.longest_streak,
  sp.last_active_date,
  count(distinct case when lp.status = 'Completed' then lp.module_id end) as completed_modules_count,
  count(distinct sa.scenario_id) as practiced_scenarios_count
from public.student_profiles sp
left join public.learning_progresses lp on lp.student_profile_id = sp.id
left join public.scenario_attempts sa on sa.student_profile_id = sp.id
group by sp.id;

-- ============================================================================
-- HÀM RPC ĐỒNG BỘ TÀI KHOẢN GOOGLE (FIREBASE AUTH -> SUPABASE POSTGRESQL)
-- Chạy với quyền SECURITY DEFINER để lưu tài khoản & hồ sơ học sinh vào Supabase
-- ngay sau khi Backend xác thực Firebase ID Token thành công.
-- ============================================================================
create or replace function public.sync_firebase_google_user(
  p_firebase_uid text,
  p_email text,
  p_full_name text,
  p_avatar_url text default null,
  p_nickname text default 'Học sinh GenUp',
  p_grade int default 7
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_student_id uuid;
  v_clean_email text;
  v_clean_name text;
begin
  v_clean_email := coalesce(nullif(btrim(p_email), ''), p_firebase_uid || '@firebase.genup.local');
  v_clean_name := coalesce(nullif(btrim(p_full_name), ''), split_part(v_clean_email, '@', 1));

  -- 1. Upsert vào bảng user_accounts theo firebase_uid hoặc email
  select id into v_user_id
  from public.user_accounts
  where firebase_uid = p_firebase_uid or email = v_clean_email
  limit 1;

  if v_user_id is null then
    insert into public.user_accounts (firebase_uid, email, full_name, avatar_url, auth_provider)
    values (p_firebase_uid, v_clean_email, v_clean_name, p_avatar_url, 'google.com')
    returning id into v_user_id;
  else
    update public.user_accounts
    set firebase_uid = p_firebase_uid,
        email = v_clean_email,
        full_name = v_clean_name,
        avatar_url = coalesce(p_avatar_url, avatar_url),
        updated_at = now()
    where id = v_user_id;
  end if;

  -- 2. Đảm bảo có ít nhất 1 hồ sơ học sinh gắn với tài khoản này trong student_profiles
  select id into v_student_id
  from public.student_profiles
  where parent_account_id = v_user_id
  limit 1;

  if v_student_id is null then
    insert into public.student_profiles (
      parent_account_id,
      nickname,
      grade,
      interested_topics,
      avatar_gender,
      total_xp,
      reward_points,
      current_streak,
      longest_streak,
      last_active_date,
      is_onboarded
    )
    values (
      v_user_id,
      coalesce(nullif(btrim(p_nickname), ''), v_clean_name),
      greatest(6, least(9, coalesce(p_grade, 7))),
      '["Puberty", "Boundaries", "CyberSafety"]'::jsonb,
      'Female',
      110,
      95,
      3,
      5,
      current_date,
      true
    )
    returning id into v_student_id;
  end if;

  -- 3. Đảm bảo có gói thuê bao mặc định trong subscriptions
  if not exists (select 1 from public.subscriptions where parent_account_id = v_user_id) then
    insert into public.subscriptions (parent_account_id, plan_type, status, amount_paid)
    values (v_user_id, 'Free', 'Active', 0);
  end if;

  return jsonb_build_object(
    'user_account_id', v_user_id,
    'student_profile_id', v_student_id,
    'email', v_clean_email,
    'full_name', v_clean_name
  );
end;
$$;

grant execute on function public.sync_firebase_google_user(text, text, text, text, text, int) to anon, authenticated;

-- Hàm RPC đồng bộ tiến độ học sinh lên Supabase
create or replace function public.sync_student_profile_state(
  p_firebase_uid text,
  p_nickname text,
  p_grade int,
  p_avatar_gender text,
  p_equipped_hair_id text,
  p_equipped_outfit_id text,
  p_equipped_accessory_id text,
  p_total_xp int,
  p_reward_points int,
  p_current_streak int,
  p_longest_streak int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_student_id uuid;
begin
  select id into v_user_id
  from public.user_accounts
  where firebase_uid = p_firebase_uid
  limit 1;

  if v_user_id is null then
    return jsonb_build_object('ok', false, 'reason', 'user_not_found');
  end if;

  update public.student_profiles
  set nickname = coalesce(nullif(btrim(p_nickname), ''), nickname),
      grade = greatest(6, least(9, coalesce(p_grade, grade))),
      avatar_gender = case when p_avatar_gender in ('Male', 'Female') then p_avatar_gender else avatar_gender end,
      equipped_hair_id = coalesce(p_equipped_hair_id, equipped_hair_id),
      equipped_outfit_id = coalesce(p_equipped_outfit_id, equipped_outfit_id),
      equipped_accessory_id = coalesce(p_equipped_accessory_id, equipped_accessory_id),
      total_xp = greatest(0, coalesce(p_total_xp, total_xp)),
      reward_points = greatest(0, coalesce(p_reward_points, reward_points)),
      current_streak = greatest(0, coalesce(p_current_streak, current_streak)),
      longest_streak = greatest(0, coalesce(p_longest_streak, longest_streak)),
      last_active_date = current_date,
      updated_at = now()
  where parent_account_id = v_user_id
  returning id into v_student_id;

  return jsonb_build_object('ok', true, 'student_profile_id', v_student_id);
end;
$$;

grant execute on function public.sync_student_profile_state(text, text, int, text, text, text, text, int, int, int, int) to anon, authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.user_accounts enable row level security;
alter table public.student_profiles enable row level security;
alter table public.user_devices enable row level security;
alter table public.learning_modules enable row level security;
alter table public.module_steps enable row level security;
alter table public.scenarios enable row level security;
alter table public.scenario_options enable row level security;
alter table public.learning_progresses enable row level security;
alter table public.scenario_attempts enable row level security;
alter table public.student_avatar_inventories enable row level security;
alter table public.student_badges enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Public read published modules" on public.learning_modules;
create policy "Public read published modules" on public.learning_modules
  for select to anon, authenticated
  using (status = 'Published');

drop policy if exists "Public read module steps" on public.module_steps;
create policy "Public read module steps" on public.module_steps
  for select to anon, authenticated
  using (true);

drop policy if exists "Public read published scenarios" on public.scenarios;
create policy "Public read published scenarios" on public.scenarios
  for select to anon, authenticated
  using (status = 'Published');

drop policy if exists "Public read scenario options" on public.scenario_options;
create policy "Public read scenario options" on public.scenario_options
  for select to anon, authenticated
  using (true);

drop policy if exists "Users select own account" on public.user_accounts;
create policy "Users select own account" on public.user_accounts
  for select to anon, authenticated
  using (true);

drop policy if exists "Users update own account" on public.user_accounts;
create policy "Users update own account" on public.user_accounts
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Parents manage own student profiles" on public.student_profiles;
create policy "Parents manage own student profiles" on public.student_profiles
  for select to anon, authenticated
  using (true);
