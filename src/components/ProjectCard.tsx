interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}

const ProjectCard = ({ title, description, imageUrl, projectUrl }: ProjectCardProps) => {
  return (
    <a
      href={projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card block min-w-[280px] md:min-w-[300px] group cursor-pointer"
    >
      <div className="relative h-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-card">
          <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm opacity-80 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
