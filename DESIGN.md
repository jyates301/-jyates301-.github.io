# Design Plan

This site is a single-page, static personal course website for the Intro to AI (AI 109) class. The overall goal is to present my name, course context, a brief professional introduction, and a highlight of my main project in a clean and minimal layout. The page uses a dark header with a light body background for strong visual hierarchy and readability. Flexbox is used to organize content in the header and projects area, and the layout is designed to stack naturally on smaller screens. The design uses system fonts, comfortable spacing, and clear section titles to create a professional, portfolio-style presentation without distractions.

## Page Structure Outline

- **Header (`<header id="home">`)**
  - Site title: “Jordan Yates”
  - Subtitle: “Intro to AI (AI 109)”
  - Top navigation (`<nav>`) with anchor links:
    - Home (`#home`)
    - About (`#about`)
    - Projects (`#projects`)

- **Main (`<main>`)**
  - **About Section (`<section id="about">`)**
    - Heading: “About”
    - Paragraph: 3–6 sentence professional introduction
  - **Projects Section (`<section id="projects">`)**
    - Heading: “Projects”
    - Project card (`<article>`)
      - Subheading: “Project 1, Part 2: JavaScript Game (Coming Soon)”
      - Short project description
      - Link to GitHub profile (placeholder username)

- **Footer (`<footer>`)**
  - Single line of text with copyright and year

## Layout and Navigation Choices

The site is implemented as a **single-page layout** to keep navigation simple and to match the small, focused scope of a course project. The header uses Flexbox to align the name, subtitle, and navigation horizontally on larger screens, then stacks them vertically on tablets and phones for better readability. The projects section also uses a flex-based grid so that project cards sit side by side on wider displays and stack into a single column on smaller screens. Navigation is provided by a top bar with anchor links that smoothly scroll to the corresponding sections using CSS `scroll-behavior: smooth`, avoiding any need for JavaScript while keeping the user experience polished. On small screens, the nav items wrap or stack vertically so they remain easy to tap and don’t require a hamburger menu.

## Design Rationale

I organized the content by priority and clarity: the header immediately communicates who I am and which course this site supports, followed by an About section that provides context about my interests and goals in AI, and finally a Projects section that highlights concrete work. Keeping everything on a single page with distinct, clearly labeled sections minimizes cognitive load and makes it easy for an instructor or viewer to scan the content quickly. The dark header separates identity and navigation from the main content, while the light background and generous spacing in the body improve legibility and give the site a professional feel. Using simple Flexbox-based layouts and responsive media queries ensures that the site remains usable and visually coherent across desktops, tablets, and phones without relying on external frameworks, which aligns well with the project’s constraints and learning objectives.