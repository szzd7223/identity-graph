"use client";

import { Header } from "../components/landing/Header";
import { HeroSection } from "../components/landing/HeroSection";
import { ProblemSolutionSection } from "../components/landing/ProblemSolutionSection";
import { StorySection } from "../components/landing/StorySection";
import { CtaFooterSection } from "../components/landing/CtaFooterSection";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Modular Header Component */}
      <Header />

      {/* Modular Hero Section */}
      <HeroSection />

      {/* Modular Problem & Solution Bento Grid Section */}
      <ProblemSolutionSection />

      {/* Modular Story Section */}
      <StorySection />

      {/* Modular CTA & Structured Footer Section */}
      <CtaFooterSection />
    </div>
  );
}
