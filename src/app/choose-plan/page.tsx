"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ChoosePlanPage.module.css";

const MONTHLY_LINK = "https://buy.stripe.com/test_dRm8wR3T59r1ePRb1nfEk00";
const YEARLY_LINK = "https://buy.stripe.com/test_dRm8wR3T59r1ePRb1nfEk00";

type PlanType = "monthly" | "yearly";

export default function ChoosePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<PlanType | null>(null);

  const nextPath = useMemo(() => {
    const next = searchParams.get("next");
    return next && next.startsWith("/") ? next : "/for-you";
  }, [searchParams]);

  function handleCheckout(plan: PlanType) {
    setLoading(plan);
    window.location.assign(plan === "monthly" ? MONTHLY_LINK : YEARLY_LINK);
  }

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <button
          type="button"
          onClick={() => router.push(nextPath)}
          className={styles.backButton}
        >
          Back
        </button>
      </div>

      <div className={styles.hero}>
        <p className={styles.eyebrow}>Premium Plans</p>
        <h1 className={styles.title}>Choose your plan</h1>
        <p className={styles.subtitle}>
          Get unlimited access to all book summaries, audio versions, and
          premium features.
        </p>
      </div>

      <div className={styles.planGrid}>
        <section className={styles.planCard}>
          <div className={styles.planHeader}>
            <p className={styles.planName}>Monthly</p>
            <h2 className={styles.price}>
              $9.99<span>/month</span>
            </h2>
            <p className={styles.planDescription}>
              Flexible monthly access to the complete Summarist premium library.
            </p>
          </div>

          <ul className={styles.featureList}>
            <li>Unlimited access to all summaries</li>
            <li>Listen to audio versions anytime</li>
            <li>Save and revisit books in your library</li>
            <li>Cancel whenever you want</li>
          </ul>

          <button
            type="button"
            onClick={() => handleCheckout("monthly")}
            disabled={loading !== null}
            className={styles.primaryButton}
          >
            {loading === "monthly" ? "Redirecting..." : "Choose Monthly"}
          </button>
        </section>

        <section className={`${styles.planCard} ${styles.planCardFeatured}`}>
          <div className={styles.planBadge}>Best Value</div>

          <div className={styles.planHeader}>
            <p className={styles.planName}>Yearly</p>
            <h2 className={styles.price}>
              $99.99<span>/year</span>
            </h2>
            <p className={styles.planDescription}>
              Best for committed readers who want full premium access all year
              long.
            </p>
          </div>

          <ul className={styles.featureList}>
            <li>Everything in the monthly plan</li>
            <li>Lower effective monthly cost</li>
            <li>Priority access to premium content</li>
            <li>One simple annual payment</li>
          </ul>

          <button
            type="button"
            onClick={() => handleCheckout("yearly")}
            disabled={loading !== null}
            className={styles.primaryButton}
          >
            {loading === "yearly" ? "Redirecting..." : "Choose Yearly"}
          </button>
        </section>
      </div>

      <section className={styles.bottomNote}>
        <h3 className={styles.noteTitle}>Why go Premium?</h3>
        <p className={styles.noteText}>
          Premium gives you access to the full Summarist experience, including
          premium summaries, audio playback, and uninterrupted learning.
        </p>
      </section>
    </div>
  );
}
