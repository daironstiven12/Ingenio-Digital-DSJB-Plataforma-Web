"use client";

import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { Search, CornerDownLeft, X, Folder, Hash, Settings, Users, Check } from "lucide-react";
import { useT } from "@/components/i18n/LanguageProvider";
import { site, contact, social } from "@/data/site";
import { members } from "@/data/team";
import { projects } from "@/data/projects";
import { toggleTheme } from "@/lib/theme";
import { resolveMotion, setMotionPreference, readMotionPreference } from "@/lib/motion";
import { triggerNavLoader } from "@/lib/nav-loader";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import styles from "./CommandPalette.module.css";

const normalize = (value) =>
  (value ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const matchesQuery = (query, label) => {
  if (!query) return true;
  const q = normalize(query).trim();
  if (!q) return true;
  const text = normalize(label);
  if (text.includes(q)) return true;
  const initials = text.split(/\s+/).map((w) => w.charAt(0)).join("");
  return initials.includes(q);
};

const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

function buildItems(t, lang, setLang, { onClose } = {}) {
  const sections = (Array.isArray(t("nav.items")) ? t("nav.items") : []).map(
    (item, index) => ({
      id: `section-${index}`,
      group: "sections",
      label: item.label,
      icon: "hash",
      hint: "#",
      run() {
        onClose?.();
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }),
  );

  const projectDict = t("sections.projects.items") ?? {};
  const projectItems = projects.map((project) => {
    const name = projectDict?.[project.id]?.name ?? project.id;
    return {
      id: `project-${project.id}`,
      group: "projects",
      label: name,
      icon: "folder",
      hint: hostnameOf(project.url),
      accent: project.accent,
      run() {
        onClose?.();
        triggerNavLoader(project.url, {
          labelText: t("loading.openingProject").replace("{name}", name),
          domainText: hostnameOf(project.url),
          accent: project.accent,
        });
      },
    };
  });

  const actions = [
    {
      id: "action-theme",
      group: "actions",
      label: t("commandPalette.toggleTheme"),
      icon: "settings",
      run() {
        onClose?.();
        toggleTheme();
      },
    },
    {
      id: "action-language",
      group: "actions",
      label: t("commandPalette.toggleLanguage"),
      icon: "settings",
      hint: lang.toUpperCase(),
      run() {
        onClose?.();
        setLang(lang === "en" ? "es" : "en");
      },
    },
    {
      id: "action-motion",
      group: "actions",
      label: t("commandPalette.toggleMotion"),
      icon: "settings",
      run() {
        onClose?.();
        setMotionPreference(resolveMotion().allowed ? "off" : "on");
      },
    },
  ];
  if (typeof contact.email === "string" && contact.email.trim()) {
    actions.push({
      id: "action-email",
      group: "actions",
      label: t("commandPalette.copyEmail"),
      icon: "settings",
      hint: t("commandPalette.emailCopied"),
      run() {
        const value = contact.email.trim();
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(value).catch(() => {});
        }
        onClose?.();
      },
    });
  }
  if (typeof contact.whatsapp === "string" && contact.whatsapp.trim()) {
    actions.push({
      id: "action-whatsapp",
      group: "actions",
      label: t("commandPalette.openWhatsApp"),
      icon: "settings",
      run() {
        onClose?.();
        window.open(
          `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
          "_blank",
          "noopener,noreferrer",
        );
      },
    });
  }
  if (typeof social.linkedin === "string" && social.linkedin.trim()) {
    actions.push({
      id: "action-linkedin",
      group: "actions",
      label: "LinkedIn",
      icon: "settings",
      run() {
        onClose?.();
        window.open(social.linkedin, "_blank", "noopener,noreferrer");
      },
    });
  }
  if (typeof social.github === "string" && social.github.trim()) {
    actions.push({
      id: "action-github",
      group: "actions",
      label: "GitHub",
      icon: "settings",
      run() {
        onClose?.();
        window.open(social.github, "_blank", "noopener,noreferrer");
      },
    });
  }

  const team = members.flatMap((member) => {
    const entries = [];
    if (member.linkedin) {
      entries.push({
        id: `team-${member.id}-linkedin`,
        group: "team",
        label: t("commandPalette.openProfile")
          .replace("{name}", member.name)
          .replace("{network}", "LinkedIn"),
        icon: "user",
        run() {
          onClose?.();
          window.open(member.linkedin, "_blank", "noopener,noreferrer");
        },
      });
    }
    if (member.github) {
      entries.push({
        id: `team-${member.id}-github`,
        group: "team",
        label: t("commandPalette.openProfile")
          .replace("{name}", member.name)
          .replace("{network}", "GitHub"),
        icon: "user",
        run() {
          onClose?.();
          window.open(member.github, "_blank", "noopener,noreferrer");
        },
      });
    }
    return entries;
  });

  return { sections, projects: projectItems, actions, team };
}

const ITEM_ICONS = {
  hash: Hash,
  folder: Folder,
  settings: Settings,
  user: Users,
};

export default function CommandPalette() {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const previousFocus = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Atajo Ctrl/Cmd+K + evento personalizado (botón del header)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (event) => {
      const isCmdK =
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey;
      if (isCmdK) {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("ingenio:palette-open", onOpen);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("ingenio:palette-open", onOpen);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const groups = useMemo(
    () => buildItems(t, lang, setLang, { onClose: close }),
    [t, lang, setLang, close],
  );

  const visibleGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const filterGroup = (items) =>
      items.filter((item) =>
        matchesQuery(query, `${item.label} ${item.hint ?? ""}`),
      );
    return {
      sections: filterGroup(groups.sections),
      projects: filterGroup(groups.projects),
      actions: filterGroup(groups.actions),
      team: filterGroup(groups.team),
    };
  }, [groups, query]);

  const flatItems = useMemo(
    () =>
      [
        ...visibleGroups.sections,
        ...visibleGroups.projects,
        ...visibleGroups.actions,
        ...visibleGroups.team,
      ],
    [visibleGroups],
  );

  // Gestión de foco al abrir/cerrar + bloqueo de scroll de documento
  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    lockScroll("palette");
    const raf = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
      inputRef.current?.select();
    });
    return () => {
      cancelAnimationFrame(raf);
      unlockScroll("palette");
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  if (!open) return null;

  const selectedId = flatItems[activeIndex]?.id ?? null;

  const onInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, flatItems.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(flatItems.length - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const item = flatItems[activeIndex];
      if (item) {
        item.run();
      }
      return;
    }
  };

  const renderGroup = (title, items) => {
    if (!items.length) return null;
    return (
      <div key={title} className={styles.group} role="group" aria-label={title}>
        <p className={styles.groupLabel}>{title}</p>
        <ul className={styles.groupList}>
          {items.map((item) => {
            const Icon = ITEM_ICONS[item.icon] ?? Hash;
            const flatIndex = flatItems.findIndex((candidate) => candidate.id === item.id);
            const active = selectedId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  data-active={active ? "true" : undefined}
                  className={`${styles.item} ${active ? styles.itemActive : ""}`}
                  onMouseMove={() => setActiveIndex(flatIndex)}
                  onClick={() => item.run()}
                >
                  <Icon size={16} aria-hidden="true" className={styles.itemIcon} />
                  <span className={styles.itemLabel}>{item.label}</span>
                  {item.hint ? (
                    <span className={styles.itemHint}>{item.hint}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const sectionsLabel = t("commandPalette.sections");
  const projectsLabel = t("commandPalette.projects");
  const actionsLabel = t("commandPalette.actions");
  const teamLabel = t("commandPalette.team");

  return (
    <div
      className={styles.backdrop}
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("commandPalette.label")}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.inputRow}>
          <Search size={18} aria-hidden="true" className={styles.inputIcon} />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={selectedId ?? undefined}
            autoComplete="off"
            spellCheck={false}
            className={styles.input}
            placeholder={t("commandPalette.search")}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
          />
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label={t("nav.closeMenu")}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div id="palette-listbox" role="listbox" className={styles.results}>
          {flatItems.length === 0 ? (
            <div className={styles.empty}>
              <Search size={18} aria-hidden="true" />
              <p>{t("commandPalette.noMatches")}</p>
            </div>
          ) : null}
          {renderGroup(sectionsLabel, visibleGroups.sections)}
          {renderGroup(projectsLabel, visibleGroups.projects)}
          {renderGroup(actionsLabel, visibleGroups.actions)}
          {renderGroup(teamLabel, visibleGroups.team)}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <span className={styles.kbd}>↑</span>
            <span className={styles.kbd}>↓</span>
            {t("commandPalette.sections")}
          </span>
          <span className={styles.footerHint}>
            <CornerDownLeft size={14} aria-hidden="true" />
            {t("commandPalette.actions")}
          </span>
        </div>
      </div>
    </div>
  );
}
