type SiteLogoProps = {
  className?: string;
  alt?: string;
};

function SiteLogo({ className = "", alt = "RicHealth AI" }: SiteLogoProps) {
  return <img className={className} src="/logo-1.png" alt={alt} />;
}

export default SiteLogo;
