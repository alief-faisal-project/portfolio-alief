import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import TextPressure from '@/components/TextPressure';
import ResumeButton from '@/components/ResumeButton';
import ProjectCarousel from '@/components/ProjectCarousel';
import SocialSidebar from '@/components/SocialSidebar';
import MusicPlayer from '@/components/MusicPlayer';

const Index = () => {
  const [showSocial, setShowSocial] = useState(true);
  const projectSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (projectSectionRef.current) {
        const rect = projectSectionRef.current.getBoundingClientRect();
        // Hide social when project section is in view
        setShowSocial(rect.top > window.innerHeight * 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SocialSidebar visible={showSocial} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center justify-center">
          {/* Text Pressure Name */}
          <div className="w-full max-w-4xl h-32 md:h-48 mb-8">
            <TextPressure
              text="FAISAL"
              textColor="hsl(0, 0%, 8%)"
              weight={true}
              width={true}
              italic={true}
              flex={true}
              minFontSize={48}
            />
          </div>
          
          {/* Tagline */}
          <p className="text-muted-foreground text-center text-lg md:text-xl mb-10 max-w-md">
            Teknik Informatika, Frontend Developer
          </p>
          
          {/* Resume Button */}
          <div className="flex justify-center">
            <ResumeButton href="https://drive.google.com" />
          </div>
          
          {/* Music Player */}
          <MusicPlayer />
        </div>
      </section>
      
      {/* Projects Section */}
      <div ref={projectSectionRef}>
        <ProjectCarousel />
      </div>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Faisal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
