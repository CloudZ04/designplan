export interface TechIcon {
  label: string
  iconUrl: string
  invertOnDark?: boolean
  brightenOnDark?: boolean
}

const TECH_ICONS: Record<string, TechIcon> = {
  // React
  react: {
    label: "React",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },

  // Next.js
  next: {
    label: "Next.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
  },
  nextjs: {
    label: "Next.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
  },

  // TypeScript / JavaScript
  typescript: {
    label: "TypeScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
  },
  ts: {
    label: "TypeScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
  },
  javascript: {
    label: "JavaScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
  },
  js: {
    label: "JavaScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
  },

  // Node.js
  node: {
    label: "Node.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
  },
  nodejs: {
    label: "Node.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
  },

  // HTML / CSS
  html: {
    label: "HTML5",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
  },
  css: {
    label: "CSS3",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
  },

  // Angular
  angular: {
    label: "Angular.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg"
  },

  // Vue
  vue: {
    label: "Vue.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
  },

  // Databases
  postgres: {
    label: "PostgreSQL",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
  },
  postgresql: {
    label: "PostgreSQL",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
  },

  // C / C++ / C#
  c: {
    label: "C",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"
  },
  cpp: {
    label: "C++",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
  },
  cplusplus: {
    label: "C++",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
  },
  
  csharp: {
    label: "C#",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg"
  },

  // Java
  java: {
    label: "Java",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
  },

  // Python / Flask / Django
  python: {
    label: "Python",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
  },
  flask: {
    label: "Flask",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    brightenOnDark: true
  },
  django: {
    label: "Django",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    brightenOnDark: true
  },

  // Git / GitHub / Bash
  git: {
    label: "Git",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
  },
  github: {
    label: "GitHub",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    invertOnDark: true
  },
  bash: {
    label: "Bash",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
    brightenOnDark: true
  },
  gitbash: {
    label: "Git Bash",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
      brightenOnDark: true
  },

  // Styling frameworks
  bootstrap: {
    label: "Bootstrap",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
  },
  tailwind: {
    label: "Tailwind CSS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
  },
  tailwindcss: {
    label: "Tailwind CSS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
  },

  // PHP / Laravel
  php: {
    label: "PHP",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
  },
  laravel: {
    label: "Laravel",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg"
  },

  // Ruby / Rails
  ruby: {
    label: "Ruby",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg"
  },
  rails: {
    label: "Ruby on Rails",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-plain.svg"
  },

  // Go / Rust
  go: {
    label: "Go",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg"
  },
  golang: {
    label: "Go",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg"
  },
  rust: {
    label: "Rust",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
    invertOnDark: true
  },

  // Frontend frameworks / tools
  svelte: {
    label: "Svelte",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg"
  },
  astro: {
    label: "Astro",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-plain.svg",
    invertOnDark: true
  },
  nuxt: {
    label: "Nuxt.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg"
  },
  vite: {
    label: "Vite",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg"
  },
  redux: {
    label: "Redux",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"
  },

  // Backend / Node ecosystem
  express: {
    label: "Express",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    invertOnDark: true
  },

  // Mobile / cross‑platform
  reactnative: {
    label: "React Native",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  electron: {
    label: "Electron",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg"
  },

  // Databases / caches
  mongodb: {
    label: "MongoDB",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
  },
  mysql: {
    label: "MySQL",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
  },
  redis: {
    label: "Redis",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
  },
  sqlite: {
    label: "SQLite",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg"
  },

  // DevOps / cloud
  docker: {
    label: "Docker",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
  },
  kubernetes: {
    label: "Kubernetes",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg"
  },
  aws: {
    label: "AWS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg"
  },
  azure: {
    label: "Azure",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
  },
  gcp: {
    label: "Google Cloud",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg"
  },
  firebase: {
    label: "Firebase",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
  },

  // Mobile platforms / languages
  android: {
    label: "Android",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg"
  },
  ios: {
    label: "iOS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
    invertOnDark: true
  },
  swift: {
    label: "Swift",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg"
  },
  kotlin: {
    label: "Kotlin",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg"
  },

  // Microsoft / .NET
  dotnet: {
    label: ".NET",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg"
  },
    // Microsoft / .NET
    net: {
      label: ".NET",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg"
    },
  aspnet: {
    label: "ASP.NET",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg"
  },

  // Java ecosystem
  spring: {
    label: "Spring",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
  },

  // Classic frontend libs/tools
  jquery: {
    label: "jQuery",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg"
  },
  webpack: {
    label: "Webpack",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg"
  },
  babel: {
    label: "Babel",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg"
  },
  eslint: {
    label: "ESLint",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg"
  },

  // Testing
  jest: {
    label: "Jest",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg"
  },
  cypress: {
    label: "Cypress",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cypressio/cypressio-original.svg",
    invertOnDark: true
  },

  // Package managers
  npm: {
    label: "npm",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg"
  },
  yarn: {
    label: "Yarn",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg"
  },
  pnpm: {
    label: "pnpm",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pnpm/pnpm-original.svg"
  },

  // CI / CD
  gitlab: {
    label: "GitLab",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg"
  },
  jenkins: {
    label: "Jenkins",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg"
  },

  // Design / tooling
  figma: {
    label: "Figma",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
  },
  photoshop: {
    label: "Photoshop",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg"
  },

  // Hosting / platforms
  vercel: {
    label: "Vercel",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
    invertOnDark: true
  },
  netlify: {
    label: "Netlify",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg"
  },

  // Analytics / DNS / CDN
  cloudflare: {
    label: "Cloudflare",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg"
  },

  // Design / no-code
  canva: {
    label: "Canva",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"
  },

  // Data / tooling
  supabase: {
    label: "Supabase",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg"
  },
  anaconda: {
    label: "Anaconda",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/anaconda/anaconda-original.svg"
  },

  // Charting
  chart: {
    label: "Chart.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg"
  },

  // .NET Razor / Blazor
  razor: {
    label: "Razor",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg"
  },
  blazor: {
    label: "Blazor",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blazor/blazor-original.svg"
  },

  // File transfer
  filezilla: {
    label: "FileZilla",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/filezilla/filezilla-plain.svg"
  },

  // Build tools
  gradle: {
    label: "Gradle",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gradle/gradle-original.svg",
      brightenOnDark: true
  },

  // APIs / schema
  graphql: {
    label: "GraphQL",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg"
  },

  // Styling languages
  sass: {
    label: "Sass",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg"
  },

  // Desktop / app shells
  tauri: {
    label: "Tauri",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tauri/tauri-original.svg"
  },

  // Markup
  xml: {
    label: "XML",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xml/xml-original.svg"
  }
}

export function normalizeTechName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp") // c# -> csharp
    .replace(/js$/, "") // vuejs, angularjs -> vue, angular
    .replace(/[53]$/, "") // html5 -> html, css3 -> css
}

export function resolveTechIcon(name: string): TechIcon | null {
  const key = normalizeTechName(name)
  return TECH_ICONS[key] ?? null
}

