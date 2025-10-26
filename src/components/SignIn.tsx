import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Check existing session on mount
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted && session) navigate("/home");
    })();

    // Subscribe to auth changes and navigate on sign-in
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/home");
      }
    });

    return () => {
      mounted = false;
      // unsubscribe if present
      data?.subscription?.unsubscribe?.();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/home" },
    });
    if (error) {
      console.error("Google sign-in error", error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-md">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/android-chrome-512x512.png"
            alt="FinSight logo"
            className="h-14 w-14 rounded-md"
          />
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            FinSight
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your expenses and lending
          </p>

          <div className="w-full mt-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3"
              variant="default"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.64 9.2045C17.64 8.56636 17.5827 7.96091 17.4764 7.38182H9V10.8227H13.8436C13.6982 11.8655 12.9964 12.7382 12.0282 13.2455V15.3082H14.9518C16.7518 14.0018 17.64 11.8027 17.64 9.2045Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18C11.43 18 13.4436 17.1545 14.9518 15.3082L12.0282 13.2455C11.2936 13.7045 10.35 13.9982 9 13.9982C6.63364 13.9982 4.66 12.36 3.93636 10.14H0.958182V12.2727C2.46409 15.5682 5.46818 18 9 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.93636 10.14C3.79545 9.56 3.72727 8.94273 3.72727 8.31818C3.72727 7.69364 3.79545 7.07636 3.93636 6.49636V4.36455H0.958182C0.344545 5.62818 0 7.01273 0 8.31818C0 9.62364 0.344545 11.0082 0.958182 12.2727L3.93636 10.14Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.63727C10.3182 3.63727 11.5155 4.14 12.4318 4.99L15.0145 2.40545C13.4373 0.995455 11.4327 0 9 0C5.46818 0 2.46409 2.43182 0.958182 5.72727L3.93636 7.85909C4.66 5.63818 6.63364 3.99909 9 3.99909V3.63727Z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
            </Button>
          </div>

          {error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
