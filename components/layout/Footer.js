"use client";

import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import GithubIcon from "@/components/ui/GithubIcon";
import { site, contact } from "@/data/site";
import { members } from "@/data/team";
import { useT } from "@/components/i18n/LanguageProvider";
import styles from "./Footer.module.css";

// lucide-react 1.71 no incluye iconos de marca: se usan glifos propios
// de simple-icons (LinkedinIcon/GithubIcon) + el dominio visible de cada URL.
const SOCIAL_META = {
  linkedin: { name: "LinkedIn", fallback: "linkedin.com" },
  github: { name: "GitHub", fallback: "github.com" },
  facebook: { name: "Facebook", fallback: "facebook.com" },
  instagram: { name: "Instagram", fallback: "instagram.com" },
};

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

// Pie compacto: marca + secciones + profesionales + encuéntranos.
// Solo muestra datos reales (social, miembros, contacto); con listas vacías,
// una sola línea honesta en vez de columnas vacías.
export default function Footer() {
  const { t } = useT();
  const year = site.copyrightYear;
  const navList = t("nav.items");
  const items = Array.isArray(navList) ? navList : [];

  const socialLinks = Object.entries(site.social ?? {})
    .filter(([key, url]) => key in SOCIAL_META && typeof url === "string" && /^https?:\/\//.test(url))
    .map(([key, url]) => ({
      key,
      url,
      name: SOCIAL_META[key].name,
      host: hostnameOf(url) ?? SOCIAL_META[key].fallback,
    }));

  const memberList = Array.isArray(members) ? members : [];

  return (
    <footer className={styles.footer} id="pie">
      <div className={`container ${styles.grid}`}>
        {/* Marca */}
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <Image
              src={site.logo ?? "/logo.jpeg"}
              alt=""
              width={80}
              height={80}
              sizes="40px"
              className={styles.brandLogo}
            />
            <p className={styles.brandName}>Ingenio Digital DSJB</p>
          </div>
          <p className={styles.brandDesc}>{t("footer.tagline")}</p>
          {contact.email || contact.whatsapp ? (
            <ul className={styles.contactList}>
              {contact.whatsapp ? (
                <li>
                  <a
                    href={`https://wa.me/${String(contact.whatsapp).replace(/\D/g, "")}`}
                    className={styles.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={15} aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className={styles.contactLink}>
                    <Mail size={15} aria-hidden="true" />
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>

        {/* Secciones (en línea, compactas) */}
        <nav aria-label={t("nav.footerLabel")} className={styles.sections}>
          <p className={`eyebrow ${styles.colTitle}`}>{t("footer.sections")}</p>
          <ul className={styles.sectionLinks}>
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.sectionLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profesionales */}
        <div className={styles.professionals}>
          <p className={`eyebrow ${styles.colTitle}`}>{t("footer.professionals")}</p>
          {memberList.length > 0 ? (
            <ul className={styles.memberList}>
              {memberList.map((member) => (
                <li key={member.id ?? member.name} className={styles.member}>
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={44}
                      height={44}
                      className={styles.avatar}
                    />
                  ) : (
                    <span className={styles.avatarInitials} aria-hidden="true">
                      {initialsOf(member.name)}
                    </span>
                  )}
                  <span className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.name}</span>
                    <span className={styles.memberRole}>{t(member.roleKey)}</span>
                  </span>
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      className={styles.memberLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("team.linkedinAria").replace("{name}", member.name)}
                    >
                      <LinkedinIcon size={16} />
                    </a>
                  ) : null}
                  {member.github ? (
                    <a
                      href={member.github}
                      className={styles.memberLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("team.githubAria").replace("{name}", member.name)}
                    >
                      <GithubIcon size={16} />
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.honestLine}>
              {t("footer.professionalsPending")}{" "}
              <a href="#equipo" className={styles.honestLink}>
                {t("footer.seeTeam")}
              </a>
            </p>
          )}
        </div>

        {/* Encuéntranos (solo si hay enlaces reales) */}
        {socialLinks.length > 0 ? (
          <div className={styles.findUs}>
            <p className={`eyebrow ${styles.colTitle}`}>{t("footer.findUs")}</p>
            <ul className={styles.socialList}>
              {socialLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.url}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.name} — ${link.host}`}
                  >
                    {link.key === "linkedin" ? (
                      <LinkedinIcon size={16} />
                    ) : link.key === "github" ? (
                      <GithubIcon size={16} />
                    ) : (
                      <LinkedinIcon size={16} />
                    )}
                    <span className={styles.socialText}>
                      <span className={styles.socialName}>{link.name}</span>
                      <span className={styles.socialHost}>{link.host}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {year} Ingenio Digital DSJB</p>
        <p className={styles.note}>{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
