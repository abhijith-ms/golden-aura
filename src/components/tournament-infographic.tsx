"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./site.module.css";

interface TournamentInfographicProps {
  edition?: string;
}

interface MetricItem {
  value: string;
  pill: string;
  note: string;
}

interface EconomicSector {
  name: string;
  amount: string;
  share: string;
  sharePercent: number;
  description: string;
}

interface DemographicItem {
  label: string;
  stat: string;
  description: string;
}

interface BarChartItem {
  label: string;
  sublabel: string;
  value: string;
  heightPercent: number;
  colorClass: "barNavy" | "barGold" | "barSlate" | "barBronze";
}

interface AnalyticsChart {
  id: string;
  tabLabel: string;
  chartType: "column" | "donut" | "gauge" | "area";
  title: string;
  badge: string;
  caption: string;
  yAxisLabels: string[];
  bars: BarChartItem[];
}

interface EditionImpactData {
  editionLabel: string;
  subtitle: string;
  directFootprint: string;
  directFootprintNote: string;
  socialValueHeadline: string;
  socialValueHeadlineNote: string;
  combinedValue: string;
  combinedValueNote: string;
  quote: string;
  highlightsKicker: string;
  highlights: string[];
  metrics: {
    registrations: MetricItem;
    juniors: MetricItem;
    titled: MetricItem;
    women: MetricItem;
    geography: MetricItem;
    prize: MetricItem;
    hospitality: MetricItem;
    social: MetricItem;
  };
  charts: AnalyticsChart[];
  economicBreakdown: {
    kicker: string;
    totalBadge: string;
    sectors: EconomicSector[];
  };
  demographicsBreakdown: {
    kicker: string;
    badge: string;
    items: DemographicItem[];
  };
  methodologyNote: string;
}

const IMPACT_DATA: Record<string, EditionImpactData> = {
  "2024": {
    editionLabel: "2024",
    subtitle:
      "The inaugural 2024 edition established the international participation base, format and governance for chess in Karnataka.",
    directFootprint: "₹2.2",
    directFootprintNote:
      "Assessed direct tournament expenditure in Bengaluru for the 2024 debut.",
    socialValueHeadline: "₹0.8",
    socialValueHeadlineNote:
      "Indicative social return, youth engagement and wellbeing valuation.",
    combinedValue: "₹3.0",
    combinedValueNote:
      "Direct footprint (₹2.2 Cr) + indicative social value (₹0.8 Cr).",
    quote:
      "“The 2024 edition established the participation base, format and governance, delivering a landmark debut for international chess in Karnataka.”",
    highlightsKicker: "KEY ASSESSMENT TAKEAWAYS",
    highlights: [
      "4,200+ room nights injected into Bengaluru’s hospitality and travel sector",
      "1,562 registered participants representing 24 Indian States and 12 Federations",
      "₹50 Lakh prize fund disbursed, creating the state's largest chess prize pool",
      "₹0.8 Cr in social value, fostering youth development and community wellbeing",
    ],
    metrics: {
      registrations: {
        value: "1,562",
        pill: "1st Edition Debut",
        note: "tournament entries",
      },
      juniors: {
        value: "707",
        pill: "45% of field",
        note: "youth players (U-18)",
      },
      titled: {
        value: "48",
        pill: "Elite Field",
        note: "GMs, IMs & WGMs",
      },
      women: {
        value: "265+",
        pill: "17% of field",
        note: "female competitors",
      },
      geography: {
        value: "24 States",
        pill: "12 Federations",
        note: "national & global reach",
      },
      prize: {
        value: "₹50 L",
        pill: "State Record",
        note: "tournament prize pool",
      },
      hospitality: {
        value: "4,200+",
        pill: "City Tourism",
        note: "hotel room nights",
      },
      social: {
        value: "₹0.8 Cr",
        pill: "Assessed",
        note: "community social value",
      },
    },
    charts: [
      {
        id: "value-streams",
        tabLabel: "Value Streams",
        chartType: "column",
        title: "2024 VALUE STREAM VALUATION",
        badge: "1st Edition",
        caption:
          "The 2024 debut delivered ₹2.2 Cr in direct tournament expenditure and ₹0.8 Cr in community social value, creating the foundation for Bengaluru's chess ecosystem.",
        yAxisLabels: ["₹2.5 Cr", "₹1.8 Cr", "₹1.2 Cr", "₹0.6 Cr", "₹0"],
        bars: [
          {
            label: "Direct Spend",
            sublabel: "Economic footprint",
            value: "₹2.2 Cr",
            heightPercent: 88,
            colorClass: "barNavy",
          },
          {
            label: "Social Value",
            sublabel: "Indicative benefit",
            value: "₹0.8 Cr",
            heightPercent: 32,
            colorClass: "barGold",
          },
          {
            label: "Wellbeing",
            sublabel: "Community wellness",
            value: "₹0.26 Cr",
            heightPercent: 11,
            colorClass: "barSlate",
          },
        ],
      },
      {
        id: "sector-spend",
        tabLabel: "Sector Spend",
        chartType: "donut",
        title: "DIRECT EXPENDITURE BY SECTOR",
        badge: "₹2.20 Cr Total",
        caption:
          "4,200+ room nights drove hospitality to 40% of direct economic spend (₹88L), followed by venue staging (₹58L) and player prize rewards (₹50L).",
        yAxisLabels: ["50%", "37.5%", "25%", "12.5%", "0%"],
        bars: [
          {
            label: "Hospitality",
            sublabel: "40% · 4.2k Nights",
            value: "₹88 L",
            heightPercent: 40,
            colorClass: "barNavy",
          },
          {
            label: "Arena & Ops",
            sublabel: "26% · Production",
            value: "₹58 L",
            heightPercent: 26,
            colorClass: "barGold",
          },
          {
            label: "Prize Fund",
            sublabel: "23% · Cash pool",
            value: "₹50 L",
            heightPercent: 23,
            colorClass: "barBronze",
          },
          {
            label: "Commerce & F&B",
            sublabel: "11% · City transit",
            value: "₹24 L",
            heightPercent: 11,
            colorClass: "barSlate",
          },
        ],
      },
      {
        id: "demographics",
        tabLabel: "Demographics",
        chartType: "gauge",
        title: "PARTICIPANT INCLUSION & REACH",
        badge: "1,562 Entries",
        caption:
          "Youth players comprised 45% of total entries (707 players), while 1,015 outstation players traveled to Bengaluru from across 24 Indian states.",
        yAxisLabels: ["100%", "75%", "50%", "25%", "0%"],
        bars: [
          {
            label: "Outstation",
            sublabel: "65% · Travelers",
            value: "1,015",
            heightPercent: 65,
            colorClass: "barNavy",
          },
          {
            label: "Open Field",
            sublabel: "55% · Senior & Open",
            value: "855",
            heightPercent: 55,
            colorClass: "barSlate",
          },
          {
            label: "Junior (U-18)",
            sublabel: "45% · Youth",
            value: "707",
            heightPercent: 45,
            colorClass: "barGold",
          },
          {
            label: "Women in Chess",
            sublabel: "17% · Girls & Women",
            value: "265+",
            heightPercent: 17,
            colorClass: "barBronze",
          },
        ],
      },
      {
        id: "categories",
        tabLabel: "Rating Tiers",
        chartType: "area",
        title: "TOURNAMENT RATING TIERS",
        badge: "3 Categories",
        caption:
          "Categories B and C comprised 78% of the field, creating a vital platform for grassroots and developing chess players across Karnataka and India.",
        yAxisLabels: ["800", "600", "400", "200", "0"],
        bars: [
          {
            label: "Category C",
            sublabel: "Under 1400",
            value: "636",
            heightPercent: 80,
            colorClass: "barGold",
          },
          {
            label: "Category B",
            sublabel: "Under 1800",
            value: "584",
            heightPercent: 73,
            colorClass: "barBronze",
          },
          {
            label: "Category A",
            sublabel: "Open / GM",
            value: "342",
            heightPercent: 43,
            colorClass: "barNavy",
          },
        ],
      },
    ],
    economicBreakdown: {
      kicker: "DIRECT ECONOMIC SPEND BY SECTOR",
      totalBadge: "₹2.20 Cr Total Footprint",
      sectors: [
        {
          name: "Accommodation & Hospitality",
          amount: "₹88 Lakh",
          share: "40%",
          sharePercent: 40,
          description:
            "4,200+ room nights for visiting grandmasters, arbiters, parents, and outstation players.",
        },
        {
          name: "Event Infrastructure & Production",
          amount: "₹58 Lakh",
          share: "26%",
          sharePercent: 26,
          description:
            "Sri Kanteerava Indoor Stadium arena setup, DGT electronic broadcast boards, and arbiter panel operations.",
        },
        {
          name: "Tournament Prize Fund",
          amount: "₹50 Lakh",
          share: "23%",
          sharePercent: 23,
          description:
            "Direct competitive rewards distributed across Category A (Open), Category B (U-1800), and Category C (U-1400).",
        },
        {
          name: "Local Transport, Dining & Retail",
          amount: "₹24 Lakh",
          share: "11%",
          sharePercent: 11,
          description:
            "Intra-city transit, airport transfers, player catering, and local commerce surrounding the stadium.",
        },
      ],
    },
    demographicsBreakdown: {
      kicker: "PARTICIPATION & COMMUNITY DEMOGRAPHICS",
      badge: "3 Tournament Sections",
      items: [
        {
          label: "Competitive Rating Categories",
          stat: "3 Tiers",
          description:
            "Category A (International Open), Category B (Under 1800), and Category C (Under 1400).",
        },
        {
          label: "Youth & Scholastic Representation",
          stat: "707 Players (45%)",
          description:
            "School and collegiate chess players under age 18 competing across all categories.",
        },
        {
          label: "Women in Chess Initiative",
          stat: "265+ Players (17%)",
          description:
            "Female participants supported with dedicated tournament prizes and incentives.",
        },
        {
          label: "FIDE International Rating Opportunities",
          stat: "610+ Aspirants",
          description:
            "Unrated and emerging players gaining official international FIDE rating points.",
        },
        {
          label: "Geographic & Federation Reach",
          stat: "24 States / 12 Federations",
          description:
            "Competitors from 24 Indian states and 12 international chess federations.",
        },
      ],
    },
    methodologyNote:
      "Independent socio-economic evaluation prepared by Infocrita Private Limited for the Golden Aura Trust. Methodology follows standard sports economic impact accounting (direct tournament expenditure in Bengaluru) and OECD / UK Treasury subjective wellbeing valuation frameworks for amateur sports participation.",
  },
  "2025": {
    editionLabel: "2025",
    subtitle:
      "The 2025 edition delivered a landmark ₹4.5 Cr economic footprint and set records for scale, youth participation and inclusion in Bengaluru.",
    directFootprint: "₹4.5",
    directFootprintNote:
      "Assessed direct tournament expenditure in Bengaluru for the 2025 edition.",
    socialValueHeadline: "₹1.2",
    socialValueHeadlineNote:
      "Indicative social return, youth engagement and wellbeing valuation.",
    combinedValue: "₹5.7",
    combinedValueNote:
      "Direct footprint (₹4.5 Cr) + indicative social value (₹1.2 Cr).",
    quote:
      "“The 2025 edition set new records for scale, youth participation and inclusion, cementing Bengaluru at the centre of Indian chess.”",
    highlightsKicker: "KEY ASSESSMENT TAKEAWAYS",
    highlights: [
      "7,500+ room nights injected into Bengaluru’s hospitality and travel sector",
      "2,533 registered participants representing 28 Indian States and 18 Federations",
      "₹59 Lakh total prize purse disbursed across Open and Blitz tournaments",
      "₹1.2 Cr in social value, expanding women's and scholastic participation",
    ],
    metrics: {
      registrations: {
        value: "2,533",
        pill: "Record Field",
        note: "tournament entries",
      },
      juniors: {
        value: "952",
        pill: "38% of field",
        note: "youth players (U-18)",
      },
      titled: {
        value: "72",
        pill: "International Masters",
        note: "GMs, IMs & WGMs",
      },
      women: {
        value: "440+",
        pill: "17.4% of field",
        note: "female competitors",
      },
      geography: {
        value: "28 States",
        pill: "18 Federations",
        note: "national & global reach",
      },
      prize: {
        value: "₹59 L",
        pill: "Record Purse",
        note: "Open (₹55L) + Blitz (₹4L)",
      },
      hospitality: {
        value: "7,500+",
        pill: "Tourism Impact",
        note: "hotel room nights",
      },
      social: {
        value: "₹1.2 Cr",
        pill: "Assessed",
        note: "community social value",
      },
    },
    charts: [
      {
        id: "value-streams",
        tabLabel: "Value Streams",
        chartType: "column",
        title: "2025 VALUE STREAM VALUATION",
        badge: "2nd Edition",
        caption:
          "The 2025 edition delivered ₹4.5 Cr in direct expenditure and ₹1.2 Cr in indicative social value, setting unprecedented milestones for Bengaluru's chess ecosystem.",
        yAxisLabels: ["₹5.0 Cr", "₹3.7 Cr", "₹2.5 Cr", "₹1.2 Cr", "₹0"],
        bars: [
          {
            label: "Direct Spend",
            sublabel: "Economic footprint",
            value: "₹4.5 Cr",
            heightPercent: 90,
            colorClass: "barNavy",
          },
          {
            label: "Social Value",
            sublabel: "Indicative benefit",
            value: "₹1.2 Cr",
            heightPercent: 24,
            colorClass: "barGold",
          },
          {
            label: "Wellbeing",
            sublabel: "Community wellness",
            value: "₹0.40 Cr",
            heightPercent: 8,
            colorClass: "barSlate",
          },
        ],
      },
      {
        id: "sector-spend",
        tabLabel: "Sector Spend",
        chartType: "donut",
        title: "DIRECT EXPENDITURE BY SECTOR",
        badge: "₹4.50 Cr Total",
        caption:
          "Hospitality stays anchored ₹1.75 Cr (39%), alongside substantial stadium production and broadcast infrastructure (₹1.25 Cr) and city retail commerce (₹91L).",
        yAxisLabels: ["50%", "37.5%", "25%", "12.5%", "0%"],
        bars: [
          {
            label: "Hospitality",
            sublabel: "39% · 7.5k Nights",
            value: "₹1.75 Cr",
            heightPercent: 39,
            colorClass: "barNavy",
          },
          {
            label: "Arena & Media",
            sublabel: "28% · Broadcast",
            value: "₹1.25 Cr",
            heightPercent: 28,
            colorClass: "barGold",
          },
          {
            label: "Commerce & F&B",
            sublabel: "20% · Retail",
            value: "₹91 L",
            heightPercent: 20,
            colorClass: "barSlate",
          },
          {
            label: "Prize Purse",
            sublabel: "13% · Open + Blitz",
            value: "₹59 L",
            heightPercent: 13,
            colorClass: "barBronze",
          },
        ],
      },
      {
        id: "demographics",
        tabLabel: "Demographics",
        chartType: "gauge",
        title: "PARTICIPANT INCLUSION & REACH",
        badge: "2,533 Entries",
        caption:
          "Scholastic youth participation reached 952 competitors, while 69% of all participants traveled to Bengaluru from outside Karnataka.",
        yAxisLabels: ["100%", "75%", "50%", "25%", "0%"],
        bars: [
          {
            label: "Outstation",
            sublabel: "69% · Travelers",
            value: "1,750",
            heightPercent: 69,
            colorClass: "barNavy",
          },
          {
            label: "Open Field",
            sublabel: "62% · Senior & Open",
            value: "1,581",
            heightPercent: 62,
            colorClass: "barSlate",
          },
          {
            label: "Junior (U-18)",
            sublabel: "38% · Youth",
            value: "952",
            heightPercent: 38,
            colorClass: "barGold",
          },
          {
            label: "Women in Chess",
            sublabel: "17.4% · Girls & Women",
            value: "440+",
            heightPercent: 17,
            colorClass: "barBronze",
          },
        ],
      },
      {
        id: "categories",
        tabLabel: "Rating Tiers",
        chartType: "area",
        title: "TOURNAMENT RATING TIERS",
        badge: "3 Sections + Blitz",
        caption:
          "Grassroots participation surged in Category C with 1,163 entries, alongside 890 players in Category B, 480 in the GM Open, and 650+ in Open Blitz.",
        yAxisLabels: ["1,400", "1,050", "700", "350", "0"],
        bars: [
          {
            label: "Category C",
            sublabel: "Under 1400",
            value: "1,163",
            heightPercent: 83,
            colorClass: "barGold",
          },
          {
            label: "Category B",
            sublabel: "Under 1800",
            value: "890",
            heightPercent: 64,
            colorClass: "barBronze",
          },
          {
            label: "Open Blitz",
            sublabel: "FIDE Blitz",
            value: "650+",
            heightPercent: 46,
            colorClass: "barSlate",
          },
          {
            label: "Category A",
            sublabel: "GM Open",
            value: "480",
            heightPercent: 34,
            colorClass: "barNavy",
          },
        ],
      },
    ],
    economicBreakdown: {
      kicker: "DIRECT ECONOMIC SPEND BY SECTOR",
      totalBadge: "₹4.50 Cr Total Footprint",
      sectors: [
        {
          name: "Accommodation & Hospitality",
          amount: "₹1.75 Cr",
          share: "39%",
          sharePercent: 39,
          description:
            "7,500+ room nights across Koramangala and central Bengaluru hotels for players, families, and international delegations.",
        },
        {
          name: "Event Infrastructure & Live Broadcast",
          amount: "₹1.25 Cr",
          share: "28%",
          sharePercent: 28,
          description:
            "Koramangala Indoor Stadium staging, multi-camera live broadcast infrastructure, arbiters and tournament operations.",
        },
        {
          name: "Local Commerce, Tourism & Dining",
          amount: "₹91 Lakh",
          share: "20%",
          sharePercent: 20,
          description:
            "Participant and visitor expenditure in Bengaluru's local retail, dining, intra-city transit, and hospitality services.",
        },
        {
          name: "Tournament Prize Purse",
          amount: "₹59 Lakh",
          share: "13%",
          sharePercent: 13,
          description:
            "₹55 Lakh Main Open prize fund + ₹4 Lakh Open Blitz championship prize distribution.",
        },
      ],
    },
    demographicsBreakdown: {
      kicker: "PARTICIPATION & COMMUNITY DEMOGRAPHICS",
      badge: "3 Sections + Open Blitz",
      items: [
        {
          label: "Competitive Tournament Sections",
          stat: "4 Competitions",
          description:
            "Category A (Grandmasters Open), Category B (Under 1800), Category C (Under 1400), and International Blitz.",
        },
        {
          label: "Youth & Scholastic Representation",
          stat: "952 Players (38%)",
          description:
            "School and collegiate competitors under 18 years across 180+ educational institutions.",
        },
        {
          label: "Women in Chess Initiative",
          stat: "440+ Players (17.4%)",
          description:
            "Female participation supported by expanded merit awards and special category prizes.",
        },
        {
          label: "FIDE International Rating Opportunities",
          stat: "980+ Aspirants",
          description:
            "Unrated and developing chess players actively competing for official international FIDE ratings.",
        },
        {
          label: "Geographic & Federation Reach",
          stat: "28 States / 18 Federations",
          description:
            "Nationwide representation across 28 States/UTs alongside 18 overseas chess federations.",
        },
      ],
    },
    methodologyNote:
      "Independent socio-economic evaluation prepared by Infocrita Private Limited for the Golden Aura Trust. Methodology follows standard sports economic impact accounting (direct tournament expenditure in Bengaluru) and OECD / UK Treasury subjective wellbeing valuation frameworks for amateur sports participation.",
  },
};

/**
 * Color mapper for SVG and inline styling.
 */
function getColorHex(colorClass: string): string {
  switch (colorClass) {
    case "barNavy":
      return "#2c3e50";
    case "barGold":
      return "#c4af78";
    case "barSlate":
      return "#5c6b73";
    case "barBronze":
      return "#b37d4e";
    default:
      return "#c4af78";
  }
}

/**
 * Visual Archetype 1: Vertical Column Chart (Executive Pillar Bars)
 * Used for Value Stream Valuations.
 */
function ColumnChartVisual({
  chart,
  inView,
}: {
  chart: AnalyticsChart;
  inView: boolean;
}) {
  return (
    <div className={styles.chartVisualBlock}>
      <div className={styles.chartStageWrap}>
        <div className={styles.chartYAxis} aria-hidden="true">
          {chart.yAxisLabels.map((label, idx) => (
            <span key={idx}>{label}</span>
          ))}
        </div>

        <div className={styles.chartStage}>
          <div className={styles.chartGridlinesOverlay} aria-hidden="true">
            <span
              className={`${styles.chartGridline} ${
                inView ? styles.chartGridlineVisible : styles.chartGridlineHidden
              }`}
              style={{ bottom: "100%", transitionDelay: "100ms" }}
            />
            <span
              className={`${styles.chartGridline} ${
                inView ? styles.chartGridlineVisible : styles.chartGridlineHidden
              }`}
              style={{ bottom: "75%", transitionDelay: "160ms" }}
            />
            <span
              className={`${styles.chartGridline} ${
                inView ? styles.chartGridlineVisible : styles.chartGridlineHidden
              }`}
              style={{ bottom: "50%", transitionDelay: "220ms" }}
            />
            <span
              className={`${styles.chartGridline} ${
                inView ? styles.chartGridlineVisible : styles.chartGridlineHidden
              }`}
              style={{ bottom: "25%", transitionDelay: "280ms" }}
            />
            <span
              className={`${styles.chartGridline} ${
                inView ? styles.chartGridlineVisible : styles.chartGridlineHidden
              }`}
              style={{ bottom: "0%", transitionDelay: "340ms" }}
            />
          </div>

          <div className={styles.chartBarsRow}>
            {chart.bars.map((bar, idx) => (
              <div key={idx} className={styles.chartBarUnit}>
                <div
                  className={`${styles.chartBarVal} ${
                    inView ? styles.chartBarValVisible : styles.chartBarValHidden
                  }`}
                  style={{ transitionDelay: `${idx * 130 + 360}ms` }}
                >
                  {bar.value}
                </div>
                <div className={styles.chartBarTrack}>
                  <div
                    className={`${styles.chartBarFill} ${styles[bar.colorClass]}`}
                    style={{
                      height: inView ? `${bar.heightPercent}%` : "0%",
                      transitionDelay: `${idx * 130}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartXAxisRow}>
        {chart.bars.map((bar, idx) => (
          <div
            key={idx}
            className={`${styles.chartXAxisItem} ${
              inView ? styles.chartXAxisItemVisible : styles.chartXAxisItemHidden
            }`}
            style={{ transitionDelay: `${idx * 130 + 150}ms` }}
          >
            <strong>{bar.label}</strong>
            <small>{bar.sublabel}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Visual Archetype 2: Circular SVG Donut Ring Chart with Central Total & Sector Legend
 * Used for Direct Expenditure by Sector (Part-to-Whole Allocation).
 */
function DonutChartVisual({
  chart,
  inView,
}: {
  chart: AnalyticsChart;
  inView: boolean;
}) {
  const radius = 76;
  const circumference = 2 * Math.PI * radius; // ~477.52
  let accumulatedPercent = 0;
  const totalSpend = chart.badge.replace(" Total", "");

  return (
    <div className={styles.donutStageWrap}>
      <div className={styles.donutSvgWrap}>
        <svg viewBox="0 0 200 200" className={styles.donutSvg}>
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(216, 210, 197, 0.35)"
            strokeWidth="24"
          />

          {chart.bars.map((bar, idx) => {
            const arcLength = (bar.heightPercent / 100) * circumference;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += bar.heightPercent;

            return (
              <circle
                key={idx}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={getColorHex(bar.colorClass)}
                strokeWidth="24"
                strokeDasharray={
                  inView
                    ? `${arcLength.toFixed(2)} ${(circumference - arcLength).toFixed(2)}`
                    : `0 ${circumference.toFixed(2)}`
                }
                strokeDashoffset={strokeDashoffset.toFixed(2)}
                style={{
                  transition: `stroke-dasharray 950ms cubic-bezier(0.16, 1, 0.3, 1) ${
                    idx * 120 + 80
                  }ms`,
                  transform: "rotate(-90deg)",
                  transformOrigin: "100px 100px",
                }}
              />
            );
          })}

          <g>
            <text
              x="100"
              y="94"
              textAnchor="middle"
              className={styles.donutCenterVal}
            >
              {totalSpend}
            </text>
            <text
              x="100"
              y="114"
              textAnchor="middle"
              className={styles.donutCenterLabel}
            >
              DIRECT SPEND
            </text>
          </g>
        </svg>
      </div>

      <div className={styles.donutLegend}>
        {chart.bars.map((bar, idx) => (
          <div
            key={idx}
            className={`${styles.donutLegendItem} ${
              inView ? styles.donutLegendItemVisible : styles.donutLegendItemHidden
            }`}
            style={{ transitionDelay: `${idx * 110 + 200}ms` }}
          >
            <div className={styles.donutLegendHead}>
              <span
                className={styles.donutLegendDot}
                style={{ backgroundColor: getColorHex(bar.colorClass) }}
                aria-hidden="true"
              />
              <span className={styles.donutLegendName}>{bar.label}</span>
            </div>
            <div className={styles.donutLegendValues}>
              <strong>{bar.value}</strong>
              <span className={styles.donutLegendShare}>{bar.heightPercent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Visual Archetype 3: Horizontal Metric Gauges with Demographic Pills
 * Used for Participant Inclusion & Reach.
 */
function GaugeChartVisual({
  chart,
  inView,
}: {
  chart: AnalyticsChart;
  inView: boolean;
}) {
  return (
    <div className={styles.gaugeStage}>
      {chart.bars.map((bar, idx) => {
        const sublabelParts = bar.sublabel.split("·");
        const shareTag = sublabelParts[0]?.trim() || `${bar.heightPercent}%`;
        const descTag = sublabelParts[1]?.trim() || "";

        return (
          <div key={idx} className={styles.gaugeItem}>
            <div className={styles.gaugeItemHead}>
              <div className={styles.gaugeItemTitleWrap}>
                <span
                  className={styles.gaugeItemDot}
                  style={{ backgroundColor: getColorHex(bar.colorClass) }}
                  aria-hidden="true"
                />
                <span className={styles.gaugeItemLabel}>{bar.label}</span>
                {descTag && <small className={styles.gaugeItemDesc}>{descTag}</small>}
              </div>
              <div className={styles.gaugeItemValueWrap}>
                <strong>{bar.value}</strong>
                <span className={styles.gaugeItemSharePill}>{shareTag}</span>
              </div>
            </div>

            <div className={styles.gaugeTrack}>
              <div
                className={styles.gaugeFill}
                style={{
                  width: inView ? `${bar.heightPercent}%` : "0%",
                  backgroundColor: getColorHex(bar.colorClass),
                  transitionDelay: `${idx * 130 + 100}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Visual Archetype 4: Smooth SVG Area Spline Curve with Data Nodes
 * Used for Tournament Rating Tiers Distribution.
 */
function AreaChartVisual({
  chart,
  inView,
}: {
  chart: AnalyticsChart;
  inView: boolean;
}) {
  const pointsCount = chart.bars.length;
  const baseline = 150;
  const maxPlotHeight = 120;

  const points = chart.bars.map((bar, idx) => {
    const margin = pointsCount === 3 ? 46 : 38;
    const availableWidth = 360 - margin * 2;
    const x = margin + (idx / (pointsCount - 1)) * availableWidth;
    const y = baseline - (bar.heightPercent / 100) * maxPlotHeight;
    return { x, y, bar };
  });

  let lineD = "";
  let areaD = "";
  if (points.length > 0) {
    lineD = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const dx = p1.x - p0.x;
      const cp1x = p0.x + dx * 0.45;
      const cp1y = p0.y;
      const cp2x = p1.x - dx * 0.45;
      const cp2y = p1.y;
      lineD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    areaD = `${lineD} L ${lastPoint.x.toFixed(1)},${baseline} L ${firstPoint.x.toFixed(1)},${baseline} Z`;
  }

  return (
    <div className={styles.chartVisualBlock}>
      <div className={styles.chartStageWrap}>
        <div className={styles.chartYAxis} aria-hidden="true">
          {chart.yAxisLabels.map((label, idx) => (
            <span key={idx}>{label}</span>
          ))}
        </div>

        <div className={styles.areaChartStage}>
          <svg viewBox="0 0 360 165" className={styles.areaChartSvg}>
            <defs>
              <linearGradient id={`areaGrad-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c4af78" stopOpacity="0.48" />
                <stop offset="60%" stopColor="#c4af78" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#c4af78" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            <line x1="0" y1="26" x2="360" y2="26" stroke="var(--line)" strokeDasharray="3 3" opacity="0.65" />
            <line x1="0" y1="57" x2="360" y2="57" stroke="var(--line)" strokeDasharray="3 3" opacity="0.65" />
            <line x1="0" y1="88" x2="360" y2="88" stroke="var(--line)" strokeDasharray="3 3" opacity="0.65" />
            <line x1="0" y1="119" x2="360" y2="119" stroke="var(--line)" strokeDasharray="3 3" opacity="0.65" />
            <line x1="0" y1={baseline} x2="360" y2={baseline} stroke="var(--line)" opacity="0.95" />

            <path
              d={areaD}
              fill={`url(#areaGrad-${chart.id})`}
              className={`${styles.areaPath} ${
                inView ? styles.areaPathVisible : styles.areaPathHidden
              }`}
            />

            <path
              d={lineD}
              fill="none"
              stroke="#b89742"
              strokeWidth="3.5"
              strokeLinecap="round"
              className={`${styles.areaSplineLine} ${
                inView ? styles.areaSplineLineVisible : styles.areaSplineLineHidden
              }`}
            />

            {points.map((pt, idx) => (
              <g
                key={idx}
                className={`${styles.areaNode} ${
                  inView ? styles.areaNodeVisible : styles.areaNodeHidden
                }`}
                style={{ transitionDelay: `${idx * 120 + 350}ms` }}
              >
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className={styles.areaNodeVal}
                >
                  {pt.bar.value}
                </text>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="#ffffff"
                  stroke="#795e29"
                  strokeWidth="3"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className={styles.chartXAxisRow}>
        {chart.bars.map((bar, idx) => (
          <div
            key={idx}
            className={`${styles.chartXAxisItem} ${
              inView ? styles.chartXAxisItemVisible : styles.chartXAxisItemHidden
            }`}
            style={{ transitionDelay: `${idx * 130 + 150}ms` }}
          >
            <strong>{bar.label}</strong>
            <small>{bar.sublabel}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Chart Card with dedicated IntersectionObserver.
 * Renders the matching chart archetype based on chartType.
 */
interface InteractiveChartCardProps {
  chart: AnalyticsChart;
  chartIdx: number;
  activeTab: string;
}

function InteractiveChartCard({
  chart,
  chartIdx,
  activeTab,
}: InteractiveChartCardProps) {
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInView(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    const el = cardRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeTab]);

  let visualContent = null;
  if (chart.chartType === "donut") {
    visualContent = <DonutChartVisual chart={chart} inView={inView} />;
  } else if (chart.chartType === "gauge") {
    visualContent = <GaugeChartVisual chart={chart} inView={inView} />;
  } else if (chart.chartType === "area") {
    visualContent = <AreaChartVisual chart={chart} inView={inView} />;
  } else {
    visualContent = <ColumnChartVisual chart={chart} inView={inView} />;
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.chartCard} ${
        inView ? styles.chartCardVisible : styles.chartCardHidden
      }`}
      style={{
        transitionDelay: `${(chartIdx % 2) * 80}ms`,
      }}
    >
      <div className={styles.chartCardHeader}>
        <span className={styles.chartCardTitle}>{chart.title}</span>
        <span className={styles.chartCardBadge}>{chart.badge}</span>
      </div>

      {visualContent}

      <p className={styles.chartCardCaption}>{chart.caption}</p>
    </div>
  );
}

/**
 * Sector Breakdown Panel with dedicated observer for progress bar animation.
 */
function SectorBreakdownList({ sectors }: { sectors: EconomicSector[] }) {
  const [inView, setInView] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const el = listRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={listRef} className={styles.breakdownList}>
      {sectors.map((sector, index) => (
        <li key={index} className={styles.breakdownItem}>
          <div className={styles.breakdownItemHead}>
            <span className={styles.breakdownItemName}>{sector.name}</span>
            <div className={styles.breakdownItemValue}>
              <span>{sector.amount}</span>
              <span className={styles.breakdownItemShare}>{sector.share}</span>
            </div>
          </div>
          <div className={styles.breakdownProgressBarTrack}>
            <div
              className={`${styles.breakdownProgressBarFill} ${
                index % 2 === 1 ? styles.breakdownProgressBarFillGold : ""
              }`}
              style={{
                width: inView ? `${sector.sharePercent}%` : "0%",
                transitionDelay: `${index * 140}ms`,
              }}
            />
          </div>
          <p className={styles.breakdownItemDesc}>{sector.description}</p>
        </li>
      ))}
    </ul>
  );
}

export function TournamentInfographic({ edition = "2024" }: TournamentInfographicProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const data = IMPACT_DATA[edition] ?? IMPACT_DATA["2024"];

  const displayedCharts =
    activeTab === "all"
      ? data.charts
      : data.charts.filter((chart) => chart.id === activeTab);

  return (
    <aside
      className={styles.infographicCard}
      aria-label={`Tournament ${data.editionLabel} economic and socio-economic impact assessment`}
    >
      {/* 1. Top Header */}
      <div className={styles.infographicHeader}>
        <span className={styles.eyebrow}>
          INDEPENDENT IMPACT ASSESSMENT · {data.editionLabel} EDITION
        </span>
        <h3 className={styles.infographicTitle}>
          Socio-economic footprint · <span>{data.editionLabel}</span>
        </h3>
        <p className={styles.infographicSubtitle}>{data.subtitle}</p>
      </div>

      {/* 2. Visual Analytics Dashboard: GRAPHS AT THE TOP */}
      <div className={styles.analyticsSection}>
        <div className={styles.analyticsHeaderWrap}>
          <div className={styles.analyticsTitleGroup}>
            <span className={styles.eyebrow}>
              VISUAL IMPACT ANALYTICS · 4 KEY CHARTS
            </span>
            <h4 className={styles.analyticsSectionTitle}>
              Independent economic valuation &amp; participation graphs
            </h4>
          </div>

          <div className={styles.analyticsTabs} role="tablist" aria-label="Chart filters">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              className={`${styles.analyticsTabBtn} ${
                activeTab === "all" ? styles.analyticsTabBtnActive : ""
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Visual Charts (4)
            </button>
            {data.charts.map((chart) => (
              <button
                key={chart.id}
                type="button"
                role="tab"
                aria-selected={activeTab === chart.id}
                className={`${styles.analyticsTabBtn} ${
                  activeTab === chart.id ? styles.analyticsTabBtnActive : ""
                }`}
                onClick={() => setActiveTab(chart.id)}
              >
                {chart.tabLabel}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Large Graphs: Pure Separated Baseline & Per-Card Scroll Animation */}
        <div
          className={`${styles.chartsGrid} ${
            activeTab !== "all" ? styles.chartsGridSingle : ""
          }`}
        >
          {displayedCharts.map((chart, chartIdx) => (
            <InteractiveChartCard
              key={chart.id}
              chart={chart}
              chartIdx={chartIdx}
              activeTab={activeTab}
            />
          ))}
        </div>
      </div>

      {/* 3. Executive Overview & 8 KPI Cards */}
      {/* 3. Infographic Body: Direct & Combined Value Banner + 8 Metric Cards */}
      <div className={styles.infographicBody}>
        {/* Row 1, Col 1: Headline Valuation Banner */}
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
              INDICATIVE SOCIAL &amp; COMMUNITY VALUE · {data.editionLabel}
            </span>
            <div className={styles.impactStatValue}>
              <span>{data.socialValueHeadline}</span> <small>Cr</small>
            </div>
            <span className={styles.impactStatNote}>
              {data.socialValueHeadlineNote}
            </span>
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

        {/* Row 1, Col 2: 8 Audited KPI Metric Cards */}
        <div className={styles.metricGridWrap}>
          <div className={styles.metricGridHeader}>
            <span className={styles.metricGridKicker}>
              KEY PERFORMANCE INDICATORS · 8 PILLARS
            </span>
            <span className={styles.metricGridBadge}>Audited Metrics</span>
          </div>

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
                <span className={styles.metricLabel}>Grandmasters &amp; Titled</span>
                <span className={styles.metricPill}>{data.metrics.titled.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.titled.value}</strong>
                <span>{data.metrics.titled.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Women in Chess</span>
                <span className={styles.metricPill}>{data.metrics.women.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.women.value}</strong>
                <span>{data.metrics.women.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Geographic Reach</span>
                <span className={styles.metricPill}>{data.metrics.geography.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.geography.value}</strong>
                <span>{data.metrics.geography.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Total Prize Fund</span>
                <span className={styles.metricPill}>{data.metrics.prize.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.prize.value}</strong>
                <span>{data.metrics.prize.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Hotel Room Nights</span>
                <span className={styles.metricPill}>{data.metrics.hospitality.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.hospitality.value}</strong>
                <span>{data.metrics.hospitality.note}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardTop}>
                <span className={styles.metricLabel}>Assessed Social Value</span>
                <span className={styles.metricPill}>{data.metrics.social.pill}</span>
              </div>
              <div className={styles.metricValues}>
                <strong>{data.metrics.social.value}</strong>
                <span>{data.metrics.social.note}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2, Col 1: Key Assessment Takeaways */}
        <div className={styles.impactHighlightsCard}>
          <div className={styles.impactHighlightsHeader}>
            <span className={styles.impactHighlightsKicker}>
              {data.highlightsKicker}
            </span>
            <span className={styles.impactHighlightsBadge}>Core Findings</span>
          </div>
          <ul className={styles.impactHighlightsList}>
            {data.highlights.map((highlight, index) => (
              <li key={index} className={styles.impactHighlightsItem}>
                <span className={styles.highlightDot} aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Row 2, Col 2: Independent Evaluator Perspective & Audit Citation */}
        <div className={styles.impactQuoteCard}>
          <div className={styles.impactQuoteCardHeader}>
            <span className={styles.impactQuoteCardKicker}>
              INDEPENDENT EVALUATOR PERSPECTIVE
            </span>
            <span className={styles.impactQuoteBadge}>Infocrita Audit</span>
          </div>
          <blockquote className={styles.impactQuoteCardBody}>
            <p>{data.quote}</p>
          </blockquote>
          <div className={styles.impactQuoteCardFooter}>
            <span className={styles.impactQuoteSource}>
              Infocrita Private Limited · Report for Golden Aura Trust
            </span>
            <span className={styles.impactQuoteMethodology}>
              Direct sports economic expenditure &amp; OECD subjective wellbeing valuation
            </span>
          </div>
        </div>
      </div>

      {/* 4. Detailed Breakdown Section: Sectoral Expenditure & Community Demographics */}
      <div className={styles.breakdownSection}>
        <div className={styles.breakdownHeaderWrap}>
          <span className={styles.eyebrow}>
            IN-DEPTH ASSESSED METRICS · {data.editionLabel}
          </span>
          <h4 className={styles.breakdownSectionTitle}>
            Sectoral expenditure &amp; community demographics
          </h4>
        </div>

        <div className={styles.breakdownGrid}>
          {/* Panel 1: Direct Economic Spend Breakdown */}
          <div className={styles.breakdownPanel}>
            <div className={styles.breakdownPanelHeader}>
              <span className={styles.breakdownPanelTitle}>
                {data.economicBreakdown.kicker}
              </span>
              <span className={styles.breakdownPanelBadge}>
                {data.economicBreakdown.totalBadge}
              </span>
            </div>

            <SectorBreakdownList sectors={data.economicBreakdown.sectors} />
          </div>

          {/* Panel 2: Participation & Community Demographics */}
          <div className={styles.breakdownPanel}>
            <div className={styles.breakdownPanelHeader}>
              <span className={styles.breakdownPanelTitle}>
                {data.demographicsBreakdown.kicker}
              </span>
              <span className={styles.breakdownPanelBadge}>
                {data.demographicsBreakdown.badge}
              </span>
            </div>

            <div className={styles.demographicList}>
              {data.demographicsBreakdown.items.map((item, index) => (
                <div key={index} className={styles.demographicRow}>
                  <div className={styles.demographicInfo}>
                    <span className={styles.demographicLabel}>{item.label}</span>
                    <span className={styles.demographicDesc}>{item.description}</span>
                  </div>
                  <span className={styles.demographicStat}>{item.stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology Footnote */}
        <div className={styles.infographicFooterNote}>
          <p>{data.methodologyNote}</p>
        </div>
      </div>
    </aside>
  );
}
