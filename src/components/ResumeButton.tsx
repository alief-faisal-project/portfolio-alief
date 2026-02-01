import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

interface ResumeButtonProps {
  href?: string;
}

const ResumeButton = ({ href = "https://drive.google.com" }: ResumeButtonProps) => {
  return (
    <div className="resume-btn-wrapper relative group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-resume-new inline-flex items-center gap-3"
      >
        <FontAwesomeIcon icon={faFileAlt} className="text-lg" />
        Resume
      </a>
      <span className="resume-tooltip">Download Resume</span>
    </div>
  );
};

export default ResumeButton;
