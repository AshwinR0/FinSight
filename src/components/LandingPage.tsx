import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const LandingPage = () => {
  const navigate = useNavigate();
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
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/home" },
    });
    if (error) {
      console.error("Google sign-in error", error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // 1. Listen for the beforeinstallprompt event
    const handler = (e) => {
      // Prevent the default browser prompt (the small banner/icon)
      e.preventDefault();

      // Store the event so it can be triggered later
      deferredPrompt = e;

      // Show your custom button
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 2. Listen for the appinstalled event (optional but good practice)
    const installedHandler = () => {
      console.log("PWA was successfully installed.");
      setShowInstallButton(false); // Hide the button after installation
    };

    window.addEventListener("appinstalled", installedHandler);

    return () => {
      // Clean up event listeners on component unmount
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []); // Run only on initial mount

  const handleInstallClick = async (e) => {
    console.log("start");

    e.preventDefault();
    if (!deferredPrompt) {
      console.log("Install prompt not available.");
      return;
    }

    console.log("Showing install prompt...");
    // 3. Show the native browser install prompt
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    // Check user choice
    console.log(`Install prompt outcome: ${outcome}`);

    // The deferredPrompt can only be used once
    deferredPrompt = null;
    setShowInstallButton(false);
  };

  return (
    <div className="max-h-screen min-h-screen flex items-center justify-center bg-[#6E50E9] relative overflow-hidden">
      <h1 className="absolute top-[10%] lg:top-[2%] md:top-[2%] transform text-[5.5rem] md:text-[12rem] lg:text-[15rem] font-bold text-white">
        FinSight
      </h1>
      <div className="relative flex items-center justify-center mt-[0rem] md:mt-40 lg:mt-40 overflow-clip">
        <img
          src="/finsight_lending.webp"
          alt="FinSight Lending Iphone"
          className="w-[80vw] md:min-w-[550px] max-w-[800px]
            relative
            z-0
            translate-x-[25%]
            md:translate-x-[20%]
            md:translate-y-[10%]
            lg:translate-x-[25%]
            lg:translate-y-[15%]
            transition-all"
        />
        <img
          src="/finsight_dashboard.webp"
          alt="FinSight Dashboard Iphone"
          className="w-[75vw] md:min-w-[550px] max-w-[700px]
            relative
            z-10
            -translate-x-[33%]
            -translate-y-[1%]
            md:-translate-x-[15%]
            md:-translate-y-[5%]
            lg:-translate-x-[20%]
            lg:-translate-y-[5%]
            transition-all"
        />
      </div>
      <div className="absolute bottom-14 p-2 rounded-full bg-white flex gap-4 z-20">
        <Button
          className="bg-[#6E50E9] text-white font-extrabold rounded-full text-lg hover:bg-[#5e39f0]"
          onClick={handleGoogleSignIn}
          disabled={loading}
          aria-busy={loading}
          size="lg"
        >
          Get Started
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
          ) : null}
        </Button>
        {showInstallButton && (
          <Button
            className="bg-[#F5C542] text-white font-extrabold rounded-full text-lg hover:bg-[#f4bf2e]"
            size="lg"
            onClick={handleInstallClick}
          >
            Install App
          </Button>
        )}
      </div>
    </div>
  );
};
