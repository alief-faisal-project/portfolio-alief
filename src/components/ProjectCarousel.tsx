import { useRef, useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import ScrollArrowButton from './ScrollArrowButton';

import project1Image from '@/assets/project-1.jpg';
import project2Image from '@/assets/project-2.jpg';
import project3Image from '@/assets/project-3.jpg';
import project4Image from '@/assets/project-4.jpg';
import project5Image from '@/assets/project-5.jpg';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "URBNX",
    description: "Website Katalog dan Galeri Produk Fashion Streetwear",
    imageUrl: project1Image,
    projectUrl: "https://urbnx.vercel.app/",
  },
  {
    id: 2,
    title: "BUSALIME",
    description:
      "Website Company Profile dan Showcase Produk Perusahaan Cairan Pencuci Piring",
    imageUrl: project2Image,
    projectUrl: "https://busalime.vercel.app/",
  },
  {
    id: 3,
    title: "Pemetaan Kelompok Tani Padi",
    description:
      "Sistem Pemetaan Pertanian Berbasis GIS untuk Kelompok Tani Padi di Wilayah Pandeglang",
    imageUrl: project3Image,
    projectUrl: "https://pemetaanpoktan-pandeglang.vercel.app/",
  },
  {
    id: 4,
    title: "Next Porject",
    description: "Coming Soon...",
    imageUrl: "https://i.ibb.co.com/CswkjD7h/loading.jpg",
    projectUrl: "#",
  },
  {
    id: 5,
    title: "Next Porject",
    description: "Coming Soon...",
    imageUrl: "https://i.ibb.co.com/CswkjD7h/loading.jpg",
    projectUrl: "#",
  },
];

const ProjectCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.project-card')?.clientWidth || 300;
    const scrollAmount = cardWidth + 24; // card width + gap
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.project-card')?.clientWidth || 300;
    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth + 24));
    setActiveIndex(Math.min(newIndex, projects.length - 1));
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.project-card')?.clientWidth || 300;
    const scrollPosition = index * (cardWidth + 24);
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Some of my recent projects
        </h2>
        
        <div className="relative">
          {/* Scroll Arrows - Hidden on Mobile */}
          {!isMobile && (
            <>
              <div className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-10">
                <ScrollArrowButton direction="left" onClick={() => scrollTo('left')} />
              </div>
              <div className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-10">
                <ScrollArrowButton direction="right" onClick={() => scrollTo('right')} />
              </div>
            </>
          )}
          
          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
          >
            {projects.map((project) => (
              <div key={project.id} className="snap-start">
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  projectUrl={project.projectUrl}
                />
              </div>
            ))}
          </div>
          
          {/* Carousel Pills */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`carousel-pill ${activeIndex === index ? 'active' : ''}`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
