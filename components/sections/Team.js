"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { members } from "@/data/team";
import { useT } from "@/components/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import useSpotlight from "@/lib/useSpotlight";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import GithubIcon from "@/components/ui/GithubIcon";
import styles from "./Team.module.css";

const SLOTS = [1, 2];

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function MemberCard({ member, t, spotlight }) {
  const role = member?.roleKey ? t(member.roleKey) : t("sections.team.roleFallback");

  return (
    <article className={`${styles.card} spotlight`} onPointerMove={spotlight}>
      <div className={styles.avatarWrap}>
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={96}
            height={96}
            sizes="96px"
            className={styles.avatarPhoto}
          />
        ) : member.name ? (
          <span className={styles.avatarInitials} aria-hidden="true">
            {initialsOf(member.name)}
          </span>
        ) : (
          <UserRound size={40} aria-hidden="true" className={styles.cardIcon} />
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>
          {member.name || t("sections.team.nameFallback")}
        </h3>
        <p className={styles.cardRole}>{role}</p>

        <div className={styles.cardLinks}>
          {member.linkedin ? (
            <a
              href={member.linkedin}
              className={styles.iconButton}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("team.linkedinAria").replace("{name}", member.name ?? "")}
            >
              <LinkedinIcon size={18} />
            </a>
          ) : null}
          {member.github ? (
            <a
              href={member.github}
              className={styles.iconButton}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("team.githubAria").replace("{name}", member.name ?? "")}
            >
              <GithubIcon size={18} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ReservedCard({ slotIndex, t, spotlight }) {
  return (
    <article className={`${styles.card} ${styles.reserved} spotlight`} onPointerMove={spotlight}>
      <div className={styles.avatarWrap}>
        <UserRound size={40} aria-hidden="true" className={styles.cardIcon} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{t("sections.team.nameFallback")}</h3>
        <p className={styles.cardRole}>{t("sections.team.roleFallback")}</p>
        <p className={styles.cardArea}>{`${t("sections.team.slotLabel")} ${slotIndex + 1}`}</p>
      </div>
    </article>
  );
}

// Equipo real confirmado por el dueño (los dos creadores).
// Con members vacío se muestra el estado honesto de siempre.
export default function Team() {
  const { t } = useT();
  const spotlight = useSpotlight();
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
          />
        </Reveal>

        <div className={styles.grid}>
          {hasMembers
            ? list.map((member, index) => (
                <Reveal key={member.id} y={26} delay={index * 0.08}>
                  <MemberCard member={member} t={t} spotlight={spotlight} />
                </Reveal>
              ))
            : SLOTS.map((slot, index) => (
                <Reveal key={slot} y={26} delay={index * 0.08}>
                  <ReservedCard slotIndex={index} t={t} spotlight={spotlight} />
                </Reveal>
              ))}
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
