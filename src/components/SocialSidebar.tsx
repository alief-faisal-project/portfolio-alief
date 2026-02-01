import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface SocialLink {
  icon: IconDefinition;
  name: string;
  url: string;
  className: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: faInstagram,
    name: "Instagram",
    url: "https://instagram.com/faisaladrsyah",
    className: "instagram",
  },
  {
    icon: faWhatsapp,
    name: "WhatsApp",
    url: "https://wa.me/6283120996468",
    className: "whatsapp",
  },
  {
    icon: faEnvelope,
    name: "Email",
    // 🔥 GMAIL WEB (BUKA TAB BARU)
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=alieffaisal222@gmail.com",
    className: "email",
  },
];

interface SocialSidebarProps {
  visible?: boolean;
}

const SocialSidebar = ({ visible = true }: SocialSidebarProps) => {
  return (
    <div
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-20 pointer-events-none"
      }`}
    >
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-icon ${social.className}`}
        >
          <span className="tooltip">{social.name}</span>
          <FontAwesomeIcon icon={social.icon} />
        </a>
      ))}
    </div>
  );
};

export default SocialSidebar;
