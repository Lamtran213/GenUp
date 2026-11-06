import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    // Đọc từ View parent_child_summary_view có bật security_invoker = true (NFR-S06)
    const { data, error } = await supabase
      .from("parent_child_summary_view")
      .select("*")
      .limit(5);

    if (!error && data) {
      return NextResponse.json({
        summaries: data,
        privacyPolicy: "NFR-S06 enforced: scenario answers and student chat excluded",
        source: "supabase",
      });
    }
  }

  return NextResponse.json({
    summaries: [],
    privacyPolicy: "NFR-S06 enforced: scenario answers and student chat excluded",
    source: "local-context-fallback",
  });
}

