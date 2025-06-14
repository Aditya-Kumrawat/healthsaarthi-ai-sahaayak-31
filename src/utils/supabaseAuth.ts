
import { supabase } from "@/integrations/supabase/client";

// Login with email/password
export async function loginWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Sign up with email/password, then create a profile entry
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const redirectUrl = `${window.location.origin}/`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  const userId = data?.user?.id;
  console.log('Signup: Creating profile with ID:', userId, 'and fullName:', fullName);

  if (userId && !error) {
    // Insert profile (separately log any errors)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert([{ id: userId, full_name: fullName }]);

    if (profileError) {
      console.error("Failed to insert profile:", profileError);
    } else {
      console.log("Successfully inserted profile:", { id: userId, full_name: fullName });
    }
  }

  return { data, error };
}

// Fetch profile details for a given user id
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();
  return { data, error };
}

