import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface ScrollArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}

const ScrollArrowButton = ({ direction, onClick, className = '' }: ScrollArrowButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`scroll-arrow-btn ${className}`}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
    >
      <span className="arrow-box">
        <FontAwesomeIcon 
          icon={direction === 'left' ? faArrowLeft : faArrowRight} 
          className="arrow-icon" 
        />
        <FontAwesomeIcon 
          icon={direction === 'left' ? faArrowLeft : faArrowRight} 
          className="arrow-icon" 
          style={{ color: 'hsl(54, 100%, 50%)' }}
        />
      </span>
    </button>
  );
};

export default ScrollArrowButton;
