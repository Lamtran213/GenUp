-- ============================================================================
-- GenUp Database Schema & Row-Level Security (Supabase PostgreSQL)
-- Tuân thủ chuẩn bảo mật SRS (NFR-S01 .. NFR-S08) & Supabase Best Practices
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Bảng Tài khoản người dùng (Liên kết với auth.users của Supabase)
create table if not exists public.user_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'Parent' check (role in ('Parent', 'Admin', 'ContentExpert')),
  parent_pin_hash text,
  parent_summary_enabled boolean not null default true,
  notify_progress_report boolean not null default true,
  notify_study_reminder boolean not null default true,
  notify_new_content boolean not null default true,
  notify_premium_offer boolean not null default false,
  report_frequency_days int not null default 7 check (report_frequency_days in (7, 14, 30)),
  created_at timestamptz not null default now()
);

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
-- VIEW TỔNG HỢP CHO PHỤ HUYNH (TUÂN THỦ NFR-S06 & SECURITY INVOKER)
-- Tuyệt đối không lộ selected_option_id của học sinh
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

-- Chính sách đọc nội dung bài học/tình huống đã xuất bản
create policy "Public read published modules" on public.learning_modules
  for select to anon, authenticated
  using (status = 'Published');

create policy "Public read module steps" on public.module_steps
  for select to anon, authenticated
  using (true);

create policy "Public read published scenarios" on public.scenarios
  for select to anon, authenticated
  using (status = 'Published');

create policy "Public read scenario options" on public.scenario_options
  for select to anon, authenticated
  using (true);

-- Chính sách tài khoản gia đình (Dùng (select auth.uid()) tối ưu hiệu năng)
create policy "Users select own account" on public.user_accounts
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users update own account" on public.user_accounts
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Parents manage own student profiles" on public.student_profiles
  for all to authenticated
  using ((select auth.uid()) = parent_account_id)
  with check ((select auth.uid()) = parent_account_id);

create policy "Family access learning progresses" on public.learning_progresses
  for all to authenticated
  using (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = learning_progresses.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = learning_progresses.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  );

create policy "Family access scenario attempts" on public.scenario_attempts
  for all to authenticated
  using (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = scenario_attempts.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = scenario_attempts.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  );

create policy "Family access avatar inventories" on public.student_avatar_inventories
  for all to authenticated
  using (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = student_avatar_inventories.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = student_avatar_inventories.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  );

create policy "Family access badges" on public.student_badges
  for all to authenticated
  using (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = student_badges.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.student_profiles sp
      where sp.id = student_badges.student_profile_id
        and sp.parent_account_id = (select auth.uid())
    )
  );

create policy "Parents manage own subscriptions" on public.subscriptions
  for all to authenticated
  using ((select auth.uid()) = parent_account_id)
  with check ((select auth.uid()) = parent_account_id);

create policy "Users manage own devices" on public.user_devices
  for all to authenticated
  using ((select auth.uid()) = user_account_id)
  with check ((select auth.uid()) = user_account_id);

