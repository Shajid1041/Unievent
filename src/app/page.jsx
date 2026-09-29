"use client";
import Image from "next/image";
import {
  Users,
  Briefcase,
  Link as LinkIcon,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeatureCarousel from "@/components/FeatureCarousel";
export default function Home() {
  const heroData = {
    title: (
      <>
        A new way to learn
        <br />
        & get knowledge
      </>
    ),

    subtitle:
      "EduFlex is here for you with various courses & materials from skilled tutors all around the world.",

    actions: [
      {
        text: "Join the Class",
        onClick: () => alert("Join the Class clicked!"),
        variant: "default",
      },
      {
        text: "Learn More",
        onClick: () => alert("Learn More clicked!"),
        variant: "outline",
      },
    ],

    stats: [
      {
        value: "15.2K",
        label: "Active students",
        icon: (
          <Users className="h-5 w-5 text-muted-foreground" />
        ),
      },
      {
        value: "4.5K",
        label: "Tutors",
        icon: (
          <Briefcase className="h-5 w-5 text-muted-foreground" />
        ),
      },
      {
        value: "Resources",
        label: "",
        icon: (
          <LinkIcon className="h-5 w-5 text-muted-foreground" />
        ),
      },
    ],

    images: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    ],
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        actions={heroData.actions}
        stats={heroData.stats}
        images={heroData.images}
      />
      <div className="min-h-screen bg-background min-w-screen flex items-center justify-center">
        <FeatureCarousel />
      </div>
    </div>
  );
}
