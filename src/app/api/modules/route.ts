import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { INITIAL_MODULES } from "@/lib/seed-data";

export async function GET() {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("learning_modules")
      .select("*, module_steps(*)")
      .eq("status", "Published")
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ modules: data, source: "supabase" });
    }
  }

  return NextResponse.json({ modules: INITIAL_MODULES, source: "seed" });
}

