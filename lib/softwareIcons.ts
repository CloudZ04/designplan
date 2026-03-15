import type { TechIcon } from "./techIcons"
import { normalizeTechName } from "./techIcons"

const SOFTWARE_ICONS: Record<string, TechIcon> = {
  // Operating systems
  windows: {
    label: "Windows",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg"
  },
  macos: {
    label: "macOS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
    invertOnDark: true
  },
  ios: {
    label: "iOS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
    invertOnDark: true
  },
  android: {
    label: "Android",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg"
  },
  ubuntu: {
    label: "Ubuntu",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg"
  },
  debian: {
    label: "Debian",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg"
  },
  fedora: {
    label: "Fedora",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fedora/fedora-original.svg"
  },
  linux: {
    label: "Linux",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
  },

  // Editors / IDEs
  vscode: {
    label: "VS Code",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
  },
  visualstudiocode: {
    label: "VS Code",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
  },
  vs: {
    label: "Visual Studio",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg"
  },
  visualstudio: {
    label: "Visual Studio",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg"
  },
  androidstudio: {
    label: "Android Studio",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg"
  },
  intellij: {
    label: "IntelliJ IDEA",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg"
  },
  intellijidea: {
    label: "IntelliJ IDEA",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg"
  },
  pycharm: {
    label: "PyCharm",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg"
  },
  atom: {
    label: "Atom",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/atom/atom-original.svg",
      brightenOnDark: true
  },

  // Design tools
  photoshop: {
    label: "Photoshop",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg",
      brightenOnDark: true
  },
  illustrator: {
    label: "Illustrator",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-original.svg"
  },
  canva: {
    label: "Canva",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"
  },
  figma: {
    label: "Figma",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
  },

  // Utilities / tools
  postman: {
    label: "Postman",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-plain.svg"
  },
  filezilla: {
    label: "FileZilla",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/filezilla/filezilla-plain.svg"
  },
  dockerdesktop: {
    label: "Docker Desktop",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
  },
  docker: {
    label: "Docker",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
  }
}

export function resolveSoftwareIcon(name: string): TechIcon | null {
  const key = normalizeTechName(name)
  return SOFTWARE_ICONS[key] ?? null
}

