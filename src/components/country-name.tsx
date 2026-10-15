import Image from "next/image";
import { countryFlags } from "@/lib/countries";
import styles from "./site.module.css";

export function CountryName({ country }: { country: string }) {
  return <span className={styles.countryName}>
    {countryFlags[country] && <Image src={countryFlags[country]} alt="" width={22} height={16} aria-hidden="true" />}
    {country}
  </span>;
}
