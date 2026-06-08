import { PROJECTS_IMAGE_RADIUS } from "@/lib/projects-owow-panel";

/** Motion Design — Figma global x=20822 … 27377 (node 88:151). */
export const MOTION_DESIGN_PANEL = {
  width: 6655,
  height: 982,
  tag: {
    x: 0,
    y: 544,
    label: "Adobe After Effects",
  },
  title: {
    x: 0,
    y: 552,
    fontSize: 120.765,
  },
  body: {
    x: 980,
    y: 334,
    width: 475,
    fontSize: 24.153,
  },
  project: {
    x: 830,
    y: 648,
    fontSize: 120.765,
  },
  clips: [
    {
      x: 1542,
      y: 177,
      width: 1116,
      height: 628,
      radius: PROJECTS_IMAGE_RADIUS,
      src: "/projects/motion-hug.webm",
      alt: "HUG kinetic typography",
    },
    {
      x: 2795,
      y: 101,
      width: 914,
      height: 514,
      radius: PROJECTS_IMAGE_RADIUS,
      src: "/projects/motion-melting.webm",
      alt: "MELTING kinetic typography",
    },
    {
      x: 3838,
      y: 433,
      width: 645,
      height: 363,
      radius: PROJECTS_IMAGE_RADIUS,
      src: "/projects/motion-shoot.webm",
      alt: "SHOOT kinetic typography",
    },
    {
      x: 4505,
      y: 519,
      width: 612,
      height: 344,
      radius: PROJECTS_IMAGE_RADIUS,
      src: "/projects/motion-kiled.webm",
      alt: "KILLED kinetic typography",
    },
    {
      x: 5158,
      y: 237,
      width: 672,
      height: 378,
      radius: PROJECTS_IMAGE_RADIUS,
      src: "/projects/motion-falling-1.webm",
      alt: "Falling kinetic typography",
    },
    {
      x: 5883,
      y: 401,
      width: 672,
      height: 378,
      radius: PROJECTS_IMAGE_RADIUS,
      src: "/projects/motion-falling-2.webm",
      alt: "Falling kinetic typography variant",
    },
  ],
} as const;
