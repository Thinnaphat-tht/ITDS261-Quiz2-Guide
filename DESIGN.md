---
name: ITDS261 Quiz 2 Guide
description: A cyanotype drawing set for reading DFD, Git and Unit test before a closed-book quiz.
colors:
  cyanotype-ground: "#0d3770"
  sheet-panel: "#0a2f62"
  drafting-ink: "#eaf3ff"
  faded-ink: "#b6cff5"
  pale-cyan-line: "#9fd0ff"
  sheet-chip: "#123f80"
  amber-mark: "#ffc84a"
  highlight-yellow: "#ffe08a"
  correct-green: "#5ee39b"
  revision-red: "#ff7b7b"
  whiteprint-ground: "#e6eefa"
  whiteprint-panel: "#ffffff"
  whiteprint-ink: "#0b2a5b"
  whiteprint-faded-ink: "#3b527c"
  whiteprint-blue: "#1450b0"
  whiteprint-chip: "#e8f0fc"
  whiteprint-amber-ink: "#8a4b00"
  whiteprint-highlight: "#0a3a8f"
  whiteprint-green: "#14803f"
  whiteprint-red: "#c4262e"
  whiteprint-button: "#0f3f8f"
typography:
  display:
    fontFamily: "Chakra Petch, Sarabun, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.05
  headline:
    fontFamily: "Chakra Petch, Sarabun, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Chakra Petch, Sarabun, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Sarabun, Noto Sans Thai, Tahoma, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Chakra Petch, Sarabun, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.1em"
  code:
    fontFamily: "Consolas, Cascadia Mono, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0px"
  process: "10px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "18px"
  lg: "28px"
  sheet: "44px"
components:
  button-primary:
    backgroundColor: "{colors.amber-mark}"
    textColor: "{colors.sheet-panel}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
  button-ghost:
    backgroundColor: "{colors.sheet-panel}"
    textColor: "{colors.drafting-ink}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  nav-tab:
    textColor: "{colors.faded-ink}"
    padding: "8px 14px"
  nav-tab-active:
    textColor: "{colors.drafting-ink}"
  quiz-option:
    backgroundColor: "{colors.sheet-panel}"
    textColor: "{colors.drafting-ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  quiz-option-right:
    textColor: "{colors.correct-green}"
  quiz-option-wrong:
    textColor: "{colors.revision-red}"
  progress-chip:
    textColor: "{colors.drafting-ink}"
    size: "38px"
  progress-chip-right:
    backgroundColor: "{colors.correct-green}"
    size: "38px"
  progress-chip-wrong:
    backgroundColor: "{colors.revision-red}"
    size: "38px"
---

# Design System: ITDS261 Quiz 2 Guide

## Overview

**Creative North Star: "The Drawing Set"**

The guide is a set of engineering sheets. Each topic is one sheet with a title block (SHEET, SOURCE, TIME, STATUS), the home page is the cover sheet, and the lecturer's slides are pinned to the sheet like plotted prints. The world comes from the subject itself: DFDs and flowcharts are line drawings, so the frame speaks in drafting lines on cyanotype blue.

The world owns the frame and leaves the reading column calm. The drafting grid lives only on the page ground behind the sheet; text sits on a flat sheet panel with real contrast. Density is moderate: one reading column of about 70 characters with slides in a right-hand margin on wide screens.

The user chose this direction over three others (highlighted study sheet, Swiss poster, plain document). Blue is a durable brand commitment; a green page theme and purple are rejected. Green is allowed only as the meaning "correct" in quiz feedback.

**Key Characteristics:**
- Cyanotype ground with a faint 32px drafting grid outside the sheet.
- Square corners everywhere; the only rounded shape is the DFD process box.
- Drafting labels in tracked Chakra Petch; reading text in Sarabun at 18px.
- One amber accent for exam-critical marks and the primary action.
- A manual light/dark toggle: cyanotype (dark) and whiteprint (light) are the same world inverted.

## Colors

A two-state blueprint palette: cyanotype blue with pale ink, and its whiteprint inversion, each with one amber mark and semantic green/red for answers.

### Primary
- **Amber Mark** (cyanotype) / **Whiteprint Amber Ink** (light): the exam-critical colour. Day-count numeral, active tab underline, progress bar, primary button, trap callout border, the "read" stamp.

### Secondary
- **Pale Cyan Line** / **Whiteprint Blue**: section headings, links, slide captions' labels, process numbers, option letters.

### Tertiary
- **Highlight Yellow** / **Whiteprint Highlight**: every `b`/`strong` in body text and DFD flow labels. Added because bold white text read poorly on the dark sheet.
- **Correct Green** and **Revision Red**: quiz feedback only (right/wrong option, progress chip, feedback box, score band). Never decorative.

### Neutral
- **Cyanotype Ground** / **Whiteprint Ground**: page background behind the sheet, carries the drafting grid.
- **Sheet Panel** / **Whiteprint Panel**: the reading surface of every sheet and callout.
- **Drafting Ink** / **Whiteprint Ink**: body text.
- **Faded Ink** / **Whiteprint Faded Ink**: captions, metadata, inactive tabs (still ≥7:1).
- **Sheet Chip** / **Whiteprint Chip**: table headers, code background, hover fill.
- Lines are the pale cyan at 42% opacity in dark and the whiteprint blue at 40% in light.

### Named Rules
**The One Amber Rule.** Amber marks what is examined or what to do next. It never decorates.

**The Meaning-Only Green Rule.** Green appears only to say "correct". A green page theme is rejected.

## Typography

**Display Font:** Chakra Petch (with Sarabun fallback), self-hosted woff2, Thai and Latin subsets.
**Body Font:** Sarabun (with Noto Sans Thai, Tahoma).
**Code Font:** Consolas (with Cascadia Mono, monospace), system font, only for Git commands and JUnit code.

**Character:** Chakra Petch is angular drafting lettering for the frame; Sarabun is a plain, highly legible Thai reading face for the column.

### Hierarchy
- **Display** (700, clamp(2.2rem, 5vw, 3.6rem), 1.05): cover sheet title only. The day-count numeral uses the same face at up to 11rem in amber.
- **Headline** (700, clamp(1.7rem, 3vw, 2.3rem), 1.25): the h1 of each sheet and of the quiz.
- **Title** (700, 1.3rem, 1.4): section headings (h2) in pale cyan / whiteprint blue.
- **Body** (400, 18px, 1.8): reading text, max about 70 characters; 17px under 640px.
- **Label** (500, 13px, 0.1em tracking): title-block captions, nav tab codes (S1, DRILL), figure captions.

### Named Rules
**The Calm Column Rule.** Drafting type stays in the frame (nav, title block, labels, headings). Paragraphs are always Sarabun.

## Layout

Single file, hash-routed sheets: Home (cover), S1 DFD, S2 Error, S3 Git, S4 Unit test, Quiz. A sticky top bar holds the mark, the sheet tabs and the theme toggle, with a 3px amber progress line under it.

The sheet is centred at max 1220px. At 1120px and wider the sheet reserves a 440px right margin and slide figures float into it (380px wide), stacked in order beside their section. Below 1120px figures return to the column at max 560px. The Error sheet keeps its slide figures inline because each figure belongs to a question. Under 640px the title block wraps to two columns and DFD diagrams keep a 680px minimum width inside a horizontally scrollable frame.

Spacing rhythm: 6 / 12 / 18 / 28 / 44px; more space above a heading (34px) than below (8px).

## Elevation & Depth

Flat by default. Depth comes from the grid ground versus the solid sheet, and from one shadow: plotted slides sit on the sheet with a soft offset shadow.

### Shadow Vocabulary
- **Pinned print** (`box-shadow: 0 8px 22px rgba(0,0,0,.45)`, lighter blue-grey in whiteprint): slide images and the hunt plate only.

### Named Rules
**The Paper-On-Sheet Rule.** Only real paper (slides) casts a shadow. UI never does.

## Shapes

Square corners and 1px drafting lines throughout: buttons, options, callouts, title block, chips. The only curve is the DFD process box (10px radius) because Gane/Sarson notation requires it. Callouts carry their label in a notch cut into the top border (นิยาม, กับดัก, โน้ตของคุณ); trap callouts use the amber line, handwritten-note callouts a dashed line. No coloured side stripes.

## Components

### Buttons
- **Shape:** square (0px).
- **Primary:** amber fill with dark sheet-blue text (navy fill with white text in whiteprint), 12px 22px, Chakra Petch 700.
- **Ghost:** transparent with a 1px line, ink text, 8px 14px; used for back, reset and theme toggle.
- **Hover / Focus:** primary brightens slightly; ghost fills with Sheet Chip. Focus is a 3px amber outline with 3px offset everywhere.

### Chips (quiz progress)
- **Style:** 38px squares (34px on phones), numbered, 1px line.
- **State:** green fill = answered right, red fill = answered wrong, empty = not answered, amber outline = current question. Numerals are dark on fills in cyanotype and white in whiteprint.

### Cards / Containers
- **Sheet:** solid panel, 1px line, 40px 44px padding.
- **Callouts:** panel background, 1px line with notched label, 18px padding.
- **Title block:** a four-cell grid of label + value directly under each sheet h1.

### Navigation
- Sheet tabs show a tracked code (COVER, S1–S4, DRILL) above the Thai name. Inactive tabs use faded ink; the active tab is ink with a 3px amber underline sitting on the bar's bottom rule. A skip button appears on first Tab. Arrow keys turn sheets.

### Plotted Slide
- A white plate with the pinned-print shadow; the image reveals left to right with a clip-path wipe when scrolled into view (0.9s). Click, Enter or Space opens a full-screen lightbox.

### Error Hunt
- The lecturer's slide (L6 p42) as a plate. Clicking a correct spot, or choosing it from a keyboard-accessible button list, draws a red revision ellipse (stroke draw, 0.7s) and adds the rule explanation; a wrong choice shakes the plate.

### Quiz Option
- Full-width square row with an option letter. After answering: the right option turns green with "ถูก", the chosen wrong option red with "คุณเลือก"; a feedback box repeats the colour, explains the rule and cites the slide page.

### DFD Diagram
- Drawn in SVG from data in Gane/Sarson notation: square entities, rounded process boxes with a number band, open data stores with an ID cell. Lines in ink, flow labels in Highlight Yellow with a panel-coloured halo; two-way flows between one pair are offset to opposite sides.

## Do's and Don'ts

### Do:
- **Do** keep every new page inside the drawing-set frame: sheet panel, title block, square corners, 1px lines.
- **Do** use amber only for exam-critical marks and the next action.
- **Do** use green for correct and red for wrong in any answer feedback, in both themes.
- **Do** show the lecturer's real slide instead of redrawing it, with a caption naming lecture and page.
- **Do** keep body text Sarabun 18px at about 70 characters and contrast at 4.5:1 or more in both themes.
- **Do** give every motion a reduced-motion fallback that still shows the final state.

### Don't:
- **Don't** use a green or purple page theme; blue is the committed family.
- **Don't** put the drafting grid behind reading text.
- **Don't** add rounded cards, coloured side stripes, gradients or glow shadows.
- **Don't** use emoji as icons.
- **Don't** let a feature work by mouse only; every click interaction needs a keyboard path.
