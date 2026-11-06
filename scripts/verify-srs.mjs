import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// 1. Kiểm tra Supabase SQL Migration tuân thủ NFR-S01..S06 & Supabase RLS Best Practices
const sqlPath = path.join(
  root,
  "supabase/migrations/20261106000000_init_genup_schema.sql"
);
const sql = fs.readFileSync(sqlPath, "utf8");

assert.ok(
  sql.includes("with (security_invoker = true)"),
  "View parent_child_summary_view phải có security_invoker = true"
);
assert.ok(
  !sql.includes("selected_option_id as"),
  "View của phụ huynh tuyệt đối không được lộ selected_option_id (NFR-S06)"
);
assert.ok(
  sql.includes("(select auth.uid())"),
  "RLS policy phải dùng (select auth.uid())"
);
assert.ok(
  !sql.includes("user_metadata"),
  "Không được dùng user_metadata trong RLS policy"
);

// 2. Kiểm tra đủ tất cả các route trong Sitemap Mục 4.1 SRS
const requiredRoutes = [
  "src/app/page.tsx",
  "src/app/login/page.tsx",
  "src/app/onboarding/page.tsx",
  "src/app/choose-avatar/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/lessons/page.tsx",
  "src/app/lessons/[id]/page.tsx",
  "src/app/lessons/[id]/complete/page.tsx",
  "src/app/scenarios/page.tsx",
  "src/app/result/[id]/page.tsx",
  "src/app/progress/page.tsx",
  "src/app/rewards/page.tsx",
  "src/app/avatar/page.tsx",
  "src/app/chat/page.tsx",
  "src/app/notifications/page.tsx",
  "src/app/settings/page.tsx",
  "src/app/parent/page.tsx",
  "src/app/parent/inbox/page.tsx",
  "src/app/parent/inbox/[id]/page.tsx",
  "src/app/parent/email-settings/page.tsx",
  "src/app/parent/gendio/page.tsx",
  "src/app/parent/support/page.tsx",
  "src/app/premium/page.tsx",
  "src/app/premium/checkout/page.tsx",
  "src/app/admin/page.tsx",
];

for (const rel of requiredRoutes) {
  assert.ok(
    fs.existsSync(path.join(root, rel)),
    `Thiếu route bắt buộc theo Sitemap SRS: ${rel}`
  );
}

console.log("✅ All SRS architecture & security assertions passed!");

