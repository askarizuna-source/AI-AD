export enum Platform {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  GoogleAds = 'Google Ads',
  Website = 'Website Landing Page',
  Email = 'Email Marketing',
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter / X',
  TikTok = 'TikTok'
}

export enum Tone {
  Professional = 'Professional',
  Friendly = 'Friendly',
  Bold = 'Bold',
  Emotional = 'Emotional',
  Fun = 'Fun',
  Luxury = 'Luxury',
  Urgent = 'Urgent'
}

export enum CallToAction {
  ShopNow = 'Shop Now',
  LearnMore = 'Learn More',
  SignUp = 'Sign Up',
  BookNow = 'Book Now',
  LimitedOffer = 'Get Limited Offer',
  ContactUs = 'Contact Us',
  Subscribe = 'Subscribe'
}

export interface AdFormData {
  productName: string;
  industry: string;
  targetAudience: string;
  platform: Platform;
  tone: Tone;
  cta: CallToAction;
  includeEmojis: boolean;
}

export interface AdResult {
  id: string;
  headline: string;
  body: string;
  ctaLine: string;
  explanation?: string; // Why the AI chose this angle
  timestamp: number;
  metadata: AdFormData;
}
