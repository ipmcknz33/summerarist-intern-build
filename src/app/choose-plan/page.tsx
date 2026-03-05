// src/app/choose-plan/page.tsx
"use client";

import { useState } from "react";
import homeStyles from "../HomePage.module.css";
import ui from "@/styles/ui.module.css";

const MONTHLY_LINK = "https://buy.stripe.com/test_dRm8wR3T59r1ePRb1nfEk00";
const YEARLY_LINK = "https://buy.stripe.com/test_dRm8wR3T59r1ePRb1nfEk00"; // swap when you have yearly link

export default function ChoosePlanPage() {
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);

  const go = (plan: "monthly" | "yearly") => {
    setLoading(plan);
    window.location.assign(plan === "monthly" ? MONTHLY_LINK : YEARLY_LINK);
  };

  // IMPORTANT: single top-level <div> so it becomes:
  // body > div.AppFrame... > main > div  (your card wrapper)
  return (
    <div className={homeStyles.container}>
      <div className={`${homeStyles.card} ${ui.card}`}>
        <div className={homeStyles.hero}>
          <div className={homeStyles.badge}>Subscription</div>
          <h1 className={homeStyles.title}>Choose Plan</h1>
          <p className={homeStyles.subtitle}>
            Select monthly or yearly, then you’ll be redirected to Stripe
            Checkout.
          </p>
        </div>

        <div className={homeStyles.actions}>
          <button
            className={ui.button}
            onClick={() => go("monthly")}
            disabled={loading !== null}
            type="button"
          >
            {loading === "monthly" ? "Redirecting..." : "Choose Monthly"}
          </button>

          <button
            className={ui.button}
            onClick={() => go("yearly")}
            disabled={loading !== null}
            type="button"
          >
            {loading === "yearly" ? "Redirecting..." : "Choose Yearly"}
          </button>
        </div>
      </div>
    </div>
  );
}
