---
version: alpha
name: Apple
description: "Apple's web design system is restrained, product-first minimalism: vast white and near-white (#F5F5F7) canvases, near-black ink (#1D1D1F) typography, and a translucent dark global nav with blurred backdrop. SF Pro Display carries large, tightly tracked semibold headlines (up to 80px), while SF Pro Text handles the 17px body, 12–14px captions and nav. Color is reserved almost entirely for interaction: a single Apple blue (#0071E3) fills pill-shaped CTAs and focus rings, with #0066CC links on light and #2997FF links on dark. Soft rounded cards (18px), generous pill radii and a single subtle shadow keep surfaces calm and premium."
colors:
  primary: "#0071E3"
  primary-focus: "#0071E3"
  link: "#0066CC"
  link-on-dark: "#2997FF"
  ink: "#1D1D1F"
  black: "#000000"
  ink-secondary: "#424245"
  muted: "#6E6E73"
  muted-light: "#86868B"
  surface: "#FFFFFF"
  surface-alt: "#F5F5F7"
  surface-dark: "#1D1D1F"
  on-primary: "#FFFFFF"
  on-dark: "#E8E8ED"
  hairline: "#D2D2D7"
  chip: "#DEDEE3"
  accent-orange: "#B64400"
  accent-indigo: "#686CCC"
typography:
  hero-display:
    fontFamily: SF Pro Display
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -1.2px
  display-xl:
    fontFamily: SF Pro Display
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.576px
  display-lg:
    fontFamily: SF Pro Display
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.28px
  display-md:
    fontFamily: SF Pro Display
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.144px
  title-lg:
    fontFamily: SF Pro Text
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.374px
  title-md:
    fontFamily: SF Pro Display
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: 0.196px
  subtitle:
    fontFamily: SF Pro Display
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.231px
  lead:
    fontFamily: SF Pro Display
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.231px
  body:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.374px
  body-strong:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.374px
  body-bold:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: -0.374px
  button:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.374px
  link-strong:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.374px
  body-sm:
    fontFamily: SF Pro Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.224px
  caption:
    fontFamily: SF Pro Text
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: -0.12px
  caption-strong:
    fontFamily: SF Pro Text
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.12px
  nav-link:
    fontFamily: SF Pro Text
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.12px
rounded:
  xs: 8px
  sm: 10px
  md: 11px
  lg: 14px
  xl: 18px
  2xl: 20px
  3xl: 48px
  4xl: 56px
  pill: 980px
  full: 9999px
spacing:
  button-primary-padding-y: 11px
  button-primary-padding-x: 21px
  button-secondary-padding-y: 11px
  button-secondary-padding-x: 21px
  button-secondary-2-padding-y: 8px
  button-secondary-2-padding-x: 15px
  button-ghost-padding-y: 11px
  button-ghost-padding-x: 21px
components:
  button-primary:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 20.0002px
      letterSpacing: -0.374px
    rounded: 980px
    height: 44px
  button-primary-hover:
    backgroundColor: "#0076DF"
  button-secondary:
    textColor: "#2997FF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 20.0002px
      letterSpacing: -0.374px
    rounded: 980px
    height: 44px
  button-secondary-hover:
    backgroundColor: "#0076DF"
    textColor: "#FFFFFF"
  button-secondary-2:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
    rounded: 980px
    height: 36px
  button-secondary-2-hover:
    backgroundColor: "#0076DF"
    textColor: "#FFFFFF"
  button-ghost:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 20.0002px
      letterSpacing: -0.374px
    rounded: 980px
    height: 44px
  button-ghost-hover:
    backgroundColor: "#0076DF"
    textColor: "#FFFFFF"
  input:
    backgroundColor: "#161617"
    textColor: "#FFFFFFEB"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", system-ui, -apple-system, system-ui, \"Segoe UI\", \"SF Pro Icons\", \"Apple Legacy Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 41px
    rounded: 11px
    height: 42px
  input-label:
    textColor: "#FFFFFFEB"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", system-ui, -apple-system, system-ui, \"Segoe UI\", \"SF Pro Icons\", \"Apple Legacy Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 36px
  card:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 580px
  card-link:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
    height: 64px
  card-media:
    height: 49px
    width: 277px
  card-text:
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 40px
      fontWeight: 600
      lineHeight: 44px
  card-body:
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 21px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: 0.231px
  card-cta:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
    rounded: 980px
  card-cta-2:
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
    rounded: 980px
  card-media-2:
    height: 580px
    width: 702px
  card-hover:
    backgroundColor: "#000000"
  card-focus:
    backgroundColor: "#000000"
  promo-banner:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 692px
  promo-banner-link:
    height: 692px
    width: 1440px
  promo-banner-title:
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 56px
      fontWeight: 600
      lineHeight: 60px
      letterSpacing: -0.28px
  promo-banner-body:
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 400
      lineHeight: 32px
      letterSpacing: 0.196px
  promo-banner-cta:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 20.0002px
      letterSpacing: -0.374px
    rounded: 980px
  promo-banner-cta-2:
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 20.0002px
      letterSpacing: -0.374px
    rounded: 980px
  promo-banner-media:
    height: 692px
    width: 1440px
  promo-banner-hover:
    backgroundColor: "#000000"
  promo-banner-focus:
    backgroundColor: "#000000"
  nav-link:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 460px
  nav-link-title:
    textColor: "#000000E0"
  nav-link-text:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  nav-menu-item:
    backgroundColor: transparent
    textColor: "#FFFFFFCC"
    height: 44px
  header-landing:
    backgroundColor: "#1D1D1FCC"
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 44px
  header-landing-nav-link:
    textColor: "#FFFFFFCC"
  header-landing-icon:
    height: 44px
    width: 14px
  header-landing-text:
    textColor: "#FFFFFFCC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 21.0012px
      letterSpacing: -0.374px
  header-landing-nav-link-2:
    textColor: "#FFFFFFCC"
    height: 44px
    width: 31px
  header-landing-icon-2:
    height: 44px
    width: 15px
  header-landing-nav-link-3:
    textColor: "#FFFFFFCC"
  header-landing-group-3:
    textColor: "#000000"
  header-landing-group-4:
    backgroundColor: "#FFFFFF"
  header-landing-text-2:
    textColor: "#000000"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 13px
      letterSpacing: -0.08px
  header-landing-nav-link-hover:
    textColor: "#FFFFFF"
  header-landing-nav-link-focus:
    textColor: "#FFFFFF"
  header-landing-nav-link-2-hover:
    textColor: "#FFFFFF"
  header-landing-nav-link-2-focus:
    textColor: "#FFFFFF"
  header-landing-nav-link-3-hover:
    textColor: "#FFFFFF"
  header-landing-nav-link-3-focus:
    textColor: "#FFFFFF"
  footer-landing:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 996px
  footer-landing-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-item:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-link:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-text-2:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-text-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-heading-2:
    textColor: "#000000E0"
  footer-landing-text-4:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-nav-link:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  header-landing-mobile:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 48px
  header-landing-mobile-inner:
    backgroundColor: "#1D1D1FCC"
  header-landing-mobile-nav-link:
    textColor: "#FFFFFFCC"
  header-landing-mobile-icon:
    height: 48px
    width: 17px
  header-landing-mobile-text:
    textColor: "#FFFFFFCC"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 19px
      fontWeight: 600
      lineHeight: 23px
      letterSpacing: 0.228px
  header-landing-mobile-nav-link-2:
    textColor: "#FFFFFFCC"
    size: 48px
  header-landing-mobile-nav-link-3:
    textColor: "#FFFFFFCC"
  header-landing-mobile-group-3:
    textColor: "#000000"
  header-landing-mobile-group-4:
    backgroundColor: "#FFFFFF"
  header-landing-mobile-text-2:
    textColor: "#000000"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 600
      lineHeight: 13px
      letterSpacing: -0.08px
  header-landing-mobile-menu-toggle:
    backgroundColor: transparent
    textColor: "#FFFFFF"
    size: 48px
  header-landing-mobile-menu-toggle-icon:
    size: 18px
  header-landing-mobile-nav-link-hover:
    textColor: "#FFFFFF"
  header-landing-mobile-nav-link-focus:
    textColor: "#FFFFFF"
  header-landing-mobile-nav-link-2-hover:
    textColor: "#FFFFFF"
  header-landing-mobile-nav-link-2-focus:
    textColor: "#FFFFFF"
  header-landing-mobile-nav-link-3-hover:
    textColor: "#FFFFFF"
  header-landing-mobile-nav-link-3-focus:
    textColor: "#FFFFFF"
  footer-landing-mobile:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 1433px
  footer-landing-mobile-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-item:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-link:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-text-2:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-text-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-heading-2:
    textColor: "#000000E0"
  footer-landing-mobile-button:
    backgroundColor: "#F5F5F7"
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-icon:
    height: 6px
    width: 11px
  footer-landing-mobile-group-7:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-link-2:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-group-8:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-link-3:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-text-4:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-link-4:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"Myriad Set Pro\", \"SF Pro Icons\", \"Apple Legacy Chevron\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-landing-mobile-button-hover:
    textColor: "#000000"
  button-ghost-2:
    backgroundColor: transparent
    textColor: "#000000CC"
    height: 44px
  card-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 222px
  card-2-icon:
    height: 106px
    width: 72px
  card-2-body:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 24px
      fontWeight: 600
      lineHeight: 28px
      letterSpacing: 0.216px
  card-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 490px
  card-3-media:
    height: 256px
    width: 288px
  card-3-title:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 19.89px
      fontWeight: 600
      lineHeight: 29.25px
      letterSpacing: -0.374px
  card-3-body:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 25px
      letterSpacing: -0.374px
  card-3-text:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 25px
      letterSpacing: -0.374px
  card-3-text-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 25px
      letterSpacing: -0.374px
  card-3-group-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10.2px
      fontWeight: 600
      lineHeight: 15px
      letterSpacing: -0.374px
  card-3-link:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
  footer-link:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 440px
  footer-link-title:
    textColor: "#000000E0"
  footer-link-text:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  breadcrumb:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 56px
  breadcrumb-link:
    textColor: "#000000B8"
  breadcrumb-group:
    backgroundColor: "#000000B8"
    textColor: transparent
  breadcrumb-text:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  breadcrumb-item:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  icon-link:
    textColor: "#000000CC"
    height: 44px
  icon-link-icon:
    height: 44px
    width: 15px
  icon-link-hover:
    textColor: "#000000"
  icon-link-focus:
    textColor: "#000000"
  icon-link-2:
    textColor: "#000000CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 12px
      letterSpacing: -0.12px
    height: 44px
  icon-link-2-icon:
    height: 44px
    width: 14px
  icon-link-2-group-2:
    textColor: "#FFFFFF"
  icon-link-2-group-3:
    backgroundColor: "#000000"
  icon-link-2-text:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 13px
      letterSpacing: -0.08px
  icon-link-2-hover:
    textColor: "#000000"
  icon-link-2-focus:
    textColor: "#000000"
  header-inner:
    backgroundColor: "#FAFAFCCC"
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 44px
  header-inner-nav-link:
    textColor: "#000000CC"
  header-inner-icon:
    height: 44px
    width: 14px
  header-inner-text:
    textColor: "#000000CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 21.0012px
      letterSpacing: -0.374px
  header-inner-nav-link-2:
    textColor: "#000000CC"
    height: 44px
    width: 31px
  header-inner-icon-2:
    height: 44px
    width: 15px
  header-inner-nav-link-3:
    textColor: "#000000CC"
  header-inner-group-3:
    textColor: "#FFFFFF"
  header-inner-group-4:
    backgroundColor: "#000000"
  header-inner-text-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 13px
      letterSpacing: -0.08px
  header-inner-nav-link-hover:
    textColor: "#000000"
  header-inner-nav-link-focus:
    textColor: "#000000"
  header-inner-nav-link-2-hover:
    textColor: "#000000"
  header-inner-nav-link-2-focus:
    textColor: "#000000"
  header-inner-nav-link-3-hover:
    textColor: "#000000"
  header-inner-nav-link-3-focus:
    textColor: "#000000"
  footer-inner:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 7911px
  footer-inner-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-group-2:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-group-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-link:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-text-2:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-text-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-text-4:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-text-5:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-link-2:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-text-6:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  header-inner-mobile:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 48px
  header-inner-mobile-inner:
    backgroundColor: "#FAFAFCCC"
  header-inner-mobile-nav-link:
    textColor: "#000000CC"
  header-inner-mobile-icon:
    height: 48px
    width: 17px
  header-inner-mobile-text:
    textColor: "#000000CC"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 19px
      fontWeight: 600
      lineHeight: 23px
      letterSpacing: 0.228px
  header-inner-mobile-nav-link-2:
    textColor: "#000000CC"
    size: 48px
  header-inner-mobile-nav-link-3:
    textColor: "#000000CC"
  header-inner-mobile-group-3:
    textColor: "#FFFFFF"
  header-inner-mobile-group-4:
    backgroundColor: "#000000"
  header-inner-mobile-text-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 600
      lineHeight: 13px
      letterSpacing: -0.08px
  header-inner-mobile-menu-toggle:
    backgroundColor: transparent
    textColor: "#000000"
    size: 48px
  header-inner-mobile-menu-toggle-icon:
    size: 18px
  header-inner-mobile-nav-link-hover:
    textColor: "#000000"
  header-inner-mobile-nav-link-focus:
    textColor: "#000000"
  header-inner-mobile-nav-link-2-hover:
    textColor: "#000000"
  header-inner-mobile-nav-link-2-focus:
    textColor: "#000000"
  header-inner-mobile-nav-link-3-hover:
    textColor: "#000000"
  header-inner-mobile-nav-link-3-focus:
    textColor: "#000000"
  footer-inner-mobile:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 19335px
  footer-inner-mobile-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-mobile-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-mobile-group-2:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-group-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-link:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-text-2:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-text-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-text-4:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-text-5:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-link-2:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-mobile-text-6:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  button-primary-2:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
    rounded: 980px
    height: 36px
  button-primary-2-label-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
  button-primary-2-hover:
    backgroundColor: "#0076DF"
  button-ghost-3:
    backgroundColor: "#D2D2D7A3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 17px
    rounded: 56px
    height: 56px
  button-ghost-3-icon:
    size: 56px
  button-ghost-3-label:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 17px
  button-ghost-3-hover:
    backgroundColor: "#DEDEE3B2"
  card-4:
    textColor: "#1D1D1F"
    height: 500px
  card-4-group-2:
    backgroundColor: "#FFFFFF"
    rounded: 18px
  card-5:
    textColor: "#1D1D1F"
    height: 500px
  card-5-group-2:
    backgroundColor: "#FFFFFF"
    rounded: 18px
  carousel-section:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 625px
  carousel-section-title:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  carousel-section-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  text-link:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
    height: 96px
  text-link-badge:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  text-link-group-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  text-link-text-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  text-link-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
    height: 96px
  text-link-2-group:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  text-link-2-group-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 16.8px
      fontWeight: 600
      lineHeight: 19.2px
      letterSpacing: 0.196px
  text-link-2-text-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 16.8px
      fontWeight: 600
      lineHeight: 19.2px
      letterSpacing: 0.196px
  text-link-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
    height: 33px
  link-list:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 440px
  link-list-title:
    textColor: "#000000E0"
  link-list-text:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  tab-bar:
    textColor: "#1D1D1F"
    height: 60px
  tab-bar-group-4:
    textColor: "#F5F5F7"
  navigation-menu-item:
    backgroundColor: transparent
    textColor: "#000000CC"
    height: 44px
  header-inner-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 44px
  header-inner-2-nav-link:
    textColor: "#000000CC"
  header-inner-2-icon:
    height: 44px
    width: 14px
  header-inner-2-text:
    textColor: "#000000CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 21.0012px
      letterSpacing: -0.374px
  header-inner-2-nav-link-2:
    textColor: "#000000CC"
    height: 44px
    width: 31px
  header-inner-2-icon-2:
    height: 44px
    width: 15px
  header-inner-2-nav-link-3:
    textColor: "#000000CC"
  header-inner-2-group-3:
    textColor: "#FFFFFF"
  header-inner-2-group-4:
    backgroundColor: "#000000"
  header-inner-2-text-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 13px
      letterSpacing: -0.08px
  header-inner-2-nav-link-hover:
    textColor: "#000000"
  header-inner-2-nav-link-focus:
    textColor: "#000000"
  header-inner-2-nav-link-2-hover:
    textColor: "#000000"
  header-inner-2-nav-link-2-focus:
    textColor: "#000000"
  header-inner-2-nav-link-3-hover:
    textColor: "#000000"
  header-inner-2-nav-link-3-focus:
    textColor: "#000000"
  footer-inner-2:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 2184px
  footer-inner-2-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-2-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-2-group-3:
    textColor: "#6E6E73"
  footer-inner-2-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-text-2:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-text-4:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-text-5:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-text-6:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-nav:
    textColor: "#000000B8"
  footer-inner-2-nav-link:
    textColor: "#000000B8"
  footer-inner-2-group-4:
    backgroundColor: "#000000B8"
    textColor: transparent
  footer-inner-2-nav-item:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-heading-3:
    textColor: "#000000E0"
  footer-inner-2-text-7:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-nav-link-2:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  header-inner-2-mobile:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 48px
  header-inner-2-mobile-nav-link:
    textColor: "#000000CC"
  header-inner-2-mobile-icon:
    height: 48px
    width: 17px
  header-inner-2-mobile-text:
    textColor: "#000000CC"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 19px
      fontWeight: 600
      lineHeight: 23px
      letterSpacing: 0.228px
  header-inner-2-mobile-nav-link-2:
    textColor: "#000000CC"
    size: 48px
  header-inner-2-mobile-nav-link-3:
    textColor: "#000000CC"
  header-inner-2-mobile-group-3:
    textColor: "#FFFFFF"
  header-inner-2-mobile-group-4:
    backgroundColor: "#000000"
  header-inner-2-mobile-text-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 600
      lineHeight: 13px
      letterSpacing: -0.08px
  header-inner-2-mobile-menu-toggle:
    backgroundColor: transparent
    textColor: "#000000"
    size: 48px
  header-inner-2-mobile-menu-toggle-icon:
    size: 18px
  header-inner-2-mobile-nav-link-hover:
    textColor: "#000000"
  header-inner-2-mobile-nav-link-focus:
    textColor: "#000000"
  header-inner-2-mobile-nav-link-2-hover:
    textColor: "#000000"
  header-inner-2-mobile-nav-link-2-focus:
    textColor: "#000000"
  header-inner-2-mobile-nav-link-3-hover:
    textColor: "#000000"
  header-inner-2-mobile-nav-link-3-focus:
    textColor: "#000000"
  footer-inner-2-mobile:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 4232px
  footer-inner-2-mobile-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-2-mobile-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-2-mobile-group-3:
    textColor: "#6E6E73"
  footer-inner-2-mobile-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-mobile-text-2:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-mobile-text-4:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-mobile-text-5:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-mobile-text-6:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-mobile-nav:
    textColor: "#000000B8"
  footer-inner-2-mobile-nav-link:
    textColor: "#000000B8"
  footer-inner-2-mobile-group-4:
    backgroundColor: "#000000B8"
    textColor: transparent
  footer-inner-2-mobile-nav-item:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-mobile-heading-3:
    textColor: "#000000E0"
  footer-inner-2-mobile-button:
    backgroundColor: "#F5F5F7"
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-2-mobile-icon:
    height: 6px
    width: 11px
  footer-inner-2-mobile-button-hover:
    textColor: "#000000"
  button-primary-3:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
    rounded: 980px
    height: 36px
  button-primary-3-group:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
  button-primary-3-hover:
    backgroundColor: "#0076DF"
  button-ghost-4:
    backgroundColor: transparent
    textColor: "#1D1D1F"
    height: 54px
  button-ghost-4-image:
    size: 54px
  button-ghost-4-focus:
    padding: 3px
  card-6:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 625px
  card-6-title:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  card-6-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  card-7:
    textColor: "#1D1D1F"
    height: 500px
  card-7-group-2:
    backgroundColor: "#FFFFFF"
    rounded: 18px
  card-link-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
    height: 128px
  card-link-2-group-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 16.8px
      fontWeight: 600
      lineHeight: 19.2px
      letterSpacing: 0.196px
  card-link-2-text-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 16.8px
      fontWeight: 600
      lineHeight: 19.2px
      letterSpacing: 0.196px
  card-link-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
    height: 64px
  card-link-3-text:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  sub-navigation:
    textColor: "#1D1D1F"
    height: 60px
  sub-navigation-group-4:
    textColor: "#F5F5F7"
  navigation-link:
    backgroundColor: transparent
    textColor: "#000000CC"
    height: 44px
  icon-button:
    textColor: "#000000CC"
    height: 44px
  icon-button-icon:
    height: 44px
    width: 15px
  icon-button-hover:
    textColor: "#000000"
  icon-button-focus:
    textColor: "#000000"
  icon-button-2:
    textColor: "#000000CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 12px
      letterSpacing: -0.12px
    height: 44px
  icon-button-2-icon:
    height: 44px
    width: 14px
  icon-button-2-group-2:
    textColor: "#FFFFFF"
  icon-button-2-group-3:
    backgroundColor: "#000000"
  icon-button-2-text:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 13px
      letterSpacing: -0.08px
  icon-button-2-hover:
    textColor: "#000000"
  icon-button-2-focus:
    textColor: "#000000"
  footer-inner-3:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 1140px
  footer-inner-3-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-3-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-3-group-3:
    textColor: "#6E6E73"
  footer-inner-3-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-text-2:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-text-4:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-nav:
    textColor: "#000000B8"
  footer-inner-3-nav-link:
    textColor: "#000000B8"
  footer-inner-3-group-4:
    backgroundColor: "#000000B8"
    textColor: transparent
  footer-inner-3-nav-item:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-heading-3:
    textColor: "#000000E0"
  footer-inner-3-text-5:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-nav-link-2:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 1861px
  footer-inner-3-mobile-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-3-mobile-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-3-mobile-group-3:
    textColor: "#6E6E73"
  footer-inner-3-mobile-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-text-2:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-text-4:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-nav:
    textColor: "#000000B8"
  footer-inner-3-mobile-nav-link:
    textColor: "#000000B8"
  footer-inner-3-mobile-group-4:
    backgroundColor: "#000000B8"
    textColor: transparent
  footer-inner-3-mobile-nav-item:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-heading-3:
    textColor: "#000000E0"
  footer-inner-3-mobile-button:
    backgroundColor: "#F5F5F7"
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-icon:
    height: 6px
    width: 11px
  footer-inner-3-mobile-group-10:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-link:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-link-2:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-text-5:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-link-3:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-text-6:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-link-4:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-3-mobile-button-hover:
    textColor: "#000000"
  button-primary-4:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 20.0002px
      letterSpacing: -0.374px
    rounded: 980px
    height: 44px
  button-primary-4-hover:
    backgroundColor: "#0076DF"
  button-primary-5:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    rounded: 980px
    height: 24px
  button-primary-5-hover:
    backgroundColor: "#0076DF"
  button-secondary-3:
    backgroundColor: transparent
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 24px
      fontWeight: 600
      lineHeight: 28px
      letterSpacing: 0.216px
    rounded: 48px
    padding: 32px
    height: 92px
  button-secondary-3-hover:
    textColor: "#000000"
  card-8:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 548px
  card-8-group-2:
    backgroundColor: "#FFFFFF"
    rounded: 10px
  card-8-media:
    height: 228px
    width: 375px
  card-8-group-4:
    padding: 36px
  card-8-body:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 25px
      letterSpacing: -0.374px
  card-8-body-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 28px
      fontWeight: 600
      lineHeight: 32px
      letterSpacing: 0.196px
  card-8-body-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
  card-9:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 508px
  card-9-title:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 48px
      fontWeight: 600
      lineHeight: 52.0077px
      letterSpacing: -0.144px
  card-9-body:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
  tab:
    textColor: "#000000CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
    height: 126px
  tab-button-active:
    backgroundColor: transparent
  tab-icon:
    height: 75px
    width: 41px
  tab-text:
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      lineHeight: 18.0008px
      letterSpacing: -0.224px
  tab-hover:
    textColor: "#000000"
  tab-2:
    backgroundColor: transparent
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 21.8582px
      letterSpacing: -0.224px
    height: 122px
  tab-2-icon:
    height: 75px
    width: 65px
  tab-2-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
  tab-2-hover:
    textColor: "#000000"
  tab-3:
    backgroundColor: transparent
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 21.8582px
      letterSpacing: -0.224px
    height: 122px
  tab-3-icon:
    height: 75px
    width: 47px
  tab-3-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 18.0008px
      letterSpacing: -0.224px
  tab-3-hover:
    textColor: "#000000"
  table:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 177px
  table-caption:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
  table-head:
    textColor: "#6E6E73"
  table-header-cell:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    padding: 1px
  table-header-cell-2:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    padding: 1px
  table-text-2:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  table-cell:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
  table-cell-2:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 25px
      letterSpacing: -0.374px
  toggle-button-active:
    backgroundColor: "#000000"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 24px
      fontWeight: 600
      lineHeight: 28px
      letterSpacing: 0.216px
    rounded: 48px
    padding: 32px
    height: 92px
  header-inner-3:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 52px
  header-inner-3-group-2:
    backgroundColor: "#FAFAFCCC"
  header-inner-3-group-3:
    textColor: "#000000"
  header-inner-3-logo:
    textColor: "#000000"
    typography:
      fontFamily: "\"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 21px
      fontWeight: 600
      lineHeight: 24px
      letterSpacing: 0.231px
  header-inner-3-cta:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    rounded: 980px
    height: 24px
  header-inner-3-cta-hover:
    backgroundColor: "#0076DF"
  footer-inner-4:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 782px
  footer-inner-4-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-4-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-4-group-2:
    textColor: "#6E6E73"
  footer-inner-4-item:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-text-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-nav:
    textColor: "#000000B8"
  footer-inner-4-nav-link:
    textColor: "#000000B8"
  footer-inner-4-group-3:
    backgroundColor: "#000000B8"
    textColor: transparent
  footer-inner-4-nav-item:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-heading-3:
    textColor: "#000000E0"
  footer-inner-4-text-4:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 600
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-nav-link-2:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  header-inner-3-mobile:
    textColor: "#1D1D1F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 400
      lineHeight: 25px
      letterSpacing: -0.374px
    height: 48px
  header-inner-3-mobile-group-2:
    backgroundColor: "#FAFAFCCC"
  header-inner-3-mobile-group-3:
    textColor: "#000000"
  header-inner-3-mobile-logo:
    textColor: "#000000"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 17px
      fontWeight: 600
      lineHeight: 24.0014px
      letterSpacing: -0.374px
  header-inner-3-mobile-cta:
    backgroundColor: "#0071E3"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    rounded: 980px
  header-inner-3-mobile-cta-hover:
    backgroundColor: "#0076DF"
  footer-inner-4-mobile:
    backgroundColor: "#F5F5F7"
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
    height: 990px
  footer-inner-4-mobile-heading:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 18px
      fontWeight: 600
      lineHeight: 24.0007px
      letterSpacing: -0.12px
  footer-inner-4-mobile-heading-2:
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 14.04px
      fontWeight: 600
      lineHeight: 18.7206px
      letterSpacing: -0.12px
  footer-inner-4-mobile-group-2:
    textColor: "#6E6E73"
  footer-inner-4-mobile-item:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-text:
    textColor: "#6E6E73"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-text-3:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-nav:
    textColor: "#000000B8"
  footer-inner-4-mobile-nav-link:
    textColor: "#000000B8"
  footer-inner-4-mobile-group-3:
    backgroundColor: "#000000B8"
    textColor: transparent
  footer-inner-4-mobile-nav-item:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-heading-3:
    textColor: "#000000E0"
  footer-inner-4-mobile-button:
    backgroundColor: "#F5F5F7"
    textColor: "#000000E0"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-icon:
    height: 6px
    width: 11px
  footer-inner-4-mobile-group-10:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-link:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-link-2:
    textColor: "#0066CC"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-text-4:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-link-3:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-text-5:
    textColor: "#0000008F"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-link-4:
    textColor: "#000000B8"
    typography:
      fontFamily: "\"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.0005px
      letterSpacing: -0.12px
  footer-inner-4-mobile-button-hover:
    textColor: "#000000"
---

# Apple

## Overview

Apple's site is product-first minimalism at its most disciplined. The page is a sequence of tall, full-bleed bands, alternating **Parchment** (`surface-alt`, #F5F5F7), pure white (`surface`, #FFFFFF) and near-black (`surface-dark`, #1D1D1F). Each band holds a centered headline, a one-line tagline, a pair of pill CTAs and a large product render. Photography and product lighting do the emotional work. The UI stays out of the way: ink-colored type, almost no chrome, and color held back for interaction.

Density is deliberately low on marketing surfaces and rises only in utility zones. The Shop pages carry card carousels and tab rails. The footer is a dense field of 12px links on Parchment. Hierarchy comes from scale and weight, not color. SF Pro Display at weight 600 steps down from `hero-display` (80px) through `display-md` (48px) to `title-md` (28px). SF Pro Text at 17px (`body`) carries everything conversational. A secondary gray continuation line (`muted`, #6E6E73) set in the same size and weight as the dark headline is a signature move on the Shop pages.

Color is almost entirely interactive. **Action Blue** (`primary`, #0071E3) fills pill CTAs and draws every focus ring. **Link Blue** (`link`, #0066CC) and **Sky Link** (`link-on-dark`, #2997FF) mark text links on light and dark grounds. Depth is quiet and comes from three sources: a single soft card shadow, a frosted translucent global nav, and tonal contrast between bands.

**Key Characteristics:**
- Full-bleed alternating light, Parchment and near-black bands, each centered around one product story.
- Two-family type system: SF Pro Display for 21px and up, SF Pro Text for 17px and below.
- Headlines use weight 600 with tight negative tracking that grows as size grows (-1.2px at 80px).
- Action Blue (`primary`, #0071E3) is reserved for primary CTA fills and the 2px focus ring.
- Every measured button uses the `pill` radius (980px); content cards use `rounded.xl` (18px).
- Elevation is a single soft shadow (`#00000014 2px 4px 12px 0px`) plus the frosted nav blur (`saturate(1.8) blur(20px)`).
- The utility footer is set in 12px `caption`, using translucent black text alphas on Parchment.

## Colors

The palette is a near-monochrome ladder of neutrals plus a tight blue family for interaction. Two small accents appear only in editorial copy and badges.

### Brand & Interaction
- **Action Blue** (`primary`, #0071E3): the fill of primary CTAs (`button-primary`, `button-primary-2`, `button-primary-3`, the `card-cta` and `promo-banner-cta` parts). Hover shifts the fill to #0076DF. Never use it for body text or decorative fills.
- **Focus Blue** (`primary-focus`, #0071E3): the same hue, used as the universal `2px solid #0071E3` focus outline on buttons, nav links, footer links and inputs.
- **Link Blue** (`link`, #0066CC): inline text links and outlined light-ground buttons (`button-ghost`, `button-secondary-2` carry a `1px solid #0066CC` border).
- **Sky Link** (`link-on-dark`, #2997FF): links and outlined buttons on dark bands (`button-secondary` uses #2997FF text and a 1px border in the same color).
- **On Primary** (`on-primary`, #FFFFFF): label color on any Action Blue fill.

### Surfaces
- **White** (`surface`, #FFFFFF): the default page and card face. `card-4`, `card-8` and the `card-5`/`card-7` groups sit as white tiles.
- **Parchment** (`surface-alt`, #F5F5F7): alternate bands, the Shop canvas, and every footer (`footer-landing` background).
- **Graphite** (`surface-dark`, #1D1D1F): dark hero bands. Translucent at 80% alpha (#1D1D1FCC) it becomes the landing nav bar behind the blur.
- **Black** (`black`, #000000): pure-black product bands and the selected state of `toggle-button-active`.

### Text
- **Ink** (`ink`, #1D1D1F): primary text everywhere on light grounds, including headlines, body and card titles. Use it instead of pure black.
- **Ink Secondary** (`ink-secondary`, #424245): secondary copy that must stay strongly legible.
- **Muted** (`muted`, #6E6E73): gray continuation headlines, tab labels (`tab-2`, `tab-3`), eyebrow text (`card-8-body`) and table headers.
- **Muted Light** (`muted-light`, #86868B): the quietest captions and disclaimers.
- **On Dark** (`on-dark`, #E8E8ED): nav and body text on dark bands.

### Hairlines & Borders
- **Hairline** (`hairline`, #D2D2D7): 1px dividers under `tab` items and table rows. Footers instead use a translucent `#00000029` bottom border on their grouping blocks.

### Editorial Accents
- **Ember** (`accent-orange`, #B64400): small highlighted text such as "New"-style callouts. Use it sparingly, as text only.
- **Indigo** (`accent-indigo`, #686CCC): a rare surface accent tied to specific product storytelling, not a UI color.

### Component & State Colors
- **Chip Gray** (`chip`, #DEDEE3): measured only on components, never in page sampling. It appears as the translucent hover fill of the circular control `button-ghost-3` (#DEDEE3B2, flagged: label y did not reproduce). The resting fill of that control is #D2D2D7A3. Treat it as a control-state color, not a palette surface.

No CSS gradients were measured. Any glow or chrome in the heroes lives inside the product imagery.

## Typography

### Font Family
- **SF Pro Display**: every size 21px and up: hero and section headlines, `title-md` card titles, `subtitle`/`lead` taglines. Fallback stack: "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif.
- **SF Pro Text**: everything 17px and below: body, buttons, nav, captions and footer. `title-lg` (34px) is the one Text-family exception above that size. The footer stacks add "Myriad Set Pro" and system-ui before Helvetica.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `hero-display` | 80px | 600 | 1.05 | -1.2px | Page-defining H1 on product heroes |
| `display-xl` | 64px | 600 | 1.05 | -0.576px | Large section headlines |
| `display-lg` | 56px | 600 | 1.05 | -0.28px | Home hero / promo-banner titles |
| `display-md` | 48px | 600 | 1.1 | -0.144px | Section H2s, `card-9` titles |
| `title-lg` | 34px | 600 | 1.45 | -0.374px | SF Pro Text page titles on Shop flows |
| `title-md` | 28px | 600 | 1.15 | 0.196px | Card titles, carousel section heads, Shop dark+gray headlines |
| `subtitle` | 21px | 400 | 1.2 | 0.231px | Hero taglines, single line |
| `lead` | 21px | 400 | 1.4 | 0.231px | Multi-line intro paragraphs |
| `body` | 17px | 400 | 1.45 | -0.374px | Default running text |
| `body-strong` | 17px | 600 | 1.45 | -0.374px | Inline emphasis, card eyebrows, H4s |
| `body-bold` | 17px | 700 | 1.45 | -0.374px | Rare heavy emphasis (pricing callouts) |
| `button` | 17px | 400 | 1.2 | -0.374px | 44px pill CTA labels |
| `link-strong` | 17px | 600 | 1.25 | -0.374px | Bold standalone links |
| `body-sm` | 14px | 400 | 1.3 | -0.224px | Compact 36px pill labels, tab labels |
| `caption` | 12px | 400 | 1.35 | -0.12px | Footer text, legal, table headers |
| `caption-strong` | 12px | 600 | 1.35 | -0.12px | Footer column headings |
| `nav-link` | 12px | 400 | 1 | -0.12px | Global nav links |

### Principles
- **Three weights only: 400, 600, 700.** Weight 600 is the headline weight at every display size. Weight 700 is limited to `body-bold`. Weights 300 and 500 are absent; don't introduce them.
- **Tracking is optical, not uniform.** Display sizes track negative and get tighter as they grow (-1.2px at 80px down to -0.144px at 48px). The 28px and 21px Display sizes flip to slightly positive tracking (0.196px, 0.231px). All Text sizes track negative (-0.374px at 17px, -0.224px at 14px, -0.12px at 12px). Always pair a size with its listed letter-spacing.
- **Line height loosens as size shrinks.** Display headlines sit at 1.05–1.1, titles at 1.15–1.2, body at 1.45. Controls collapse to 1.2 (`button`) or 1 (`nav-link`) so they center in fixed-height bars.
- **The Display/Text switch is a hard rule.** Never set body copy in SF Pro Display or a hero in SF Pro Text.
- **Hierarchy through weight and size, never color.** The gray continuation headline (`muted`) keeps the same size and weight as its `ink` lead.

### Note on Font Substitutes
SF Pro is proprietary and licensed for Apple platforms only. The closest open-source stand-in is **Inter**: use Inter Display (or Inter with optical sizing) for the Display roles and Inter for the Text roles. Inter runs slightly wider, so add roughly -0.01em on top of the token letter-spacing at display sizes, and keep the token line-heights. On Apple devices, `-apple-system` / `system-ui` resolves to SF Pro and should lead the stack.

## Layout

### Spacing System
No base step or section-rhythm token was verified. The only verified spacing measurements are the internal paddings of the pill buttons:

| Token | Value | Read on |
|---|---|---|
| `button-primary-padding-y` | 11px | `button-primary` root |
| `button-primary-padding-x` | 21px | `button-primary` root |
| `button-secondary-padding-y` | 11px | `button-secondary` root |
| `button-secondary-padding-x` | 21px | `button-secondary` root |
| `button-ghost-padding-y` | 11px | `button-ghost` root |
| `button-ghost-padding-x` | 21px | `button-ghost` root |
| `button-secondary-2-padding-y` | 8px | `button-secondary-2` root |
| `button-secondary-2-padding-x` | 15px | `button-secondary-2` root |

The pattern is consistent. Full-size pills use `button-primary-padding-y` (11px) by `button-primary-padding-x` (21px) in every variant, filled or outlined. The compact pill tightens to `button-secondary-2-padding-y` (8px) by `button-secondary-2-padding-x` (15px).

### Grid & Container
No container max-width or grid-gap token was verified, so don't hard-code them from this document. From the screenshots:
- Hero bands are full-bleed, with a single centered stack: headline, tagline, CTA pair, then product image.
- Below the heroes, promotional tiles sit in a multi-column mosaic separated by narrow gutters, inside a white page frame.
- Shop pages are left-aligned on Parchment. Horizontally scrolling card carousels bleed off the right edge, and a sub-navigation rail sits beneath the global nav.
- Financing and trade-in pages use a narrow centered text column with small icon and product grids.

### Whitespace Philosophy
Whitespace is the primary luxury signal. Each band is tall enough to read as its own scene, and copy is limited to a headline and one line. Tight gutters between tiles contrast with the generous air inside them. Density appears only where users scan: footers, tabs and comparison tables. Don't fill empty band space with extra copy or decoration.

### Measured Layout

Every spacing token restates a measurement of a verified component recipe, or the step those measurements share.

- `button-primary-padding-y`: 11px (`button-primary`, vertical padding of the root)
- `button-primary-padding-x`: 21px (`button-primary`, horizontal padding of the root)
- `button-secondary-padding-y`: 11px (`button-secondary`, vertical padding of the root)
- `button-secondary-padding-x`: 21px (`button-secondary`, horizontal padding of the root)
- `button-secondary-2-padding-y`: 8px (`button-secondary-2`, vertical padding of the root)
- `button-secondary-2-padding-x`: 15px (`button-secondary-2`, horizontal padding of the root)
- `button-ghost-padding-y`: 11px (`button-ghost`, vertical padding of the root)
- `button-ghost-padding-x`: 21px (`button-ghost`, horizontal padding of the root)

The card-4 grid lays out in 8 columns; the card-8 grid in 3 columns; the tab grid in 6 columns at desktop.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 · Flat tonal | No shadow. Depth comes from switching band color between `surface`, `surface-alt` and `surface-dark` | Hero and product bands, footers |
| 1 · Hairline | `1px solid` `hairline` (#D2D2D7) bottom border on `tab` and table rows; `#00000029` bottom border on footer groups (`footer-landing-group`) | Separating list items, tab rails, footer sections |
| 2 · Soft card shadow | `#00000014 2px 4px 12px 0px` (page-sampled as `rgba(0, 0, 0, 0.08) 2px 4px 12px 0px`) on a white `rounded.xl` face | `card-4` group tiles on Parchment Shop canvases. Also on `card-5` and `card-7` (not verifiable: page media covers most of the card) |
| 3 · Frosted glass | `backdrop-filter: saturate(1.8) blur(20px)` over a translucent fill: #1D1D1FCC dark, or #FAFAFCCC light | Global nav `header-landing` (flagged: group x did not reproduce) and `header-inner` (flagged: group x did not reproduce), plus the Shop sticky bar in `header-inner-3` (flagged: group y did not reproduce) |
| Focus | `2px solid #0071E3` outline, offset 3px on pills, -7px (inset) on nav items, 1px on text links | All interactive elements |

**Shadow philosophy.** Apple uses exactly one shadow, and it is barely there: an 8%-black, 12px-blur drop shadow offset down and to the right. It lifts white product cards off the Parchment Shop canvas. It never appears on buttons, heroes or the nav. The nav earns its separation through translucency and blur instead, a frosted layer that saturates the content scrolling beneath it. Everything else is flat. Tonal band changes and 1px hairlines do the structural work. To add depth, use one of these four tiers; never stack shadows or deepen the one that exists.

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| `rounded.xs` | 8px | Small elements seen in page sampling; no measured component |
| `rounded.sm` | 10px | `card-8` content face (white tile with media) |
| `rounded.md` | 11px | Dark country-selector `input` (flagged: render matched 89% of pixels on focus) |
| `rounded.lg` | 14px | Occasional tiles in page sampling; no measured component |
| `rounded.xl` | 18px | The standard card radius: `card-4` group face, also `card-5` and `card-7` |
| `rounded.2xl` | 20px | Larger tiles in page sampling; no measured component |
| `rounded.3xl` | 48px | Large selector chips `button-secondary-3` and `toggle-button-active` (both flagged: width did not reproduce 202px) |
| `rounded.4xl` | 56px | Circular carousel control `button-ghost-3`, 56px high, so it renders as a circle (flagged: label y did not reproduce) |
| `rounded.pill` | 980px | Every CTA: `button-primary`, `button-secondary`, `button-secondary-2`, `button-ghost`, `card-cta`, nav CTA `header-inner-3-cta` |
| `rounded.full` | 9999px | Rare true-circle elements in page sampling |

The geometry is soft and continuous. There are no sharp corners on interactive or container elements, and no hard square tiles. Buttons are always full pills: the 980px value guarantees a capsule at any height (44px, 36px or 24px). Cards use `rounded.xl`, and smaller media-led tiles step down to `rounded.sm`. Circles appear for carousel arrows (`rounded.4xl` on a 56px control) and avatar/icon chips. Photography is mostly unframed cut-out product renders, so imagery rarely needs a radius of its own.

## Components

Each component below was distilled from the live page: the recipe is a standalone, placeholder-filled reproduction with literal values, and every frontmatter key named in the anatomy carries the same measurements. A verified component reproduced the original in every check; a flagged one is shipped with the reason it did not; one marked not verifiable could not be compared with the original, which says nothing about the recipe.



### Button, primary

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-primary`: the component root, a `<a>` (`.c-button-primary`), 10-character label

**Recipe**

```html
<div class="c-button-primary-scope">
  <a class="c-button-primary" href="#">lorem ipsu</a>
</div>
```

```css
.c-button-primary-scope {
  background-color: #000000;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-primary {
  display: inline-block;
  border-spacing: 0px;
  min-width: 26px;
  padding: 11px 21px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 20.0002px;
  letter-spacing: -0.374px;
  text-decoration-line: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-primary:hover {
  background-color: #0076DF;
}

.c-button-primary:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-primary-hover`): background-color #0076DF
- focus: outline 2px solid #0071E3, outline-offset 3px

### Button, secondary

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-secondary`: the component root, a `<a>` (`.c-button-secondary`), 3-character label

**Recipe**

```html
<div class="c-button-secondary-scope">
  <a class="c-button-secondary" href="#">lor</a>
</div>
```

```css
.c-button-secondary-scope {
  background-color: #000000;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-secondary {
  display: inline-block;
  border-spacing: 0px;
  min-width: 26px;
  padding: 11px 21px;
  color: #2997FF;
  border: 1px solid #2997FF;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 20.0002px;
  letter-spacing: -0.374px;
  text-decoration-line: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-secondary:hover {
  background-color: #0076DF;
  color: #FFFFFF;
  border: 1px solid transparent;
}

.c-button-secondary:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-secondary-hover`): background-color #0076DF, color #FFFFFF, border 1px solid transparent
- focus: outline 2px solid #0071E3, outline-offset 3px

### Button, secondary (2)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-secondary-2`: the component root, a `<a>` (`.c-button-secondary-2`), 3-character label

**Recipe**

```html
<div class="c-button-secondary-2-scope">
  <a class="c-button-secondary-2" href="#">lor</a>
</div>
```

```css
.c-button-secondary-2-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-secondary-2 {
  display: inline-block;
  border-spacing: 0px;
  min-width: 28px;
  padding: 8px 15px;
  color: #0066CC;
  border: 1px solid #0066CC;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
  letter-spacing: -0.224px;
  text-decoration-line: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-secondary-2:hover {
  background-color: #0076DF;
  color: #FFFFFF;
  border: 1px solid transparent;
}

.c-button-secondary-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-secondary-2-hover`): background-color #0076DF, color #FFFFFF, border 1px solid transparent
- focus: outline 2px solid #0071E3, outline-offset 3px

### Button, ghost

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-ghost`: the component root, a `<a>` (`.c-button-ghost`), 12-character label

**Recipe**

```html
<div class="c-button-ghost-scope">
  <a class="c-button-ghost" href="#">lorem ipsum</a>
</div>
```

```css
.c-button-ghost-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-ghost {
  display: inline-block;
  border-spacing: 0px;
  min-width: 26px;
  padding: 11px 21px;
  color: #0066CC;
  border: 1px solid #0066CC;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 20.0002px;
  letter-spacing: -0.374px;
  text-decoration-line: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-ghost:hover {
  background-color: #0076DF;
  color: #FFFFFF;
  border: 1px solid transparent;
}

.c-button-ghost:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-ghost-hover`): background-color #0076DF, color #FFFFFF, border 1px solid transparent
- focus: outline 2px solid #0071E3, outline-offset 3px

### Input

**Verification**: flagged, the render matched 89% of the original pixels, below the 97% required on focus after 2 correction attempts.

**Anatomy**

- `input`: the component root, a `<div>` (`.c-input`)
- `input-group`: inner group (`.c-input__group`)
- `input-group-2`: inner group (`.c-input__group-2`)
- `input-label`: label text, 11 characters (`.c-input__label`)
- `input-group-3`: inner block (`.c-input__group-3`)

**Recipe**

```html
<div class="c-input-scope">
  <div class="c-input">
    <span class="c-input__group">
      <span class="c-input__group-2"></span>
      <span class="c-input__label">lorem ipsum</span>
    </span>
    <div class="c-input__group-3"></div>
  </div>
</div>
```

```css
.c-input-scope {
  background-color: #161617;
  color: #FFFFFFEB;
  font-family: "SF Pro Text", "Myriad Set Pro", system-ui, -apple-system, system-ui, "Segoe UI", "SF Pro Icons", "Apple Legacy Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-input {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 42px;
  position: relative;
  z-index: 2;
  background-color: #161617;
  color: #FFFFFFEB;
  border: 3px solid #FFFFFF14;
  border-radius: 11px;
  cursor: default;
  font-family: "SF Pro Text", "Myriad Set Pro", system-ui, -apple-system, system-ui, "Segoe UI", "SF Pro Icons", "Apple Legacy Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 41px;
  list-style-type: none;
  padding-right: 14px;
  padding-left: 14px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), cubic-bezier(0.4, 0, 0.6, 1);
  transition-property: background-color, border-color;
}

.c-input::after {
  content: "";
  display: block;
  width: 15px;
  height: 34px;
  position: absolute;
  top: 3px;
  right: 13px;
  bottom: -1px;
  left: 314.828px;
  z-index: 1;
  color: #FFFFFFCC;
  font-family: "SF Pro Icons", "Apple Legacy Icons";
  font-size: 21px;
  font-weight: 300;
  line-height: 30px;
}

.c-input__group {
  display: inline;
}

.c-input__group-2 {
  display: block;
  position: absolute;
  font-size: 24px;
  font-weight: 300;
  line-height: 36px;
}

.c-input__group-2::after {
  content: "";
  display: inline-block;
  width: 17px;
  height: 24px;
  position: relative;
  top: -3px;
  right: 2px;
  bottom: 3px;
  left: -2px;
  z-index: 1;
  font-family: "SF Pro Icons", "Apple Legacy Icons";
  line-height: 24px;
}

.c-input__label {
  display: inline-block;
  width: calc(100% - 48px);
  overflow-x: hidden;
  overflow-y: hidden;
  line-height: 36px;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 29px;
}

.c-input__group-3 {
  display: block;
}

.c-input__group-3::after {
  content: "";
  display: block;
  width: 343px;
  height: 36px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF29;
  border-radius: 8px;
}

.c-input:focus {
  outline: 2px solid #0071E3;
  outline-offset: 0px;
}
```

**States**

- focus: outline 2px solid #0071E3, outline-offset 0px

### Card

**Verification**: flagged, the `card-media` y did not reproduce the measured 57px after 2 correction attempts.

**Anatomy**

- Group: 6 instances in a 2-column grid, 12px gap; the recipe carries the values they all share
- `card`: the component root, a `<div>` (`.c-card`)
- `card-link`: link (`.c-card__link`)
- `card-group`: inner flex column (`.c-card__group`)
- `card-group-2`: inner block (`.c-card__group-2`)
- `card-title`: heading, 0 characters (`.c-card__title`)
- `card-media`: image placeholder, 277x49px (`.c-card__media`)
- `card-text`: label text, 19 characters (`.c-card__text`)
- `card-body`: label text, 27 characters (`.c-card__body`)
- `card-group-3`: inner grid (`.c-card__group-3`)
- `card-cta`: link, 10-character label (`.c-card__cta`)
- `card-cta-2`: link, 3-character label (`.c-card__cta-2`)
- `card-group-4`: inner block (`.c-card__group-4`)
- `card-media-2`: image placeholder, 702x580px (`.c-card__media-2`)

**Recipe**

```html
<div class="c-card-scope">
  <div class="c-card">
    <a class="c-card__link" href="#"></a>
    <div class="c-card__group">
      <div class="c-card__group-2">
        <h3 class="c-card__title">
          <span class="c-card__media" aria-hidden="true"></span>
          <span class="c-card__text">lorem ipsum dolor s</span>
        </h3>
        <p class="c-card__body">lorem ipsum dolor sit amet</p>
      </div>
      <div class="c-card__group-3">
        <a class="c-card__cta" href="#">lorem ipsu</a>
        <a class="c-card__cta-2" href="#">lor</a>
      </div>
    </div>
    <div class="c-card__group-4">
      <span class="c-card__media-2" aria-hidden="true"></span>
    </div>
  </div>
</div>
```

```css
.c-card-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card {
  display: inline-flex;
  justify-content: center;
  border-spacing: 0px;
  box-sizing: border-box;
  min-height: 580px;
  position: relative;
  overflow-x: clip;
  overflow-y: clip;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  text-align: center;
  padding-top: 53px;
  padding-bottom: 60px;
}

.c-card__link {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  cursor: pointer;
  text-decoration-line: none;
}

.c-card__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.c-card__group-2 {
  display: block;
  position: relative;
  z-index: 2;
}

.c-card__title {
  display: block;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 44px;
  margin-right: auto;
  margin-left: auto;
}

.c-card__media {
  display: inline-block;
  flex-shrink: 0;
  width: 277px;
  height: 49px;
  background-color: currentcolor;
}

.c-card__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-card__body {
  display: block;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 21px;
  letter-spacing: 0.231px;
  margin-right: auto;
  margin-bottom: 0px;
  margin-left: auto;
}

.c-card__group-3 {
  display: grid;
  justify-content: center;
  column-gap: 14px;
  margin-top: 12px;
}

.c-card__cta {
  display: block;
  min-width: 28px;
  padding: 8px 15px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-size: 14px;
  line-height: 18.0008px;
  letter-spacing: -0.224px;
  text-decoration-line: none;
  white-space: nowrap;
}

.c-card__cta-2 {
  display: block;
  min-width: 28px;
  padding: 8px 15px;
  border-width: 1px;
  border-style: solid;
  border-radius: 980px;
  cursor: pointer;
  font-size: 14px;
  line-height: 18.0008px;
  letter-spacing: -0.224px;
  text-decoration-line: none;
  white-space: nowrap;
}

.c-card__group-4 {
  display: block;
  width: 100%;
  height: 580px;
  position: absolute;
}

.c-card__media-2 {
  display: block;
  flex-shrink: 0;
  width: 702px;
  height: 580px;
  background-color: currentcolor;
}

.c-card:hover {
  background-color: #000000;
}

.c-card:focus {
  background-color: #000000;
}
```

**States**

- hover (`card-hover`): background-color #000000
- focus (`card-focus`): background-color #000000

### Promo banner

**Verification**: flagged, the render matched 50% of the original pixels, below the 96% required (instance 1) after 2 correction attempts.

**Anatomy**

- Group: 3 instances in a 1-column grid, 12px gap; the recipe carries the values they all share
- `promo-banner`: the component root, a `<div>` (`.c-promo-banner`)
- `promo-banner-link`: link (`.c-promo-banner__link`)
- `promo-banner-group`: inner flex column (`.c-promo-banner__group`)
- `promo-banner-group-2`: inner block (`.c-promo-banner__group-2`, 2 instances)
- `promo-banner-title`: heading, 13 characters (`.c-promo-banner__title`)
- `promo-banner-body`: label text, 12 characters (`.c-promo-banner__body`)
- `promo-banner-cta`: link, 10-character label (`.c-promo-banner__cta`)
- `promo-banner-cta-2`: link, 3-character label (`.c-promo-banner__cta-2`)
- `promo-banner-group-3`: inner block (`.c-promo-banner__group-3`)
- `promo-banner-media`: image placeholder, 1440x692px (`.c-promo-banner__media`)

**Recipe**

```html
<div class="c-promo-banner-scope">
  <div class="c-promo-banner">
    <a class="c-promo-banner__link" href="#"></a>
    <div class="c-promo-banner__group">
      <div class="c-promo-banner__group-2">
        <h2 class="c-promo-banner__title">lorem ipsum d</h2>
        <p class="c-promo-banner__body">lorem ipsum</p>
      </div>
      <div class="c-promo-banner__group-2">
        <a class="c-promo-banner__cta" href="#">lorem ipsu</a>
        <a class="c-promo-banner__cta-2" href="#">lor</a>
      </div>
    </div>
    <div class="c-promo-banner__group-3">
      <span class="c-promo-banner__media" aria-hidden="true"></span>
    </div>
  </div>
</div>
```

```css
.c-promo-banner-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-promo-banner {
  display: inline-flex;
  justify-content: center;
  border-spacing: 0px;
  box-sizing: border-box;
  min-height: 692px;
  position: relative;
  overflow-x: clip;
  overflow-y: clip;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  text-align: center;
  padding-top: 56px;
  padding-bottom: 63px;
}

.c-promo-banner__link {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  cursor: pointer;
  text-decoration-line: none;
}

.c-promo-banner__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.c-promo-banner__title {
  display: block;
  margin: 0px auto;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -0.28px;
}

.c-promo-banner__body {
  display: block;
  margin: 6px auto 0px;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  line-height: 32px;
  letter-spacing: 0.196px;
}

.c-promo-banner__cta {
  display: block;
  min-width: 26px;
  padding: 11px 21px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  line-height: 20.0002px;
  text-decoration-line: none;
  white-space: nowrap;
}

.c-promo-banner__cta-2 {
  display: block;
  min-width: 26px;
  padding: 11px 21px;
  border-width: 1px;
  border-style: solid;
  border-radius: 980px;
  cursor: pointer;
  line-height: 20.0002px;
  text-decoration-line: none;
  white-space: nowrap;
}

.c-promo-banner__group-3 {
  display: block;
  width: 100%;
  height: 692px;
  position: absolute;
  bottom: 0px;
}

.c-promo-banner__media {
  display: block;
  flex-shrink: 0;
  width: 1440px;
  height: 692px;
  background-color: currentcolor;
}

.c-promo-banner:hover {
  background-color: #000000;
}

.c-promo-banner:focus {
  background-color: #000000;
}
```

**States**

- hover (`promo-banner-hover`): background-color #000000
- focus (`promo-banner-focus`): background-color #000000

### Nav links

**Verification**: flagged, the `nav-link-list` width did not reproduce the measured 176px after 2 correction attempts.

**Anatomy**

- `nav-link`: the component root, a `<nav>` (`.c-nav-link`), content not captured
- `nav-link-group`: inner block (`.c-nav-link__group`, 2 instances)
- `nav-link-group-2`: inner block (`.c-nav-link__group-2`, 2 instances)
- `nav-link-title`: heading, 0 characters (`.c-nav-link__title`, 4 instances)
- `nav-link-text`: label text, 14 characters (`.c-nav-link__text`, 4 instances)
- `nav-link-list`: inner group (`.c-nav-link__list`, 4 instances), content not captured
- `nav-link-item`: inner group (`.c-nav-link__item`, 18 instances), content not captured
- `nav-link-item-2`: inner group (`.c-nav-link__item-2`, 3 instances), content not captured
- `nav-link-group-3`: inner block (`.c-nav-link__group-3`, 2 instances)

**Recipe**

```html
<div class="c-nav-link-scope">
  <nav class="c-nav-link">
    <div class="c-nav-link__group">
      <div class="c-nav-link__group-2">
        <h3 class="c-nav-link__title">
          <span class="c-nav-link__text">lorem ipsum do</span>
        </h3>
        <ul class="c-nav-link__list">
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item-2"></li>
        </ul>
      </div>
      <div class="c-nav-link__group-3">
        <h3 class="c-nav-link__title">
          <span class="c-nav-link__text">lorem ipsum</span>
        </h3>
        <ul class="c-nav-link__list">
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item-2"></li>
        </ul>
      </div>
    </div>
    <div class="c-nav-link__group">
      <div class="c-nav-link__group-2">
        <h3 class="c-nav-link__title">
          <span class="c-nav-link__text">lorem i</span>
        </h3>
        <ul class="c-nav-link__list">
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item-2"></li>
        </ul>
      </div>
      <div class="c-nav-link__group-3">
        <h3 class="c-nav-link__title">
          <span class="c-nav-link__text">lorem ipsum d</span>
        </h3>
        <ul class="c-nav-link__list">
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
          <li class="c-nav-link__item"></li>
        </ul>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-nav-link-scope {
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Apple Legacy Chevron", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
}

.c-nav-link {
  display: flex;
  border-spacing: 0px;
  color: #0000008F;
  font-family: "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Apple Legacy Chevron", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  padding-top: 20px;
}

.c-nav-link__group {
  display: block;
  flex-basis: 25%;
}

.c-nav-link__group-2 {
  display: block;
}

.c-nav-link__title {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 12px;
  font-weight: 400;
}

.c-nav-link__text {
  display: block;
  font-weight: 600;
  margin-right: 20px;
  margin-bottom: 9.6px;
}

.c-nav-link__list {
  display: block;
  padding: 0px;
  margin: 0px 20px 0px 0px;
  list-style-type: none;
}

.c-nav-link__item {
  display: block;
  margin-bottom: 9.6px;
}

.c-nav-link__item-2 {
  display: block;
}

.c-nav-link__group-3 {
  display: block;
  padding-top: 24px;
}
```

**States**

- No hover or focus change was observed.

### Nav menu item

**Verification**: verified against the live page at desktop.

**Anatomy**

- `nav-menu-item`: the component root, a `<button>` (`.c-nav-menu-item`)

**Recipe**

```html
<div class="c-nav-menu-item-scope">
  <button class="c-nav-menu-item" type="button"></button>
</div>
```

```css
.c-nav-menu-item-scope {
  background-color: #1D1D1FCC;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-nav-menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  width: 22px;
  padding: 0px;
  position: absolute;
  top: 0px;
  right: -7px;
  background-color: transparent;
  color: #FFFFFFCC;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  list-style-type: none;
}

.c-nav-menu-item:focus {
  z-index: 1;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- focus: z-index 1, outline 2px solid #0071E3, outline-offset -7px

### Header (landing)

**Verification**: desktop flagged, the `header-landing-group` x did not reproduce the measured 1146px after 2 correction attempts; mobile flagged, the `header-landing-mobile-nav-link-2` x did not reproduce the measured 246px after 2 correction attempts.

Variant observed on https://www.apple.com/.

**Anatomy**

- `header-landing`: the component root, a `<nav>` (`.c-header-landing`)
- `header-landing-inner`: inner block (`.c-header-landing__inner`)
- `header-landing-nav`: inner flex row (`.c-header-landing__nav`)
- `header-landing-nav-item`: inner group (`.c-header-landing__nav-item`)
- `header-landing-nav-link`: link (`.c-header-landing__nav-link`)
- `header-landing-group`: inner flex row (`.c-header-landing__group`, 3 instances)
- `header-landing-icon`: icon placeholder, 14x44px (`.c-header-landing__icon`, 2 instances)
- `header-landing-text`: label text, 5 characters (`.c-header-landing__text`)
- `header-landing-nav-link-2`: link (`.c-header-landing__nav-link-2`)
- `header-landing-icon-2`: icon placeholder, 15x44px (`.c-header-landing__icon-2`)
- `header-landing-group-2`: inner block (`.c-header-landing__group-2`)
- `header-landing-nav-link-3`: link (`.c-header-landing__nav-link-3`)
- `header-landing-group-3`: inner group (`.c-header-landing__group-3`)
- `header-landing-group-4`: inner group (`.c-header-landing__group-4`)
- `header-landing-text-2`: label text, 1 characters (`.c-header-landing__text-2`)

**Desktop recipe**

```html
<div class="c-header-landing-scope">
  <nav class="c-header-landing">
    <div class="c-header-landing__inner">
      <ul class="c-header-landing__nav">
        <li class="c-header-landing__nav-item">
          <a class="c-header-landing__nav-link" href="#">
            <span class="c-header-landing__group">
              <span class="c-header-landing__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-landing__text">lorem</span>
          </a>
        </li>
        <a class="c-header-landing__nav-link-2" href="#">
          <span class="c-header-landing__group">
            <span class="c-header-landing__icon-2" aria-hidden="true"></span>
          </span>
        </a>
        <div class="c-header-landing__group-2">
          <a class="c-header-landing__nav-link-3" href="#">
            <span class="c-header-landing__group">
              <span class="c-header-landing__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-landing__group-3">
              <span class="c-header-landing__group-4"></span>
              <span class="c-header-landing__text-2">l</span>
            </span>
          </a>
        </div>
      </ul>
    </div>
  </nav>
</div>
```

```css
.c-header-landing-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-landing {
  display: block;
  border-spacing: 0px;
  height: 48px;
  min-width: 320px;
  max-height: 44px;
  position: fixed;
  top: 70px;
  right: 0px;
  left: 0px;
  z-index: 9999;
  background-color: #1D1D1FCC;
  color: #1D1D1F;
  backdrop-filter: saturate(1.8) blur(20px);
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-landing__inner {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 1024px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-landing__nav {
  display: flex;
  justify-content: space-between;
  height: 44px;
  padding: 0px;
  margin: 0px -8px;
  cursor: default;
  list-style-type: none;
}

.c-header-landing__nav-item {
  display: block;
  box-sizing: border-box;
  height: 44px;
}

.c-header-landing__nav-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #FFFFFFCC;
  cursor: pointer;
  font-weight: 600;
  line-height: 21.0012px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-landing__group {
  display: flex;
}

.c-header-landing__icon {
  display: block;
  flex-shrink: 0;
  width: 14px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-landing__text {
  display: flex;
  align-items: center;
  width: 1px;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  margin-left: 4px;
}

.c-header-landing__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #FFFFFFCC;
  cursor: pointer;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-landing__icon-2 {
  display: block;
  flex-shrink: 0;
  width: 15px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-landing__group-2 {
  display: block;
  position: relative;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-landing__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  color: #FFFFFFCC;
  cursor: pointer;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-landing__group-3 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 11px;
  left: 15px;
  z-index: 1;
  color: #000000;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-header-landing__group-3::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-landing__group-3::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF;
  border-radius: 13px;
}

.c-header-landing__group-4 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #FFFFFF;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-landing__text-2 {
  display: block;
  position: relative;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-landing__nav-link:hover {
  color: #FFFFFF;
}

.c-header-landing__nav-link:focus {
  color: #FFFFFF;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-landing__nav-link-2:hover {
  color: #FFFFFF;
}

.c-header-landing__nav-link-2:focus {
  color: #FFFFFF;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-landing__nav-link-3:hover {
  color: #FFFFFF;
}

.c-header-landing__nav-link-3:focus {
  color: #FFFFFF;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**Mobile anatomy**

- `header-landing-mobile`: the component root, a `<nav>` (`.c-header-landing-mobile`)
- `header-landing-mobile-inner`: inner flex row (`.c-header-landing-mobile__inner`)
- `header-landing-mobile-nav`: inner flex row (`.c-header-landing-mobile__nav`)
- `header-landing-mobile-nav-item`: inner group (`.c-header-landing-mobile__nav-item`)
- `header-landing-mobile-nav-link`: link (`.c-header-landing-mobile__nav-link`)
- `header-landing-mobile-group`: inner flex row (`.c-header-landing-mobile__group`, 3 instances)
- `header-landing-mobile-icon`: icon placeholder, 17x48px (`.c-header-landing-mobile__icon`, 3 instances)
- `header-landing-mobile-text`: label text, 5 characters (`.c-header-landing-mobile__text`)
- `header-landing-mobile-nav-item-2`: inner group (`.c-header-landing-mobile__nav-item-2`)
- `header-landing-mobile-nav-link-2`: link (`.c-header-landing-mobile__nav-link-2`)
- `header-landing-mobile-group-2`: inner block (`.c-header-landing-mobile__group-2`)
- `header-landing-mobile-nav-link-3`: link (`.c-header-landing-mobile__nav-link-3`)
- `header-landing-mobile-group-3`: inner group (`.c-header-landing-mobile__group-3`)
- `header-landing-mobile-group-4`: inner group (`.c-header-landing-mobile__group-4`)
- `header-landing-mobile-text-2`: label text, 1 characters (`.c-header-landing-mobile__text-2`)
- `header-landing-mobile-group-5`: inner block (`.c-header-landing-mobile__group-5`)
- `header-landing-mobile-menu-toggle`: button (`.c-header-landing-mobile__menu-toggle`)
- `header-landing-mobile-menu-toggle-icon`: icon placeholder, 18px (`.c-header-landing-mobile__menu-toggle-icon`)

**Mobile recipe**

```html
<div class="c-header-landing-mobile-scope">
  <nav class="c-header-landing-mobile">
    <div class="c-header-landing-mobile__inner">
      <ul class="c-header-landing-mobile__nav">
        <li class="c-header-landing-mobile__nav-item">
          <a class="c-header-landing-mobile__nav-link" href="#">
            <span class="c-header-landing-mobile__group">
              <span class="c-header-landing-mobile__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-landing-mobile__text">lorem</span>
          </a>
        </li>
        <li class="c-header-landing-mobile__nav-item-2">
          <a class="c-header-landing-mobile__nav-link-2" href="#">
            <span class="c-header-landing-mobile__group">
              <span class="c-header-landing-mobile__icon" aria-hidden="true"></span>
            </span>
          </a>
        </li>
        <div class="c-header-landing-mobile__group-2">
          <a class="c-header-landing-mobile__nav-link-3" href="#">
            <span class="c-header-landing-mobile__group">
              <span class="c-header-landing-mobile__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-landing-mobile__group-3">
              <span class="c-header-landing-mobile__group-4"></span>
              <span class="c-header-landing-mobile__text-2">l</span>
            </span>
          </a>
        </div>
      </ul>
      <div class="c-header-landing-mobile__group-5">
        <button class="c-header-landing-mobile__menu-toggle" type="button">
          <span class="c-header-landing-mobile__menu-toggle-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-header-landing-mobile-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-landing-mobile {
  display: block;
  border-spacing: 0px;
  height: 48px;
  min-width: 320px;
  position: fixed;
  top: 135px;
  right: 0px;
  left: 0px;
  z-index: 9999;
  color: #1D1D1F;
  backdrop-filter: saturate(1.8) blur(20px);
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-landing-mobile__inner {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: 1024px;
  position: absolute;
  top: 0px;
  z-index: 2;
  background-color: #1D1D1FCC;
  transition: background 0.422s cubic-bezier(0.4, 0, 0.6, 1);
  margin-right: auto;
  margin-left: auto;
}

.c-header-landing-mobile__nav {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  padding: 0px 48px 0px 0px;
  margin: 0px;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  cursor: default;
  list-style-type: none;
}

.c-header-landing-mobile__nav-item {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  width: 48px;
  height: 100%;
  text-align: left;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
}

.c-header-landing-mobile__nav-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 48px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #FFFFFFCC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 23px;
  letter-spacing: 0.228px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 16px;
  padding-left: 16px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-landing-mobile__group {
  display: flex;
}

.c-header-landing-mobile__icon {
  display: block;
  flex-shrink: 0;
  width: 17px;
  height: 48px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-landing-mobile__text {
  display: flex;
  align-items: center;
  width: 1px;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  margin-left: 4px;
}

.c-header-landing-mobile__nav-item-2 {
  display: list-item;
  box-sizing: border-box;
  width: 48px;
  height: 100%;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
}

.c-header-landing-mobile__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #FFFFFFCC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 8px;
  padding-left: 8px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-landing-mobile__group-2 {
  display: block;
  position: relative;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-landing-mobile__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  position: relative;
  z-index: 1;
  color: #FFFFFFCC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 8px;
  padding-left: 8px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-landing-mobile__group-3 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 13px;
  left: 22px;
  z-index: 1;
  color: #000000;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-header-landing-mobile__group-3::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-landing-mobile__group-3::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF;
  border-radius: 13px;
}

.c-header-landing-mobile__group-4 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #FFFFFF;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-landing-mobile__text-2 {
  display: block;
  position: relative;
  z-index: 2;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-landing-mobile__group-5 {
  display: block;
  width: 48px;
  position: absolute;
  right: 0px;
  z-index: 3;
}

.c-header-landing-mobile__menu-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  padding: 0px;
  position: relative;
  background-color: transparent;
  color: #FFFFFF;
  border: 0;
  opacity: 0.8;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.32s, 0.32s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), cubic-bezier(0.4, 0, 0.6, 1);
  transition-property: opacity, color;
}

.c-header-landing-mobile__menu-toggle-icon {
  display: block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-landing-mobile__nav-link:hover {
  color: #FFFFFF;
}

.c-header-landing-mobile__nav-link:focus {
  color: #FFFFFF;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-landing-mobile__nav-link-2:hover {
  color: #FFFFFF;
}

.c-header-landing-mobile__nav-link-2:focus {
  color: #FFFFFF;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-landing-mobile__nav-link-3:hover {
  color: #FFFFFF;
}

.c-header-landing-mobile__nav-link-3:focus {
  color: #FFFFFF;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-landing-mobile__menu-toggle:hover {
  opacity: 1;
}

.c-header-landing-mobile__menu-toggle:focus {
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- `header-landing-nav-link` hover (`header-landing-nav-link-hover`): color #FFFFFF
- `header-landing-nav-link` focus (`header-landing-nav-link-focus`): color #FFFFFF, outline 2px solid #0071E3, outline-offset -7px
- `header-landing-nav-link-2` hover (`header-landing-nav-link-2-hover`): color #FFFFFF
- `header-landing-nav-link-2` focus (`header-landing-nav-link-2-focus`): color #FFFFFF, outline 2px solid #0071E3, outline-offset -7px
- `header-landing-nav-link-3` hover (`header-landing-nav-link-3-hover`): color #FFFFFF
- `header-landing-nav-link-3` focus (`header-landing-nav-link-3-focus`): color #FFFFFF, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-landing-mobile-nav-link` hover (`header-landing-mobile-nav-link-hover`): color #FFFFFF
- mobile, `header-landing-mobile-nav-link` focus (`header-landing-mobile-nav-link-focus`): color #FFFFFF, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-landing-mobile-nav-link-2` hover (`header-landing-mobile-nav-link-2-hover`): color #FFFFFF
- mobile, `header-landing-mobile-nav-link-2` focus (`header-landing-mobile-nav-link-2-focus`): color #FFFFFF, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-landing-mobile-nav-link-3` hover (`header-landing-mobile-nav-link-3-hover`): color #FFFFFF
- mobile, `header-landing-mobile-nav-link-3` focus (`header-landing-mobile-nav-link-3-focus`): color #FFFFFF, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-landing-mobile-menu-toggle` hover: opacity 1
- mobile, `header-landing-mobile-menu-toggle` focus: outline 2px solid #0071E3, outline-offset -7px

### Footer (landing)

**Verification**: desktop flagged, the `footer-landing-inner` height did not reproduce the measured 996px after 2 correction attempts; mobile flagged, the `footer-landing-mobile` height did not reproduce the measured 1433px after 2 correction attempts.

Variant observed on https://www.apple.com/.

**Anatomy**

- `footer-landing`: the component root, a `<footer>` (`.c-footer-landing`)
- `footer-landing-inner`: inner block (`.c-footer-landing__inner`), content not captured
- `footer-landing-heading`: heading, 12 characters (`.c-footer-landing__heading`)
- `footer-landing-group`: inner group (`.c-footer-landing__group`)
- `footer-landing-list`: inner group (`.c-footer-landing__list`)
- `footer-landing-item`: inner group (`.c-footer-landing__item`, 6 instances)
- `footer-landing-text`: label text, 207 characters (`.c-footer-landing__text`, 4 instances)
- `footer-landing-link`: link, 20-character label (`.c-footer-landing__link`, 2 instances)
- `footer-landing-list-2`: inner group (`.c-footer-landing__list-2`)
- `footer-landing-group-2`: inner group (`.c-footer-landing__group-2`, 2 instances)
- `footer-landing-text-2`: label text, 370 characters (`.c-footer-landing__text-2`)
- `footer-landing-text-3`: label text, 203 characters (`.c-footer-landing__text-3`, 2 instances)
- `footer-landing-nav`: inner flex row (`.c-footer-landing__nav`), content not captured
- `footer-landing-group-3`: inner block (`.c-footer-landing__group-3`, 3 instances)
- `footer-landing-group-4`: inner block (`.c-footer-landing__group-4`, 3 instances)
- `footer-landing-heading-2`: heading, 0 characters (`.c-footer-landing__heading-2`, 5 instances)
- `footer-landing-text-4`: label text, 14 characters (`.c-footer-landing__text-4`, 5 instances)
- `footer-landing-list-3`: inner group (`.c-footer-landing__list-3`, 5 instances), content not captured
- `footer-landing-nav-item`: inner group (`.c-footer-landing__nav-item`, 35 instances), content not captured
- `footer-landing-nav-link`: link, 5-character label (`.c-footer-landing__nav-link`, 38 instances)
- `footer-landing-nav-item-2`: inner group (`.c-footer-landing__nav-item-2`, 4 instances)
- `footer-landing-group-5`: inner block (`.c-footer-landing__group-5`, 2 instances)

**Desktop recipe**

```html
<div class="c-footer-landing-scope">
  <footer class="c-footer-landing">
    <div class="c-footer-landing__inner">
      <h2 class="c-footer-landing__heading">lorem ipsum</h2>
      <section class="c-footer-landing__group">
        <ol class="c-footer-landing__list">
          <li class="c-footer-landing__item">
            <span class="c-footer-landing__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
            <a class="c-footer-landing__link" href="#">lorem ipsum dolor si</a>
            <span class="c-footer-landing__text">l</span>
          </li>
          <li class="c-footer-landing__item">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor</li>
        </ol>
        <ul class="c-footer-landing__list-2">
          <li class="c-footer-landing__item">
            <span class="c-footer-landing__group-2">
              <p class="c-footer-landing__text-2">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do</p>
              <p class="c-footer-landing__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing</p>
              <p class="c-footer-landing__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectet</p>
            </span>
          </li>
          <li class="c-footer-landing__item">
            <span class="c-footer-landing__group-2">
              <span class="c-footer-landing__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do</span>
              <a class="c-footer-landing__link" href="#">lorem ipsum dolor sit amet co</a>
              <span class="c-footer-landing__text">l</span>
            </span>
          </li>
          <li class="c-footer-landing__item">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsu</li>
          <li class="c-footer-landing__item">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing</li>
        </ul>
      </section>
      <nav class="c-footer-landing__nav">
        <div class="c-footer-landing__group-3">
          <div class="c-footer-landing__group-4">
            <h3 class="c-footer-landing__heading-2">
              <span class="c-footer-landing__text-4">lorem ipsum do</span>
            </h3>
            <ul class="c-footer-landing__list-3">
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lor</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lore</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem i</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ips</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-landing__nav-item-2">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-landing__group-5">
            <h3 class="c-footer-landing__heading-2">
              <span class="c-footer-landing__text-4">lorem ipsum</span>
            </h3>
            <ul class="c-footer-landing__list-3">
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ips</a>
              </li>
              <li class="c-footer-landing__nav-item-2">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-footer-landing__group-3">
          <div class="c-footer-landing__group-4">
            <h3 class="c-footer-landing__heading-2">
              <span class="c-footer-landing__text-4">lorem i</span>
            </h3>
            <ul class="c-footer-landing__list-3">
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum dolor sit ame</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum dolor s</a>
              </li>
              <li class="c-footer-landing__nav-item-2">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-landing__group-5">
            <h3 class="c-footer-landing__heading-2">
              <span class="c-footer-landing__text-4">lorem ipsum d</span>
            </h3>
            <ul class="c-footer-landing__list-3">
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ips</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ip</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-landing__nav-item-2">
                <a class="c-footer-landing__nav-link" href="#">lorem ips</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-footer-landing__group-3">
          <div class="c-footer-landing__group-4">
            <h3 class="c-footer-landing__heading-2">
              <span class="c-footer-landing__text-4">lorem ipsum</span>
            </h3>
            <ul class="c-footer-landing__list-3">
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum dolor</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum dol</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum dolor sit</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum d</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ips</a>
              </li>
              <li class="c-footer-landing__nav-item">
                <a class="c-footer-landing__nav-link" href="#">lorem ipsum dolor sit</a>
              </li>
              <li class="c-footer-landing__nav-item"></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </footer>
</div>
```

```css
.c-footer-landing-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-landing {
  display: block;
  border-spacing: 0px;
  min-width: 1024px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Apple Legacy Chevron", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-landing__inner {
  display: block;
  max-width: 980px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-landing__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 12px;
  font-weight: 400;
}

.c-footer-landing__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-landing__list {
  display: block;
  padding: 0px 17px;
  margin: 0px;
  list-style-type: decimal;
}

.c-footer-landing__item {
  display: list-item;
  padding-bottom: 9.6px;
}

.c-footer-landing__link {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000B8;
}

.c-footer-landing__list-2 {
  display: block;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-landing__group-2 {
  display: inline;
}

.c-footer-landing__text-2 {
  display: block;
  margin: 0px;
}

.c-footer-landing__text-3 {
  display: block;
  margin: 0px;
  padding-top: 9.6px;
}

.c-footer-landing__nav {
  display: flex;
  padding-top: 20px;
}

.c-footer-landing__group-3 {
  display: block;
  flex-basis: 25%;
}

.c-footer-landing__group-4 {
  display: block;
}

.c-footer-landing__heading-2 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 12px;
  font-weight: 400;
}

.c-footer-landing__text-4 {
  display: block;
  font-weight: 600;
  margin-right: 20px;
  margin-bottom: 9.6px;
}

.c-footer-landing__list-3 {
  display: block;
  padding: 0px;
  margin: 0px 20px 0px 0px;
  list-style-type: none;
}

.c-footer-landing__nav-item {
  display: block;
  margin-bottom: 9.6px;
}

.c-footer-landing__nav-link {
  display: inline-block;
  position: relative;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
  padding-top: 4px;
  padding-right: 20px;
  padding-bottom: 4px;
  margin-top: -4px;
  margin-right: -20px;
  margin-bottom: -4px;
}

.c-footer-landing__nav-item-2 {
  display: block;
}

.c-footer-landing__group-5 {
  display: block;
  padding-top: 24px;
}

.c-footer-landing__link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-landing__nav-link:hover {
  text-decoration-line: underline;
}

.c-footer-landing__nav-link:focus {
  outline: none;
}

.c-footer-landing__nav-link:focus::before {
  content: "";
  display: block;
  width: 28px;
  height: 16px;
  position: absolute;
  top: 4px;
  right: 20px;
  bottom: 4px;
  left: 0px;
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**Mobile anatomy**

- `footer-landing-mobile`: the component root, a `<footer>` (`.c-footer-landing-mobile`)
- `footer-landing-mobile-inner`: inner block (`.c-footer-landing-mobile__inner`)
- `footer-landing-mobile-heading`: heading, 12 characters (`.c-footer-landing-mobile__heading`)
- `footer-landing-mobile-group`: inner group (`.c-footer-landing-mobile__group`)
- `footer-landing-mobile-list`: inner group (`.c-footer-landing-mobile__list`)
- `footer-landing-mobile-item`: inner group (`.c-footer-landing-mobile__item`, 6 instances)
- `footer-landing-mobile-text`: label text, 207 characters (`.c-footer-landing-mobile__text`, 20 instances)
- `footer-landing-mobile-link`: link, 20-character label (`.c-footer-landing-mobile__link`, 2 instances)
- `footer-landing-mobile-list-2`: inner group (`.c-footer-landing-mobile__list-2`)
- `footer-landing-mobile-group-2`: inner group (`.c-footer-landing-mobile__group-2`, 2 instances)
- `footer-landing-mobile-text-2`: label text, 370 characters (`.c-footer-landing-mobile__text-2`)
- `footer-landing-mobile-text-3`: label text, 203 characters (`.c-footer-landing-mobile__text-3`, 2 instances)
- `footer-landing-mobile-nav`: inner flex column (`.c-footer-landing-mobile__nav`)
- `footer-landing-mobile-group-3`: inner block (`.c-footer-landing-mobile__group-3`, 5 instances)
- `footer-landing-mobile-group-4`: inner block (`.c-footer-landing-mobile__group-4`, 11 instances)
- `footer-landing-mobile-heading-2`: heading, 0 characters (`.c-footer-landing-mobile__heading-2`, 11 instances)
- `footer-landing-mobile-button`: button (`.c-footer-landing-mobile__button`, 11 instances)
- `footer-landing-mobile-group-5`: inner flex row (`.c-footer-landing-mobile__group-5`, 11 instances)
- `footer-landing-mobile-icon`: icon placeholder, 11x6px (`.c-footer-landing-mobile__icon`, 11 instances)
- `footer-landing-mobile-group-6`: inner group (`.c-footer-landing-mobile__group-6`)
- `footer-landing-mobile-group-7`: inner block (`.c-footer-landing-mobile__group-7`)
- `footer-landing-mobile-link-2`: link, 19-character label (`.c-footer-landing-mobile__link-2`, 3 instances)
- `footer-landing-mobile-group-8`: inner group (`.c-footer-landing-mobile__group-8`)
- `footer-landing-mobile-group-9`: inner block (`.c-footer-landing-mobile__group-9`)
- `footer-landing-mobile-group-10`: inner block (`.c-footer-landing-mobile__group-10`)
- `footer-landing-mobile-link-3`: link, 13-character label (`.c-footer-landing-mobile__link-3`)
- `footer-landing-mobile-group-11`: inner block (`.c-footer-landing-mobile__group-11`)
- `footer-landing-mobile-text-4`: label text, 48 characters (`.c-footer-landing-mobile__text-4`)
- `footer-landing-mobile-list-3`: inner group (`.c-footer-landing-mobile__list-3`)
- `footer-landing-mobile-item-2`: inner group (`.c-footer-landing-mobile__item-2`, 5 instances)
- `footer-landing-mobile-link-4`: link, 14-character label (`.c-footer-landing-mobile__link-4`, 5 instances)

**Mobile recipe**

```html
<div class="c-footer-landing-mobile-scope">
  <footer class="c-footer-landing-mobile">
    <div class="c-footer-landing-mobile__inner">
      <h2 class="c-footer-landing-mobile__heading">lorem ipsum</h2>
      <section class="c-footer-landing-mobile__group">
        <ol class="c-footer-landing-mobile__list">
          <li class="c-footer-landing-mobile__item">
            <span class="c-footer-landing-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
            <a class="c-footer-landing-mobile__link" href="#">lorem ipsum dolor si</a>
            <span class="c-footer-landing-mobile__text">l</span>
          </li>
          <li class="c-footer-landing-mobile__item">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor</li>
        </ol>
        <ul class="c-footer-landing-mobile__list-2">
          <li class="c-footer-landing-mobile__item">
            <span class="c-footer-landing-mobile__group-2">
              <p class="c-footer-landing-mobile__text-2">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do</p>
              <p class="c-footer-landing-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing</p>
              <p class="c-footer-landing-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectet</p>
            </span>
          </li>
          <li class="c-footer-landing-mobile__item">
            <span class="c-footer-landing-mobile__group-2">
              <span class="c-footer-landing-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do</span>
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsum dolor sit amet co</a>
              <span class="c-footer-landing-mobile__text">l</span>
            </span>
          </li>
          <li class="c-footer-landing-mobile__item">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsu</li>
          <li class="c-footer-landing-mobile__item">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing</li>
        </ul>
      </section>
      <nav class="c-footer-landing-mobile__nav">
        <div class="c-footer-landing-mobile__group-3">
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum do</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-landing-mobile__group-3">
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem i</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum d</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-landing-mobile__group-3">
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-landing-mobile__group-3">
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum d</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum do</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum do</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-landing-mobile__group-3">
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-landing-mobile__group-4">
            <h3 class="c-footer-landing-mobile__heading-2">
              <button class="c-footer-landing-mobile__button" type="button">
                <span class="c-footer-landing-mobile__text">lorem ipsum</span>
                <span class="c-footer-landing-mobile__group-5">
                  <span class="c-footer-landing-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
      </nav>
      <section class="c-footer-landing-mobile__group-6">
        <div class="c-footer-landing-mobile__group-7">
          <span class="c-footer-landing-mobile__text">lorem ipsum dolor</span>
          <a class="c-footer-landing-mobile__link-2" href="#">lorem ipsum dolor s</a>
          <span class="c-footer-landing-mobile__text">lo</span>
          <a class="c-footer-landing-mobile__link-2" href="#">lorem ipsum do</a>
          <span class="c-footer-landing-mobile__text">lorem ips</span>
          <span class="c-footer-landing-mobile__group-8">
            <span class="c-footer-landing-mobile__text">lorem i</span>
            <a class="c-footer-landing-mobile__link-2" href="#">lorem ipsum do</a>
            <span class="c-footer-landing-mobile__text">lorem ipsum dolor</span>
          </span>
        </div>
        <div class="c-footer-landing-mobile__group-9">
          <div class="c-footer-landing-mobile__group-10">
            <a class="c-footer-landing-mobile__link-3" href="#">lorem ipsum d</a>
          </div>
          <div class="c-footer-landing-mobile__group-11">
            <div class="c-footer-landing-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscin</div>
            <ul class="c-footer-landing-mobile__list-3">
              <li class="c-footer-landing-mobile__item-2">
                <a class="c-footer-landing-mobile__link-4" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-landing-mobile__item-2">
                <a class="c-footer-landing-mobile__link-4" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-landing-mobile__item-2">
                <a class="c-footer-landing-mobile__link-4" href="#">lorem ipsum dolor</a>
              </li>
              <li class="c-footer-landing-mobile__item-2">
                <a class="c-footer-landing-mobile__link-4" href="#">lorem</a>
              </li>
              <li class="c-footer-landing-mobile__item-2">
                <a class="c-footer-landing-mobile__link-4" href="#">lorem ip</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </footer>
</div>
```

```css
.c-footer-landing-mobile-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-landing-mobile {
  display: block;
  border-spacing: 0px;
  min-width: 320px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Apple Legacy Chevron", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-landing-mobile__inner {
  display: block;
  max-width: 980px;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-landing-mobile__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 12px;
  font-weight: 400;
}

.c-footer-landing-mobile__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-landing-mobile__list {
  display: block;
  padding: 0px 17px;
  margin: 0px;
  list-style-type: decimal;
}

.c-footer-landing-mobile__item {
  display: list-item;
  padding-bottom: 9.6px;
}

.c-footer-landing-mobile__link {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000B8;
}

.c-footer-landing-mobile__list-2 {
  display: block;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-landing-mobile__group-2 {
  display: inline;
}

.c-footer-landing-mobile__text-2 {
  display: block;
  margin: 0px;
}

.c-footer-landing-mobile__text-3 {
  display: block;
  margin: 0px;
  padding-top: 9.6px;
}

.c-footer-landing-mobile__nav {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.c-footer-landing-mobile__group-3 {
  display: block;
}

.c-footer-landing-mobile__group-4 {
  display: block;
  box-sizing: border-box;
  width: calc(100% + 8px);
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-right: 4px;
  padding-bottom: 1px;
  padding-left: 4px;
  margin-left: -4px;
}

.c-footer-landing-mobile__group-4::after {
  content: "";
  display: block;
  width: 358px;
  height: 1px;
  position: absolute;
  top: 36px;
  right: 4px;
  bottom: 0px;
  left: 4px;
  z-index: 3;
  background-color: #00000029;
}

.c-footer-landing-mobile__heading-2 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 12px;
  font-weight: 400;
}

.c-footer-landing-mobile__button {
  display: block;
  width: 100%;
  padding: 10px 0px;
  position: relative;
  z-index: 2;
  background-color: #F5F5F7;
  color: #000000E0;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Apple Legacy Chevron", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  text-transform: none;
  text-align: start;
}

.c-footer-landing-mobile__button::after {
  content: "";
  display: block;
  width: 366px;
  height: 36px;
  position: absolute;
  top: 0px;
  right: -4px;
  bottom: 0px;
  left: -4px;
}

.c-footer-landing-mobile__group-5 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 11px;
  font-size: 14px;
  line-height: 18.6672px;
  transition: transform 0.3s ease;
  margin-top: 5px;
}

.c-footer-landing-mobile__icon {
  display: block;
  flex-shrink: 0;
  width: 11px;
  height: 6px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-landing-mobile__group-6 {
  display: block;
  padding-top: 17px;
  padding-bottom: 9px;
}

.c-footer-landing-mobile__group-7 {
  display: block;
  max-height: 9999px;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.c-footer-landing-mobile__link-2 {
  display: inline;
  color: #0066CC;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #0066CC;
}

.c-footer-landing-mobile__group-8 {
  display: inline-block;
  white-space: nowrap;
}

.c-footer-landing-mobile__group-9 {
  display: block;
  justify-content: space-between;
}

.c-footer-landing-mobile__group-10 {
  display: block;
  position: relative;
  top: -3px;
  z-index: 2;
  white-space: nowrap;
  padding-top: 4px;
  margin-top: 5px;
}

.c-footer-landing-mobile__link-3 {
  display: inline-block;
  position: relative;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-top: -4px;
  margin-bottom: -4px;
}

.c-footer-landing-mobile__group-11 {
  display: block;
  position: relative;
  top: -3px;
  z-index: 1;
  padding-top: 12px;
}

.c-footer-landing-mobile__group-11::before {
  content: "";
  display: table;
}

.c-footer-landing-mobile__group-11::after {
  content: "";
  display: table;
}

.c-footer-landing-mobile__text-4 {
  display: block;
  max-height: 9999px;
  list-style-type: none;
  margin-top: 5px;
}

.c-footer-landing-mobile__list-3 {
  display: block;
  padding: 0px;
  margin: 5px 0px 0px;
  position: relative;
  top: -5px;
  z-index: 1;
  list-style-type: none;
}

.c-footer-landing-mobile__item-2 {
  display: inline-block;
  position: relative;
  margin-top: 8px;
  margin-right: 6px;
}

.c-footer-landing-mobile__item-2::before {
  content: "";
  display: block;
  width: 73px;
  height: 16px;
  position: absolute;
  top: 0px;
  right: 9px;
  bottom: 0px;
  left: 0px;
}

.c-footer-landing-mobile__item-2::after {
  content: "";
  display: block;
  width: 1px;
  height: 10px;
  position: absolute;
  top: 0px;
  right: -1px;
  bottom: 0px;
  left: 82.4219px;
  background-color: #0000007A;
  margin-top: 3px;
  margin-bottom: 3px;
}

.c-footer-landing-mobile__link-4 {
  display: inline-block;
  padding: 4px 9px;
  position: relative;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
  white-space: nowrap;
  margin-top: -4px;
  margin-bottom: -4px;
  margin-left: -9px;
}

.c-footer-landing-mobile__link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-landing-mobile__button:hover {
  color: #000000;
}

.c-footer-landing-mobile__button:hover::after {
  color: #000000;
}

.c-footer-landing-mobile__button:focus {
  outline: none;
}

.c-footer-landing-mobile__button:focus::after {
  outline: 2px solid #0071E3;
  outline-offset: -2px;
}

.c-footer-landing-mobile__link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-landing-mobile__link-3:hover {
  text-decoration-line: underline;
}

.c-footer-landing-mobile__link-3:focus {
  outline: none;
}

.c-footer-landing-mobile__link-3:focus::after {
  content: "";
  display: block;
  width: 71px;
  height: 16px;
  position: absolute;
  top: 4px;
  right: 0px;
  bottom: 4px;
  left: 0px;
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-landing-mobile__link-4:hover {
  text-decoration-line: underline;
}

.c-footer-landing-mobile__link-4:focus {
  outline: none;
}
```

**States**

- `footer-landing-link` focus: outline 2px solid #0071E3, outline-offset 1px
- `footer-landing-nav-link` hover: text-decoration-line underline
- `footer-landing-nav-link` focus: outline none, ::before content "", ::before display block, ::before width 28px, ::before height 16px, ::before position absolute, ::before top 4px, ::before right 20px, ::before bottom 4px, ::before left 0px, ::before outline 2px solid #0071E3, ::before outline-offset 1px
- mobile, `footer-landing-mobile-link` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-landing-mobile-button` hover (`footer-landing-mobile-button-hover`): color #000000, ::after color #000000
- mobile, `footer-landing-mobile-button` focus: outline none, ::after outline 2px solid #0071E3, ::after outline-offset -2px
- mobile, `footer-landing-mobile-link-2` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-landing-mobile-link-3` hover: text-decoration-line underline
- mobile, `footer-landing-mobile-link-3` focus: outline none, ::after content "", ::after display block, ::after width 71px, ::after height 16px, ::after position absolute, ::after top 4px, ::after right 0px, ::after bottom 4px, ::after left 0px, ::after outline 2px solid #0071E3, ::after outline-offset 1px
- mobile, `footer-landing-mobile-link-4` hover: text-decoration-line underline
- mobile, `footer-landing-mobile-link-4` focus: outline none

### Button, ghost (2)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-ghost-2`: the component root, a `<button>` (`.c-button-ghost-2`)

**Recipe**

```html
<div class="c-button-ghost-2-scope">
  <button class="c-button-ghost-2" type="button"></button>
</div>
```

```css
.c-button-ghost-2-scope {
  background-color: #FAFAFCCC;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-ghost-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  width: 22px;
  padding: 0px;
  position: absolute;
  top: 0px;
  right: -7px;
  background-color: transparent;
  color: #000000CC;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  list-style-type: none;
}

.c-button-ghost-2:focus {
  z-index: 1;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- focus: z-index 1, outline 2px solid #0071E3, outline-offset -7px

### Card (2)

**Verification**: flagged, the `card-2-break` y did not reproduce the measured 138px after 2 correction attempts.

**Anatomy**

- Group: 3 instances in a 3-column grid; the recipe carries the values they all share
- `card-2`: the component root, a `<div>` (`.c-card-2`)
- `card-2-group`: inner block (`.c-card-2__group`)
- `card-2-icon`: icon placeholder, 72x106px (`.c-card-2__icon`)
- `card-2-body`: inner group (`.c-card-2__body`)
- `card-2-text`: label text, 23 characters (`.c-card-2__text`, 2 instances)
- `card-2-break`: line break (`.c-card-2__break`)

**Recipe**

```html
<div class="c-card-2-scope">
  <div class="c-card-2">
    <div class="c-card-2__group">
      <span class="c-card-2__icon" aria-hidden="true"></span>
    </div>
    <p class="c-card-2__body">
      <span class="c-card-2__text">lorem ipsum dolor sit a</span>
      <br class="c-card-2__break">
      <span class="c-card-2__text">lorem ipsum d</span>
    </p>
  </div>
</div>
```

```css
.c-card-2-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-2 {
  display: inline-block;
  flex-basis: 33.3333%;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 33.3333%;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  text-align: center;
}

.c-card-2__group {
  display: block;
}

.c-card-2__icon {
  display: inline-block;
  flex-shrink: 0;
  width: 72px;
  height: 106px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-card-2__body {
  display: block;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.216px;
  margin-top: -3px;
  margin-bottom: 0px;
}

.c-card-2:hover {
  padding: 0px 48px 0px 0px;
}

.c-card-2:focus {
  padding: 0px 48px 0px 0px;
}
```

**States**

- hover: padding 0px 48px 0px 0px
- focus: padding 0px 48px 0px 0px

### Card (3)

**Verification**: flagged, the `card-3-group` y did not reproduce the measured 77px after 2 correction attempts.

**Anatomy**

- Group: 6 instances in a 3-column grid; the recipe carries the values they all share
- `card-3`: the component root, a `<li>` (`.c-card-3`)
- `card-3-group`: inner block (`.c-card-3__group`)
- `card-3-media`: image placeholder, 288x256px (`.c-card-3__media`)
- `card-3-group-2`: inner block (`.c-card-3__group-2`)
- `card-3-title`: heading, 6 characters (`.c-card-3__title`)
- `card-3-body`: inner group (`.c-card-3__body`)
- `card-3-text`: label text, 12 characters (`.c-card-3__text`)
- `card-3-text-2`: label text, 6 characters (`.c-card-3__text-2`, 5 instances)
- `card-3-text-3`: label text, 9 characters (`.c-card-3__text-3`, 3 instances)
- `card-3-group-3`: inner group (`.c-card-3__group-3`)
- `card-3-body-2`: inner group (`.c-card-3__body-2`)
- `card-3-link`: link, 11-character label (`.c-card-3__link`)

**Recipe**

```html
<div class="c-card-3-scope">
  <li class="c-card-3">
    <div class="c-card-3__group">
      <span class="c-card-3__media" aria-hidden="true"></span>
    </div>
    <div class="c-card-3__group-2">
      <h3 class="c-card-3__title">lorem</h3>
      <p class="c-card-3__body">
        <span class="c-card-3__text">lorem ipsum</span>
        <span class="c-card-3__text-2">lorem</span>
        <span class="c-card-3__text-2">lore</span>
        <span class="c-card-3__text-3">lorem ips</span>
        <span class="c-card-3__text-2">lorem</span>
        <span class="c-card-3__text-2">lor</span>
        <span class="c-card-3__text-3">lorem</span>
        <sup class="c-card-3__group-3">
          <span class="c-card-3__text-3">lorem ip</span>
          <span class="c-card-3__text-2">l</span>
        </sup>
      </p>
      <p class="c-card-3__body-2">
        <a class="c-card-3__link" href="#">lorem ipsum</a>
      </p>
    </div>
  </li>
</div>
```

```css
.c-card-3-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-3 {
  flex-basis: 33.3333%;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 33.3333%;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  text-align: center;
  list-style-type: none;
}

.c-card-3__group {
  display: block;
  margin-top: 77px;
}

.c-card-3__media {
  display: inline-block;
  flex-shrink: 0;
  width: 288px;
  height: 256px;
  aspect-ratio: auto 288 / 256;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
}

.c-card-3__group-2 {
  display: block;
}

.c-card-3__title {
  display: block;
  margin: 24px 0px 7.956px;
  font-size: 19.89px;
  font-weight: 600;
  line-height: 29.25px;
}

.c-card-3__body {
  display: block;
  margin: 0px;
  font-weight: 600;
}

.c-card-3__text {
  display: block;
}

.c-card-3__text-3 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-card-3__group-3 {
  display: inline;
  position: relative;
  top: -5.1px;
  font-size: 10.2px;
  line-height: 15px;
}

.c-card-3__body-2 {
  display: block;
  margin: 13.6px 0px 0px;
}

.c-card-3__link {
  display: inline;
  color: #0066CC;
  cursor: pointer;
  text-decoration-line: none;
}

.c-card-3__link::after {
  content: "";
  display: inline-block;
  width: 12px;
  height: 17px;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  font-family: "SF Pro Icons";
  line-height: 17px;
  padding-left: 4.08px;
}

.c-card-3:hover {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.c-card-3:focus {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
```

**States**

- hover: display flex, flex-direction column, justify-content flex-end
- focus: display flex, flex-direction column, justify-content flex-end

### Footer links

**Verification**: flagged, the `footer-link-list` width did not reproduce the measured 176px after 2 correction attempts.

**Anatomy**

- `footer-link`: the component root, a `<nav>` (`.c-footer-link`), content not captured
- `footer-link-group`: inner block (`.c-footer-link__group`, 2 instances)
- `footer-link-group-2`: inner block (`.c-footer-link__group-2`, 2 instances)
- `footer-link-title`: heading, 0 characters (`.c-footer-link__title`, 4 instances)
- `footer-link-text`: label text, 14 characters (`.c-footer-link__text`, 4 instances)
- `footer-link-list`: inner group (`.c-footer-link__list`, 4 instances), content not captured
- `footer-link-item`: inner group (`.c-footer-link__item`, 18 instances), content not captured
- `footer-link-item-2`: inner group (`.c-footer-link__item-2`, 3 instances), content not captured
- `footer-link-group-3`: inner block (`.c-footer-link__group-3`, 2 instances)

**Recipe**

```html
<div class="c-footer-link-scope">
  <nav class="c-footer-link">
    <div class="c-footer-link__group">
      <div class="c-footer-link__group-2">
        <h3 class="c-footer-link__title">
          <span class="c-footer-link__text">lorem ipsum do</span>
        </h3>
        <ul class="c-footer-link__list">
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item-2"></li>
        </ul>
      </div>
      <div class="c-footer-link__group-3">
        <h3 class="c-footer-link__title">
          <span class="c-footer-link__text">lorem ipsum</span>
        </h3>
        <ul class="c-footer-link__list">
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item-2"></li>
        </ul>
      </div>
    </div>
    <div class="c-footer-link__group">
      <div class="c-footer-link__group-2">
        <h3 class="c-footer-link__title">
          <span class="c-footer-link__text">lorem i</span>
        </h3>
        <ul class="c-footer-link__list">
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item-2"></li>
        </ul>
      </div>
      <div class="c-footer-link__group-3">
        <h3 class="c-footer-link__title">
          <span class="c-footer-link__text">lorem ipsum d</span>
        </h3>
        <ul class="c-footer-link__list">
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
          <li class="c-footer-link__item"></li>
        </ul>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-footer-link-scope {
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
}

.c-footer-link {
  display: flex;
  border-spacing: 0px;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-link__group {
  display: block;
  flex-basis: 25%;
}

.c-footer-link__group-2 {
  display: block;
}

.c-footer-link__title {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-link__text {
  display: block;
  font-size: 12px;
  line-height: 16.0005px;
  margin-right: 20px;
  margin-bottom: 9.6px;
}

.c-footer-link__list {
  display: block;
  padding: 0px;
  margin: 0px 20px 0px 0px;
  list-style-type: none;
}

.c-footer-link__item {
  display: block;
  margin-bottom: 9.6px;
}

.c-footer-link__item-2 {
  display: block;
}

.c-footer-link__group-3 {
  display: block;
  padding-top: 24px;
}
```

**States**

- No hover or focus change was observed.

### Breadcrumbs

**Verification**: flagged, the `breadcrumb` height did not reproduce the measured 56px after 2 correction attempts.

**Anatomy**

- `breadcrumb`: the component root, a `<nav>` (`.c-breadcrumb`)
- `breadcrumb-link`: link (`.c-breadcrumb__link`)
- `breadcrumb-group`: inner group (`.c-breadcrumb__group`)
- `breadcrumb-text`: label text, 5 characters (`.c-breadcrumb__text`)
- `breadcrumb-group-2`: inner block (`.c-breadcrumb__group-2`)
- `breadcrumb-list`: inner group (`.c-breadcrumb__list`)
- `breadcrumb-item`: label text, 9 characters (`.c-breadcrumb__item`, 2 instances)

**Recipe**

```html
<div class="c-breadcrumb-scope">
  <nav class="c-breadcrumb">
    <a class="c-breadcrumb__link" href="#">
      <span class="c-breadcrumb__group"></span>
      <span class="c-breadcrumb__text">lorem</span>
    </a>
    <div class="c-breadcrumb__group-2">
      <ol class="c-breadcrumb__list">
        <li class="c-breadcrumb__item">lorem ips</li>
        <li class="c-breadcrumb__item">lorem ipsum dolor si</li>
      </ol>
    </div>
  </nav>
</div>
```

```css
.c-breadcrumb-scope {
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
}

.c-breadcrumb {
  display: block;
  border-spacing: 0px;
  position: relative;
  z-index: 1;
  color: #000000B8;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  padding-top: 17px;
  padding-bottom: 17px;
}

.c-breadcrumb::before {
  content: "";
  display: table;
}

.c-breadcrumb::after {
  content: "";
  display: table;
}

.c-breadcrumb__link {
  display: block;
  position: absolute;
  top: 17px;
  left: 0px;
  z-index: 2;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-breadcrumb__group {
  display: block;
  width: 14px;
  height: 18px;
  position: relative;
  z-index: 2;
  background-color: #000000B8;
  color: transparent;
}

.c-breadcrumb__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-breadcrumb__group-2 {
  display: block;
  position: relative;
  z-index: 1;
}

.c-breadcrumb__group-2::before {
  content: "";
  display: table;
}

.c-breadcrumb__group-2::after {
  content: "";
  display: table;
}

.c-breadcrumb__list {
  display: block;
  max-height: 9999px;
  padding: 0px 0px 0px 25px;
  margin: 0px;
  list-style-type: none;
}

.c-breadcrumb__item {
  display: list-item;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 3px;
  padding-right: 4px;
  padding-bottom: 3px;
  margin-right: 7px;
}

.c-breadcrumb__item::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 11px;
  vertical-align: middle;
  background-color: #0000007A;
  margin-top: -1px;
  margin-right: 11px;
}
```

**States**

- No hover or focus change was observed.

### Icon link

**Verification**: verified against the live page at desktop.

**Anatomy**

- `icon-link`: the component root, a `<a>` (`.c-icon-link`)
- `icon-link-group`: inner flex row (`.c-icon-link__group`)
- `icon-link-icon`: icon placeholder, 15x44px (`.c-icon-link__icon`)

**Recipe**

```html
<div class="c-icon-link-scope">
  <a class="c-icon-link" href="#">
    <span class="c-icon-link__group">
      <span class="c-icon-link__icon" aria-hidden="true"></span>
    </span>
  </a>
</div>
```

```css
.c-icon-link-scope {
  background-color: #FAFAFCCC;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-icon-link {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  list-style-type: none;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-icon-link__group {
  display: flex;
}

.c-icon-link__icon {
  display: block;
  flex-shrink: 0;
  width: 15px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-icon-link:hover {
  color: #000000;
}

.c-icon-link:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- hover (`icon-link-hover`): color #000000
- focus (`icon-link-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px

### Icon link (2)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `icon-link-2`: the component root, a `<a>` (`.c-icon-link-2`)
- `icon-link-2-group`: inner flex row (`.c-icon-link-2__group`)
- `icon-link-2-icon`: icon placeholder, 14x44px (`.c-icon-link-2__icon`)
- `icon-link-2-group-2`: inner group (`.c-icon-link-2__group-2`)
- `icon-link-2-group-3`: inner group (`.c-icon-link-2__group-3`)
- `icon-link-2-text`: label text, 1 characters (`.c-icon-link-2__text`)

**Recipe**

```html
<div class="c-icon-link-2-scope">
  <a class="c-icon-link-2" href="#">
    <span class="c-icon-link-2__group">
      <span class="c-icon-link-2__icon" aria-hidden="true"></span>
    </span>
    <span class="c-icon-link-2__group-2">
      <span class="c-icon-link-2__group-3"></span>
      <span class="c-icon-link-2__text">l</span>
    </span>
  </a>
</div>
```

```css
.c-icon-link-2-scope {
  background-color: #FAFAFCCC;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-icon-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  height: 44px;
  position: relative;
  z-index: 1;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  list-style-type: none;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-icon-link-2__group {
  display: flex;
}

.c-icon-link-2__icon {
  display: block;
  flex-shrink: 0;
  width: 14px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-icon-link-2__group-2 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 11px;
  left: 15px;
  z-index: 1;
  color: #FFFFFF;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-icon-link-2__group-2::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-icon-link-2__group-2::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
}

.c-icon-link-2__group-3 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #000000;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-icon-link-2__text {
  display: block;
  position: relative;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-icon-link-2:hover {
  color: #000000;
}

.c-icon-link-2:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- hover (`icon-link-2-hover`): color #000000
- focus (`icon-link-2-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px

### Header (inner)

**Verification**: desktop flagged, the `header-inner-group` x did not reproduce the measured 1146px after 2 correction attempts; mobile flagged, the `header-inner-mobile-nav-link-2` x did not reproduce the measured 246px after 2 correction attempts.

Variant observed on https://www.apple.com/us/shop/goto/payment_plan.

**Anatomy**

- `header-inner`: the component root, a `<nav>` (`.c-header-inner`)
- `header-inner-inner`: inner block (`.c-header-inner__inner`)
- `header-inner-nav`: inner flex row (`.c-header-inner__nav`)
- `header-inner-nav-item`: inner group (`.c-header-inner__nav-item`)
- `header-inner-nav-link`: link (`.c-header-inner__nav-link`)
- `header-inner-group`: inner flex row (`.c-header-inner__group`, 3 instances)
- `header-inner-icon`: icon placeholder, 14x44px (`.c-header-inner__icon`, 2 instances)
- `header-inner-text`: label text, 5 characters (`.c-header-inner__text`)
- `header-inner-nav-link-2`: link (`.c-header-inner__nav-link-2`)
- `header-inner-icon-2`: icon placeholder, 15x44px (`.c-header-inner__icon-2`)
- `header-inner-group-2`: inner block (`.c-header-inner__group-2`)
- `header-inner-nav-link-3`: link (`.c-header-inner__nav-link-3`)
- `header-inner-group-3`: inner group (`.c-header-inner__group-3`)
- `header-inner-group-4`: inner group (`.c-header-inner__group-4`)
- `header-inner-text-2`: label text, 1 characters (`.c-header-inner__text-2`)

**Desktop recipe**

```html
<div class="c-header-inner-scope">
  <nav class="c-header-inner">
    <div class="c-header-inner__inner">
      <ul class="c-header-inner__nav">
        <li class="c-header-inner__nav-item">
          <a class="c-header-inner__nav-link" href="#">
            <span class="c-header-inner__group">
              <span class="c-header-inner__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner__text">lorem</span>
          </a>
        </li>
        <a class="c-header-inner__nav-link-2" href="#">
          <span class="c-header-inner__group">
            <span class="c-header-inner__icon-2" aria-hidden="true"></span>
          </span>
        </a>
        <div class="c-header-inner__group-2">
          <a class="c-header-inner__nav-link-3" href="#">
            <span class="c-header-inner__group">
              <span class="c-header-inner__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner__group-3">
              <span class="c-header-inner__group-4"></span>
              <span class="c-header-inner__text-2">l</span>
            </span>
          </a>
        </div>
      </ul>
    </div>
  </nav>
</div>
```

```css
.c-header-inner-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-inner {
  display: block;
  border-spacing: 0px;
  height: 48px;
  min-width: 320px;
  max-height: 44px;
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 9999;
  background-color: #FAFAFCCC;
  color: #1D1D1F;
  backdrop-filter: saturate(1.8) blur(20px);
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-inner__inner {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 1024px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner__nav {
  display: flex;
  justify-content: space-between;
  height: 44px;
  padding: 0px;
  margin: 0px -8px;
  cursor: default;
  list-style-type: none;
}

.c-header-inner__nav-item {
  display: block;
  box-sizing: border-box;
  height: 44px;
}

.c-header-inner__nav-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-weight: 600;
  line-height: 21.0012px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-inner__group {
  display: flex;
}

.c-header-inner__icon {
  display: block;
  flex-shrink: 0;
  width: 14px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-inner__text {
  display: flex;
  align-items: center;
  width: 1px;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  margin-left: 4px;
}

.c-header-inner__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-inner__icon-2 {
  display: block;
  flex-shrink: 0;
  width: 15px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-inner__group-2 {
  display: block;
  position: relative;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  color: #000000CC;
  cursor: pointer;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-inner__group-3 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 11px;
  left: 15px;
  z-index: 1;
  color: #FFFFFF;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-header-inner__group-3::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner__group-3::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
}

.c-header-inner__group-4 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #000000;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner__text-2 {
  display: block;
  position: relative;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner__nav-link:hover {
  color: #000000;
}

.c-header-inner__nav-link:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner__nav-link-2:hover {
  color: #000000;
}

.c-header-inner__nav-link-2:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner__nav-link-3:hover {
  color: #000000;
}

.c-header-inner__nav-link-3:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**Mobile anatomy**

- `header-inner-mobile`: the component root, a `<nav>` (`.c-header-inner-mobile`)
- `header-inner-mobile-inner`: inner flex row (`.c-header-inner-mobile__inner`)
- `header-inner-mobile-nav`: inner flex row (`.c-header-inner-mobile__nav`)
- `header-inner-mobile-nav-item`: inner group (`.c-header-inner-mobile__nav-item`)
- `header-inner-mobile-nav-link`: link (`.c-header-inner-mobile__nav-link`)
- `header-inner-mobile-group`: inner flex row (`.c-header-inner-mobile__group`, 3 instances)
- `header-inner-mobile-icon`: icon placeholder, 17x48px (`.c-header-inner-mobile__icon`, 3 instances)
- `header-inner-mobile-text`: label text, 5 characters (`.c-header-inner-mobile__text`)
- `header-inner-mobile-nav-item-2`: inner group (`.c-header-inner-mobile__nav-item-2`)
- `header-inner-mobile-nav-link-2`: link (`.c-header-inner-mobile__nav-link-2`)
- `header-inner-mobile-group-2`: inner block (`.c-header-inner-mobile__group-2`)
- `header-inner-mobile-nav-link-3`: link (`.c-header-inner-mobile__nav-link-3`)
- `header-inner-mobile-group-3`: inner group (`.c-header-inner-mobile__group-3`)
- `header-inner-mobile-group-4`: inner group (`.c-header-inner-mobile__group-4`)
- `header-inner-mobile-text-2`: label text, 1 characters (`.c-header-inner-mobile__text-2`)
- `header-inner-mobile-group-5`: inner block (`.c-header-inner-mobile__group-5`)
- `header-inner-mobile-menu-toggle`: button (`.c-header-inner-mobile__menu-toggle`)
- `header-inner-mobile-menu-toggle-icon`: icon placeholder, 18px (`.c-header-inner-mobile__menu-toggle-icon`)

**Mobile recipe**

```html
<div class="c-header-inner-mobile-scope">
  <nav class="c-header-inner-mobile">
    <div class="c-header-inner-mobile__inner">
      <ul class="c-header-inner-mobile__nav">
        <li class="c-header-inner-mobile__nav-item">
          <a class="c-header-inner-mobile__nav-link" href="#">
            <span class="c-header-inner-mobile__group">
              <span class="c-header-inner-mobile__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner-mobile__text">lorem</span>
          </a>
        </li>
        <li class="c-header-inner-mobile__nav-item-2">
          <a class="c-header-inner-mobile__nav-link-2" href="#">
            <span class="c-header-inner-mobile__group">
              <span class="c-header-inner-mobile__icon" aria-hidden="true"></span>
            </span>
          </a>
        </li>
        <div class="c-header-inner-mobile__group-2">
          <a class="c-header-inner-mobile__nav-link-3" href="#">
            <span class="c-header-inner-mobile__group">
              <span class="c-header-inner-mobile__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner-mobile__group-3">
              <span class="c-header-inner-mobile__group-4"></span>
              <span class="c-header-inner-mobile__text-2">l</span>
            </span>
          </a>
        </div>
      </ul>
      <div class="c-header-inner-mobile__group-5">
        <button class="c-header-inner-mobile__menu-toggle" type="button">
          <span class="c-header-inner-mobile__menu-toggle-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-header-inner-mobile-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-inner-mobile {
  display: block;
  border-spacing: 0px;
  height: 48px;
  min-width: 320px;
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 9999;
  color: #1D1D1F;
  backdrop-filter: saturate(1.8) blur(20px);
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-inner-mobile__inner {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: 1024px;
  position: absolute;
  top: 0px;
  z-index: 2;
  background-color: #FAFAFCCC;
  transition: background 0.422s cubic-bezier(0.4, 0, 0.6, 1);
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-mobile__nav {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  padding: 0px 48px 0px 0px;
  margin: 0px;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  cursor: default;
  list-style-type: none;
}

.c-header-inner-mobile__nav-item {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  width: 48px;
  height: 100%;
  text-align: left;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
}

.c-header-inner-mobile__nav-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 48px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 23px;
  letter-spacing: 0.228px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 16px;
  padding-left: 16px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-mobile__group {
  display: flex;
}

.c-header-inner-mobile__icon {
  display: block;
  flex-shrink: 0;
  width: 17px;
  height: 48px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-inner-mobile__text {
  display: flex;
  align-items: center;
  width: 1px;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  margin-left: 4px;
}

.c-header-inner-mobile__nav-item-2 {
  display: list-item;
  box-sizing: border-box;
  width: 48px;
  height: 100%;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
}

.c-header-inner-mobile__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 8px;
  padding-left: 8px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-mobile__group-2 {
  display: block;
  position: relative;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-mobile__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  position: relative;
  z-index: 1;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 8px;
  padding-left: 8px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-mobile__group-3 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 13px;
  left: 22px;
  z-index: 1;
  color: #FFFFFF;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-header-inner-mobile__group-3::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-mobile__group-3::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
}

.c-header-inner-mobile__group-4 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #000000;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-mobile__text-2 {
  display: block;
  position: relative;
  z-index: 2;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-mobile__group-5 {
  display: block;
  width: 48px;
  position: absolute;
  right: 0px;
  z-index: 3;
}

.c-header-inner-mobile__menu-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  padding: 0px;
  position: relative;
  background-color: transparent;
  color: #000000;
  border: 0;
  opacity: 0.8;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.32s, 0.32s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), cubic-bezier(0.4, 0, 0.6, 1);
  transition-property: opacity, color;
}

.c-header-inner-mobile__menu-toggle-icon {
  display: block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner-mobile__nav-link:hover {
  color: #000000;
}

.c-header-inner-mobile__nav-link:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-mobile__nav-link-2:hover {
  color: #000000;
}

.c-header-inner-mobile__nav-link-2:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-mobile__nav-link-3:hover {
  color: #000000;
}

.c-header-inner-mobile__nav-link-3:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-mobile__menu-toggle:hover {
  opacity: 1;
}

.c-header-inner-mobile__menu-toggle:focus {
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- `header-inner-nav-link` hover (`header-inner-nav-link-hover`): color #000000
- `header-inner-nav-link` focus (`header-inner-nav-link-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- `header-inner-nav-link-2` hover (`header-inner-nav-link-2-hover`): color #000000
- `header-inner-nav-link-2` focus (`header-inner-nav-link-2-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- `header-inner-nav-link-3` hover (`header-inner-nav-link-3-hover`): color #000000
- `header-inner-nav-link-3` focus (`header-inner-nav-link-3-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-mobile-nav-link` hover (`header-inner-mobile-nav-link-hover`): color #000000
- mobile, `header-inner-mobile-nav-link` focus (`header-inner-mobile-nav-link-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-mobile-nav-link-2` hover (`header-inner-mobile-nav-link-2-hover`): color #000000
- mobile, `header-inner-mobile-nav-link-2` focus (`header-inner-mobile-nav-link-2-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-mobile-nav-link-3` hover (`header-inner-mobile-nav-link-3-hover`): color #000000
- mobile, `header-inner-mobile-nav-link-3` focus (`header-inner-mobile-nav-link-3-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-mobile-menu-toggle` hover: opacity 1
- mobile, `header-inner-mobile-menu-toggle` focus: outline 2px solid #0071E3, outline-offset -7px

### Footer (inner)

**Verification**: desktop flagged, the `footer-inner-inner` height did not reproduce the measured 7902px after 2 correction attempts; mobile flagged, the recipe could not be rendered on its own.

Variant observed on https://www.apple.com/us/shop/goto/payment_plan.

**Anatomy**

- `footer-inner`: the component root, a `<footer>` (`.c-footer-inner`)
- `footer-inner-inner`: inner block (`.c-footer-inner__inner`), content not captured
- `footer-inner-heading`: heading, 6 characters (`.c-footer-inner__heading`)
- `footer-inner-heading-2`: heading, 9 characters (`.c-footer-inner__heading-2`)
- `footer-inner-group`: inner block (`.c-footer-inner__group`), content not captured
- `footer-inner-group-2`: inner block (`.c-footer-inner__group-2`), content not captured
- `footer-inner-group-3`: inner group (`.c-footer-inner__group-3`)
- `footer-inner-text`: label text, 818 characters (`.c-footer-inner__text`, 49 instances)
- `footer-inner-link`: link (`.c-footer-inner__link`, 3 instances)
- `footer-inner-text-2`: label text, 23 characters (`.c-footer-inner__text-2`, 4 instances)
- `footer-inner-group-4`: inner group (`.c-footer-inner__group-4`, 53 instances)
- `footer-inner-text-3`: label text, 995 characters (`.c-footer-inner__text-3`)
- `footer-inner-text-4`: label text, 66 characters (`.c-footer-inner__text-4`, 19 instances)
- `footer-inner-text-5`: label text, 19 characters (`.c-footer-inner__text-5`, 22 instances)
- `footer-inner-link-2`: link (`.c-footer-inner__link-2`)
- `footer-inner-break`: line break (`.c-footer-inner__break`, 4 instances)
- `footer-inner-text-6`: label text, 1213 characters (`.c-footer-inner__text-6`), content not captured

**Desktop recipe**

```html
<div class="c-footer-inner-scope">
  <footer class="c-footer-inner">
    <div class="c-footer-inner__inner">
      <h2 class="c-footer-inner__heading">lorem</h2>
      <h3 class="c-footer-inner__heading-2">lorem ips</h3>
      <div class="c-footer-inner__group">
        <div class="c-footer-inner__group-2">
          <p class="c-footer-inner__group-3">
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscin</span>
            <a class="c-footer-inner__link" href="#">
              <span class="c-footer-inner__text">lorem ipsum dolor sit amet conse</span>
              <span class="c-footer-inner__text-2">lorem ipsum dolor sit a</span>
            </a>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsu</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <span class="c-footer-inner__text">l</span>
          <span class="c-footer-inner__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod t</span>
          <p class="c-footer-inner__group-4">
            <span class="c-footer-inner__text">l</span>
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eius</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod te</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet co</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
          </p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet co</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</span>
          </p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet co</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem</span>
          </p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing e</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet cons</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consecte</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetu</span>
          </p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet conse</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tem</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempo</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do ei</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ips</span>
            <a class="c-footer-inner__link" href="#">
              <span class="c-footer-inner__text">lorem ipsum dolor</span>
              <span class="c-footer-inner__text-2">lorem ipsum dolor sit a</span>
            </a>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet co</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectet</span>
          </p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipis</strong>
          </p>
          <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscin</span>
          <a class="c-footer-inner__link-2" href="#">
            <span class="c-footer-inner__text">lorem ipsum dolor</span>
            <span class="c-footer-inner__text-2">lorem ipsum dolor sit a</span>
          </a>
          <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed</span>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempo</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consec</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eius</span>
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod temp</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipisc</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet cons</span>
            <br class="c-footer-inner__break">
            <br class="c-footer-inner__break">
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do</span>
            <br class="c-footer-inner__break">
            <br class="c-footer-inner__break">
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem</span>
          </p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet conse</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusm</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed d</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipis</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adip</span>
            <a class="c-footer-inner__link" href="#">
              <span class="c-footer-inner__text">lorem ipsum dolor</span>
              <span class="c-footer-inner__text-2">lorem ipsum dolor sit a</span>
            </a>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit ame</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adip</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consec</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit am</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod t</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempo</span>
          </p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum do</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <strong class="c-footer-inner__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do</strong>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscin</span>
          </p>
          <p class="c-footer-inner__group-4"></p>
          <p class="c-footer-inner__group-4">
            <em class="c-footer-inner__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet conse</span>
          </p>
          <p class="c-footer-inner__text-6">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed</p>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner {
  display: block;
  border-spacing: 0px;
  min-width: 1024px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner__inner {
  display: block;
  max-width: 980px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner__group-2 {
  display: block;
}

.c-footer-inner__group-3 {
  display: block;
  margin: 0px;
}

.c-footer-inner__link {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000B8;
}

.c-footer-inner__text-2 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner__group-4 {
  display: block;
  margin: 9.6px 0px 0px;
}

.c-footer-inner__text-3 {
  display: inline;
  margin-top: 9.6px;
}

.c-footer-inner__text-4 {
  display: inline;
  font-weight: 600;
}

.c-footer-inner__text-5 {
  display: inline;
  font-style: italic;
}

.c-footer-inner__link-2 {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000B8;
  margin-top: 9.6px;
}

.c-footer-inner__text-6 {
  display: block;
  margin: 9.6px 0px 0px;
}

.c-footer-inner__link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner__link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**Mobile anatomy**

- `footer-inner-mobile`: the component root, a `<footer>` (`.c-footer-inner-mobile`)
- `footer-inner-mobile-inner`: inner block (`.c-footer-inner-mobile__inner`), content not captured
- `footer-inner-mobile-heading`: heading, 6 characters (`.c-footer-inner-mobile__heading`)
- `footer-inner-mobile-heading-2`: heading, 9 characters (`.c-footer-inner-mobile__heading-2`)
- `footer-inner-mobile-group`: inner block (`.c-footer-inner-mobile__group`), content not captured
- `footer-inner-mobile-group-2`: inner block (`.c-footer-inner-mobile__group-2`), content not captured
- `footer-inner-mobile-group-3`: inner group (`.c-footer-inner-mobile__group-3`)
- `footer-inner-mobile-text`: label text, 818 characters (`.c-footer-inner-mobile__text`, 49 instances)
- `footer-inner-mobile-link`: link (`.c-footer-inner-mobile__link`, 3 instances)
- `footer-inner-mobile-text-2`: label text, 23 characters (`.c-footer-inner-mobile__text-2`, 4 instances)
- `footer-inner-mobile-group-4`: inner group (`.c-footer-inner-mobile__group-4`, 53 instances)
- `footer-inner-mobile-text-3`: label text, 995 characters (`.c-footer-inner-mobile__text-3`)
- `footer-inner-mobile-text-4`: label text, 66 characters (`.c-footer-inner-mobile__text-4`, 19 instances)
- `footer-inner-mobile-text-5`: label text, 19 characters (`.c-footer-inner-mobile__text-5`, 22 instances)
- `footer-inner-mobile-link-2`: link (`.c-footer-inner-mobile__link-2`)
- `footer-inner-mobile-break`: line break (`.c-footer-inner-mobile__break`, 4 instances)
- `footer-inner-mobile-text-6`: label text, 1213 characters (`.c-footer-inner-mobile__text-6`), content not captured

**Mobile recipe**

```html
<div class="c-footer-inner-mobile-scope">
  <footer class="c-footer-inner-mobile">
    <div class="c-footer-inner-mobile__inner">
      <h2 class="c-footer-inner-mobile__heading">lorem</h2>
      <h3 class="c-footer-inner-mobile__heading-2">lorem ips</h3>
      <div class="c-footer-inner-mobile__group">
        <div class="c-footer-inner-mobile__group-2">
          <p class="c-footer-inner-mobile__group-3">
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscin</span>
            <a class="c-footer-inner-mobile__link" href="#">
              <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet conse</span>
              <span class="c-footer-inner-mobile__text-2">lorem ipsum dolor sit a</span>
            </a>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsu</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <span class="c-footer-inner-mobile__text">l</span>
          <span class="c-footer-inner-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod t</span>
          <p class="c-footer-inner-mobile__group-4">
            <span class="c-footer-inner-mobile__text">l</span>
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eius</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod te</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet co</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet co</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet co</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing e</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet cons</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consecte</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetu</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet conse</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tem</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempo</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do ei</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ips</span>
            <a class="c-footer-inner-mobile__link" href="#">
              <span class="c-footer-inner-mobile__text">lorem ipsum dolor</span>
              <span class="c-footer-inner-mobile__text-2">lorem ipsum dolor sit a</span>
            </a>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet co</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectet</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipis</strong>
          </p>
          <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscin</span>
          <a class="c-footer-inner-mobile__link-2" href="#">
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor</span>
            <span class="c-footer-inner-mobile__text-2">lorem ipsum dolor sit a</span>
          </a>
          <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed</span>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempo</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consec</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eius</span>
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod temp</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipisc</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet cons</span>
            <br class="c-footer-inner-mobile__break">
            <br class="c-footer-inner-mobile__break">
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do</span>
            <br class="c-footer-inner-mobile__break">
            <br class="c-footer-inner-mobile__break">
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet conse</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusm</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed d</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipis</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consect</strong>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adip</span>
            <a class="c-footer-inner-mobile__link" href="#">
              <span class="c-footer-inner-mobile__text">lorem ipsum dolor</span>
              <span class="c-footer-inner-mobile__text-2">lorem ipsum dolor sit a</span>
            </a>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit ame</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adip</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consec</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit am</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod t</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor sit</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempo</span>
          </p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum do</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <strong class="c-footer-inner-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do</strong>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscin</span>
          </p>
          <p class="c-footer-inner-mobile__group-4"></p>
          <p class="c-footer-inner-mobile__group-4">
            <em class="c-footer-inner-mobile__text-5">lorem ipsum dolor s</em>
            <span class="c-footer-inner-mobile__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet conse</span>
          </p>
          <p class="c-footer-inner-mobile__text-6">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed</p>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-mobile-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner-mobile {
  display: block;
  border-spacing: 0px;
  min-width: 320px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner-mobile__inner {
  display: block;
  max-width: 980px;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-mobile__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner-mobile__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-mobile__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-mobile__group-2 {
  display: block;
}

.c-footer-inner-mobile__group-3 {
  display: block;
  margin: 0px;
}

.c-footer-inner-mobile__link {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000B8;
}

.c-footer-inner-mobile__text-2 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner-mobile__group-4 {
  display: block;
  margin: 9.6px 0px 0px;
}

.c-footer-inner-mobile__text-3 {
  display: inline;
  margin-top: 9.6px;
}

.c-footer-inner-mobile__text-4 {
  display: inline;
  font-weight: 600;
}

.c-footer-inner-mobile__text-5 {
  display: inline;
  font-style: italic;
}

.c-footer-inner-mobile__link-2 {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000B8;
  margin-top: 9.6px;
}

.c-footer-inner-mobile__text-6 {
  display: block;
  margin: 9.6px 0px 0px;
}

.c-footer-inner-mobile__link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-mobile__link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- `footer-inner-link` focus: outline 2px solid #0071E3, outline-offset 1px
- `footer-inner-link-2` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-mobile-link` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-mobile-link-2` focus: outline 2px solid #0071E3, outline-offset 1px

### Button, primary (2)

**Verification**: flagged, the `button-primary-2-label-2` y did not reproduce the measured 9px after 2 correction attempts.

**Anatomy**

- `button-primary-2`: the component root, a `<a>` (`.c-button-primary-2`)
- `button-primary-2-label`: label text, 3 characters (`.c-button-primary-2__label`)
- `button-primary-2-label-2`: label text, 13 characters (`.c-button-primary-2__label-2`)

**Recipe**

```html
<div class="c-button-primary-2-scope">
  <a class="c-button-primary-2" href="#">
    <span class="c-button-primary-2__label">lor</span>
    <span class="c-button-primary-2__label-2">lorem ipsum d</span>
  </a>
</div>
```

```css
.c-button-primary-2-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
}

.c-button-primary-2 {
  display: inline-block;
  align-self: flex-end;
  border-spacing: 0px;
  padding: 8px 15px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
  letter-spacing: -0.224px;
  text-decoration-line: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-primary-2__label-2 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-button-primary-2:hover {
  background-color: #0076DF;
}

.c-button-primary-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-primary-2-hover`): background-color #0076DF
- focus: outline 2px solid #0071E3, outline-offset 3px

### Button, ghost (3)

**Verification**: flagged, the `button-ghost-3-label` y did not reproduce the measured 0px after 2 correction attempts.

**Anatomy**

- `button-ghost-3`: the component root, a `<button>` (`.c-button-ghost-3`)
- `button-ghost-3-group`: inner group (`.c-button-ghost-3__group`)
- `button-ghost-3-icon`: icon placeholder, 56px (`.c-button-ghost-3__icon`)
- `button-ghost-3-label`: label text, 17 characters (`.c-button-ghost-3__label`)

**Recipe**

```html
<div class="c-button-ghost-3-scope">
  <button class="c-button-ghost-3" type="button">
    <span class="c-button-ghost-3__group">
      <span class="c-button-ghost-3__icon" aria-hidden="true"></span>
    </span>
    <span class="c-button-ghost-3__label">lorem ipsum dolor</span>
  </button>
</div>
```

```css
.c-button-ghost-3-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-ghost-3 {
  display: inline-block;
  border-spacing: 0px;
  width: 56px;
  height: 56px;
  padding: 0px;
  position: absolute;
  top: 49%;
  right: 18px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #D2D2D7A3;
  color: #FFFFFF;
  border: 0;
  border-radius: 56px;
  cursor: pointer;
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  list-style-type: none;
  transition-duration: 0.5s;
  transition-timing-function: ease-in, cubic-bezier(0.15, 0, 0.2, 1);
  transition-property: transform, opacity;
}

.c-button-ghost-3__group {
  display: inline;
}

.c-button-ghost-3__icon {
  display: inline-block;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-button-ghost-3__label {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-button-ghost-3:hover {
  background-color: #DEDEE3B2;
}

.c-button-ghost-3:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-ghost-3-hover`): background-color #DEDEE3B2
- focus: outline 2px solid #0071E3, outline-offset 3px

### Card (4)

**Verification**: verified against the live page at desktop.

**Anatomy**

- Group: 4 instances in a 8-column grid; the recipe carries the values they all share
- `card-4`: the component root, a `<div>` (`.c-card-4`)
- `card-4-group`: inner flex row (`.c-card-4__group`)
- `card-4-group-2`: inner flex column (`.c-card-4__group-2`)
- `card-4-group-3`: inner block (`.c-card-4__group-3`), content not captured
- `card-4-group-4`: inner block (`.c-card-4__group-4`), content not captured
- `card-4-list`: inner flex row (`.c-card-4__list`), content not captured
- `card-4-group-5`: inner flex column (`.c-card-4__group-5`), content not captured

**Recipe**

```html
<div class="c-card-4-scope">
  <div class="c-card-4">
    <div class="c-card-4__group">
      <div class="c-card-4__group-2">
        <div class="c-card-4__group-3"></div>
        <div class="c-card-4__group-4"></div>
        <ul class="c-card-4__list"></ul>
        <div class="c-card-4__group-5"></div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-card-4-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-4 {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  white-space: nowrap;
}

.c-card-4__group {
  display: flex;
  height: 500px;
  transform: matrix(1, 0, 0, 1, 140, 0);
  margin-right: 20px;
}

.c-card-4__group-2 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  height: 500px;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #FFFFFF;
  border-radius: 18px;
  box-shadow: #00000014 2px 4px 12px 0px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.5, 1);
}

.c-card-4__group-3 {
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 28px 28px 16px;
}

.c-card-4__group-4 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-card-4__list {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 24px 0px 0px;
  margin: 0px auto;
  list-style-type: none;
}

.c-card-4__group-5 {
  display: flex;
  flex-direction: column;
  height: 80px;
  position: relative;
  padding-top: 10px;
}
```

**States**

- No hover or focus change was observed.

### Card (5)

**Verification**: not verifiable, what the page placed in it (photos, media, ads) covers most of it and nothing else differs, so the comparison could not be judged.

**Anatomy**

- Group: 3 instances in a 6-column grid; the recipe carries the values they all share
- `card-5`: the component root, a `<div>` (`.c-card-5`)
- `card-5-group`: inner flex row (`.c-card-5__group`)
- `card-5-group-2`: inner flex row (`.c-card-5__group-2`), content not captured

**Recipe**

```html
<div class="c-card-5-scope">
  <div class="c-card-5">
    <div class="c-card-5__group">
      <div class="c-card-5__group-2"></div>
    </div>
  </div>
</div>
```

```css
.c-card-5-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-5 {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  white-space: nowrap;
}

.c-card-5__group {
  display: flex;
  height: 500px;
  transform: matrix(1, 0, 0, 1, 140, 0);
  margin-right: 20px;
}

.c-card-5__group-2 {
  display: flex;
  justify-content: center;
  width: 480px;
  height: 500px;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #FFFFFF;
  border-radius: 18px;
  box-shadow: #00000014 2px 4px 12px 0px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.5, 1);
}
```

**States**

- No hover or focus change was observed.

### Carousel section

**Verification**: not verifiable, what the page placed in it (photos, media, ads) covers most of it and nothing else differs, so the comparison could not be judged.

**Anatomy**

- Group: 6 instances in a 1-column grid; the recipe carries the values they all share
- `carousel-section`: the component root, a `<div>` (`.c-carousel-section`)
- `carousel-section-group`: inner block (`.c-carousel-section__group`)
- `carousel-section-group-2`: inner block (`.c-carousel-section__group-2`)
- `carousel-section-title`: heading, 11 characters (`.c-carousel-section__title`)
- `carousel-section-text`: label text, 15 characters (`.c-carousel-section__text`)
- `carousel-section-group-3`: inner block (`.c-carousel-section__group-3`)
- `carousel-section-group-4`: inner block (`.c-carousel-section__group-4`), content not captured
- `carousel-section-group-5`: inner flex row (`.c-carousel-section__group-5`), content not captured

**Recipe**

```html
<div class="c-carousel-section-scope">
  <div class="c-carousel-section">
    <div class="c-carousel-section__group">
      <div class="c-carousel-section__group-2">
        <h2 class="c-carousel-section__title">lorem ipsum</h2>
        <span class="c-carousel-section__text">lorem ipsum dol</span>
      </div>
      <div class="c-carousel-section__group-3">
        <div class="c-carousel-section__group-4"></div>
        <div class="c-carousel-section__group-5"></div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-carousel-section-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-carousel-section {
  display: block;
  border-spacing: 0px;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  padding-bottom: 46px;
}

.c-carousel-section__group {
  display: block;
}

.c-carousel-section__group-2 {
  display: block;
  padding-bottom: 8px;
  margin-left: 140px;
}

.c-carousel-section__title {
  display: inline;
  margin: 0px;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
}

.c-carousel-section__text {
  display: inline;
  color: #6E6E73;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  margin-top: 22.4px;
}

.c-carousel-section__group-3 {
  display: block;
  position: relative;
}

.c-carousel-section__group-4 {
  display: block;
  height: 500px;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-bottom: 38px;
}

.c-carousel-section__group-5 {
  display: flex;
  justify-content: center;
  list-style-type: none;
}
```

**States**

- No hover or focus change was observed.

### Text link

**Verification**: flagged, the `text-link` height did not reproduce the measured 96px after 2 correction attempts.

**Anatomy**

- `text-link`: the component root, a `<a>` (`.c-text-link`)
- `text-link-badge`: label text, 19 characters (`.c-text-link__badge`)
- `text-link-break`: line break (`.c-text-link__break`)
- `text-link-text`: label text, 54 characters (`.c-text-link__text`, 2 instances)
- `text-link-group`: inner group (`.c-text-link__group`)
- `text-link-group-2`: inner group (`.c-text-link__group-2`)
- `text-link-text-2`: label text, 8 characters (`.c-text-link__text-2`)

**Recipe**

```html
<div class="c-text-link-scope">
  <a class="c-text-link" href="#">
    <span class="c-text-link__badge">lorem ipsum dolor s</span>
    <br class="c-text-link__break">
    <span class="c-text-link__text">lorem ipsum dolor sit amet consectetur adipiscing elit</span>
    <span class="c-text-link__group">
      <sup class="c-text-link__group-2">
        <span class="c-text-link__text-2">lorem ip</span>
        <span class="c-text-link__text">l</span>
      </sup>
    </span>
  </a>
</div>
```

```css
.c-text-link-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

.c-text-link {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
}

.c-text-link__badge {
  display: inline-block;
  background-image: linear-gradient(108deg, #0079D0 0px, #9E52D8 32%, #DA365C 84%, #D04901 100%);
  background-clip: text;
}

.c-text-link__group {
  display: inline;
}

.c-text-link__group-2 {
  display: inline;
  position: relative;
}

.c-text-link__text-2 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-text-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- focus: outline 2px solid #0071E3, outline-offset 1px

### Text link (2)

**Verification**: flagged, the `text-link-2-group-3` y did not reproduce the measured 66px after 2 correction attempts.

**Anatomy**

- `text-link-2`: the component root, a `<a>` (`.c-text-link-2`)
- `text-link-2-group`: inner block (`.c-text-link-2__group`)
- `text-link-2-text`: label text, 55 characters (`.c-text-link-2__text`, 2 instances)
- `text-link-2-group-2`: inner group (`.c-text-link-2__group-2`)
- `text-link-2-group-3`: inner group (`.c-text-link-2__group-3`)
- `text-link-2-text-2`: label text, 8 characters (`.c-text-link-2__text-2`)

**Recipe**

```html
<div class="c-text-link-2-scope">
  <a class="c-text-link-2" href="#">
    <div class="c-text-link-2__group">
      <span class="c-text-link-2__text">lorem ipsum dolor sit amet consectetur adipiscing elit</span>
      <span class="c-text-link-2__group-2">
        <sup class="c-text-link-2__group-3">
          <span class="c-text-link-2__text-2">lorem ip</span>
          <span class="c-text-link-2__text">l</span>
        </sup>
      </span>
    </div>
  </a>
</div>
```

```css
.c-text-link-2-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

.c-text-link-2 {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
}

.c-text-link-2__group {
  display: block;
  margin-right: 10%;
}

.c-text-link-2__group-2 {
  display: inline;
}

.c-text-link-2__group-3 {
  display: inline;
  position: relative;
  top: -8.4px;
  font-size: 16.8px;
  line-height: 19.2px;
}

.c-text-link-2__text-2 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-text-link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- focus: outline 2px solid #0071E3, outline-offset 1px

### Text link (3)

**Verification**: flagged, the render matched 35% of the original pixels, below the 96% required on focus after 2 correction attempts.

**Anatomy**

- `text-link-3`: the component root, a `<a>` (`.c-text-link-3`), 19-character label

**Recipe**

```html
<div class="c-text-link-3-scope">
  <a class="c-text-link-3" href="#">lorem ipsum dolor s</a>
</div>
```

```css
.c-text-link-3-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

.c-text-link-3 {
  display: inline;
  border-spacing: 0px;
  color: #1D1D1F;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
  text-align: center;
}

.c-text-link-3:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- focus: outline 2px solid #0071E3, outline-offset 1px

### Link list

**Verification**: flagged, the `link-list-list` width did not reproduce the measured 176px after 2 correction attempts.

**Anatomy**

- `link-list`: the component root, a `<nav>` (`.c-link-list`), content not captured
- `link-list-group`: inner block (`.c-link-list__group`, 2 instances)
- `link-list-group-2`: inner block (`.c-link-list__group-2`, 2 instances)
- `link-list-title`: heading, 0 characters (`.c-link-list__title`, 4 instances)
- `link-list-text`: label text, 14 characters (`.c-link-list__text`, 4 instances)
- `link-list-list`: inner group (`.c-link-list__list`, 4 instances), content not captured
- `link-list-item`: inner group (`.c-link-list__item`, 18 instances), content not captured
- `link-list-item-2`: inner group (`.c-link-list__item-2`, 3 instances), content not captured
- `link-list-group-3`: inner block (`.c-link-list__group-3`, 2 instances)

**Recipe**

```html
<div class="c-link-list-scope">
  <nav class="c-link-list">
    <div class="c-link-list__group">
      <div class="c-link-list__group-2">
        <h3 class="c-link-list__title">
          <span class="c-link-list__text">lorem ipsum do</span>
        </h3>
        <ul class="c-link-list__list">
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item-2"></li>
        </ul>
      </div>
      <div class="c-link-list__group-3">
        <h3 class="c-link-list__title">
          <span class="c-link-list__text">lorem ipsum</span>
        </h3>
        <ul class="c-link-list__list">
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item-2"></li>
        </ul>
      </div>
    </div>
    <div class="c-link-list__group">
      <div class="c-link-list__group-2">
        <h3 class="c-link-list__title">
          <span class="c-link-list__text">lorem i</span>
        </h3>
        <ul class="c-link-list__list">
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item-2"></li>
        </ul>
      </div>
      <div class="c-link-list__group-3">
        <h3 class="c-link-list__title">
          <span class="c-link-list__text">lorem ipsum d</span>
        </h3>
        <ul class="c-link-list__list">
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
          <li class="c-link-list__item"></li>
        </ul>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-link-list-scope {
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
}

.c-link-list {
  display: flex;
  border-spacing: 0px;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-link-list__group {
  display: block;
  flex-basis: 25%;
}

.c-link-list__group-2 {
  display: block;
}

.c-link-list__title {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-link-list__text {
  display: block;
  font-size: 12px;
  line-height: 16.0005px;
  margin-right: 20px;
  margin-bottom: 9.6px;
}

.c-link-list__list {
  display: block;
  padding: 0px;
  margin: 0px 20px 0px 0px;
  list-style-type: none;
}

.c-link-list__item {
  display: block;
  margin-bottom: 9.6px;
}

.c-link-list__item-2 {
  display: block;
}

.c-link-list__group-3 {
  display: block;
  padding-top: 24px;
}
```

**States**

- No hover or focus change was observed.

### Tab bar

**Verification**: flagged, the `tab-bar-group` y did not reproduce the measured 12px after 2 correction attempts.

**Anatomy**

- `tab-bar`: the component root, a `<div>` (`.c-tab-bar`)
- `tab-bar-group`: inner block (`.c-tab-bar__group`)
- `tab-bar-group-2`: inner block (`.c-tab-bar__group-2`)
- `tab-bar-group-3`: inner block (`.c-tab-bar__group-3`, 8 instances)
- `tab-bar-group-4`: inner block (`.c-tab-bar__group-4`, 8 instances), content not captured

**Recipe**

```html
<div class="c-tab-bar-scope">
  <div class="c-tab-bar">
    <div class="c-tab-bar__group">
      <div class="c-tab-bar__group-2">
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
        <div class="c-tab-bar__group-3">
          <div class="c-tab-bar__group-4"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-tab-bar-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-tab-bar {
  display: flex;
  align-items: center;
  border-spacing: 0px;
  max-width: 1300px;
  position: relative;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-tab-bar__group {
  display: block;
  position: relative;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 1px;
}

.c-tab-bar__group-2 {
  display: block;
}

.c-tab-bar__group-3 {
  display: inline-block;
}

.c-tab-bar__group-4 {
  display: block;
  margin: 5px 35px 5px 5px;
  color: #F5F5F7;
}
```

**States**

- No hover or focus change was observed.

### Navigation menu item

**Verification**: verified against the live page at desktop.

**Anatomy**

- `navigation-menu-item`: the component root, a `<button>` (`.c-navigation-menu-item`)

**Recipe**

```html
<div class="c-navigation-menu-item-scope">
  <button class="c-navigation-menu-item" type="button"></button>
</div>
```

```css
.c-navigation-menu-item-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-navigation-menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  width: 22px;
  padding: 0px;
  position: absolute;
  top: 0px;
  right: -7px;
  background-color: transparent;
  color: #000000CC;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  list-style-type: none;
}

.c-navigation-menu-item:focus {
  z-index: 1;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- focus: z-index 1, outline 2px solid #0071E3, outline-offset -7px

### Header (inner, 2)

**Verification**: desktop flagged, the `header-inner-2-group` x did not reproduce the measured 1146px after 2 correction attempts; mobile flagged, the `header-inner-2-mobile-nav-link-2` x did not reproduce the measured 246px after 2 correction attempts.

Variant observed on https://www.apple.com/us/shop/goto/buy_mac.

**Anatomy**

- `header-inner-2`: the component root, a `<nav>` (`.c-header-inner-2`)
- `header-inner-2-inner`: inner block (`.c-header-inner-2__inner`)
- `header-inner-2-nav`: inner flex row (`.c-header-inner-2__nav`)
- `header-inner-2-nav-item`: inner group (`.c-header-inner-2__nav-item`)
- `header-inner-2-nav-link`: link (`.c-header-inner-2__nav-link`)
- `header-inner-2-group`: inner flex row (`.c-header-inner-2__group`, 3 instances)
- `header-inner-2-icon`: icon placeholder, 14x44px (`.c-header-inner-2__icon`, 2 instances)
- `header-inner-2-text`: label text, 5 characters (`.c-header-inner-2__text`)
- `header-inner-2-nav-link-2`: link (`.c-header-inner-2__nav-link-2`)
- `header-inner-2-icon-2`: icon placeholder, 15x44px (`.c-header-inner-2__icon-2`)
- `header-inner-2-group-2`: inner block (`.c-header-inner-2__group-2`)
- `header-inner-2-nav-link-3`: link (`.c-header-inner-2__nav-link-3`)
- `header-inner-2-group-3`: inner group (`.c-header-inner-2__group-3`)
- `header-inner-2-group-4`: inner group (`.c-header-inner-2__group-4`)
- `header-inner-2-text-2`: label text, 1 characters (`.c-header-inner-2__text-2`)

**Desktop recipe**

```html
<div class="c-header-inner-2-scope">
  <nav class="c-header-inner-2">
    <div class="c-header-inner-2__inner">
      <ul class="c-header-inner-2__nav">
        <li class="c-header-inner-2__nav-item">
          <a class="c-header-inner-2__nav-link" href="#">
            <span class="c-header-inner-2__group">
              <span class="c-header-inner-2__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner-2__text">lorem</span>
          </a>
        </li>
        <a class="c-header-inner-2__nav-link-2" href="#">
          <span class="c-header-inner-2__group">
            <span class="c-header-inner-2__icon-2" aria-hidden="true"></span>
          </span>
        </a>
        <div class="c-header-inner-2__group-2">
          <a class="c-header-inner-2__nav-link-3" href="#">
            <span class="c-header-inner-2__group">
              <span class="c-header-inner-2__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner-2__group-3">
              <span class="c-header-inner-2__group-4"></span>
              <span class="c-header-inner-2__text-2">l</span>
            </span>
          </a>
        </div>
      </ul>
    </div>
  </nav>
</div>
```

```css
.c-header-inner-2-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-inner-2 {
  display: block;
  border-spacing: 0px;
  height: 48px;
  min-width: 320px;
  max-height: 44px;
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 9999;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-inner-2__inner {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 1024px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-2__nav {
  display: flex;
  justify-content: space-between;
  height: 44px;
  padding: 0px;
  margin: 0px -8px;
  cursor: default;
  list-style-type: none;
}

.c-header-inner-2__nav-item {
  display: block;
  box-sizing: border-box;
  height: 44px;
}

.c-header-inner-2__nav-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-weight: 600;
  line-height: 21.0012px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-inner-2__group {
  display: flex;
}

.c-header-inner-2__icon {
  display: block;
  flex-shrink: 0;
  width: 14px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-inner-2__text {
  display: flex;
  align-items: center;
  width: 1px;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  margin-left: 4px;
}

.c-header-inner-2__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-inner-2__icon-2 {
  display: block;
  flex-shrink: 0;
  width: 15px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-inner-2__group-2 {
  display: block;
  position: relative;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-2__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  z-index: 1;
  color: #000000CC;
  cursor: pointer;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-header-inner-2__group-3 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 11px;
  left: 15px;
  z-index: 1;
  color: #FFFFFF;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-header-inner-2__group-3::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-2__group-3::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
}

.c-header-inner-2__group-4 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #000000;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-2__text-2 {
  display: block;
  position: relative;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-2__nav-link:hover {
  color: #000000;
}

.c-header-inner-2__nav-link:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-2__nav-link-2:hover {
  color: #000000;
}

.c-header-inner-2__nav-link-2:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-2__nav-link-3:hover {
  color: #000000;
}

.c-header-inner-2__nav-link-3:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**Mobile anatomy**

- `header-inner-2-mobile`: the component root, a `<nav>` (`.c-header-inner-2-mobile`)
- `header-inner-2-mobile-inner`: inner flex row (`.c-header-inner-2-mobile__inner`)
- `header-inner-2-mobile-nav`: inner flex row (`.c-header-inner-2-mobile__nav`)
- `header-inner-2-mobile-nav-item`: inner group (`.c-header-inner-2-mobile__nav-item`)
- `header-inner-2-mobile-nav-link`: link (`.c-header-inner-2-mobile__nav-link`)
- `header-inner-2-mobile-group`: inner flex row (`.c-header-inner-2-mobile__group`, 3 instances)
- `header-inner-2-mobile-icon`: icon placeholder, 17x48px (`.c-header-inner-2-mobile__icon`, 3 instances)
- `header-inner-2-mobile-text`: label text, 5 characters (`.c-header-inner-2-mobile__text`)
- `header-inner-2-mobile-nav-item-2`: inner group (`.c-header-inner-2-mobile__nav-item-2`)
- `header-inner-2-mobile-nav-link-2`: link (`.c-header-inner-2-mobile__nav-link-2`)
- `header-inner-2-mobile-group-2`: inner block (`.c-header-inner-2-mobile__group-2`)
- `header-inner-2-mobile-nav-link-3`: link (`.c-header-inner-2-mobile__nav-link-3`)
- `header-inner-2-mobile-group-3`: inner group (`.c-header-inner-2-mobile__group-3`)
- `header-inner-2-mobile-group-4`: inner group (`.c-header-inner-2-mobile__group-4`)
- `header-inner-2-mobile-text-2`: label text, 1 characters (`.c-header-inner-2-mobile__text-2`)
- `header-inner-2-mobile-group-5`: inner block (`.c-header-inner-2-mobile__group-5`)
- `header-inner-2-mobile-menu-toggle`: button (`.c-header-inner-2-mobile__menu-toggle`)
- `header-inner-2-mobile-menu-toggle-icon`: icon placeholder, 18px (`.c-header-inner-2-mobile__menu-toggle-icon`)

**Mobile recipe**

```html
<div class="c-header-inner-2-mobile-scope">
  <nav class="c-header-inner-2-mobile">
    <div class="c-header-inner-2-mobile__inner">
      <ul class="c-header-inner-2-mobile__nav">
        <li class="c-header-inner-2-mobile__nav-item">
          <a class="c-header-inner-2-mobile__nav-link" href="#">
            <span class="c-header-inner-2-mobile__group">
              <span class="c-header-inner-2-mobile__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner-2-mobile__text">lorem</span>
          </a>
        </li>
        <li class="c-header-inner-2-mobile__nav-item-2">
          <a class="c-header-inner-2-mobile__nav-link-2" href="#">
            <span class="c-header-inner-2-mobile__group">
              <span class="c-header-inner-2-mobile__icon" aria-hidden="true"></span>
            </span>
          </a>
        </li>
        <div class="c-header-inner-2-mobile__group-2">
          <a class="c-header-inner-2-mobile__nav-link-3" href="#">
            <span class="c-header-inner-2-mobile__group">
              <span class="c-header-inner-2-mobile__icon" aria-hidden="true"></span>
            </span>
            <span class="c-header-inner-2-mobile__group-3">
              <span class="c-header-inner-2-mobile__group-4"></span>
              <span class="c-header-inner-2-mobile__text-2">l</span>
            </span>
          </a>
        </div>
      </ul>
      <div class="c-header-inner-2-mobile__group-5">
        <button class="c-header-inner-2-mobile__menu-toggle" type="button">
          <span class="c-header-inner-2-mobile__menu-toggle-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-header-inner-2-mobile-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-inner-2-mobile {
  display: block;
  border-spacing: 0px;
  height: 48px;
  min-width: 320px;
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 9999;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-inner-2-mobile__inner {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: 1024px;
  position: absolute;
  top: 0px;
  z-index: 2;
  transition: background 0.422s cubic-bezier(0.4, 0, 0.6, 1);
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-2-mobile__nav {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  padding: 0px 48px 0px 0px;
  margin: 0px;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  cursor: default;
  list-style-type: none;
}

.c-header-inner-2-mobile__nav-item {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  width: 48px;
  height: 100%;
  text-align: left;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
}

.c-header-inner-2-mobile__nav-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 48px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 23px;
  letter-spacing: 0.228px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 16px;
  padding-left: 16px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-2-mobile__group {
  display: flex;
}

.c-header-inner-2-mobile__icon {
  display: block;
  flex-shrink: 0;
  width: 17px;
  height: 48px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-header-inner-2-mobile__text {
  display: flex;
  align-items: center;
  width: 1px;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  margin-left: 4px;
}

.c-header-inner-2-mobile__nav-item-2 {
  display: list-item;
  box-sizing: border-box;
  width: 48px;
  height: 100%;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
}

.c-header-inner-2-mobile__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 8px;
  padding-left: 8px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-2-mobile__group-2 {
  display: block;
  position: relative;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-2-mobile__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  position: relative;
  z-index: 1;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 8px;
  padding-left: 8px;
  transition-duration: 0.24s, 0.24s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), steps(1, start);
  transition-property: opacity, visibility;
}

.c-header-inner-2-mobile__group-3 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 13px;
  left: 22px;
  z-index: 1;
  color: #FFFFFF;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-header-inner-2-mobile__group-3::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-2-mobile__group-3::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
}

.c-header-inner-2-mobile__group-4 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #000000;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-2-mobile__text-2 {
  display: block;
  position: relative;
  z-index: 2;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-header-inner-2-mobile__group-5 {
  display: block;
  width: 48px;
  position: absolute;
  right: 0px;
  z-index: 3;
}

.c-header-inner-2-mobile__menu-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  padding: 0px;
  position: relative;
  background-color: transparent;
  color: #000000;
  border: 0;
  opacity: 0.8;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.32s, 0.32s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1), cubic-bezier(0.4, 0, 0.6, 1);
  transition-property: opacity, color;
}

.c-header-inner-2-mobile__menu-toggle-icon {
  display: block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner-2-mobile__nav-link:hover {
  color: #000000;
}

.c-header-inner-2-mobile__nav-link:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-2-mobile__nav-link-2:hover {
  color: #000000;
}

.c-header-inner-2-mobile__nav-link-2:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-2-mobile__nav-link-3:hover {
  color: #000000;
}

.c-header-inner-2-mobile__nav-link-3:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}

.c-header-inner-2-mobile__menu-toggle:hover {
  opacity: 1;
}

.c-header-inner-2-mobile__menu-toggle:focus {
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- `header-inner-2-nav-link` hover (`header-inner-2-nav-link-hover`): color #000000
- `header-inner-2-nav-link` focus (`header-inner-2-nav-link-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- `header-inner-2-nav-link-2` hover (`header-inner-2-nav-link-2-hover`): color #000000
- `header-inner-2-nav-link-2` focus (`header-inner-2-nav-link-2-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- `header-inner-2-nav-link-3` hover (`header-inner-2-nav-link-3-hover`): color #000000
- `header-inner-2-nav-link-3` focus (`header-inner-2-nav-link-3-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-2-mobile-nav-link` hover (`header-inner-2-mobile-nav-link-hover`): color #000000
- mobile, `header-inner-2-mobile-nav-link` focus (`header-inner-2-mobile-nav-link-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-2-mobile-nav-link-2` hover (`header-inner-2-mobile-nav-link-2-hover`): color #000000
- mobile, `header-inner-2-mobile-nav-link-2` focus (`header-inner-2-mobile-nav-link-2-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-2-mobile-nav-link-3` hover (`header-inner-2-mobile-nav-link-3-hover`): color #000000
- mobile, `header-inner-2-mobile-nav-link-3` focus (`header-inner-2-mobile-nav-link-3-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px
- mobile, `header-inner-2-mobile-menu-toggle` hover: opacity 1
- mobile, `header-inner-2-mobile-menu-toggle` focus: outline 2px solid #0071E3, outline-offset -7px

### Footer (inner, 2)

**Verification**: desktop flagged, the `footer-inner-2-inner` height did not reproduce the measured 2174px after 2 correction attempts; mobile flagged, the `footer-inner-2-mobile-inner` height did not reproduce the measured 4222px after 2 correction attempts.

Variant observed on https://www.apple.com/us/shop/goto/buy_mac.

**Anatomy**

- `footer-inner-2`: the component root, a `<footer>` (`.c-footer-inner-2`)
- `footer-inner-2-inner`: inner block (`.c-footer-inner-2__inner`), content not captured
- `footer-inner-2-heading`: heading, 6 characters (`.c-footer-inner-2__heading`)
- `footer-inner-2-heading-2`: heading, 9 characters (`.c-footer-inner-2__heading-2`)
- `footer-inner-2-group`: inner block (`.c-footer-inner-2__group`)
- `footer-inner-2-group-2`: inner block (`.c-footer-inner-2__group-2`, 3 instances)
- `footer-inner-2-group-3`: inner block (`.c-footer-inner-2__group-3`)
- `footer-inner-2-list`: inner group (`.c-footer-inner-2__list`)
- `footer-inner-2-item`: inner group (`.c-footer-inner-2__item`, 9 instances)
- `footer-inner-2-text`: label text, 8 characters (`.c-footer-inner-2__text`, 11 instances)
- `footer-inner-2-text-2`: label text, 0 characters (`.c-footer-inner-2__text-2`, 6 instances), content not captured
- `footer-inner-2-text-3`: label text, 823 characters (`.c-footer-inner-2__text-3`, 13 instances)
- `footer-inner-2-item-2`: inner flex row (`.c-footer-inner-2__item-2`, 2 instances)
- `footer-inner-2-text-4`: label text, 2 characters (`.c-footer-inner-2__text-4`, 2 instances)
- `footer-inner-2-text-5`: label text, 0 characters (`.c-footer-inner-2__text-5`, 2 instances), content not captured
- `footer-inner-2-text-6`: label text, 162 characters (`.c-footer-inner-2__text-6`)
- `footer-inner-2-nav`: inner group (`.c-footer-inner-2__nav`)
- `footer-inner-2-nav-link`: link (`.c-footer-inner-2__nav-link`)
- `footer-inner-2-group-4`: inner group (`.c-footer-inner-2__group-4`)
- `footer-inner-2-group-5`: inner block (`.c-footer-inner-2__group-5`)
- `footer-inner-2-list-2`: inner group (`.c-footer-inner-2__list-2`)
- `footer-inner-2-nav-item`: label text, 18 characters (`.c-footer-inner-2__nav-item`, 2 instances)
- `footer-inner-2-nav-2`: inner flex row (`.c-footer-inner-2__nav-2`), content not captured
- `footer-inner-2-group-6`: inner block (`.c-footer-inner-2__group-6`, 2 instances)
- `footer-inner-2-heading-3`: heading, 0 characters (`.c-footer-inner-2__heading-3`, 4 instances)
- `footer-inner-2-text-7`: label text, 14 characters (`.c-footer-inner-2__text-7`, 4 instances)
- `footer-inner-2-list-3`: inner group (`.c-footer-inner-2__list-3`, 4 instances), content not captured
- `footer-inner-2-nav-item-2`: inner group (`.c-footer-inner-2__nav-item-2`, 20 instances)
- `footer-inner-2-nav-link-2`: link, 5-character label (`.c-footer-inner-2__nav-link-2`, 23 instances)
- `footer-inner-2-nav-item-3`: inner group (`.c-footer-inner-2__nav-item-3`, 3 instances)
- `footer-inner-2-group-7`: inner block (`.c-footer-inner-2__group-7`, 2 instances)

**Desktop recipe**

```html
<div class="c-footer-inner-2-scope">
  <footer class="c-footer-inner-2">
    <div class="c-footer-inner-2__inner">
      <h2 class="c-footer-inner-2__heading">lorem</h2>
      <h3 class="c-footer-inner-2__heading-2">lorem ips</h3>
      <div class="c-footer-inner-2__group">
        <div class="c-footer-inner-2__group-2">
          <div class="c-footer-inner-2__group-3">
            <ul class="c-footer-inner-2__list">
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-2">
                  <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
                  <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet conse</span>
                </span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-2">l</span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-2">l</span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tem</span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusm</span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-2">
                  <span class="c-footer-inner-2__text-3">l</span>
                  <span class="c-footer-inner-2__text-3">lor</span>
                  <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit</span>
                </span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmo</span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
              </li>
              <li class="c-footer-inner-2__item-2">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-4">lo</span>
                <span class="c-footer-inner-2__text-5">
                  <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor</span>
                  <span class="c-footer-inner-2__text-3">l</span>
                </span>
              </li>
              <li class="c-footer-inner-2__item-2">
                <span class="c-footer-inner-2__text">lorem ip</span>
                <span class="c-footer-inner-2__text-4">lo</span>
                <span class="c-footer-inner-2__text-5">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur</span>
              </li>
              <li class="c-footer-inner-2__item">
                <span class="c-footer-inner-2__text-2">
                  <span class="c-footer-inner-2__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur a</span>
                  <span class="c-footer-inner-2__text-3">lorem</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <p class="c-footer-inner-2__text-6">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</p>
      </div>
      <nav class="c-footer-inner-2__nav">
        <a class="c-footer-inner-2__nav-link" href="#">
          <span class="c-footer-inner-2__group-4"></span>
          <span class="c-footer-inner-2__text">lorem</span>
        </a>
        <div class="c-footer-inner-2__group-5">
          <ol class="c-footer-inner-2__list-2">
            <li class="c-footer-inner-2__nav-item">lorem ipsum dolor</li>
            <li class="c-footer-inner-2__nav-item">
              <span class="c-footer-inner-2__text-2">lorem ip</span>
            </li>
          </ol>
        </div>
      </nav>
      <nav class="c-footer-inner-2__nav-2">
        <div class="c-footer-inner-2__group-6">
          <div class="c-footer-inner-2__group-2">
            <h3 class="c-footer-inner-2__heading-3">
              <span class="c-footer-inner-2__text-7">lorem ipsum do</span>
            </h3>
            <ul class="c-footer-inner-2__list-3">
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lor</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lore</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem i</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-2__nav-item-3">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-inner-2__group-7">
            <h3 class="c-footer-inner-2__heading-3">
              <span class="c-footer-inner-2__text-7">lorem ipsum</span>
            </h3>
            <ul class="c-footer-inner-2__list-3">
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-2__nav-item-3">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-footer-inner-2__group-6">
          <div class="c-footer-inner-2__group-2">
            <h3 class="c-footer-inner-2__heading-3">
              <span class="c-footer-inner-2__text-7">lorem i</span>
            </h3>
            <ul class="c-footer-inner-2__list-3">
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsum dolor sit ame</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsum dolor s</a>
              </li>
              <li class="c-footer-inner-2__nav-item-3">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-inner-2__group-7">
            <h3 class="c-footer-inner-2__heading-3">
              <span class="c-footer-inner-2__text-7">lorem ipsum d</span>
            </h3>
            <ul class="c-footer-inner-2__list-3">
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ip</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-2__nav-item-2">
                <a class="c-footer-inner-2__nav-link-2" href="#">lorem ipsum do</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-2-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner-2 {
  display: block;
  border-spacing: 0px;
  min-width: 1024px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner-2__inner {
  display: block;
  max-width: 980px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-2__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner-2__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-2__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-2__group-2 {
  display: block;
}

.c-footer-inner-2__group-3 {
  display: block;
  color: #6E6E73;
}

.c-footer-inner-2__list {
  display: block;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-2__item {
  display: list-item;
  padding-bottom: 9.6px;
}

.c-footer-inner-2__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner-2__text-2 {
  display: inline;
}

.c-footer-inner-2__item-2 {
  display: flex;
  padding-bottom: 9.6px;
}

.c-footer-inner-2__text-4 {
  display: block;
  width: 20px;
  white-space: pre-wrap;
}

.c-footer-inner-2__text-5 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
}

.c-footer-inner-2__text-6 {
  display: block;
  margin: 0px;
}

.c-footer-inner-2__nav {
  display: block;
  position: relative;
  z-index: 1;
  color: #000000B8;
  padding-top: 17px;
  padding-bottom: 17px;
}

.c-footer-inner-2__nav::before {
  content: "";
  display: table;
}

.c-footer-inner-2__nav::after {
  content: "";
  display: table;
}

.c-footer-inner-2__nav-link {
  display: block;
  position: absolute;
  top: 17px;
  left: 0px;
  z-index: 2;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-2__group-4 {
  display: block;
  width: 14px;
  height: 18px;
  position: relative;
  z-index: 2;
  background-color: #000000B8;
  color: transparent;
}

.c-footer-inner-2__group-5 {
  display: block;
  position: relative;
  z-index: 1;
}

.c-footer-inner-2__group-5::before {
  content: "";
  display: table;
}

.c-footer-inner-2__group-5::after {
  content: "";
  display: table;
}

.c-footer-inner-2__list-2 {
  display: block;
  max-height: 9999px;
  padding: 0px 0px 0px 25px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-2__nav-item {
  display: list-item;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 3px;
  padding-right: 4px;
  padding-bottom: 3px;
  margin-right: 7px;
}

.c-footer-inner-2__nav-item::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 11px;
  vertical-align: middle;
  background-color: #0000007A;
  margin-top: -1px;
  margin-right: 11px;
}

.c-footer-inner-2__nav-2 {
  display: flex;
}

.c-footer-inner-2__group-6 {
  display: block;
  flex-basis: 25%;
}

.c-footer-inner-2__heading-3 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-2__text-7 {
  display: block;
  font-size: 12px;
  line-height: 16.0005px;
  margin-right: 20px;
  margin-bottom: 9.6px;
}

.c-footer-inner-2__list-3 {
  display: block;
  padding: 0px;
  margin: 0px 20px 0px 0px;
  list-style-type: none;
}

.c-footer-inner-2__nav-item-2 {
  display: block;
  margin-bottom: 9.6px;
}

.c-footer-inner-2__nav-link-2 {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-2__nav-item-3 {
  display: block;
}

.c-footer-inner-2__group-7 {
  display: block;
  padding-top: 24px;
}

.c-footer-inner-2__nav-link:hover {
  text-decoration-line: underline;
}

.c-footer-inner-2__nav-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-2__nav-link-2:hover {
  text-decoration-line: underline;
}

.c-footer-inner-2__nav-link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**Mobile anatomy**

- `footer-inner-2-mobile`: the component root, a `<footer>` (`.c-footer-inner-2-mobile`)
- `footer-inner-2-mobile-inner`: inner block (`.c-footer-inner-2-mobile__inner`), content not captured
- `footer-inner-2-mobile-heading`: heading, 6 characters (`.c-footer-inner-2-mobile__heading`)
- `footer-inner-2-mobile-heading-2`: heading, 9 characters (`.c-footer-inner-2-mobile__heading-2`)
- `footer-inner-2-mobile-group`: inner block (`.c-footer-inner-2-mobile__group`)
- `footer-inner-2-mobile-group-2`: inner block (`.c-footer-inner-2-mobile__group-2`, 6 instances), content not captured
- `footer-inner-2-mobile-group-3`: inner block (`.c-footer-inner-2-mobile__group-3`)
- `footer-inner-2-mobile-list`: inner group (`.c-footer-inner-2-mobile__list`)
- `footer-inner-2-mobile-item`: inner group (`.c-footer-inner-2-mobile__item`, 9 instances)
- `footer-inner-2-mobile-text`: label text, 8 characters (`.c-footer-inner-2-mobile__text`, 11 instances)
- `footer-inner-2-mobile-text-2`: label text, 0 characters (`.c-footer-inner-2-mobile__text-2`, 5 instances), content not captured
- `footer-inner-2-mobile-text-3`: label text, 823 characters (`.c-footer-inner-2-mobile__text-3`, 23 instances)
- `footer-inner-2-mobile-item-2`: inner flex row (`.c-footer-inner-2-mobile__item-2`, 2 instances)
- `footer-inner-2-mobile-text-4`: label text, 2 characters (`.c-footer-inner-2-mobile__text-4`, 2 instances)
- `footer-inner-2-mobile-text-5`: label text, 0 characters (`.c-footer-inner-2-mobile__text-5`, 2 instances), content not captured
- `footer-inner-2-mobile-text-6`: label text, 162 characters (`.c-footer-inner-2-mobile__text-6`)
- `footer-inner-2-mobile-nav`: inner group (`.c-footer-inner-2-mobile__nav`)
- `footer-inner-2-mobile-nav-link`: link (`.c-footer-inner-2-mobile__nav-link`)
- `footer-inner-2-mobile-group-4`: inner group (`.c-footer-inner-2-mobile__group-4`)
- `footer-inner-2-mobile-group-5`: inner block (`.c-footer-inner-2-mobile__group-5`)
- `footer-inner-2-mobile-list-2`: inner group (`.c-footer-inner-2-mobile__list-2`)
- `footer-inner-2-mobile-nav-item`: label text, 18 characters (`.c-footer-inner-2-mobile__nav-item`, 2 instances)
- `footer-inner-2-mobile-nav-2`: inner flex column (`.c-footer-inner-2-mobile__nav-2`)
- `footer-inner-2-mobile-group-6`: inner block (`.c-footer-inner-2-mobile__group-6`, 10 instances)
- `footer-inner-2-mobile-heading-3`: heading, 0 characters (`.c-footer-inner-2-mobile__heading-3`, 10 instances)
- `footer-inner-2-mobile-button`: button (`.c-footer-inner-2-mobile__button`, 10 instances)
- `footer-inner-2-mobile-group-7`: inner flex row (`.c-footer-inner-2-mobile__group-7`, 10 instances), content not captured
- `footer-inner-2-mobile-icon`: icon placeholder, 11x6px (`.c-footer-inner-2-mobile__icon`, 9 instances)

**Mobile recipe**

```html
<div class="c-footer-inner-2-mobile-scope">
  <footer class="c-footer-inner-2-mobile">
    <div class="c-footer-inner-2-mobile__inner">
      <h2 class="c-footer-inner-2-mobile__heading">lorem</h2>
      <h3 class="c-footer-inner-2-mobile__heading-2">lorem ips</h3>
      <div class="c-footer-inner-2-mobile__group">
        <div class="c-footer-inner-2-mobile__group-2">
          <div class="c-footer-inner-2-mobile__group-3">
            <ul class="c-footer-inner-2-mobile__list">
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-2">
                  <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
                  <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet conse</span>
                </span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-2">l</span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-2">l</span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tem</span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusm</span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-2">
                  <span class="c-footer-inner-2-mobile__text-3">l</span>
                  <span class="c-footer-inner-2-mobile__text-3">lor</span>
                  <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit</span>
                </span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmo</span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
              </li>
              <li class="c-footer-inner-2-mobile__item-2">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-4">lo</span>
                <span class="c-footer-inner-2-mobile__text-5">
                  <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor</span>
                  <span class="c-footer-inner-2-mobile__text-3">l</span>
                </span>
              </li>
              <li class="c-footer-inner-2-mobile__item-2">
                <span class="c-footer-inner-2-mobile__text">lorem ip</span>
                <span class="c-footer-inner-2-mobile__text-4">lo</span>
                <span class="c-footer-inner-2-mobile__text-5">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur</span>
              </li>
              <li class="c-footer-inner-2-mobile__item">
                <span class="c-footer-inner-2-mobile__text-2">
                  <span class="c-footer-inner-2-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur a</span>
                  <span class="c-footer-inner-2-mobile__text-3">lorem</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <p class="c-footer-inner-2-mobile__text-6">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</p>
      </div>
      <nav class="c-footer-inner-2-mobile__nav">
        <a class="c-footer-inner-2-mobile__nav-link" href="#">
          <span class="c-footer-inner-2-mobile__group-4"></span>
          <span class="c-footer-inner-2-mobile__text">lorem</span>
        </a>
        <div class="c-footer-inner-2-mobile__group-5">
          <ol class="c-footer-inner-2-mobile__list-2">
            <li class="c-footer-inner-2-mobile__nav-item">lorem ipsum dolor</li>
            <li class="c-footer-inner-2-mobile__nav-item">lorem ip</li>
          </ol>
        </div>
      </nav>
      <nav class="c-footer-inner-2-mobile__nav-2">
        <div class="c-footer-inner-2-mobile__group-2">
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum do</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-2-mobile__group-2">
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem i</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum d</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-2-mobile__group-2">
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-2-mobile__group-2">
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum d</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum do</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum do</span>
                <span class="c-footer-inner-2-mobile__group-7">
                  <span class="c-footer-inner-2-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-2-mobile__group-2">
          <div class="c-footer-inner-2-mobile__group-6">
            <h3 class="c-footer-inner-2-mobile__heading-3">
              <button class="c-footer-inner-2-mobile__button" type="button">
                <span class="c-footer-inner-2-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-2-mobile__group-7"></span>
              </button>
            </h3>
          </div>
        </div>
      </nav>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-2-mobile-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner-2-mobile {
  display: block;
  border-spacing: 0px;
  min-width: 320px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner-2-mobile__inner {
  display: block;
  max-width: 980px;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-2-mobile__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner-2-mobile__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-2-mobile__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-2-mobile__group-2 {
  display: block;
}

.c-footer-inner-2-mobile__group-3 {
  display: block;
  color: #6E6E73;
}

.c-footer-inner-2-mobile__list {
  display: block;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-2-mobile__item {
  display: list-item;
  padding-bottom: 9.6px;
}

.c-footer-inner-2-mobile__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner-2-mobile__text-2 {
  display: inline;
}

.c-footer-inner-2-mobile__item-2 {
  display: flex;
  padding-bottom: 9.6px;
}

.c-footer-inner-2-mobile__text-4 {
  display: block;
  width: 20px;
  white-space: pre-wrap;
}

.c-footer-inner-2-mobile__text-5 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
}

.c-footer-inner-2-mobile__text-6 {
  display: block;
  margin: 0px;
}

.c-footer-inner-2-mobile__nav {
  display: block;
  position: relative;
  z-index: 1;
  color: #000000B8;
  padding-top: 17px;
  padding-bottom: 17px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-2-mobile__nav::before {
  content: "";
  display: table;
}

.c-footer-inner-2-mobile__nav::after {
  content: "";
  display: table;
}

.c-footer-inner-2-mobile__nav-link {
  display: block;
  position: absolute;
  top: 17px;
  left: 0px;
  z-index: 2;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-2-mobile__group-4 {
  display: block;
  width: 14px;
  height: 18px;
  position: relative;
  z-index: 2;
  background-color: #000000B8;
  color: transparent;
}

.c-footer-inner-2-mobile__group-5 {
  display: block;
  position: relative;
  z-index: 1;
}

.c-footer-inner-2-mobile__group-5::before {
  content: "";
  display: table;
}

.c-footer-inner-2-mobile__group-5::after {
  content: "";
  display: table;
}

.c-footer-inner-2-mobile__list-2 {
  display: block;
  max-height: 9999px;
  padding: 0px 0px 0px 25px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-2-mobile__nav-item {
  display: list-item;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 3px;
  padding-right: 4px;
  padding-bottom: 3px;
  margin-right: 7px;
}

.c-footer-inner-2-mobile__nav-item::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 11px;
  vertical-align: middle;
  background-color: #0000007A;
  margin-top: -1px;
  margin-right: 11px;
}

.c-footer-inner-2-mobile__nav-2 {
  display: flex;
  flex-direction: column;
}

.c-footer-inner-2-mobile__group-6 {
  display: block;
  box-sizing: border-box;
  width: calc(100% + 8px);
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-right: 4px;
  padding-bottom: 1px;
  padding-left: 4px;
  margin-left: -4px;
}

.c-footer-inner-2-mobile__group-6::after {
  content: "";
  display: block;
  width: 358px;
  height: 1px;
  position: absolute;
  top: 36px;
  right: 4px;
  bottom: 0px;
  left: 4px;
  z-index: 3;
  background-color: #00000029;
}

.c-footer-inner-2-mobile__heading-3 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-2-mobile__button {
  display: block;
  width: 100%;
  padding: 10px 0px;
  position: relative;
  z-index: 2;
  background-color: #F5F5F7;
  color: #000000E0;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  text-transform: none;
  text-align: start;
}

.c-footer-inner-2-mobile__button::after {
  content: "";
  display: block;
  width: 366px;
  height: 36px;
  position: absolute;
  top: 0px;
  right: -4px;
  bottom: 0px;
  left: -4px;
}

.c-footer-inner-2-mobile__group-7 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 11px;
  font-size: 14px;
  line-height: 18.6672px;
  transition: transform 0.3s ease;
  margin-top: 5px;
}

.c-footer-inner-2-mobile__icon {
  display: block;
  flex-shrink: 0;
  width: 11px;
  height: 6px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-inner-2-mobile__nav-link:hover {
  text-decoration-line: underline;
}

.c-footer-inner-2-mobile__nav-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-2-mobile__button:hover {
  color: #000000;
}

.c-footer-inner-2-mobile__button:hover::after {
  color: #000000;
}

.c-footer-inner-2-mobile__button:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-2-mobile__button:focus::after {
  outline: 2px solid #0071E3;
  outline-offset: -2px;
}
```

**States**

- `footer-inner-2-nav-link` hover: text-decoration-line underline
- `footer-inner-2-nav-link` focus: outline 2px solid #0071E3, outline-offset 1px
- `footer-inner-2-nav-link-2` hover: text-decoration-line underline
- `footer-inner-2-nav-link-2` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-2-mobile-nav-link` hover: text-decoration-line underline
- mobile, `footer-inner-2-mobile-nav-link` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-2-mobile-button` hover (`footer-inner-2-mobile-button-hover`): color #000000, ::after color #000000
- mobile, `footer-inner-2-mobile-button` focus: outline 2px solid #0071E3, outline-offset 1px, ::after outline 2px solid #0071E3, ::after outline-offset -2px

### Button, primary (3)

**Verification**: flagged, the `button-primary-3-group` y did not reproduce the measured 9px after 2 correction attempts.

**Anatomy**

- `button-primary-3`: the component root, a `<a>` (`.c-button-primary-3`)
- `button-primary-3-label`: label text, 3 characters (`.c-button-primary-3__label`)
- `button-primary-3-group`: inner group (`.c-button-primary-3__group`)
- `button-primary-3-label-2`: label text, 23 characters (`.c-button-primary-3__label-2`)
- `button-primary-3-group-2`: line break (`.c-button-primary-3__group-2`)
- `button-primary-3-group-3`: line break (`.c-button-primary-3__group-3`)

**Recipe**

```html
<div class="c-button-primary-3-scope">
  <a class="c-button-primary-3" href="#">
    <span class="c-button-primary-3__label">lor</span>
    <span class="c-button-primary-3__group">
      <span class="c-button-primary-3__label-2">lorem ipsum dolor sit a</span>
      <br class="c-button-primary-3__group-2">
      <br class="c-button-primary-3__group-3">
    </span>
  </a>
</div>
```

```css
.c-button-primary-3-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
}

.c-button-primary-3 {
  display: inline-block;
  align-self: flex-end;
  border-spacing: 0px;
  padding: 8px 15px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
  letter-spacing: -0.224px;
  text-decoration-line: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-primary-3__group {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-button-primary-3:hover {
  background-color: #0076DF;
}

.c-button-primary-3:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-primary-3-hover`): background-color #0076DF
- focus: outline 2px solid #0071E3, outline-offset 3px

### Button, ghost (4)

**Verification**: not verifiable, what the page placed in it (photos, media, ads) covers most of it and nothing else differs, so the comparison could not be judged.

**Anatomy**

- `button-ghost-4`: the component root, a `<button>` (`.c-button-ghost-4`)
- `button-ghost-4-image`: image placeholder, 54px (`.c-button-ghost-4__image`)

**Recipe**

```html
<div class="c-button-ghost-4-scope">
  <button class="c-button-ghost-4" type="button">
    <span class="c-button-ghost-4__image" aria-hidden="true"></span>
  </button>
</div>
```

```css
.c-button-ghost-4-scope {
  background-color: #ADD8FF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-ghost-4 {
  display: inline-flex;
  border-spacing: 0px;
  padding: 0px;
  background-color: transparent;
  color: #1D1D1F;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-button-ghost-4__image {
  display: block;
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  aspect-ratio: auto 54 / 54;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
  border-radius: 50%;
}

.c-button-ghost-4:focus {
  padding: 3px;
  border-radius: 50%;
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- focus (`button-ghost-4-focus`): padding 3px, border-radius 50%, outline 2px solid #0071E3, outline-offset 1px

### Card (6)

**Verification**: not verifiable, what the page placed in it (photos, media, ads) covers most of it and nothing else differs, so the comparison could not be judged.

**Anatomy**

- Group: 5 instances in a 1-column grid; the recipe carries the values they all share
- `card-6`: the component root, a `<div>` (`.c-card-6`)
- `card-6-group`: inner block (`.c-card-6__group`)
- `card-6-group-2`: inner block (`.c-card-6__group-2`)
- `card-6-title`: heading, 17 characters (`.c-card-6__title`)
- `card-6-text`: label text, 29 characters (`.c-card-6__text`)
- `card-6-group-3`: inner block (`.c-card-6__group-3`)
- `card-6-group-4`: inner block (`.c-card-6__group-4`), content not captured
- `card-6-group-5`: inner flex row (`.c-card-6__group-5`), content not captured

**Recipe**

```html
<div class="c-card-6-scope">
  <div class="c-card-6">
    <div class="c-card-6__group">
      <div class="c-card-6__group-2">
        <h2 class="c-card-6__title">lorem ipsum dolor</h2>
        <span class="c-card-6__text">lorem ipsum dolor sit amet co</span>
      </div>
      <div class="c-card-6__group-3">
        <div class="c-card-6__group-4"></div>
        <div class="c-card-6__group-5"></div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-card-6-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-6 {
  display: block;
  border-spacing: 0px;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  padding-bottom: 46px;
}

.c-card-6__group {
  display: block;
}

.c-card-6__group-2 {
  display: block;
  padding-bottom: 8px;
  margin-left: 140px;
}

.c-card-6__title {
  display: inline;
  margin: 0px;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
}

.c-card-6__text {
  display: inline;
  color: #6E6E73;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  margin-top: 22.4px;
}

.c-card-6__group-3 {
  display: block;
  position: relative;
}

.c-card-6__group-4 {
  display: block;
  height: 500px;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-bottom: 38px;
}

.c-card-6__group-5 {
  display: flex;
  justify-content: center;
  list-style-type: none;
}
```

**States**

- No hover or focus change was observed.

### Card (7)

**Verification**: not verifiable, what the page placed in it (photos, media, ads) covers most of it and nothing else differs, so the comparison could not be judged.

**Anatomy**

- Group: 3 instances in a 3-column grid; the recipe carries the values they all share
- `card-7`: the component root, a `<div>` (`.c-card-7`)
- `card-7-group`: inner flex row (`.c-card-7__group`)
- `card-7-group-2`: inner flex row (`.c-card-7__group-2`), content not captured

**Recipe**

```html
<div class="c-card-7-scope">
  <div class="c-card-7">
    <div class="c-card-7__group">
      <div class="c-card-7__group-2"></div>
    </div>
  </div>
</div>
```

```css
.c-card-7-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-7 {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  white-space: nowrap;
}

.c-card-7__group {
  display: flex;
  height: 500px;
  transform: matrix(1, 0, 0, 1, 140, 0);
  margin-right: 20px;
}

.c-card-7__group-2 {
  display: flex;
  justify-content: center;
  width: 480px;
  height: 500px;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #FFFFFF;
  border-radius: 18px;
  box-shadow: #00000014 2px 4px 12px 0px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.5, 1);
}
```

**States**

- No hover or focus change was observed.

### Card links

**Verification**: flagged, the render matched 91% of the original pixels, below the 96% required on focus after 2 correction attempts.

**Anatomy**

- `card-link`: the component root, a `<a>` (`.c-card-link`), 38-character label

**Recipe**

```html
<div class="c-card-link-scope">
  <a class="c-card-link" href="#">lorem ipsum dolor sit amet consectetur</a>
</div>
```

```css
.c-card-link-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

.c-card-link {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
}

.c-card-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- focus: outline 2px solid #0071E3, outline-offset 1px

### Card links (2)

**Verification**: flagged, the `card-link-2-group-2` y did not reproduce the measured 98px after 2 correction attempts.

**Anatomy**

- `card-link-2`: the component root, a `<a>` (`.c-card-link-2`)
- `card-link-2-text`: label text, 101 characters (`.c-card-link-2__text`, 2 instances)
- `card-link-2-group`: inner group (`.c-card-link-2__group`)
- `card-link-2-group-2`: inner group (`.c-card-link-2__group-2`)
- `card-link-2-text-2`: label text, 8 characters (`.c-card-link-2__text-2`)

**Recipe**

```html
<div class="c-card-link-2-scope">
  <a class="c-card-link-2" href="#">
    <span class="c-card-link-2__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit am</span>
    <span class="c-card-link-2__group">
      <sup class="c-card-link-2__group-2">
        <span class="c-card-link-2__text-2">lorem ip</span>
        <span class="c-card-link-2__text">l</span>
      </sup>
    </span>
  </a>
</div>
```

```css
.c-card-link-2-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

.c-card-link-2 {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
}

.c-card-link-2__group {
  display: inline;
}

.c-card-link-2__group-2 {
  display: inline;
  position: relative;
  top: -8.4px;
  font-size: 16.8px;
  line-height: 19.2px;
}

.c-card-link-2__text-2 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-card-link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- focus: outline 2px solid #0071E3, outline-offset 1px

### Card links (3)

**Verification**: flagged, the render matched 88% of the original pixels, below the 96% required on focus after 2 correction attempts.

**Anatomy**

- `card-link-3`: the component root, a `<a>` (`.c-card-link-3`)
- `card-link-3-text`: label text, 42 characters (`.c-card-link-3__text`)

**Recipe**

```html
<div class="c-card-link-3-scope">
  <a class="c-card-link-3" href="#">
    <div class="c-card-link-3__text">lorem ipsum dolor sit amet consectetur adi</div>
  </a>
</div>
```

```css
.c-card-link-3-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

.c-card-link-3 {
  display: inline-block;
  border-spacing: 0px;
  color: #1D1D1F;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
  text-decoration-line: none;
}

.c-card-link-3__text {
  display: block;
  margin-right: 10%;
}

.c-card-link-3:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**States**

- focus: outline 2px solid #0071E3, outline-offset 1px

### Sub navigation

**Verification**: flagged, the `sub-navigation-group` y did not reproduce the measured 12px after 2 correction attempts.

**Anatomy**

- `sub-navigation`: the component root, a `<div>` (`.c-sub-navigation`)
- `sub-navigation-group`: inner block (`.c-sub-navigation__group`)
- `sub-navigation-group-2`: inner block (`.c-sub-navigation__group-2`)
- `sub-navigation-group-3`: inner block (`.c-sub-navigation__group-3`, 7 instances)
- `sub-navigation-group-4`: inner block (`.c-sub-navigation__group-4`, 7 instances), content not captured

**Recipe**

```html
<div class="c-sub-navigation-scope">
  <div class="c-sub-navigation">
    <div class="c-sub-navigation__group">
      <div class="c-sub-navigation__group-2">
        <div class="c-sub-navigation__group-3">
          <div class="c-sub-navigation__group-4"></div>
        </div>
        <div class="c-sub-navigation__group-3">
          <div class="c-sub-navigation__group-4"></div>
        </div>
        <div class="c-sub-navigation__group-3">
          <div class="c-sub-navigation__group-4"></div>
        </div>
        <div class="c-sub-navigation__group-3">
          <div class="c-sub-navigation__group-4"></div>
        </div>
        <div class="c-sub-navigation__group-3">
          <div class="c-sub-navigation__group-4"></div>
        </div>
        <div class="c-sub-navigation__group-3">
          <div class="c-sub-navigation__group-4"></div>
        </div>
        <div class="c-sub-navigation__group-3">
          <div class="c-sub-navigation__group-4"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-sub-navigation-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-sub-navigation {
  display: flex;
  align-items: center;
  border-spacing: 0px;
  max-width: 1300px;
  position: relative;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-sub-navigation__group {
  display: block;
  position: relative;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 1px;
}

.c-sub-navigation__group-2 {
  display: block;
}

.c-sub-navigation__group-3 {
  display: inline-block;
}

.c-sub-navigation__group-4 {
  display: block;
  margin: 5px 35px 5px 5px;
  color: #F5F5F7;
}
```

**States**

- No hover or focus change was observed.

### Navigation links

**Verification**: verified against the live page at desktop.

**Anatomy**

- `navigation-link`: the component root, a `<button>` (`.c-navigation-link`)

**Recipe**

```html
<div class="c-navigation-link-scope">
  <button class="c-navigation-link" type="button"></button>
</div>
```

```css
.c-navigation-link-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-navigation-link {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  width: 22px;
  padding: 0px;
  position: absolute;
  top: 0px;
  right: -7px;
  background-color: transparent;
  color: #000000CC;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  list-style-type: none;
}

.c-navigation-link:focus {
  z-index: 1;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- focus: z-index 1, outline 2px solid #0071E3, outline-offset -7px

### Icon buttons

**Verification**: verified against the live page at desktop.

**Anatomy**

- `icon-button`: the component root, a `<a>` (`.c-icon-button`)
- `icon-button-group`: inner flex row (`.c-icon-button__group`)
- `icon-button-icon`: icon placeholder, 15x44px (`.c-icon-button__icon`)

**Recipe**

```html
<div class="c-icon-button-scope">
  <a class="c-icon-button" href="#">
    <span class="c-icon-button__group">
      <span class="c-icon-button__icon" aria-hidden="true"></span>
    </span>
  </a>
</div>
```

```css
.c-icon-button-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-icon-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  height: 44px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  list-style-type: none;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-icon-button__group {
  display: flex;
}

.c-icon-button__icon {
  display: block;
  flex-shrink: 0;
  width: 15px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-icon-button:hover {
  color: #000000;
}

.c-icon-button:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- hover (`icon-button-hover`): color #000000
- focus (`icon-button-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px

### Icon buttons (2)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `icon-button-2`: the component root, a `<a>` (`.c-icon-button-2`)
- `icon-button-2-group`: inner flex row (`.c-icon-button-2__group`)
- `icon-button-2-icon`: icon placeholder, 14x44px (`.c-icon-button-2__icon`)
- `icon-button-2-group-2`: inner group (`.c-icon-button-2__group-2`)
- `icon-button-2-group-3`: inner group (`.c-icon-button-2__group-3`)
- `icon-button-2-text`: label text, 1 characters (`.c-icon-button-2__text`)

**Recipe**

```html
<div class="c-icon-button-2-scope">
  <a class="c-icon-button-2" href="#">
    <span class="c-icon-button-2__group">
      <span class="c-icon-button-2__icon" aria-hidden="true"></span>
    </span>
    <span class="c-icon-button-2__group-2">
      <span class="c-icon-button-2__group-3"></span>
      <span class="c-icon-button-2__text">l</span>
    </span>
  </a>
</div>
```

```css
.c-icon-button-2-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-icon-button-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  height: 44px;
  position: relative;
  z-index: 1;
  color: #000000CC;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: -0.12px;
  text-decoration-line: none;
  white-space: nowrap;
  list-style-type: none;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-right: 8px;
  padding-left: 8px;
}

.c-icon-button-2__group {
  display: flex;
}

.c-icon-button-2__icon {
  display: block;
  flex-shrink: 0;
  width: 14px;
  height: 44px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-icon-button-2__group-2 {
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 11px;
  bottom: 11px;
  left: 15px;
  z-index: 1;
  color: #FFFFFF;
  transform: matrix(0, 0, 0, 0, 0, 0);
  font-size: 10px;
  line-height: 13px;
  letter-spacing: -0.08px;
  text-align: center;
}

.c-icon-button-2__group-2::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-icon-button-2__group-2::after {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000;
  border-radius: 13px;
}

.c-icon-button-2__group-3 {
  display: block;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 6.5px;
  background-color: #000000;
  transform: matrix(0, 0, 0, 1, 0, 0);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-icon-button-2__text {
  display: block;
  position: relative;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.3, 1);
}

.c-icon-button-2:hover {
  color: #000000;
}

.c-icon-button-2:focus {
  color: #000000;
  outline: 2px solid #0071E3;
  outline-offset: -7px;
}
```

**States**

- hover (`icon-button-2-hover`): color #000000
- focus (`icon-button-2-focus`): color #000000, outline 2px solid #0071E3, outline-offset -7px

### Footer (inner, 3)

**Verification**: desktop flagged, the `footer-inner-3-inner` height did not reproduce the measured 1131px after 2 correction attempts; mobile flagged, the recipe could not be rendered on its own.

Variant observed on https://www.apple.com/us/shop/goto/buy_vision.

**Anatomy**

- `footer-inner-3`: the component root, a `<footer>` (`.c-footer-inner-3`)
- `footer-inner-3-inner`: inner block (`.c-footer-inner-3__inner`), content not captured
- `footer-inner-3-heading`: heading, 6 characters (`.c-footer-inner-3__heading`)
- `footer-inner-3-heading-2`: heading, 9 characters (`.c-footer-inner-3__heading-2`)
- `footer-inner-3-group`: inner block (`.c-footer-inner-3__group`)
- `footer-inner-3-group-2`: inner block (`.c-footer-inner-3__group-2`, 4 instances)
- `footer-inner-3-group-3`: inner block (`.c-footer-inner-3__group-3`)
- `footer-inner-3-list`: inner group (`.c-footer-inner-3__list`)
- `footer-inner-3-item`: inner group (`.c-footer-inner-3__item`, 2 instances)
- `footer-inner-3-text`: label text, 8 characters (`.c-footer-inner-3__text`, 3 instances)
- `footer-inner-3-text-2`: label text, 0 characters (`.c-footer-inner-3__text-2`, 2 instances), content not captured
- `footer-inner-3-text-3`: label text, 823 characters (`.c-footer-inner-3__text-3`, 8 instances)
- `footer-inner-3-text-4`: label text, 162 characters (`.c-footer-inner-3__text-4`)
- `footer-inner-3-nav`: inner group (`.c-footer-inner-3__nav`)
- `footer-inner-3-nav-link`: link (`.c-footer-inner-3__nav-link`)
- `footer-inner-3-group-4`: inner group (`.c-footer-inner-3__group-4`)
- `footer-inner-3-group-5`: inner block (`.c-footer-inner-3__group-5`)
- `footer-inner-3-list-2`: inner group (`.c-footer-inner-3__list-2`)
- `footer-inner-3-nav-item`: label text, 16 characters (`.c-footer-inner-3__nav-item`, 2 instances)
- `footer-inner-3-nav-2`: inner flex row (`.c-footer-inner-3__nav-2`), content not captured
- `footer-inner-3-group-6`: inner block (`.c-footer-inner-3__group-6`, 3 instances)
- `footer-inner-3-heading-3`: heading, 0 characters (`.c-footer-inner-3__heading-3`, 5 instances)
- `footer-inner-3-text-5`: label text, 14 characters (`.c-footer-inner-3__text-5`, 5 instances)
- `footer-inner-3-list-3`: inner group (`.c-footer-inner-3__list-3`, 5 instances), content not captured
- `footer-inner-3-nav-item-2`: inner group (`.c-footer-inner-3__nav-item-2`, 31 instances), content not captured
- `footer-inner-3-nav-link-2`: link, 5-character label (`.c-footer-inner-3__nav-link-2`, 34 instances)
- `footer-inner-3-nav-item-3`: inner group (`.c-footer-inner-3__nav-item-3`, 4 instances)
- `footer-inner-3-group-7`: inner block (`.c-footer-inner-3__group-7`, 2 instances)

**Desktop recipe**

```html
<div class="c-footer-inner-3-scope">
  <footer class="c-footer-inner-3">
    <div class="c-footer-inner-3__inner">
      <h2 class="c-footer-inner-3__heading">lorem</h2>
      <h3 class="c-footer-inner-3__heading-2">lorem ips</h3>
      <div class="c-footer-inner-3__group">
        <div class="c-footer-inner-3__group-2">
          <div class="c-footer-inner-3__group-3">
            <ul class="c-footer-inner-3__list">
              <li class="c-footer-inner-3__item">
                <span class="c-footer-inner-3__text">lorem ip</span>
                <span class="c-footer-inner-3__text-2">
                  <span class="c-footer-inner-3__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
                  <span class="c-footer-inner-3__text-3">lorem ipsum dolor sit amet conse</span>
                </span>
              </li>
              <li class="c-footer-inner-3__item">
                <span class="c-footer-inner-3__text">lorem ip</span>
                <span class="c-footer-inner-3__text-2">
                  <span class="c-footer-inner-3__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consecte</span>
                  <span class="c-footer-inner-3__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
                  <span class="c-footer-inner-3__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do</span>
                  <span class="c-footer-inner-3__text-3">lorem ipsum dolor sit amet conse</span>
                  <span class="c-footer-inner-3__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum d</span>
                  <span class="c-footer-inner-3__text-3">l</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <p class="c-footer-inner-3__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</p>
      </div>
      <nav class="c-footer-inner-3__nav">
        <a class="c-footer-inner-3__nav-link" href="#">
          <span class="c-footer-inner-3__group-4"></span>
          <span class="c-footer-inner-3__text">lorem</span>
        </a>
        <div class="c-footer-inner-3__group-5">
          <ol class="c-footer-inner-3__list-2">
            <li class="c-footer-inner-3__nav-item">lorem ipsum dolo</li>
            <li class="c-footer-inner-3__nav-item">lorem ipsum dolor si</li>
          </ol>
        </div>
      </nav>
      <nav class="c-footer-inner-3__nav-2">
        <div class="c-footer-inner-3__group-6">
          <div class="c-footer-inner-3__group-2">
            <h3 class="c-footer-inner-3__heading-3">
              <span class="c-footer-inner-3__text-5">lorem ipsum do</span>
            </h3>
            <ul class="c-footer-inner-3__list-3">
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lor</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lore</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem i</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-3__nav-item-3">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-inner-3__group-7">
            <h3 class="c-footer-inner-3__heading-3">
              <span class="c-footer-inner-3__text-5">lorem ipsum</span>
            </h3>
            <ul class="c-footer-inner-3__list-3">
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-3__nav-item-3">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-footer-inner-3__group-6">
          <div class="c-footer-inner-3__group-2">
            <h3 class="c-footer-inner-3__heading-3">
              <span class="c-footer-inner-3__text-5">lorem i</span>
            </h3>
            <ul class="c-footer-inner-3__list-3">
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum dolor sit ame</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum dolor s</a>
              </li>
              <li class="c-footer-inner-3__nav-item-3">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-inner-3__group-7">
            <h3 class="c-footer-inner-3__heading-3">
              <span class="c-footer-inner-3__text-5">lorem ipsum d</span>
            </h3>
            <ul class="c-footer-inner-3__list-3">
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ip</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-3__nav-item-3">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ips</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-footer-inner-3__group-6">
          <div class="c-footer-inner-3__group-2">
            <h3 class="c-footer-inner-3__heading-3">
              <span class="c-footer-inner-3__text-5">lorem ipsum</span>
            </h3>
            <ul class="c-footer-inner-3__list-3">
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum dol</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum dolor sit</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2">
                <a class="c-footer-inner-3__nav-link-2" href="#">lorem ipsum d</a>
              </li>
              <li class="c-footer-inner-3__nav-item-2"></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-3-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner-3 {
  display: block;
  border-spacing: 0px;
  min-width: 1024px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner-3__inner {
  display: block;
  max-width: 980px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-3__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner-3__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-3__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-3__group-2 {
  display: block;
}

.c-footer-inner-3__group-3 {
  display: block;
  color: #6E6E73;
}

.c-footer-inner-3__list {
  display: block;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-3__item {
  display: list-item;
  padding-bottom: 9.6px;
}

.c-footer-inner-3__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner-3__text-2 {
  display: inline;
}

.c-footer-inner-3__text-4 {
  display: block;
  margin: 0px;
}

.c-footer-inner-3__nav {
  display: block;
  position: relative;
  z-index: 1;
  color: #000000B8;
  padding-top: 17px;
  padding-bottom: 17px;
}

.c-footer-inner-3__nav::before {
  content: "";
  display: table;
}

.c-footer-inner-3__nav::after {
  content: "";
  display: table;
}

.c-footer-inner-3__nav-link {
  display: block;
  position: absolute;
  top: 17px;
  left: 0px;
  z-index: 2;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-3__group-4 {
  display: block;
  width: 14px;
  height: 18px;
  position: relative;
  z-index: 2;
  background-color: #000000B8;
  color: transparent;
}

.c-footer-inner-3__group-5 {
  display: block;
  position: relative;
  z-index: 1;
}

.c-footer-inner-3__group-5::before {
  content: "";
  display: table;
}

.c-footer-inner-3__group-5::after {
  content: "";
  display: table;
}

.c-footer-inner-3__list-2 {
  display: block;
  max-height: 9999px;
  padding: 0px 0px 0px 25px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-3__nav-item {
  display: list-item;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 3px;
  padding-right: 4px;
  padding-bottom: 3px;
  margin-right: 7px;
}

.c-footer-inner-3__nav-item::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 11px;
  vertical-align: middle;
  background-color: #0000007A;
  margin-top: -1px;
  margin-right: 11px;
}

.c-footer-inner-3__nav-2 {
  display: flex;
}

.c-footer-inner-3__group-6 {
  display: block;
  flex-basis: 25%;
}

.c-footer-inner-3__heading-3 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-3__text-5 {
  display: block;
  font-size: 12px;
  line-height: 16.0005px;
  margin-right: 20px;
  margin-bottom: 9.6px;
}

.c-footer-inner-3__list-3 {
  display: block;
  padding: 0px;
  margin: 0px 20px 0px 0px;
  list-style-type: none;
}

.c-footer-inner-3__nav-item-2 {
  display: block;
  margin-bottom: 9.6px;
}

.c-footer-inner-3__nav-link-2 {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-3__nav-item-3 {
  display: block;
}

.c-footer-inner-3__group-7 {
  display: block;
  padding-top: 24px;
}

.c-footer-inner-3__nav-link:hover {
  text-decoration-line: underline;
}

.c-footer-inner-3__nav-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-3__nav-link-2:hover {
  text-decoration-line: underline;
}

.c-footer-inner-3__nav-link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**Mobile anatomy**

- `footer-inner-3-mobile`: the component root, a `<footer>` (`.c-footer-inner-3-mobile`)
- `footer-inner-3-mobile-inner`: inner block (`.c-footer-inner-3-mobile__inner`)
- `footer-inner-3-mobile-heading`: heading, 6 characters (`.c-footer-inner-3-mobile__heading`)
- `footer-inner-3-mobile-heading-2`: heading, 9 characters (`.c-footer-inner-3-mobile__heading-2`)
- `footer-inner-3-mobile-group`: inner block (`.c-footer-inner-3-mobile__group`)
- `footer-inner-3-mobile-group-2`: inner block (`.c-footer-inner-3-mobile__group-2`, 6 instances)
- `footer-inner-3-mobile-group-3`: inner block (`.c-footer-inner-3-mobile__group-3`)
- `footer-inner-3-mobile-list`: inner group (`.c-footer-inner-3-mobile__list`)
- `footer-inner-3-mobile-item`: inner group (`.c-footer-inner-3-mobile__item`, 2 instances)
- `footer-inner-3-mobile-text`: label text, 8 characters (`.c-footer-inner-3-mobile__text`, 3 instances)
- `footer-inner-3-mobile-text-2`: label text, 0 characters (`.c-footer-inner-3-mobile__text-2`, 2 instances), content not captured
- `footer-inner-3-mobile-text-3`: label text, 823 characters (`.c-footer-inner-3-mobile__text-3`, 25 instances)
- `footer-inner-3-mobile-text-4`: label text, 162 characters (`.c-footer-inner-3-mobile__text-4`)
- `footer-inner-3-mobile-nav`: inner group (`.c-footer-inner-3-mobile__nav`)
- `footer-inner-3-mobile-nav-link`: link (`.c-footer-inner-3-mobile__nav-link`)
- `footer-inner-3-mobile-group-4`: inner group (`.c-footer-inner-3-mobile__group-4`)
- `footer-inner-3-mobile-group-5`: inner block (`.c-footer-inner-3-mobile__group-5`)
- `footer-inner-3-mobile-list-2`: inner group (`.c-footer-inner-3-mobile__list-2`)
- `footer-inner-3-mobile-nav-item`: label text, 16 characters (`.c-footer-inner-3-mobile__nav-item`, 2 instances)
- `footer-inner-3-mobile-nav-2`: inner flex column (`.c-footer-inner-3-mobile__nav-2`)
- `footer-inner-3-mobile-group-6`: inner block (`.c-footer-inner-3-mobile__group-6`, 11 instances)
- `footer-inner-3-mobile-heading-3`: heading, 0 characters (`.c-footer-inner-3-mobile__heading-3`, 11 instances)
- `footer-inner-3-mobile-button`: button (`.c-footer-inner-3-mobile__button`, 11 instances)
- `footer-inner-3-mobile-group-7`: inner flex row (`.c-footer-inner-3-mobile__group-7`, 11 instances)
- `footer-inner-3-mobile-icon`: icon placeholder, 11x6px (`.c-footer-inner-3-mobile__icon`, 11 instances)
- `footer-inner-3-mobile-group-8`: inner block (`.c-footer-inner-3-mobile__group-8`)
- `footer-inner-3-mobile-group-9`: inner block (`.c-footer-inner-3-mobile__group-9`)
- `footer-inner-3-mobile-group-10`: inner group (`.c-footer-inner-3-mobile__group-10`)
- `footer-inner-3-mobile-link`: link, 19-character label (`.c-footer-inner-3-mobile__link`)
- `footer-inner-3-mobile-link-2`: link, 14-character label (`.c-footer-inner-3-mobile__link-2`)
- `footer-inner-3-mobile-text-5`: label text, 0 characters (`.c-footer-inner-3-mobile__text-5`)
- `footer-inner-3-mobile-group-11`: inner block (`.c-footer-inner-3-mobile__group-11`)
- `footer-inner-3-mobile-group-12`: inner block (`.c-footer-inner-3-mobile__group-12`)
- `footer-inner-3-mobile-link-3`: link, 13-character label (`.c-footer-inner-3-mobile__link-3`)
- `footer-inner-3-mobile-group-13`: inner block (`.c-footer-inner-3-mobile__group-13`)
- `footer-inner-3-mobile-text-6`: label text, 48 characters (`.c-footer-inner-3-mobile__text-6`)
- `footer-inner-3-mobile-list-3`: inner group (`.c-footer-inner-3-mobile__list-3`), content not captured
- `footer-inner-3-mobile-item-2`: inner group (`.c-footer-inner-3-mobile__item-2`, 4 instances), content not captured
- `footer-inner-3-mobile-link-4`: link, 14-character label (`.c-footer-inner-3-mobile__link-4`, 3 instances)

**Mobile recipe**

```html
<div class="c-footer-inner-3-mobile-scope">
  <footer class="c-footer-inner-3-mobile">
    <div class="c-footer-inner-3-mobile__inner">
      <h2 class="c-footer-inner-3-mobile__heading">lorem</h2>
      <h3 class="c-footer-inner-3-mobile__heading-2">lorem ips</h3>
      <div class="c-footer-inner-3-mobile__group">
        <div class="c-footer-inner-3-mobile__group-2">
          <div class="c-footer-inner-3-mobile__group-3">
            <ul class="c-footer-inner-3-mobile__list">
              <li class="c-footer-inner-3-mobile__item">
                <span class="c-footer-inner-3-mobile__text">lorem ip</span>
                <span class="c-footer-inner-3-mobile__text-2">
                  <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing eli</span>
                  <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor sit amet conse</span>
                </span>
              </li>
              <li class="c-footer-inner-3-mobile__item">
                <span class="c-footer-inner-3-mobile__text">lorem ip</span>
                <span class="c-footer-inner-3-mobile__text-2">
                  <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consecte</span>
                  <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</span>
                  <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do</span>
                  <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor sit amet conse</span>
                  <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum d</span>
                  <span class="c-footer-inner-3-mobile__text-3">l</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <p class="c-footer-inner-3-mobile__text-4">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</p>
      </div>
      <nav class="c-footer-inner-3-mobile__nav">
        <a class="c-footer-inner-3-mobile__nav-link" href="#">
          <span class="c-footer-inner-3-mobile__group-4"></span>
          <span class="c-footer-inner-3-mobile__text">lorem</span>
        </a>
        <div class="c-footer-inner-3-mobile__group-5">
          <ol class="c-footer-inner-3-mobile__list-2">
            <li class="c-footer-inner-3-mobile__nav-item">lorem ipsum dolo</li>
            <li class="c-footer-inner-3-mobile__nav-item">lorem ipsum dolor si</li>
          </ol>
        </div>
      </nav>
      <nav class="c-footer-inner-3-mobile__nav-2">
        <div class="c-footer-inner-3-mobile__group-2">
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum do</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-3-mobile__group-2">
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem i</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum d</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-3-mobile__group-2">
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-3-mobile__group-2">
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum d</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum do</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum do</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-3-mobile__group-2">
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-3-mobile__group-6">
            <h3 class="c-footer-inner-3-mobile__heading-3">
              <button class="c-footer-inner-3-mobile__button" type="button">
                <span class="c-footer-inner-3-mobile__text-3">lorem ipsum</span>
                <span class="c-footer-inner-3-mobile__group-7">
                  <span class="c-footer-inner-3-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
      </nav>
      <div class="c-footer-inner-3-mobile__group-8">
        <div class="c-footer-inner-3-mobile__group-9">
          <p class="c-footer-inner-3-mobile__group-10">
            <span class="c-footer-inner-3-mobile__text-3">lorem ipsum dolor</span>
            <a class="c-footer-inner-3-mobile__link" href="#">lorem ipsum dolor s</a>
            <span class="c-footer-inner-3-mobile__text-3">lo</span>
            <a class="c-footer-inner-3-mobile__link-2" href="#">lorem ipsum do</a>
            <span class="c-footer-inner-3-mobile__text-3">lorem ipsum</span>
            <span class="c-footer-inner-3-mobile__text-5">
              <span class="c-footer-inner-3-mobile__text-3">lore</span>
              <span class="c-footer-inner-3-mobile__text-3">lorem ipsum do</span>
            </span>
            <span class="c-footer-inner-3-mobile__text-3">l</span>
          </p>
        </div>
        <div class="c-footer-inner-3-mobile__group-11">
          <div class="c-footer-inner-3-mobile__group-12">
            <a class="c-footer-inner-3-mobile__link-3" href="#">lorem ipsum d</a>
          </div>
          <div class="c-footer-inner-3-mobile__group-13">
            <div class="c-footer-inner-3-mobile__text-6">lorem ipsum dolor sit amet consectetur adipiscin</div>
            <ul class="c-footer-inner-3-mobile__list-3">
              <li class="c-footer-inner-3-mobile__item-2">
                <a class="c-footer-inner-3-mobile__link-4" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-3-mobile__item-2">
                <a class="c-footer-inner-3-mobile__link-4" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-3-mobile__item-2">
                <a class="c-footer-inner-3-mobile__link-4" href="#">lorem ipsum dolor</a>
              </li>
              <li class="c-footer-inner-3-mobile__item-2"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-3-mobile-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner-3-mobile {
  display: block;
  border-spacing: 0px;
  min-width: 320px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner-3-mobile__inner {
  display: block;
  max-width: 980px;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-3-mobile__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner-3-mobile__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-3-mobile__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-3-mobile__group-2 {
  display: block;
}

.c-footer-inner-3-mobile__group-3 {
  display: block;
  color: #6E6E73;
}

.c-footer-inner-3-mobile__list {
  display: block;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-3-mobile__item {
  display: list-item;
  padding-bottom: 9.6px;
}

.c-footer-inner-3-mobile__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner-3-mobile__text-2 {
  display: inline;
}

.c-footer-inner-3-mobile__text-4 {
  display: block;
  margin: 0px;
}

.c-footer-inner-3-mobile__nav {
  display: block;
  position: relative;
  z-index: 1;
  color: #000000B8;
  padding-top: 17px;
  padding-bottom: 17px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-3-mobile__nav::before {
  content: "";
  display: table;
}

.c-footer-inner-3-mobile__nav::after {
  content: "";
  display: table;
}

.c-footer-inner-3-mobile__nav-link {
  display: block;
  position: absolute;
  top: 17px;
  left: 0px;
  z-index: 2;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-3-mobile__group-4 {
  display: block;
  width: 14px;
  height: 18px;
  position: relative;
  z-index: 2;
  background-color: #000000B8;
  color: transparent;
}

.c-footer-inner-3-mobile__group-5 {
  display: block;
  position: relative;
  z-index: 1;
}

.c-footer-inner-3-mobile__group-5::before {
  content: "";
  display: table;
}

.c-footer-inner-3-mobile__group-5::after {
  content: "";
  display: table;
}

.c-footer-inner-3-mobile__list-2 {
  display: block;
  max-height: 9999px;
  padding: 0px 0px 0px 25px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-3-mobile__nav-item {
  display: list-item;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 3px;
  padding-right: 4px;
  padding-bottom: 3px;
  margin-right: 7px;
}

.c-footer-inner-3-mobile__nav-item::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 11px;
  vertical-align: middle;
  background-color: #0000007A;
  margin-top: -1px;
  margin-right: 11px;
}

.c-footer-inner-3-mobile__nav-2 {
  display: flex;
  flex-direction: column;
}

.c-footer-inner-3-mobile__group-6 {
  display: block;
  box-sizing: border-box;
  width: calc(100% + 8px);
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-right: 4px;
  padding-bottom: 1px;
  padding-left: 4px;
  margin-left: -4px;
}

.c-footer-inner-3-mobile__group-6::after {
  content: "";
  display: block;
  width: 358px;
  height: 1px;
  position: absolute;
  top: 36px;
  right: 4px;
  bottom: 0px;
  left: 4px;
  z-index: 3;
  background-color: #00000029;
}

.c-footer-inner-3-mobile__heading-3 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-3-mobile__button {
  display: block;
  width: 100%;
  padding: 10px 0px;
  position: relative;
  z-index: 2;
  background-color: #F5F5F7;
  color: #000000E0;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  text-transform: none;
  text-align: start;
}

.c-footer-inner-3-mobile__button::after {
  content: "";
  display: block;
  width: 366px;
  height: 36px;
  position: absolute;
  top: 0px;
  right: -4px;
  bottom: 0px;
  left: -4px;
}

.c-footer-inner-3-mobile__group-7 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 11px;
  font-size: 14px;
  line-height: 18.6672px;
  transition: transform 0.3s ease;
  margin-top: 5px;
}

.c-footer-inner-3-mobile__icon {
  display: block;
  flex-shrink: 0;
  width: 11px;
  height: 6px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-inner-3-mobile__group-8 {
  display: block;
  padding-top: 17px;
  padding-bottom: 9px;
}

.c-footer-inner-3-mobile__group-9 {
  display: block;
  max-height: 9999px;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.c-footer-inner-3-mobile__group-10 {
  display: block;
  margin: 0px;
}

.c-footer-inner-3-mobile__link {
  display: inline;
  color: #0066CC;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #0066CC;
  white-space: nowrap;
}

.c-footer-inner-3-mobile__link-2 {
  display: inline;
  color: #0066CC;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #0066CC;
}

.c-footer-inner-3-mobile__text-5 {
  display: inline-block;
  white-space: nowrap;
}

.c-footer-inner-3-mobile__group-11 {
  display: block;
  justify-content: space-between;
}

.c-footer-inner-3-mobile__group-12 {
  display: block;
  position: relative;
  top: -3px;
  z-index: 2;
  white-space: nowrap;
  padding-top: 4px;
  margin-top: 5px;
}

.c-footer-inner-3-mobile__link-3 {
  display: inline-block;
  position: relative;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-3-mobile__link-3::after {
  content: "";
  display: block;
  width: 71px;
  height: 16px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.c-footer-inner-3-mobile__group-13 {
  display: block;
  position: relative;
  top: -3px;
  z-index: 1;
  padding-top: 12px;
}

.c-footer-inner-3-mobile__group-13::before {
  content: "";
  display: table;
}

.c-footer-inner-3-mobile__group-13::after {
  content: "";
  display: table;
}

.c-footer-inner-3-mobile__text-6 {
  display: block;
  max-height: 9999px;
  list-style-type: none;
  margin-top: 5px;
}

.c-footer-inner-3-mobile__list-3 {
  display: block;
  padding: 0px;
  margin: 5px 0px 0px;
  position: relative;
  top: -5px;
  z-index: 1;
  list-style-type: none;
}

.c-footer-inner-3-mobile__item-2 {
  display: inline-block;
  position: relative;
  margin-top: 5px;
  margin-right: 6px;
}

.c-footer-inner-3-mobile__item-2::before {
  content: "";
  display: block;
  width: 73px;
  height: 16px;
  position: absolute;
  top: 0px;
  right: 9px;
  bottom: 0px;
  left: 0px;
}

.c-footer-inner-3-mobile__item-2::after {
  content: "";
  display: block;
  width: 1px;
  height: 10px;
  position: absolute;
  top: 0px;
  right: -1px;
  bottom: 0px;
  left: 82.4219px;
  background-color: #0000007A;
  margin-top: 3px;
  margin-bottom: 3px;
}

.c-footer-inner-3-mobile__link-4 {
  display: inline-block;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 9px;
  padding-left: 9px;
  margin-left: -9px;
}

.c-footer-inner-3-mobile__nav-link:hover {
  text-decoration-line: underline;
}

.c-footer-inner-3-mobile__nav-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-3-mobile__button:hover {
  color: #000000;
}

.c-footer-inner-3-mobile__button:hover::after {
  color: #000000;
}

.c-footer-inner-3-mobile__button:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-3-mobile__button:focus::after {
  outline: 2px solid #0071E3;
  outline-offset: -2px;
}

.c-footer-inner-3-mobile__link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-3-mobile__link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-3-mobile__link-3:hover {
  text-decoration-line: underline;
}

.c-footer-inner-3-mobile__link-3:focus {
  outline: none;
}

.c-footer-inner-3-mobile__link-3:focus::after {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-3-mobile__link-4:hover {
  text-decoration-line: underline;
}

.c-footer-inner-3-mobile__link-4:focus {
  outline: none;
}
```

**States**

- `footer-inner-3-nav-link` hover: text-decoration-line underline
- `footer-inner-3-nav-link` focus: outline 2px solid #0071E3, outline-offset 1px
- `footer-inner-3-nav-link-2` hover: text-decoration-line underline
- `footer-inner-3-nav-link-2` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-3-mobile-nav-link` hover: text-decoration-line underline
- mobile, `footer-inner-3-mobile-nav-link` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-3-mobile-button` hover (`footer-inner-3-mobile-button-hover`): color #000000, ::after color #000000
- mobile, `footer-inner-3-mobile-button` focus: outline 2px solid #0071E3, outline-offset 1px, ::after outline 2px solid #0071E3, ::after outline-offset -2px
- mobile, `footer-inner-3-mobile-link` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-3-mobile-link-2` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-3-mobile-link-3` hover: text-decoration-line underline
- mobile, `footer-inner-3-mobile-link-3` focus: outline none, ::after outline 2px solid #0071E3, ::after outline-offset 1px
- mobile, `footer-inner-3-mobile-link-4` hover: text-decoration-line underline
- mobile, `footer-inner-3-mobile-link-4` focus: outline none

### Button, primary (4)

**Verification**: flagged, the render came out 42 px narrower than the original after 2 correction attempts.

**Anatomy**

- `button-primary-4`: the component root, a `<button>` (`.c-button-primary-4`), 24-character label

**Recipe**

```html
<div class="c-button-primary-4-scope">
  <button class="c-button-primary-4" type="button">lorem ipsum dolor sit am</button>
</div>
```

```css
.c-button-primary-4-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-button-primary-4 {
  display: inline-block;
  border-spacing: 0px;
  min-width: 26px;
  padding: 11px 21px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 20.0002px;
  letter-spacing: -0.374px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-primary-4:hover {
  background-color: #0076DF;
}

.c-button-primary-4:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-primary-4-hover`): background-color #0076DF
- focus: outline 2px solid #0071E3, outline-offset 3px

### Button, primary (5)

**Verification**: flagged, the render came out 21 px narrower than the original after 2 correction attempts.

**Anatomy**

- `button-primary-5`: the component root, a `<button>` (`.c-button-primary-5`), 24-character label

**Recipe**

```html
<div class="c-button-primary-5-scope">
  <button class="c-button-primary-5" type="button">lorem ipsum dolor sit am</button>
</div>
```

```css
.c-button-primary-5-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
}

.c-button-primary-5 {
  display: inline-block;
  border-spacing: 0px;
  min-width: 23px;
  padding: 3px 10px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
}

.c-button-primary-5:hover {
  background-color: #0076DF;
}

.c-button-primary-5:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- hover (`button-primary-5-hover`): background-color #0076DF
- focus: outline 2px solid #0071E3, outline-offset 3px

### Button, secondary (3)

**Verification**: flagged, the `button-secondary-3` width did not reproduce the measured 202px after 2 correction attempts.

**Anatomy**

- `button-secondary-3`: the component root, a `<button>` (`.c-button-secondary-3`), 8-character label

**Recipe**

```html
<div class="c-button-secondary-3-scope">
  <button class="c-button-secondary-3" type="button">lorem ip</button>
</div>
```

```css
.c-button-secondary-3-scope {
  background-color: #FFFFFF;
  color: #000000CC;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
}

.c-button-secondary-3 {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-spacing: 0px;
  width: 138px;
  padding: 32px;
  vertical-align: bottom;
  background-color: transparent;
  color: #6E6E73;
  border: 0;
  border-radius: 48px;
  cursor: pointer;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.216px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  list-style-type: none;
  transition: opacity 0.1s ease-in-out;
}

.c-button-secondary-3:hover {
  color: #000000;
}

.c-button-secondary-3:focus {
  outline: none;
}
```

**States**

- hover (`button-secondary-3-hover`): color #000000
- focus: outline none

### Card (8)

**Verification**: verified against the live page at desktop.

**Anatomy**

- Group: 3 instances in a 3-column grid; the recipe carries the values they all share
- `card-8`: the component root, a `<li>` (`.c-card-8`)
- `card-8-group`: inner flex row (`.c-card-8__group`)
- `card-8-group-2`: inner block (`.c-card-8__group-2`)
- `card-8-group-3`: inner block (`.c-card-8__group-3`)
- `card-8-media`: image placeholder, 375x228px (`.c-card-8__media`)
- `card-8-group-4`: inner block (`.c-card-8__group-4`)
- `card-8-body`: label text, 6 characters (`.c-card-8__body`)
- `card-8-body-2`: label text, 26 characters (`.c-card-8__body-2`)
- `card-8-body-3`: label text, 108 characters (`.c-card-8__body-3`)

**Recipe**

```html
<div class="c-card-8-scope">
  <li class="c-card-8">
    <div class="c-card-8__group">
      <div class="c-card-8__group-2">
        <div class="c-card-8__group-3">
          <span class="c-card-8__media" aria-hidden="true"></span>
        </div>
        <div class="c-card-8__group-4">
          <p class="c-card-8__body">lorem</p>
          <p class="c-card-8__body-2">lorem ipsum dolor sit amet</p>
          <p class="c-card-8__body-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet cons</p>
        </div>
      </div>
    </div>
  </li>
</div>
```

```css
.c-card-8-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-8 {
  display: inline-flex;
  flex-basis: 33.3333%;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 33.3333%;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  list-style-type: none;
}

.c-card-8__group {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 5px 10px;
}

.c-card-8__group-2 {
  display: block;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #FFFFFF;
  border-radius: 10px;
}

.c-card-8__group-3 {
  display: block;
}

.c-card-8__media {
  display: inline-block;
  flex-shrink: 0;
  width: 375px;
  height: 228px;
  aspect-ratio: auto 375 / 228;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
}

.c-card-8__group-4 {
  display: block;
  padding: 36px;
}

.c-card-8__body {
  display: block;
  margin: 0px;
  color: #6E6E73;
  font-weight: 600;
}

.c-card-8__body-2 {
  display: block;
  margin: 5.6px 0px 11.2px;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.196px;
}

.c-card-8__body-3 {
  display: block;
  margin: 0px;
}
```

**States**

- No hover or focus change was observed.

### Card (9)

**Verification**: flagged, the `card-9-title` y did not reproduce the measured 124px after 2 correction attempts.

**Anatomy**

- Group: 3 instances in a 3-column grid; the recipe carries the values they all share
- `card-9`: the component root, a `<li>` (`.c-card-9`)
- `card-9-group`: inner flex row (`.c-card-9__group`)
- `card-9-group-2`: inner block (`.c-card-9__group-2`)
- `card-9-group-3`: inner block (`.c-card-9__group-3`)
- `card-9-title`: heading, 21 characters (`.c-card-9__title`)
- `card-9-body`: label text, 104 characters (`.c-card-9__body`)
- `card-9-body-2`: inner group (`.c-card-9__body-2`), content not captured

**Recipe**

```html
<div class="c-card-9-scope">
  <li class="c-card-9">
    <div class="c-card-9__group">
      <div class="c-card-9__group-2">
        <div class="c-card-9__group-3">
          <h3 class="c-card-9__title">lorem ipsum dolor sit</h3>
          <p class="c-card-9__body">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet</p>
          <p class="c-card-9__body-2"></p>
        </div>
      </div>
    </div>
  </li>
</div>
```

```css
.c-card-9-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-card-9 {
  display: inline-flex;
  flex-basis: 33.3333%;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 33.3333%;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
  list-style-type: none;
}

.c-card-9__group {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 5px 10px;
}

.c-card-9__group-2 {
  width: 100%;
}

.c-card-9__group-3 {
  display: block;
}

.c-card-9__title {
  display: block;
  margin: 0px 5% 0px 0px;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 48px;
  font-weight: 600;
  line-height: 52.0077px;
  letter-spacing: -0.144px;
}

.c-card-9__body {
  display: block;
  margin: 13.6px 8% 0px 0px;
}

.c-card-9__body-2 {
  display: block;
  margin: 23.8px 0px 0px;
}
```

**States**

- No hover or focus change was observed.

### Tabs

**Verification**: verified against the live page at desktop.

**Anatomy**

- Group: 6 instances in a 6-column grid; the recipe carries the values they all share
- `tab`: the component root, a `<li>` (`.c-tab`)
- `tab-button-active`: button (`.c-tab__button-active`)
- `tab-group`: inner group (`.c-tab__group`)
- `tab-group-2`: inner block (`.c-tab__group-2`)
- `tab-icon`: icon placeholder, 41x75px (`.c-tab__icon`)
- `tab-text`: label text, 6 characters (`.c-tab__text`)

**Recipe**

```html
<div class="c-tab-scope">
  <li class="c-tab">
    <button class="c-tab__button-active" type="button">
      <span class="c-tab__group">
        <div class="c-tab__group-2">
          <span class="c-tab__icon" aria-hidden="true"></span>
        </div>
        <div class="c-tab__text">lorem</div>
      </span>
    </button>
  </li>
</div>
```

```css
.c-tab-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
}

.c-tab {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  min-width: 140px;
  position: relative;
  vertical-align: bottom;
  color: #000000CC;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
  letter-spacing: -0.224px;
  text-align: center;
  white-space: nowrap;
  list-style-type: none;
  transition: color 0.12s ease-out;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #D2D2D7;
}

.c-tab__button-active {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 122px;
  padding: 0px 0px 15px;
  vertical-align: bottom;
  background-color: transparent;
  border-width: 0px;
  border-style: none;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 21.8582px;
  letter-spacing: -0.224px;
  text-transform: none;
  text-align: center;
  transition: opacity 0.1s ease-in-out;
  margin-top: 3px;
  margin-left: 4px;
}

.c-tab__group {
  display: block;
  align-items: center;
  box-sizing: border-box;
  line-height: 20.4px;
}

.c-tab__group-2 {
  display: block;
  box-sizing: border-box;
}

.c-tab__icon {
  display: inline-block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 41px;
  height: 75px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-tab__text {
  display: block;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 18.0008px;
  margin-top: 3px;
}

.c-tab:hover {
  right: auto;
  color: #000000;
}

.c-tab:focus {
  right: auto;
}
```

**States**

- hover (`tab-hover`): right auto, color #000000
- focus: right auto

### Tabs (2)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `tab-2`: the component root, a `<button>` (`.c-tab-2`)
- `tab-2-group`: inner group (`.c-tab-2__group`)
- `tab-2-group-2`: inner block (`.c-tab-2__group-2`)
- `tab-2-icon`: icon placeholder, 65x75px (`.c-tab-2__icon`)
- `tab-2-text`: label text, 11 characters (`.c-tab-2__text`)

**Recipe**

```html
<div class="c-tab-2-scope">
  <button class="c-tab-2" type="button">
    <span class="c-tab-2__group">
      <div class="c-tab-2__group-2">
        <span class="c-tab-2__icon" aria-hidden="true"></span>
      </div>
      <div class="c-tab-2__text">lorem ipsum</div>
    </span>
  </button>
</div>
```

```css
.c-tab-2-scope {
  background-color: #FFFFFF;
  color: #000000CC;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
}

.c-tab-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  min-height: 122px;
  padding: 0px 0px 15px;
  vertical-align: bottom;
  background-color: transparent;
  color: #6E6E73;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 21.8582px;
  letter-spacing: -0.224px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  list-style-type: none;
  transition: opacity 0.1s ease-in-out;
}

.c-tab-2__group {
  display: block;
  align-items: center;
  box-sizing: border-box;
  line-height: 20.4px;
}

.c-tab-2__group-2 {
  display: block;
  box-sizing: border-box;
}

.c-tab-2__icon {
  display: inline-block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 65px;
  height: 75px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-tab-2__text {
  display: block;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 18.0008px;
  margin-top: 3px;
}

.c-tab-2:hover {
  color: #000000;
}

.c-tab-2:focus {
  outline: none;
}
```

**States**

- hover (`tab-2-hover`): color #000000
- focus: outline none

### Tabs (3)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `tab-3`: the component root, a `<button>` (`.c-tab-3`)
- `tab-3-group`: inner group (`.c-tab-3__group`)
- `tab-3-group-2`: inner block (`.c-tab-3__group-2`)
- `tab-3-icon`: icon placeholder, 47x75px (`.c-tab-3__icon`)
- `tab-3-text`: label text, 4 characters (`.c-tab-3__text`)

**Recipe**

```html
<div class="c-tab-3-scope">
  <button class="c-tab-3" type="button">
    <span class="c-tab-3__group">
      <div class="c-tab-3__group-2">
        <span class="c-tab-3__icon" aria-hidden="true"></span>
      </div>
      <div class="c-tab-3__text">lore</div>
    </span>
  </button>
</div>
```

```css
.c-tab-3-scope {
  background-color: #FFFFFF;
  color: #000000CC;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
}

.c-tab-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  min-height: 122px;
  padding: 0px 0px 15px;
  vertical-align: bottom;
  background-color: transparent;
  color: #6E6E73;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 21.8582px;
  letter-spacing: -0.224px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  list-style-type: none;
  transition: opacity 0.1s ease-in-out;
}

.c-tab-3__group {
  display: block;
  align-items: center;
  box-sizing: border-box;
  line-height: 20.4px;
}

.c-tab-3__group-2 {
  display: block;
  box-sizing: border-box;
}

.c-tab-3__icon {
  display: inline-block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 47px;
  height: 75px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-tab-3__text {
  display: block;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 18.0008px;
  margin-top: 3px;
}

.c-tab-3:hover {
  color: #000000;
}

.c-tab-3:focus {
  outline: none;
}
```

**States**

- hover (`tab-3-hover`): color #000000
- focus: outline none

### Table

**Verification**: flagged, the `table-text-2` y did not reproduce the measured 17px after 2 correction attempts.

**Anatomy**

- `table`: the component root, a `<table>` (`.c-table`)
- `table-caption`: label text, 22 characters (`.c-table__caption`)
- `table-head`: inner group (`.c-table__head`)
- `table-row`: inner group (`.c-table__row`, 2 instances)
- `table-header-cell`: label text, 11 characters (`.c-table__header-cell`)
- `table-header-cell-2`: inner group (`.c-table__header-cell-2`)
- `table-text`: label text, 9 characters (`.c-table__text`, 2 instances)
- `table-break`: line break (`.c-table__break`)
- `table-text-2`: label text, 8 characters (`.c-table__text-2`)
- `table-group`: inner group (`.c-table__group`), content not captured
- `table-body`: inner group (`.c-table__body`)
- `table-row-2`: inner group (`.c-table__row-2`, 3 instances)
- `table-cell`: label text, 17 characters (`.c-table__cell`, 4 instances)
- `table-cell-2`: label text, 10 characters (`.c-table__cell-2`, 4 instances)

**Recipe**

```html
<div class="c-table-scope">
  <table class="c-table">
    <caption class="c-table__caption">lorem ipsum dolor sit</caption>
    <thead class="c-table__head">
      <tr class="c-table__row">
        <th class="c-table__header-cell">lorem ipsum</th>
        <th class="c-table__header-cell-2">
          <span class="c-table__text">lorem ips</span>
          <br class="c-table__break">
          <span class="c-table__text">lorem ipsum do</span>
          <span class="c-table__text-2">lorem ip</span>
          <span class="c-table__group"></span>
        </th>
      </tr>
    </thead>
    <tbody class="c-table__body">
      <tr class="c-table__row-2">
        <td class="c-table__cell">lorem ipsum dolor</td>
        <td class="c-table__cell-2">lorem ipsu</td>
      </tr>
      <tr class="c-table__row-2">
        <td class="c-table__cell">lorem ipsum d</td>
        <td class="c-table__cell-2">lorem ipsu</td>
      </tr>
      <tr class="c-table__row-2">
        <td class="c-table__cell">lorem ipsu</td>
        <td class="c-table__cell-2">lorem ipsu</td>
      </tr>
      <tr class="c-table__row">
        <td class="c-table__cell">lorem ips</td>
        <td class="c-table__cell-2">lorem ipsu</td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
.c-table-scope {
  background-color: #F5F5F7;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-table {
  display: table;
  border-collapse: collapse;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-table__caption {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  text-align: left;
}

.c-table__head {
  display: table-header-group;
  vertical-align: middle;
  color: #6E6E73;
  font-size: 12px;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-table__row {
  display: table-row;
  vertical-align: middle;
}

.c-table__header-cell {
  display: table-cell;
  padding: 1px;
  vertical-align: bottom;
  font-weight: 400;
  text-align: left;
}

.c-table__header-cell-2 {
  display: table-cell;
  padding: 1px;
  vertical-align: bottom;
  font-weight: 400;
  text-align: end;
}

.c-table__text-2 {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-table__group {
  display: inline;
}

.c-table__body {
  display: table-row-group;
  vertical-align: middle;
}

.c-table__row-2 {
  display: table-row;
  vertical-align: middle;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #D2D2D7;
}

.c-table__cell {
  display: table-cell;
  padding: 5px 5px 5px 0px;
  vertical-align: bottom;
}

.c-table__cell-2 {
  display: table-cell;
  padding: 5px 0px;
  vertical-align: bottom;
  font-weight: 600;
  text-align: end;
}
```

**States**

- No hover or focus change was observed.

### Toggle button

**Verification**: flagged, the `toggle-button-active` width did not reproduce the measured 202px after 2 correction attempts.

**Anatomy**

- `toggle-button-active`: the component root, a `<button>` (`.c-toggle-button-active`), 6-character label

**Recipe**

```html
<div class="c-toggle-button-active-scope">
  <button class="c-toggle-button-active" type="button">lorem</button>
</div>
```

```css
.c-toggle-button-active-scope {
  background-color: #FFFFFF;
  color: #000000CC;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.0008px;
}

.c-toggle-button-active {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-spacing: 0px;
  width: 138px;
  padding: 32px;
  position: relative;
  vertical-align: bottom;
  background-color: #000000;
  color: #FFFFFF;
  border: 0;
  border-radius: 48px;
  cursor: default;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.216px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  list-style-type: none;
  transition: opacity 0.1s ease-in-out;
}

.c-toggle-button-active:focus {
  outline: none;
}
```

**States**

- focus: outline none

### Header (inner, 3)

**Verification**: desktop flagged, the `header-inner-3-group-4` y did not reproduce the measured -3px after 2 correction attempts; mobile flagged, the render matched 94% of the original pixels, below the 96% required on `header-inner-3-mobile-logo` focus after 2 correction attempts.

Variant observed on https://www.apple.com/us/shop/goto/trade_in.

**Anatomy**

- `header-inner-3`: the component root, a `<nav>` (`.c-header-inner-3`)
- `header-inner-3-group`: inner block (`.c-header-inner-3__group`)
- `header-inner-3-group-2`: inner block (`.c-header-inner-3__group-2`)
- `header-inner-3-inner`: inner block (`.c-header-inner-3__inner`)
- `header-inner-3-group-3`: inner block (`.c-header-inner-3__group-3`)
- `header-inner-3-logo`: link, 14-character label (`.c-header-inner-3__logo`)
- `header-inner-3-group-4`: inner block (`.c-header-inner-3__group-4`)
- `header-inner-3-group-5`: inner block (`.c-header-inner-3__group-5`, 2 instances)
- `header-inner-3-group-6`: inner block (`.c-header-inner-3__group-6`)
- `header-inner-3-cta`: the `button-primary-5` button, 24-character label (`.c-header-inner-3__cta`)

**Desktop recipe**

```html
<div class="c-header-inner-3-scope">
  <nav class="c-header-inner-3">
    <div class="c-header-inner-3__group">
      <div class="c-header-inner-3__group-2"></div>
      <div class="c-header-inner-3__inner">
        <div class="c-header-inner-3__group-3">
          <a class="c-header-inner-3__logo" href="#">lorem ipsum do</a>
        </div>
        <div class="c-header-inner-3__group-4">
          <div class="c-header-inner-3__group-5"></div>
          <div class="c-header-inner-3__group-5">
            <div class="c-header-inner-3__group-6">
              <button class="c-header-inner-3__cta" type="button">lorem ipsum dolor sit am</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-header-inner-3-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-inner-3 {
  display: block;
  border-spacing: 0px;
  height: 52px;
  min-width: 1024px;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 9997;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-inner-3__group {
  display: block;
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}

.c-header-inner-3__group-2 {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: #FAFAFCCC;
  backdrop-filter: saturate(1.8) blur(20px);
  transition: background 0.24s cubic-bezier(0.28, 0.11, 0.32, 1);
  padding-top: 44px;
  margin-top: -44px;
}

.c-header-inner-3__group-2::after {
  content: "";
  display: block;
  width: 1440px;
  height: 1px;
  position: absolute;
  top: 95px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  background-color: #00000029;
}

.c-header-inner-3__inner {
  display: block;
  height: 52px;
  max-width: 980px;
  position: relative;
  z-index: 2;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-3__inner::before {
  content: "";
  display: table;
}

.c-header-inner-3__inner::after {
  content: "";
  display: table;
}

.c-header-inner-3__group-3 {
  display: block;
  min-height: 52px;
  color: #000000;
  cursor: default;
  font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 21px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.231px;
  white-space: nowrap;
  transition: color 0.24s cubic-bezier(0.28, 0.11, 0.32, 1);
  margin-top: 14px;
  margin-bottom: -14px;
}

.c-header-inner-3__logo {
  display: flex;
  flex-direction: column-reverse;
  color: #000000;
  opacity: 0.88;
  cursor: pointer;
  text-decoration-line: none;
  transition: color 0.24s cubic-bezier(0.28, 0.11, 0.32, 1);
}

.c-header-inner-3__group-4 {
  display: block;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.12px;
  margin-top: -3px;
}

.c-header-inner-3__group-5 {
  display: block;
  padding-top: 18px;
}

.c-header-inner-3__group-6 {
  display: block;
  margin-left: 24px;
}

.c-header-inner-3__cta {
  display: inline-block;
  min-width: 23px;
  padding: 3px 10px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  margin-top: -1px;
}

.c-header-inner-3__logo:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-header-inner-3__cta:hover {
  background-color: #0076DF;
}

.c-header-inner-3__cta:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**Mobile anatomy**

- `header-inner-3-mobile`: the component root, a `<nav>` (`.c-header-inner-3-mobile`)
- `header-inner-3-mobile-group`: inner block (`.c-header-inner-3-mobile__group`)
- `header-inner-3-mobile-group-2`: inner block (`.c-header-inner-3-mobile__group-2`)
- `header-inner-3-mobile-inner`: inner block (`.c-header-inner-3-mobile__inner`)
- `header-inner-3-mobile-group-3`: inner block (`.c-header-inner-3-mobile__group-3`)
- `header-inner-3-mobile-logo`: link, 14-character label (`.c-header-inner-3-mobile__logo`)
- `header-inner-3-mobile-group-4`: inner block (`.c-header-inner-3-mobile__group-4`)
- `header-inner-3-mobile-group-5`: inner block (`.c-header-inner-3-mobile__group-5`)
- `header-inner-3-mobile-group-6`: inner block (`.c-header-inner-3-mobile__group-6`)
- `header-inner-3-mobile-cta`: button, 24-character label (`.c-header-inner-3-mobile__cta`)

**Mobile recipe**

```html
<div class="c-header-inner-3-mobile-scope">
  <nav class="c-header-inner-3-mobile">
    <div class="c-header-inner-3-mobile__group">
      <div class="c-header-inner-3-mobile__group-2"></div>
      <div class="c-header-inner-3-mobile__inner">
        <div class="c-header-inner-3-mobile__group-3">
          <a class="c-header-inner-3-mobile__logo" href="#">lorem ipsum do</a>
        </div>
        <div class="c-header-inner-3-mobile__group-4">
          <div class="c-header-inner-3-mobile__group-5">
            <div class="c-header-inner-3-mobile__group-6">
              <button class="c-header-inner-3-mobile__cta" type="button">lorem ipsum dolor sit am</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>
```

```css
.c-header-inner-3-mobile-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-header-inner-3-mobile {
  display: block;
  border-spacing: 0px;
  width: 390px;
  height: 48px;
  min-width: 320px;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 9997;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: -0.374px;
}

.c-header-inner-3-mobile__group {
  display: block;
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}

.c-header-inner-3-mobile__group-2 {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 48px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: #FAFAFCCC;
  backdrop-filter: saturate(1.8) blur(20px);
  transition: background 0.32s cubic-bezier(0.4, 0, 0.6, 1);
  padding-top: 48px;
  margin-top: -48px;
}

.c-header-inner-3-mobile__group-2::after {
  content: "";
  display: block;
  width: 390px;
  height: 1px;
  position: absolute;
  top: 95px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  background-color: #00000029;
  transition-duration: 0.32s;
  transition-timing-function: ease-out;
  transition-property: margin-inline-start, width, inset-inline-start;
}

.c-header-inner-3-mobile__inner {
  display: block;
  height: 48px;
  max-width: 980px;
  position: relative;
  z-index: 2;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-3-mobile__inner::before {
  content: "";
  display: table;
}

.c-header-inner-3-mobile__inner::after {
  content: "";
  display: table;
}

.c-header-inner-3-mobile__group-3 {
  display: block;
  min-height: 48px;
  color: #000000;
  cursor: default;
  font-weight: 600;
  line-height: 24.0014px;
  white-space: nowrap;
  transition: color 0.24s cubic-bezier(0.28, 0.11, 0.32, 1);
  margin-top: 12px;
  margin-bottom: -12px;
}

.c-header-inner-3-mobile__logo {
  display: flex;
  flex-direction: column-reverse;
  color: #000000;
  opacity: 0.88;
  cursor: pointer;
  text-decoration-line: none;
  transition: color 0.24s cubic-bezier(0.28, 0.11, 0.32, 1);
}

.c-header-inner-3-mobile__group-4 {
  display: block;
  width: 100%;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: -0.28px;
}

.c-header-inner-3-mobile__group-5 {
  display: block;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
  padding-top: 16px;
  padding-right: 16px;
  padding-left: 16px;
}

.c-header-inner-3-mobile__group-6 {
  display: block;
  margin-top: -3px;
  margin-left: 24px;
}

.c-header-inner-3-mobile__cta {
  display: inline-block;
  min-width: 23px;
  padding: 3px 10px;
  background-color: #0071E3;
  color: #FFFFFF;
  border: 1px solid transparent;
  border-radius: 980px;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  margin-top: -1px;
}

.c-header-inner-3-mobile__logo:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-header-inner-3-mobile__cta:hover {
  background-color: #0076DF;
}

.c-header-inner-3-mobile__cta:focus {
  outline: 2px solid #0071E3;
  outline-offset: 3px;
}
```

**States**

- `header-inner-3-logo` focus: outline 2px solid #0071E3, outline-offset 1px
- `header-inner-3-cta` hover (`header-inner-3-cta-hover`): background-color #0076DF
- `header-inner-3-cta` focus: outline 2px solid #0071E3, outline-offset 3px
- mobile, `header-inner-3-mobile-logo` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `header-inner-3-mobile-cta` hover (`header-inner-3-mobile-cta-hover`): background-color #0076DF
- mobile, `header-inner-3-mobile-cta` focus: outline 2px solid #0071E3, outline-offset 3px

### Footer (inner, 4)

**Verification**: desktop flagged, the `footer-inner-4-inner` height did not reproduce the measured 773px after 2 correction attempts; mobile flagged, the recipe could not be rendered on its own.

Variant observed on https://www.apple.com/us/shop/goto/trade_in.

**Anatomy**

- `footer-inner-4`: the component root, a `<footer>` (`.c-footer-inner-4`)
- `footer-inner-4-inner`: inner block (`.c-footer-inner-4__inner`), content not captured
- `footer-inner-4-heading`: heading, 6 characters (`.c-footer-inner-4__heading`)
- `footer-inner-4-heading-2`: heading, 9 characters (`.c-footer-inner-4__heading-2`)
- `footer-inner-4-group`: inner block (`.c-footer-inner-4__group`)
- `footer-inner-4-group-2`: inner block (`.c-footer-inner-4__group-2`)
- `footer-inner-4-item`: inner group (`.c-footer-inner-4__item`)
- `footer-inner-4-text`: label text, 8 characters (`.c-footer-inner-4__text`, 2 instances)
- `footer-inner-4-text-2`: label text, 1068 characters (`.c-footer-inner-4__text-2`)
- `footer-inner-4-text-3`: label text, 162 characters (`.c-footer-inner-4__text-3`)
- `footer-inner-4-nav`: inner group (`.c-footer-inner-4__nav`)
- `footer-inner-4-nav-link`: link (`.c-footer-inner-4__nav-link`)
- `footer-inner-4-group-3`: inner group (`.c-footer-inner-4__group-3`)
- `footer-inner-4-group-4`: inner block (`.c-footer-inner-4__group-4`)
- `footer-inner-4-list`: inner group (`.c-footer-inner-4__list`)
- `footer-inner-4-nav-item`: label text, 14 characters (`.c-footer-inner-4__nav-item`)
- `footer-inner-4-nav-2`: inner flex row (`.c-footer-inner-4__nav-2`), content not captured
- `footer-inner-4-group-5`: inner block (`.c-footer-inner-4__group-5`, 3 instances)
- `footer-inner-4-group-6`: inner block (`.c-footer-inner-4__group-6`, 3 instances)
- `footer-inner-4-heading-3`: heading, 0 characters (`.c-footer-inner-4__heading-3`, 5 instances)
- `footer-inner-4-text-4`: label text, 14 characters (`.c-footer-inner-4__text-4`, 5 instances)
- `footer-inner-4-list-2`: inner group (`.c-footer-inner-4__list-2`, 5 instances), content not captured
- `footer-inner-4-nav-item-2`: inner group (`.c-footer-inner-4__nav-item-2`, 33 instances)
- `footer-inner-4-nav-link-2`: link, 5-character label (`.c-footer-inner-4__nav-link-2`, 37 instances)
- `footer-inner-4-nav-item-3`: inner group (`.c-footer-inner-4__nav-item-3`, 4 instances)
- `footer-inner-4-group-7`: inner block (`.c-footer-inner-4__group-7`, 2 instances)

**Desktop recipe**

```html
<div class="c-footer-inner-4-scope">
  <footer class="c-footer-inner-4">
    <div class="c-footer-inner-4__inner">
      <h2 class="c-footer-inner-4__heading">lorem</h2>
      <h3 class="c-footer-inner-4__heading-2">lorem ips</h3>
      <div class="c-footer-inner-4__group">
        <div class="c-footer-inner-4__group-2">
          <li class="c-footer-inner-4__item">
            <span class="c-footer-inner-4__text">lorem ip</span>
            <span class="c-footer-inner-4__text-2">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusm</span>
          </li>
        </div>
        <p class="c-footer-inner-4__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</p>
      </div>
      <nav class="c-footer-inner-4__nav">
        <a class="c-footer-inner-4__nav-link" href="#">
          <span class="c-footer-inner-4__group-3"></span>
          <span class="c-footer-inner-4__text">lorem</span>
        </a>
        <div class="c-footer-inner-4__group-4">
          <ol class="c-footer-inner-4__list">
            <li class="c-footer-inner-4__nav-item">lorem ipsum do</li>
          </ol>
        </div>
      </nav>
      <nav class="c-footer-inner-4__nav-2">
        <div class="c-footer-inner-4__group-5">
          <div class="c-footer-inner-4__group-6">
            <h3 class="c-footer-inner-4__heading-3">
              <span class="c-footer-inner-4__text-4">lorem ipsum do</span>
            </h3>
            <ul class="c-footer-inner-4__list-2">
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lor</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lore</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem i</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-4__nav-item-3">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-inner-4__group-7">
            <h3 class="c-footer-inner-4__heading-3">
              <span class="c-footer-inner-4__text-4">lorem ipsum</span>
            </h3>
            <ul class="c-footer-inner-4__list-2">
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-4__nav-item-3">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-footer-inner-4__group-5">
          <div class="c-footer-inner-4__group-6">
            <h3 class="c-footer-inner-4__heading-3">
              <span class="c-footer-inner-4__text-4">lorem i</span>
            </h3>
            <ul class="c-footer-inner-4__list-2">
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum dolor sit ame</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum dolor s</a>
              </li>
              <li class="c-footer-inner-4__nav-item-3">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsu</a>
              </li>
            </ul>
          </div>
          <div class="c-footer-inner-4__group-7">
            <h3 class="c-footer-inner-4__heading-3">
              <span class="c-footer-inner-4__text-4">lorem ipsum d</span>
            </h3>
            <ul class="c-footer-inner-4__list-2">
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ip</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-4__nav-item-3">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ips</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-footer-inner-4__group-5">
          <div class="c-footer-inner-4__group-6">
            <h3 class="c-footer-inner-4__heading-3">
              <span class="c-footer-inner-4__text-4">lorem ipsum</span>
            </h3>
            <ul class="c-footer-inner-4__list-2">
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsu</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum dol</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum dolor sit</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum d</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-footer-inner-4__nav-item-2">
                <a class="c-footer-inner-4__nav-link-2" href="#">lorem ipsum dolor sit</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-4-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner-4 {
  display: block;
  border-spacing: 0px;
  min-width: 1024px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner-4__inner {
  display: block;
  max-width: 980px;
  padding-right: 22px;
  padding-left: 22px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-4__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner-4__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-4__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-4__group-2 {
  display: block;
  color: #6E6E73;
}

.c-footer-inner-4__item {
  display: list-item;
  list-style-type: none;
  padding-bottom: 9.6px;
}

.c-footer-inner-4__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner-4__text-3 {
  display: block;
  margin: 0px;
}

.c-footer-inner-4__nav {
  display: block;
  position: relative;
  z-index: 1;
  color: #000000B8;
  padding-top: 17px;
  padding-bottom: 17px;
}

.c-footer-inner-4__nav::before {
  content: "";
  display: table;
}

.c-footer-inner-4__nav::after {
  content: "";
  display: table;
}

.c-footer-inner-4__nav-link {
  display: block;
  position: absolute;
  top: 17px;
  left: 0px;
  z-index: 2;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-4__group-3 {
  display: block;
  width: 14px;
  height: 18px;
  position: relative;
  z-index: 2;
  background-color: #000000B8;
  color: transparent;
}

.c-footer-inner-4__group-4 {
  display: block;
  position: relative;
  z-index: 1;
}

.c-footer-inner-4__group-4::before {
  content: "";
  display: table;
}

.c-footer-inner-4__group-4::after {
  content: "";
  display: table;
}

.c-footer-inner-4__list {
  display: block;
  max-height: 9999px;
  padding: 0px 0px 0px 25px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-4__nav-item {
  display: list-item;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 3px;
  padding-right: 4px;
  padding-bottom: 3px;
  margin-right: 7px;
}

.c-footer-inner-4__nav-item::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 11px;
  vertical-align: middle;
  background-color: #0000007A;
  margin-top: -1px;
  margin-right: 11px;
}

.c-footer-inner-4__nav-2 {
  display: flex;
}

.c-footer-inner-4__group-5 {
  display: block;
  flex-basis: 25%;
}

.c-footer-inner-4__group-6 {
  display: block;
}

.c-footer-inner-4__heading-3 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-4__text-4 {
  display: block;
  font-size: 12px;
  line-height: 16.0005px;
  margin-right: 20px;
  margin-bottom: 9.6px;
}

.c-footer-inner-4__list-2 {
  display: block;
  padding: 0px;
  margin: 0px 20px 0px 0px;
  list-style-type: none;
}

.c-footer-inner-4__nav-item-2 {
  display: block;
  margin-bottom: 9.6px;
}

.c-footer-inner-4__nav-link-2 {
  display: inline;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-4__nav-item-3 {
  display: block;
}

.c-footer-inner-4__group-7 {
  display: block;
  padding-top: 24px;
}

.c-footer-inner-4__nav-link:hover {
  text-decoration-line: underline;
}

.c-footer-inner-4__nav-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-4__nav-link-2:hover {
  text-decoration-line: underline;
}

.c-footer-inner-4__nav-link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}
```

**Mobile anatomy**

- `footer-inner-4-mobile`: the component root, a `<footer>` (`.c-footer-inner-4-mobile`)
- `footer-inner-4-mobile-inner`: inner block (`.c-footer-inner-4-mobile__inner`)
- `footer-inner-4-mobile-heading`: heading, 6 characters (`.c-footer-inner-4-mobile__heading`)
- `footer-inner-4-mobile-heading-2`: heading, 9 characters (`.c-footer-inner-4-mobile__heading-2`)
- `footer-inner-4-mobile-group`: inner block (`.c-footer-inner-4-mobile__group`)
- `footer-inner-4-mobile-group-2`: inner block (`.c-footer-inner-4-mobile__group-2`)
- `footer-inner-4-mobile-item`: inner group (`.c-footer-inner-4-mobile__item`)
- `footer-inner-4-mobile-text`: label text, 8 characters (`.c-footer-inner-4-mobile__text`, 2 instances)
- `footer-inner-4-mobile-text-2`: label text, 1068 characters (`.c-footer-inner-4-mobile__text-2`, 18 instances)
- `footer-inner-4-mobile-text-3`: label text, 162 characters (`.c-footer-inner-4-mobile__text-3`)
- `footer-inner-4-mobile-nav`: inner group (`.c-footer-inner-4-mobile__nav`)
- `footer-inner-4-mobile-nav-link`: link (`.c-footer-inner-4-mobile__nav-link`)
- `footer-inner-4-mobile-group-3`: inner group (`.c-footer-inner-4-mobile__group-3`)
- `footer-inner-4-mobile-group-4`: inner block (`.c-footer-inner-4-mobile__group-4`)
- `footer-inner-4-mobile-list`: inner group (`.c-footer-inner-4-mobile__list`)
- `footer-inner-4-mobile-nav-item`: label text, 14 characters (`.c-footer-inner-4-mobile__nav-item`)
- `footer-inner-4-mobile-nav-2`: inner flex column (`.c-footer-inner-4-mobile__nav-2`)
- `footer-inner-4-mobile-group-5`: inner block (`.c-footer-inner-4-mobile__group-5`, 5 instances)
- `footer-inner-4-mobile-group-6`: inner block (`.c-footer-inner-4-mobile__group-6`, 11 instances)
- `footer-inner-4-mobile-heading-3`: heading, 0 characters (`.c-footer-inner-4-mobile__heading-3`, 11 instances)
- `footer-inner-4-mobile-button`: button (`.c-footer-inner-4-mobile__button`, 11 instances)
- `footer-inner-4-mobile-group-7`: inner flex row (`.c-footer-inner-4-mobile__group-7`, 11 instances)
- `footer-inner-4-mobile-icon`: icon placeholder, 11x6px (`.c-footer-inner-4-mobile__icon`, 11 instances)
- `footer-inner-4-mobile-group-8`: inner block (`.c-footer-inner-4-mobile__group-8`)
- `footer-inner-4-mobile-group-9`: inner block (`.c-footer-inner-4-mobile__group-9`)
- `footer-inner-4-mobile-group-10`: inner group (`.c-footer-inner-4-mobile__group-10`)
- `footer-inner-4-mobile-link`: link, 19-character label (`.c-footer-inner-4-mobile__link`)
- `footer-inner-4-mobile-link-2`: link, 14-character label (`.c-footer-inner-4-mobile__link-2`)
- `footer-inner-4-mobile-text-4`: label text, 0 characters (`.c-footer-inner-4-mobile__text-4`)
- `footer-inner-4-mobile-group-11`: inner block (`.c-footer-inner-4-mobile__group-11`)
- `footer-inner-4-mobile-group-12`: inner block (`.c-footer-inner-4-mobile__group-12`)
- `footer-inner-4-mobile-link-3`: link, 13-character label (`.c-footer-inner-4-mobile__link-3`)
- `footer-inner-4-mobile-group-13`: inner block (`.c-footer-inner-4-mobile__group-13`)
- `footer-inner-4-mobile-text-5`: label text, 48 characters (`.c-footer-inner-4-mobile__text-5`)
- `footer-inner-4-mobile-list-2`: inner group (`.c-footer-inner-4-mobile__list-2`)
- `footer-inner-4-mobile-item-2`: inner group (`.c-footer-inner-4-mobile__item-2`, 5 instances)
- `footer-inner-4-mobile-link-4`: link, 14-character label (`.c-footer-inner-4-mobile__link-4`, 5 instances)

**Mobile recipe**

```html
<div class="c-footer-inner-4-mobile-scope">
  <footer class="c-footer-inner-4-mobile">
    <div class="c-footer-inner-4-mobile__inner">
      <h2 class="c-footer-inner-4-mobile__heading">lorem</h2>
      <h3 class="c-footer-inner-4-mobile__heading-2">lorem ips</h3>
      <div class="c-footer-inner-4-mobile__group">
        <div class="c-footer-inner-4-mobile__group-2">
          <li class="c-footer-inner-4-mobile__item">
            <span class="c-footer-inner-4-mobile__text">lorem ip</span>
            <span class="c-footer-inner-4-mobile__text-2">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusm</span>
          </li>
        </div>
        <p class="c-footer-inner-4-mobile__text-3">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ip</p>
      </div>
      <nav class="c-footer-inner-4-mobile__nav">
        <a class="c-footer-inner-4-mobile__nav-link" href="#">
          <span class="c-footer-inner-4-mobile__group-3"></span>
          <span class="c-footer-inner-4-mobile__text">lorem</span>
        </a>
        <div class="c-footer-inner-4-mobile__group-4">
          <ol class="c-footer-inner-4-mobile__list">
            <li class="c-footer-inner-4-mobile__nav-item">lorem ipsum do</li>
          </ol>
        </div>
      </nav>
      <nav class="c-footer-inner-4-mobile__nav-2">
        <div class="c-footer-inner-4-mobile__group-5">
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum do</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-4-mobile__group-5">
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem i</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum d</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-4-mobile__group-5">
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-4-mobile__group-5">
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum d</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum do</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum do</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
        <div class="c-footer-inner-4-mobile__group-5">
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
          <div class="c-footer-inner-4-mobile__group-6">
            <h3 class="c-footer-inner-4-mobile__heading-3">
              <button class="c-footer-inner-4-mobile__button" type="button">
                <span class="c-footer-inner-4-mobile__text-2">lorem ipsum</span>
                <span class="c-footer-inner-4-mobile__group-7">
                  <span class="c-footer-inner-4-mobile__icon" aria-hidden="true"></span>
                </span>
              </button>
            </h3>
          </div>
        </div>
      </nav>
      <div class="c-footer-inner-4-mobile__group-8">
        <div class="c-footer-inner-4-mobile__group-9">
          <p class="c-footer-inner-4-mobile__group-10">
            <span class="c-footer-inner-4-mobile__text-2">lorem ipsum dolor</span>
            <a class="c-footer-inner-4-mobile__link" href="#">lorem ipsum dolor s</a>
            <span class="c-footer-inner-4-mobile__text-2">lo</span>
            <a class="c-footer-inner-4-mobile__link-2" href="#">lorem ipsum do</a>
            <span class="c-footer-inner-4-mobile__text-2">lorem ipsum</span>
            <span class="c-footer-inner-4-mobile__text-4">
              <span class="c-footer-inner-4-mobile__text-2">lore</span>
              <span class="c-footer-inner-4-mobile__text-2">lorem ipsum do</span>
            </span>
            <span class="c-footer-inner-4-mobile__text-2">l</span>
          </p>
        </div>
        <div class="c-footer-inner-4-mobile__group-11">
          <div class="c-footer-inner-4-mobile__group-12">
            <a class="c-footer-inner-4-mobile__link-3" href="#">lorem ipsum d</a>
          </div>
          <div class="c-footer-inner-4-mobile__group-13">
            <div class="c-footer-inner-4-mobile__text-5">lorem ipsum dolor sit amet consectetur adipiscin</div>
            <ul class="c-footer-inner-4-mobile__list-2">
              <li class="c-footer-inner-4-mobile__item-2">
                <a class="c-footer-inner-4-mobile__link-4" href="#">lorem ipsum do</a>
              </li>
              <li class="c-footer-inner-4-mobile__item-2">
                <a class="c-footer-inner-4-mobile__link-4" href="#">lorem ipsum</a>
              </li>
              <li class="c-footer-inner-4-mobile__item-2">
                <a class="c-footer-inner-4-mobile__link-4" href="#">lorem ipsum dolor</a>
              </li>
              <li class="c-footer-inner-4-mobile__item-2">
                <a class="c-footer-inner-4-mobile__link-4" href="#">lorem</a>
              </li>
              <li class="c-footer-inner-4-mobile__item-2">
                <a class="c-footer-inner-4-mobile__link-4" href="#">lorem ip</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-4-mobile-scope {
  background-color: #FFFFFF;
  color: #1D1D1F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 25px;
}

.c-footer-inner-4-mobile {
  display: block;
  border-spacing: 0px;
  min-width: 320px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #F5F5F7;
  color: #0000008F;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
}

.c-footer-inner-4-mobile__inner {
  display: block;
  max-width: 980px;
  padding-right: 16px;
  padding-left: 16px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-4-mobile__heading {
  display: block;
  width: 1px;
  height: 1px;
  margin: 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.0007px;
}

.c-footer-inner-4-mobile__heading-2 {
  display: block;
  width: 1px;
  height: 1px;
  margin: 5.616px 0px 0px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-4-mobile__group {
  display: block;
  padding-top: 17px;
  padding-bottom: 11px;
  margin-top: 9.6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-4-mobile__group-2 {
  display: block;
  color: #6E6E73;
}

.c-footer-inner-4-mobile__item {
  display: list-item;
  list-style-type: none;
  padding-bottom: 9.6px;
}

.c-footer-inner-4-mobile__text {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-footer-inner-4-mobile__text-3 {
  display: block;
  margin: 0px;
}

.c-footer-inner-4-mobile__nav {
  display: block;
  position: relative;
  z-index: 1;
  color: #000000B8;
  padding-top: 17px;
  padding-bottom: 17px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #00000029;
}

.c-footer-inner-4-mobile__nav::before {
  content: "";
  display: table;
}

.c-footer-inner-4-mobile__nav::after {
  content: "";
  display: table;
}

.c-footer-inner-4-mobile__nav-link {
  display: block;
  position: absolute;
  top: 17px;
  left: 0px;
  z-index: 2;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-4-mobile__group-3 {
  display: block;
  width: 14px;
  height: 18px;
  position: relative;
  z-index: 2;
  background-color: #000000B8;
  color: transparent;
}

.c-footer-inner-4-mobile__group-4 {
  display: block;
  position: relative;
  z-index: 1;
}

.c-footer-inner-4-mobile__group-4::before {
  content: "";
  display: table;
}

.c-footer-inner-4-mobile__group-4::after {
  content: "";
  display: table;
}

.c-footer-inner-4-mobile__list {
  display: block;
  max-height: 9999px;
  padding: 0px 0px 0px 25px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-4-mobile__nav-item {
  display: list-item;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 3px;
  padding-right: 4px;
  padding-bottom: 3px;
  margin-right: 7px;
}

.c-footer-inner-4-mobile__nav-item::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 11px;
  vertical-align: middle;
  background-color: #0000007A;
  margin-top: -1px;
  margin-right: 11px;
}

.c-footer-inner-4-mobile__nav-2 {
  display: flex;
  flex-direction: column;
}

.c-footer-inner-4-mobile__group-5 {
  display: block;
}

.c-footer-inner-4-mobile__group-6 {
  display: block;
  box-sizing: border-box;
  width: calc(100% + 8px);
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-right: 4px;
  padding-bottom: 1px;
  padding-left: 4px;
  margin-left: -4px;
}

.c-footer-inner-4-mobile__group-6::after {
  content: "";
  display: block;
  width: 358px;
  height: 1px;
  position: absolute;
  top: 36px;
  right: 4px;
  bottom: 0px;
  left: 4px;
  z-index: 3;
  background-color: #00000029;
}

.c-footer-inner-4-mobile__heading-3 {
  display: block;
  margin: 0px;
  color: #000000E0;
  font-size: 14.04px;
  font-weight: 600;
  line-height: 18.7206px;
}

.c-footer-inner-4-mobile__button {
  display: block;
  width: 100%;
  padding: 10px 0px;
  position: relative;
  z-index: 2;
  background-color: #F5F5F7;
  color: #000000E0;
  border: 0;
  cursor: pointer;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.0005px;
  letter-spacing: -0.12px;
  text-transform: none;
  text-align: start;
}

.c-footer-inner-4-mobile__button::after {
  content: "";
  display: block;
  width: 366px;
  height: 36px;
  position: absolute;
  top: 0px;
  right: -4px;
  bottom: 0px;
  left: -4px;
}

.c-footer-inner-4-mobile__group-7 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 11px;
  font-size: 14px;
  line-height: 18.6672px;
  transition: transform 0.3s ease;
  margin-top: 5px;
}

.c-footer-inner-4-mobile__icon {
  display: block;
  flex-shrink: 0;
  width: 11px;
  height: 6px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-inner-4-mobile__group-8 {
  display: block;
  padding-top: 17px;
  padding-bottom: 9px;
}

.c-footer-inner-4-mobile__group-9 {
  display: block;
  max-height: 9999px;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.c-footer-inner-4-mobile__group-10 {
  display: block;
  margin: 0px;
}

.c-footer-inner-4-mobile__link {
  display: inline;
  color: #0066CC;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #0066CC;
  white-space: nowrap;
}

.c-footer-inner-4-mobile__link-2 {
  display: inline;
  color: #0066CC;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #0066CC;
}

.c-footer-inner-4-mobile__text-4 {
  display: inline-block;
  white-space: nowrap;
}

.c-footer-inner-4-mobile__group-11 {
  display: block;
  justify-content: space-between;
}

.c-footer-inner-4-mobile__group-12 {
  display: block;
  position: relative;
  top: -3px;
  z-index: 2;
  white-space: nowrap;
  padding-top: 4px;
  margin-top: 5px;
}

.c-footer-inner-4-mobile__link-3 {
  display: inline-block;
  position: relative;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
}

.c-footer-inner-4-mobile__link-3::after {
  content: "";
  display: block;
  width: 71px;
  height: 16px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.c-footer-inner-4-mobile__group-13 {
  display: block;
  position: relative;
  top: -3px;
  z-index: 1;
  padding-top: 12px;
}

.c-footer-inner-4-mobile__group-13::before {
  content: "";
  display: table;
}

.c-footer-inner-4-mobile__group-13::after {
  content: "";
  display: table;
}

.c-footer-inner-4-mobile__text-5 {
  display: block;
  max-height: 9999px;
  list-style-type: none;
  margin-top: 5px;
}

.c-footer-inner-4-mobile__list-2 {
  display: block;
  padding: 0px;
  margin: 5px 0px 0px;
  position: relative;
  top: -5px;
  z-index: 1;
  list-style-type: none;
}

.c-footer-inner-4-mobile__item-2 {
  display: inline-block;
  position: relative;
  margin-top: 5px;
  margin-right: 6px;
}

.c-footer-inner-4-mobile__item-2::before {
  content: "";
  display: block;
  width: 73px;
  height: 16px;
  position: absolute;
  top: 0px;
  right: 9px;
  bottom: 0px;
  left: 0px;
}

.c-footer-inner-4-mobile__item-2::after {
  content: "";
  display: block;
  width: 1px;
  height: 10px;
  position: absolute;
  top: 0px;
  right: -1px;
  bottom: 0px;
  left: 82.4219px;
  background-color: #0000007A;
  margin-top: 3px;
  margin-bottom: 3px;
}

.c-footer-inner-4-mobile__link-4 {
  display: inline-block;
  color: #000000B8;
  cursor: pointer;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 9px;
  padding-left: 9px;
  margin-left: -9px;
}

.c-footer-inner-4-mobile__nav-link:hover {
  text-decoration-line: underline;
}

.c-footer-inner-4-mobile__nav-link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-4-mobile__button:hover {
  color: #000000;
}

.c-footer-inner-4-mobile__button:hover::after {
  color: #000000;
}

.c-footer-inner-4-mobile__button:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-4-mobile__button:focus::after {
  outline: 2px solid #0071E3;
  outline-offset: -2px;
}

.c-footer-inner-4-mobile__link:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-4-mobile__link-2:focus {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-4-mobile__link-3:hover {
  text-decoration-line: underline;
}

.c-footer-inner-4-mobile__link-3:focus {
  outline: none;
}

.c-footer-inner-4-mobile__link-3:focus::after {
  outline: 2px solid #0071E3;
  outline-offset: 1px;
}

.c-footer-inner-4-mobile__link-4:hover {
  text-decoration-line: underline;
}

.c-footer-inner-4-mobile__link-4:focus {
  outline: none;
}
```

**States**

- `footer-inner-4-nav-link` hover: text-decoration-line underline
- `footer-inner-4-nav-link` focus: outline 2px solid #0071E3, outline-offset 1px
- `footer-inner-4-nav-link-2` hover: text-decoration-line underline
- `footer-inner-4-nav-link-2` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-4-mobile-nav-link` hover: text-decoration-line underline
- mobile, `footer-inner-4-mobile-nav-link` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-4-mobile-button` hover (`footer-inner-4-mobile-button-hover`): color #000000, ::after color #000000
- mobile, `footer-inner-4-mobile-button` focus: outline 2px solid #0071E3, outline-offset 1px, ::after outline 2px solid #0071E3, ::after outline-offset -2px
- mobile, `footer-inner-4-mobile-link` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-4-mobile-link-2` focus: outline 2px solid #0071E3, outline-offset 1px
- mobile, `footer-inner-4-mobile-link-3` hover: text-decoration-line underline
- mobile, `footer-inner-4-mobile-link-3` focus: outline none, ::after outline 2px solid #0071E3, ::after outline-offset 1px
- mobile, `footer-inner-4-mobile-link-4` hover: text-decoration-line underline
- mobile, `footer-inner-4-mobile-link-4` focus: outline none

## Do's and Don'ts

### Do
- Do fill primary actions with **Action Blue** (`primary`, #0071E3) and white labels (`on-primary`). The site applies this fill on `button-primary` and the primary CTA parts (`card-cta`, `promo-banner-cta`), and hover shifts it to #0076DF.
- Do give every button the `pill` radius (980px), as `button-primary`, `button-secondary`, `button-secondary-2` and `button-ghost` all do.
- Do keep control heights on the measured ladder: 44px for `button-primary`, `button-secondary`, `button-ghost` and `button-ghost-2`; 36px for the compact `button-secondary-2`.
- Do pair a filled pill with an outlined sibling in hero CTA pairs: `link` (#0066CC) outline on light bands, `link-on-dark` (#2997FF) outline on dark bands.
- Do keep the frosted nav: `saturate(1.8) blur(20px)` over a translucent `surface-dark` fill on `header-landing`. Don't replace it with an opaque bar.
- Do lift white `rounded.xl` cards on `surface-alt` with the single `#00000014 2px 4px 12px 0px` shadow, as `card-4` does. `card-4` instances sit in an 8-column grid and `card-8` in a 3-column grid.
- Do use only weights 400, 600 and 700, and keep the SF Pro Display / SF Pro Text split at the 21px boundary.
- Do draw every focus state as the `2px solid #0071E3` outline (`primary-focus`).

### Don't
- Don't use `primary` as a text, background or decorative color. Body links take `link`, and links on dark bands take `link-on-dark`.
- Don't set text in pure `black` on light grounds. Use `ink` (#1D1D1F), then `muted` (#6E6E73) for secondary lines.
- Don't add a third typeface or a 300/500 weight, and don't drop the token letter-spacing. Headlines need their negative tracking.
- Don't introduce heavier shadows, colored shadows or shadows on buttons. The system has one shadow value and it belongs to cards.
- Don't use square corners or a mid-radius (`rounded.sm`/`rounded.md`) on CTAs. Buttons are pills.
- Don't use `hairline` (#D2D2D7) as a fill. It is a 1px divider on tabs and table rows, and appears in translucent form on circular controls.
- Don't introduce gradients in CSS. Glow and chrome belong to product imagery.
- Don't crowd hero bands. One headline (`display-lg`/`hero-display`), one tagline (`subtitle`), at most two pills.

## Responsive Behavior

This is a **two-viewport analysis** (desktop and mobile captures only). No breakpoint values were observed, and none should be inferred from this document.

### What changes between viewports
- **Global nav:** on desktop, a slim bar of evenly spaced `nav-link` text links with search and bag icons; `header-landing` is 44px high. On mobile it collapses to logo, search, bag and a hamburger toggle; `header-landing-mobile` is 48px high, with a 48px `header-landing-mobile-menu-toggle` carrying an 18px icon. Both viewports keep the `saturate(1.8) blur(20px)` frosted fill (mobile recipe flagged: nav-link x did not reproduce).
- **Hero bands:** stay full-bleed and centered on both viewports. The black/Parchment alternation is preserved. The CTA pair stays side by side and centered.
- **Tile mosaic and card grids:** collapse from multi-column on desktop to a stacked column on mobile.
- **Footer:** on desktop, link columns spread across the footer. On mobile they become accordion rows: `footer-landing-mobile-button` on `surface-alt` with an 11×6px chevron icon, separated by `#00000029` hairlines (flagged: footer height did not reproduce).

### Touch targets
Primary controls are 44px tall (`button-primary`, `button-ghost`, `nav-menu-item`). Mobile nav targets grow to 48px (`header-landing-mobile-nav-link-2`, the menu toggle). The compact `button-secondary-2` (36px) and the Shop nav CTA `button-primary-5` (24px, flagged: render 21px narrower) fall below that and should be kept to secondary or desktop contexts.

## Iteration Guide

1. **Reference tokens, never raw hex.** Write `primary`, `ink`, `surface-alt`, `rounded.pill`, `body`. The only hexes outside tokens are the measured state values: hover #0076DF, the nav translucencies #1D1D1FCC / #FAFAFCCC, and the footer hairline #00000029. Those belong inside their component recipes.
2. **Variants live in the component keys.** Button variants are `button-primary` (filled), `button-secondary` (outlined on dark, `link-on-dark`), `button-ghost` (outlined on light, `link`) and `button-secondary-2` (compact 36px). Extend this family; don't invent new button shapes or fills.
3. **Blue is for interaction only.** `primary` may appear as a CTA fill or a focus ring, nowhere else. A new feature that needs emphasis gets weight or size from the type ladder, not color.
4. **Respect the type boundary.** Sizes of 21px and above use SF Pro Display at weight 600 (400 for taglines). Sizes of 17px and below use SF Pro Text. Each size carries its exact token letter-spacing and line-height. Weights other than 400/600/700 are out of system.
5. **Elevation has four tiers and no more:** flat tonal bands, 1px hairlines, the single `#00000014 2px 4px 12px 0px` card shadow, and the `saturate(1.8) blur(20px)` frosted nav. Pick one; never combine shadow and blur on the same surface.
6. **Pills and soft cards are non-negotiable.** Buttons use `rounded.pill`; cards use `rounded.xl` (or `rounded.sm` for media tiles). Square corners break the system.
7. **Treat flagged recipes as approximations.** For components marked flagged (headers, footers, most cards), trust the colors and typography, but re-measure positions and heights before relying on them.

## Known Gaps

- **Layout dimensions are largely unverified.** No container max-width, grid gap, base spacing step or section padding token survived verification. Only button paddings are confirmed. Tile gutters and band heights must be judged from screenshots.
- **Many recipes did not reproduce exactly.** All headers and footers, most cards (`card`, `card-2`, `card-3`, `card-9`), `promo-banner`, `input`, `table` and several CTAs are flagged, mostly for position or size drift. Their colors and typography are reliable; their geometry is not.
- **Media-dominated components could not be compared:** `card-5`, `card-7`, `card-6`, `carousel-section` and `button-ghost-4` (not verifiable: page media covers most of each component).
- **Two `footer-inner` mobile variants could not be rendered on their own:** `footer-inner-mobile`, `footer-inner-3-mobile` and `footer-inner-4-mobile`.
- **Interaction coverage is partial.** Hover and focus were measured on buttons, nav links and footer links. Pressed/active states, the nav mega-menu flyouts, carousel scroll behavior, video playback and scroll-driven animations were not captured.
- **Only two viewports were captured**, so no breakpoint values or tablet behavior are known.
- **Authenticated and transactional surfaces were not reached.** Bag, checkout, account and configurator steps beyond the five captured pages (home, payment plan, buy Mac, buy Vision, trade-in) may introduce further patterns.
- **SF Pro is proprietary**, so rebuilds on non-Apple platforms will need a substitute, and type metrics will shift slightly.
- **No dark theme was captured.** Dark bands are authored per section, not via a theme switch.
