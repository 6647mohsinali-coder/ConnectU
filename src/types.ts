export type University = {
  id: string;
  name: string;
  shortName: string;
  mascot: string;
  accentColor: string;
  studentCount: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  handle: string;
  universityId: string;
  major: string;
  gradYear: string;
  avatar: string;
  verifiedStudent: boolean;
  rating: number;
  bio: string;
};

export type ConfessionReaction = 'fire' | 'skull' | 'heart' | 'tea';

export type ConfessionComment = {
  id: string;
  confessionId: string;
  authorHandle: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isUpvoted?: boolean;
};

export type Confession = {
  id: string;
  authorAlias: string;
  universityId: string;
  content: string;
  tag: 'Campus Life' | 'Exams' | 'Dorm Tales' | 'Crushes' | 'Professors' | 'Career';
  moodEmoji: string;
  createdAt: string;
  reactions: {
    fire: number;
    skull: number;
    heart: number;
    tea: number;
  };
  userReactions?: Record<ConfessionReaction, boolean>;
  commentsCount: number;
  comments?: ConfessionComment[];
  isBookmarked?: boolean;
  verifiedCampusOnly?: boolean;
};

export type ProductCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export type ProductCategory = 
  | 'Textbooks & Academics'
  | 'Tech & Gadgets'
  | 'Dorm & Living'
  | 'Transport & Bikes'
  | 'Fashion & Apparel'
  | 'Free / Donated';

export type Product = {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  description: string;
  imageUrl: string;
  universityId: string;
  meetupLocation: string;
  sellerId: string;
  sellerName: string;
  sellerMajor: string;
  sellerRating: number;
  sellerAvatar: string;
  createdAt: string;
  isSaved?: boolean;
  isSold?: boolean;
};

export type GigCategory = 
  | 'Tutoring & STEM'
  | 'Dorm Help & Moving'
  | 'Tech & Coding'
  | 'Photo & Media'
  | 'Essay & Proofreading'
  | 'Errands & Campus Tasks';

export type Gig = {
  id: string;
  title: string;
  category: GigCategory;
  rateType: 'hourly' | 'fixed';
  rate: number;
  universityId: string;
  location: string;
  deadline: string;
  description: string;
  posterId: string;
  posterName: string;
  posterMajor: string;
  posterAvatar: string;
  posterRating: number;
  applicantsCount: number;
  createdAt: string;
  tags: string[];
  isApplied?: boolean;
  isBookmarked?: boolean;
  status: 'open' | 'in_progress' | 'completed';
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  contextItem?: {
    type: 'product' | 'gig';
    title: string;
    priceOrRate: string;
    imageUrl?: string;
  };
};

export type Conversation = {
  id: string;
  type: 'direct' | 'channel';
  title: string;
  subtitle: string;
  avatar: string;
  online?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  pinned?: boolean;
  channelTag?: string;
  participant?: {
    id: string;
    name: string;
    major: string;
    university: string;
    avatar: string;
  };
  messages: ChatMessage[];
};
