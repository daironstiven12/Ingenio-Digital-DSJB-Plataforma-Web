"use client";

import Image from "next/image";
import { Mail, Globe } from "lucide-react";
import { useT } from "@/components/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ElectricCard from "@/components/ui/ElectricCard";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import GithubIcon from "@/components/ui/GithubIcon";
import { site } from "@/data/site";
import styles from "./Team.module.css";

const TONES = ["blue", "violet"];

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function MemberCard({ member, index, t }) {
  const role = t(member.roleKey);
  const tone = TONES[index % TONES.length];
  const photo = member.photoSrc ?? null;

  const avatar = photo ? (
    <Image
      src={photo}
      alt={t("team.photoAlt").replace("{name}", member.name)}
      width={480}
      height={480}
      sizes="112px"
      style={{ objectFit: "cover", objectPosition: "50% 20%" }}
      className={styles.avatarPhoto}
    />
  ) : (
    <span className={styles.avatarInitials} aria-hidden="true">
      {initialsOf(member.name)}
    </span>
  );

  const links = [
    member.linkedin
      ? {
          href: member.linkedin,
          label: t("team.linkedinAria").replace("{name}", member.name),
          Icon: LinkedinIcon,
        }
      : null,
    member.github
      ? {
          href: member.github,
          label: t("team.githubAria").replace("{name}", member.name),
          Icon: GithubIcon,
        }
      : null,
    member.website
      ? {
          href: member.website,
          label: t("team.siteAria").replace("{name}", member.name),
          Icon: Globe,
        }
      : null,
    site.email
      ? {
          href: `mailto:${site.email}`,
          label: t("team.emailAria").replace("{name}", member.name),
          Icon: Mail,
        }
      : null,
  ].filter(Boolean);

  return (
    <ElectricCard
      badge={role}
      title={member.name}
      description={null}
      tone={tone}
      className={styles.memberCard}
      leading={
        <span
          className={`${styles.avatarRing} ${
            tone === "blue" ? styles.ringBlue : styles.ringViolet
          }`}
        >
          {avatar}
        </span>
      }
    >
      {links.length > 0 ? (
        <div className={styles.linkRow}>
          {links.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className={styles.iconButton}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              aria-label={label}
            >
              <Icon size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : null}
    </ElectricCard>
  );
}

// Profesionales reales confirmados por el dueño.
// Con members vacío se muestra el estado honesto reservado.
export default function Team({ members }) {
  const { t } = useT();
  const list = Array.isArray(members) ? members : [];
  const hasMembers = list.length > 0;

  return (
    <section
      className={`band ${styles.section}`}
      id="equipo"
      aria-labelledby="equipo-titulo"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            index="05"
            kicker={t("sections.team.kicker")}
            title={t("sections.team.title")}
            lead={
              hasMembers
                ? t("sections.team.leadFilled")
                : t("sections.team.leadEmpty")
            }
            id="equipo-titulo"
            align="center"
          />
        </Reveal>

        <div className={styles.grid}>
          {hasMembers
            ? list.map((member, index) => (
                <Reveal key={member.id} y={26} delay={index * 0.08}>
                  <MemberCard member={member} index={index} t={t} />
                </Reveal>
              ))
            : null}
        </div>

        {!hasMembers ? (
          <Reveal className={styles.note} y={16} delay={0.24}>
            <p>{t("sections.team.note")}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
