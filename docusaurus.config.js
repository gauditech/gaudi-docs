// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Gaudi documentation",
  // tagline: 'Dinosaurs are cool',
  favicon: "img/favicon.svg",

  // Set the production url of your site here
  url: "https://docs.gaudi.tech",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "gaudi", // Usually your GitHub org/user name.
  projectName: "gaudi-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      navbar: {
        title: "Gaudi",
        logo: {
          alt: "Gaudi Logo",
          src: "img/logo.svg",
          href: "https://gaudi.tech",
        },
        items: [
          // {
          //   type: "docSidebar",
          //   sidebarId: "docsSidebar",
          //   position: "left",
          //   label: "Docs",
          // },
          // {
          //   href: 'https://github.com/facebook/docusaurus',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting started",
                to: "/",
              },
              {
                label: "Core concepts",
                to: "/core-concepts",
              },
              {
                label: "Advanced topics",
                to: "/advanced-topics",
              },
              {
                label: "Reference",
                to: "/reference",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/gaudi",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/gaudi",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/gaudi",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Gaudi on GitHub",
                href: "https://github.com/gauditech/gaudi",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Gaudi team.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
