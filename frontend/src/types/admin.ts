export interface Application {
  _id: string;
  userId: {
    username: string;
    email: string;
    avatar: string;
    discordId: string;
  };
  basicInfo: {
    fullName: string;
    preferredName?: string;
    school: string;
    year: string;
    location?: string;
  };
  skillsAndLinks: {
    skills: string[];
    githubUrl?: string;
    portfolioUrl?: string;
    otherLinks?: string[];
  };
  accessibility: {
    allergies?: string;
    dietaryRestrictions?: string;
    accommodations?: string;
  };
  accepted: boolean;
  rsvpd: boolean;
}

export interface TestApplication {
  _id: string;
  basicInfo: {
    fullName: string;
    preferredName?: string;
    school: string;
    year: string;
    location?: string;
  };
  skillsAndLinks: {
    skills: string[];
    githubUrl?: string;
    portfolioUrl?: string;
    otherLinks?: string[];
  };
  accessibility: {
    allergies?: string;
    dietaryRestrictions?: string;
    accommodations?: string;
  };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: string;
}
