export interface SocialLink {
  label: string;
  url: string;
}

export interface BoardMember {
  name: string;
  role: string;
  bio?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface SiteSettings {
  companyName: string;
  founderName: string;
  founderRole: string;
  founderImage: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutBody: string;
  email: string;
  socialLinks: SocialLink[];
  directors: BoardMember[];
  employees: TeamMember[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'Apparellex',
  founderName: 'Shaikh Kamran',
  founderRole: 'Founder & CEO, Apparellex',
  founderImage:
    'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80',
  aboutTitle: 'REDEFINING THE RETAIL ECOSYSTEM',
  aboutIntro:
    'Founded by Shaikh Kamran, Apparellex is a high-octane fashion startup designed for the modern disruptor. We noticed a flaw in the world: fashion was either fast and low-quality, or premium and agonizingly slow.',
  aboutBody:
    'We bridged the gap. Apparellex combines curated luxury with instant gratification. We do not just sell clothes; we provide a 10-minute gateway to your best self. Every stitch, every delivery, and every digital interaction is engineered to make you feel like the world is your runway.',
  email: 'Apparellexsk@gmail.com',
  socialLinks: [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'Twitter / X', url: 'https://twitter.com' },
    { label: 'Facebook', url: 'https://facebook.com' },
  ],
  directors: [
    { name: 'Shaikh Kamran', role: 'Founder & CEO', bio: 'Visionary building the 10-minute luxury retail model.' },
    { name: 'Amelia Hart', role: 'Board Director', bio: 'Brand strategy and expansion across digital-first retail.' },
    { name: 'Dorian Lee', role: 'Operations Director', bio: 'Micro-fulfillment network design and delivery innovation.' },
  ],
  employees: [
    { name: 'Nadia Malik', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80' },
    { name: 'Omar Siddiq', role: 'Style Merchandising Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80' },
    { name: 'Rhea Collins', role: 'Community Experience Lead', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80' },
  ],
};
