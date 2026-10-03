import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Confession, 
  Product, 
  Gig, 
  Conversation, 
  CurrentUser, 
  University,
  ConfessionReaction
} from '../types';
import { 
  UNIVERSITIES, 
  INITIAL_USER, 
  INITIAL_CONFESSIONS, 
  INITIAL_PRODUCTS, 
  INITIAL_GIGS, 
  INITIAL_CONVERSATIONS 
} from '../data/mockData';

interface AppContextType {
  activeTab: 'confessions' | 'chat' | 'marketplace' | 'gigs';
  setActiveTab: (tab: 'confessions' | 'chat' | 'marketplace' | 'gigs') => void;
  selectedUniversityId: string;
  setSelectedUniversityId: (id: string) => void;
  universities: University[];
  currentUser: CurrentUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>;
  confessions: Confession[];
  addConfession: (confession: Omit<Confession, 'id' | 'createdAt' | 'reactions' | 'commentsCount'>) => void;
  toggleConfessionReaction: (confessionId: string, reaction: ConfessionReaction) => void;
  addConfessionComment: (confessionId: string, content: string, authorHandle: string) => void;
  toggleBookmarkConfession: (confessionId: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerMajor' | 'sellerRating' | 'sellerAvatar'>) => void;
  toggleBookmarkProduct: (productId: string) => void;
  gigs: Gig[];
  addGig: (gig: Omit<Gig, 'id' | 'createdAt' | 'posterId' | 'posterName' | 'posterMajor' | 'posterRating' | 'posterAvatar' | 'applicantsCount' | 'status'>) => void;
  applyToGig: (gigId: string, message: string) => void;
  toggleBookmarkGig: (gigId: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, contextItem?: any) => void;
  startOrOpenChatWithUser: (
    participant: { id: string; name: string; major: string; university: string; avatar: string },
    initialMessage?: string,
    contextItem?: any
  ) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  createModalInitialTab?: 'confession' | 'product' | 'gig';
  setCreateModalInitialTab: (tab: 'confession' | 'product' | 'gig') => void;
  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'confessions' | 'chat' | 'marketplace' | 'gigs'>('confessions');
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('all');
  const [universities] = useState<University[]>(UNIVERSITIES);
  
  // Persisted state
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('connectu_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [confessions, setConfessions] = useState<Confession[]>(() => {
    const saved = localStorage.getItem('connectu_confessions');
    return saved ? JSON.parse(saved) : INITIAL_CONFESSIONS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('connectu_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [gigs, setGigs] = useState<Gig[]>(() => {
    const saved = localStorage.getItem('connectu_gigs');
    return saved ? JSON.parse(saved) : INITIAL_GIGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('connectu_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_maya');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialTab, setCreateModalInitialTab] = useState<'confession' | 'product' | 'gig'>('confession');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('connectu_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('connectu_confessions', JSON.stringify(confessions));
  }, [confessions]);

  useEffect(() => {
    localStorage.setItem('connectu_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('connectu_gigs', JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem('connectu_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Confession Actions
  const addConfession = (newConf: Omit<Confession, 'id' | 'createdAt' | 'reactions' | 'commentsCount'>) => {
    const confession: Confession = {
      ...newConf,
      id: `conf_${Date.now()}`,
      createdAt: 'Just now',
      reactions: { fire: 1, skull: 0, heart: 0, tea: 0 },
      commentsCount: 0,
      comments: [],
    };
    setConfessions(prev => [confession, ...prev]);
  };

  const toggleConfessionReaction = (confessionId: string, reaction: ConfessionReaction) => {
    setConfessions(prev =>
      prev.map(c => {
        if (c.id !== confessionId) return c;
        const currentActive = c.userReactions?.[reaction] || false;
        const updatedUserReactions = {
          ...(c.userReactions || { fire: false, skull: false, heart: false, tea: false }),
          [reaction]: !currentActive,
        };
        const delta = currentActive ? -1 : 1;
        return {
          ...c,
          reactions: {
            ...c.reactions,
            [reaction]: Math.max(0, (c.reactions[reaction] || 0) + delta),
          },
          userReactions: updatedUserReactions,
        };
      })
    );
  };

  const addConfessionComment = (confessionId: string, content: string, authorHandle: string) => {
    setConfessions(prev =>
      prev.map(c => {
        if (c.id !== confessionId) return c;
        const newComment = {
          id: `comment_${Date.now()}`,
          confessionId,
          authorHandle: authorHandle || 'Anonymous Student',
          content,
          createdAt: 'Just now',
          upvotes: 0,
        };
        return {
          ...c,
          commentsCount: (c.commentsCount || 0) + 1,
          comments: [...(c.comments || []), newComment],
        };
      })
    );
  };

  const toggleBookmarkConfession = (confessionId: string) => {
    setConfessions(prev =>
      prev.map(c => c.id === confessionId ? { ...c, isBookmarked: !c.isBookmarked } : c)
    );
  };

  // Product Actions
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerMajor' | 'sellerRating' | 'sellerAvatar'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod_${Date.now()}`,
      createdAt: 'Just now',
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerMajor: currentUser.major,
      sellerRating: currentUser.rating,
      sellerAvatar: currentUser.avatar,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const toggleBookmarkProduct = (productId: string) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, isSaved: !p.isSaved } : p)
    );
  };

  // Gig Actions
  const addGig = (gigData: Omit<Gig, 'id' | 'createdAt' | 'posterId' | 'posterName' | 'posterMajor' | 'posterRating' | 'posterAvatar' | 'applicantsCount' | 'status'>) => {
    const newGig: Gig = {
      ...gigData,
      id: `gig_${Date.now()}`,
      createdAt: 'Just now',
      posterId: currentUser.id,
      posterName: currentUser.name,
      posterMajor: currentUser.major,
      posterRating: currentUser.rating,
      posterAvatar: currentUser.avatar,
      applicantsCount: 0,
      status: 'open',
    };
    setGigs(prev => [newGig, ...prev]);
  };

  const applyToGig = (gigId: string, message: string) => {
    const targetGig = gigs.find(g => g.id === gigId);
    if (!targetGig) return;

    setGigs(prev =>
      prev.map(g => g.id === gigId ? { ...g, applicantsCount: g.applicantsCount + 1, isApplied: true } : g)
    );

    // Open or create chat with gig poster
    startOrOpenChatWithUser(
      {
        id: targetGig.posterId,
        name: targetGig.posterName,
        major: targetGig.posterMajor,
        university: UNIVERSITIES.find(u => u.id === targetGig.universityId)?.name || 'Campus',
        avatar: targetGig.posterAvatar,
      },
      message || `Hi ${targetGig.posterName}! I would love to apply for your gig: "${targetGig.title}". Let me know if you are free to discuss details!`,
      {
        type: 'gig',
        title: targetGig.title,
        priceOrRate: targetGig.rateType === 'hourly' ? `$${targetGig.rate}/hr` : `$${targetGig.rate} fixed`,
      }
    );
  };

  const toggleBookmarkGig = (gigId: string) => {
    setGigs(prev =>
      prev.map(g => g.id === gigId ? { ...g, isBookmarked: !g.isBookmarked } : g)
    );
  };

  // Chat Actions
  const sendMessage = (conversationId: string, text: string, contextItem?: any) => {
    if (!text.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      contextItem,
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          lastMessage: text.trim(),
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMessage],
        };
      })
    );

    // Simulate realistic campus peer response for direct messages
    const currentConv = conversations.find(c => c.id === conversationId);
    if (currentConv && currentConv.type === 'direct') {
      setTimeout(() => {
        const peerResponses = [
          "Hey! Thanks for reaching out. Yes, that works great for me!",
          "Awesome! Are you free to meet by the Student Union or Library later today?",
          "Sounds perfect. I can Venmo or do cash when we meet up!",
          "Got it! Let me review the details and I'll confirm right away.",
          "Great, see you then! Feel free to text me if anything changes."
        ];
        const randomReply = peerResponses[Math.floor(Math.random() * peerResponses.length)];
        
        const replyMsg = {
          id: `reply_${Date.now()}`,
          senderId: currentConv.participant?.id || 'peer',
          senderName: currentConv.participant?.name || currentConv.title,
          senderAvatar: currentConv.avatar,
          content: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
        };

        setConversations(latest =>
          latest.map(c => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              messages: [...c.messages, replyMsg],
            };
          })
        );
      }, 1400);
    }
  };

  const startOrOpenChatWithUser = (
    participant: { id: string; name: string; major: string; university: string; avatar: string },
    initialMessage?: string,
    contextItem?: any
  ) => {
    // Check if conversation already exists
    const existing = conversations.find(
      c => c.type === 'direct' && c.participant?.id === participant.id
    );

    let targetConvId = existing ? existing.id : `conv_${participant.id}`;

    if (!existing) {
      const newConversation: Conversation = {
        id: targetConvId,
        type: 'direct',
        title: participant.name,
        subtitle: `${participant.major} · ${participant.university}`,
        avatar: participant.avatar,
        online: true,
        lastMessage: initialMessage || 'Started conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        participant,
        messages: initialMessage
          ? [
              {
                id: `m_${Date.now()}`,
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderAvatar: currentUser.avatar,
                content: initialMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true,
                contextItem,
              },
            ]
          : [],
      };

      setConversations(prev => [newConversation, ...prev]);

      // Trigger automatic peer welcome reply if initial message was sent
      if (initialMessage) {
        setTimeout(() => {
          const autoReply = {
            id: `reply_${Date.now()}`,
            senderId: participant.id,
            senderName: participant.name,
            senderAvatar: participant.avatar,
            content: `Hey ${currentUser.name.split(' ')[0]}! Thanks for reaching out. Yes, let's connect on this!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
          };

          setConversations(latest =>
            latest.map(c => {
              if (c.id !== targetConvId) return c;
              return {
                ...c,
                lastMessage: autoReply.content,
                lastMessageTime: 'Just now',
                messages: [...c.messages, autoReply],
              };
            })
          );
        }, 1200);
      }
    } else if (initialMessage) {
      sendMessage(existing.id, initialMessage, contextItem);
    }

    setActiveConversationId(targetConvId);
    setActiveTab('chat');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedUniversityId,
        setSelectedUniversityId,
        universities,
        currentUser,
        setCurrentUser,
        confessions,
        addConfession,
        toggleConfessionReaction,
        addConfessionComment,
        toggleBookmarkConfession,
        products,
        addProduct,
        toggleBookmarkProduct,
        gigs,
        addGig,
        applyToGig,
        toggleBookmarkGig,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startOrOpenChatWithUser,
        isCreateModalOpen,
        setIsCreateModalOpen,
        createModalInitialTab,
        setCreateModalInitialTab,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
