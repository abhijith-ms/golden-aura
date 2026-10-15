"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./site.module.css";

interface TournamentInfographicProps {
  edition?: string;
}

interface EditionImpactData {
  editionLabel: string;
  subtitle: string;
  directFootprint: string;
  directFootprintNote: string;
  combinedValue: string;
  combinedValueNote: string;
  quote: string;
  chartKicker: string;
  chartBadge: string;
  chartCaption: string;
  directSpend: string;
  directHeight: string;
  socialValue: string;
  socialHeight: string;
  wellbeingValue: string;
  wellbeingHeight: string;
  metrics: {
    registrations: { value: string; pill: string; note: string };
    juniors: { value: string; pill: string; note: string };
    social: { value: string; pill: string; note: string };
    prize: { value: string; pill: string; note: string };
  };
}

const IMPACT_DATA: Record<string, EditionImpactData> = {
  "2024": {
    editionLabel: "2024",
    subtitle:
      "The inaugural 2024 edition established the international participation base, format and governance for chess in Karnataka.",
    directFootprint: "₹2.2",
    directFootprintNote:
      "Assessed direct tournament expenditure in Bengaluru for the 2024 debut.",
    combinedValue: "₹3.0",
    combinedValueNote:
      "Direct footprint (₹2.2 Cr) + indicative social value (₹0.8 Cr).",
    quote:
      "“The 2024 edition established the participation base, format and governance, delivering a landmark debut for international chess in Karnataka.”",
    chartKicker: "2024 VALUE STREAM BREAKDOWN",
    chartBadge: "1st Edition",
    chartCaption:
      "The 2024 edition delivered ₹2.2 Cr in direct expenditure and ₹0.8 Cr in indicative social value, creating the foundation for Bengaluru’s chess ecosystem.",
    directSpend: "₹2.2 Cr",
    directHeight: "100%",
    socialValue: "₹0.8 Cr",
    socialHeight: "36%",
    wellbeingValue: "₹0.26 Cr",
    wellbeingHeight: "12%",
    metrics: {
      registrations: { value: "1,562", pill: "1st Edition", note: "tournament entries" },
      juniors: { value: "707", pill: "45% of field", note: "youth players" },
      social: { value: "₹0.8 Cr", pill: "Assessed", note: "community value" },
      prize: { value: "₹50 L", pill: "State Record", note: "tournament pool" },
    },
  },
  "2025": {
    editionLabel: "2025",
    subtitle:
      "The 2025 edition delivered a landmark ₹4.5 Cr economic footprint and set records for scale, youth participation and inclusion in Bengaluru.",
    directFootprint: "₹4.5",
    directFootprintNote:
      "Assessed direct tournament expenditure in Bengaluru for the 2025 edition.",
    combinedValue: "₹5.7",
    combinedValueNote:
      "Direct footprint (₹4.5 Cr) + indicative social value (₹1.2 Cr).",
    quote:
      "“The 2025 edition set new records for scale, youth participation and inclusion, cementing Bengaluru at the centre of Indian chess.”",
    chartKicker: "2025 VALUE STREAM BREAKDOWN",
    chartBadge: "2nd Edition",
    chartCaption:
      "The 2025 edition delivered ₹4.5 Cr in direct expenditure and ₹1.2 Cr in indicative social value, setting unprecedented milestones for Bengaluru’s chess ecosystem.",
    directSpend: "₹4.5 Cr",
    directHeight: "100%",
    socialValue: "₹1.2 Cr",
    socialHeight: "27%",
    wellbeingValue: "₹0.40 Cr",
    wellbeingHeight: "9%",
    metrics: {
      registrations: { value: "2,533", pill: "Record Field", note: "tournament entries" },
      juniors: { value: "952", pill: "38% of field", note: "youth players" },
      social: { value: "₹1.2 Cr", pill: "Assessed", note: "community value" },
      prize: { value: "₹55 L", pill: "State Record", note: "tournament pool" },
    },
  },
};

export function TournamentInfographic({ edition = "2024" }: TournamentInfographicProps) {
  const [animated, setAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const data = IMPACT_DATA[edition] ?? IMPACT_DATA["2024"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <aside
      ref={cardRef}
      className={styles.infographicCard}
      aria-label={`Tournament ${data.editionLabel} economic and socio-economic impact assessment`}
    >
      <div className={styles.infographicHeader}>
        <span className={styles.eyebrow}>
          INDEPENDENT IMPACT ASSESSMENT · {data.editionLabel} EDITION
        </span>
        <h3 className={styles.infographicTitle}>
          Socio-economic footprint · <span>{data.editionLabel}</span>
        </h3>
        <p className={styles.infographicSubtitle}>{data.subtitle}</p>
      </div>

      <div className={styles.infographicBody}>
        {/* Left Column: Edition-Specific Headline Banner & Quote */}
        <div className={styles.infographicLeftCol}>
          <div className={styles.impactHighlightBanner}>
            <div className={styles.impactStatBlock}>
              <span className={styles.impactStatKicker}>
                DIRECT ECONOMIC FOOTPRINT · {data.editionLabel}
              </span>
              <div className={styles.impactStatValue}>
                <span>{data.directFootprint}</span> <small>Cr</small>
              </div>
              <span className={styles.impactStatNote}>{data.directFootprintNote}</span>
            </div>

            <div className={styles.impactDivider} aria-hidden="true" />

            <div className={styles.impactStatBlock}>
              <span className={styles.impactStatKicker}>
                COMBINED SOCIO-ECONOMIC VALUE · {data.editionLabel}
              </span>
              <div className={`${styles.impactStatValue} ${styles.goldValue}`}>
                <small>Approx.</small> <span>{data.combinedValue}</span> <small>Cr</small>
              </div>
              <span className={styles.impactStatNote}>{data.combinedValueNote}</span>
            </div>
          </div>

          <div className={styles.impactQuote}>
            <p>{data.quote}</p>
            <span className={styles.impactSource}>
              Infocrita Private Limited · Report for Golden Aura Trust
            </span>
          </div>
        </div>

        {/* Right Column: Edition-Specific Value Stream Breakdown & Metric Cards */}
        <div className={styles.infographicRightCol}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <span className={styles.chartKicker}>{data.chartKicker}</span>
              <span className={styles.growthBadge}>{data.chartBadge}</span>
            </div>

            <div className={styles.chartArea}>
              <div className={styles.chartBarCol}>
                <div className={styles.chartBarVal}>{data.directSpend}</div>
                <div className={styles.chartBarTrack}>
                  <div
                    className={`${styles.chartBarFill} ${styles.barNavy} ${styles.barActive}`}
                    style={{ height: animated ? data.directHeight : "0%" }}
                  />
                </div>
                <div className={styles.chartBarLabel}>
                  <strong>Direct Spend</strong>
                  <small>Economic footprint</small>
                </div>
              </div>

              <div className={styles.chartBarCol}>
                <div className={`${styles.chartBarVal} ${styles.goldVal}`}>
                  {data.socialValue}
                </div>
                <div className={styles.chartBarTrack}>
                  <div
                    className={`${styles.chartBarFill} ${styles.barGold}`}
                    style={{ height: animated ? data.socialHeight : "0%" }}
                  />
                </div>
                <div className={styles.chartBarLabel}>
                  <strong>Social Value</strong>
                  <small>Indicative benefit</small>
                </div>
              </div>

              <div className={styles.chartBarCol}>
                <div className={styles.chartBarVal}>{data.wellbeingValue}</div>
                <div className={styles.chartBarTrack}>
                  <div
                    className={`${styles.chartBarFill} ${styles.barSlate}`}
                    style={{ height: animated ? data.wellbeingHeight : "0%" }}
                  />
                </div>
                <div className={styles.chartBarLabel}>
                  <strong>Wellbeing</strong>
                  <small>Community value</small>
                </div>
              </div>
            </div>

            <p className={styles.chartCaption}>{data.chartCaption}</p>
          </div>

          {/* 4 Edition-Specific Metric Cards */}
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Total Registrations</span>
                <span className={styles.metricPill}>
                  {data.metrics.registrations.pill}
                </span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.registrations.value}</strong>
                <span>{data.metrics.registrations.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Junior Players</span>
                <span className={styles.metricPill}>{data.metrics.juniors.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.juniors.value}</strong>
                <span>{data.metrics.juniors.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Indicative Social Value</span>
                <span className={styles.metricPill}>{data.metrics.social.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.social.value}</strong>
                <span>{data.metrics.social.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Prize Fund</span>
                <span className={styles.metricPill}>{data.metrics.prize.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.prize.value}</strong>
                <span>{data.metrics.prize.note}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
