import type { ComponentType, SVGProps } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import banner from "./_assets/banner.jpg";
import photo from "./_assets/profile.jpg";
import ContactActions from "./ContactActions";
import { ArrowIcon, CompassIcon, EmailIcon, LinkedInIcon } from "./icons";
import { LINKS, PROFILE, type ConnectLink } from "./profile";
import styles from "./connect.module.css";

export const metadata: Metadata = {
  title: PROFILE.name,
  description: PROFILE.headline,
  openGraph: {
    title: PROFILE.name,
    description: PROFILE.headline,
    url: "/connect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PROFILE.name,
    description: PROFILE.headline,
  },
};

const LINK_ICONS: Record<ConnectLink["service"], ComponentType<SVGProps<SVGSVGElement>>> = {
  linkedin: LinkedInIcon,
  website: CompassIcon,
  email: EmailIcon,
};

export default function ConnectPage() {
  return (
    <div className={styles.page}>
      <main className={styles.column}>
        <div className={styles.topNav} />

        <div className={styles.imageSection}>
          <div className={styles.banner}>
            <Image
              src={banner}
              alt=""
              fill
              preload
              sizes="(max-width: 500px) calc(100vw - 44px), 456px"
              className={styles.cover}
            />
          </div>
          <div className={styles.avatar}>
            <Image
              src={photo}
              alt={PROFILE.name}
              fill
              preload
              sizes="116px"
              className={styles.cover}
            />
          </div>
        </div>

        <div className={styles.textArea}>
          <h1 className={styles.name}>{PROFILE.name}</h1>
          <p className={styles.headline}>{PROFILE.headline}</p>
          <div className={styles.subBio}>
            <p>
              {PROFILE.work} | {PROFILE.company}
            </p>
            <p>{PROFILE.location}</p>
            <p>
              {PROFILE.education} | {PROFILE.degree}
            </p>
          </div>
          <ul className={styles.chips}>
            {PROFILE.skills.map((skill) => (
              <li key={skill} className={styles.chip}>
                <span className={styles.chipText}>{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        <ContactActions />

        <nav className={styles.links} aria-label="Links">
          {LINKS.map((link) => {
            const Icon = LINK_ICONS[link.service];
            const external = link.href.startsWith("http");
            return (
              <a
                key={link.service}
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={styles.linkRow}
              >
                <span className={styles.iconSlot}>
                  <span className={styles.iconFrame}>
                    <span className={styles.icon}>
                      <Icon />
                    </span>
                  </span>
                </span>
                <span className={styles.linkText}>
                  <span className={styles.linkTitle}>{link.title}</span>
                  <span className={styles.linkValue}>{link.display}</span>
                </span>
                <span className={styles.linkArrow}>
                  <ArrowIcon />
                </span>
              </a>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
