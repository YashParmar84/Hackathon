export const UserType = {
  id: '',
  name: '',
  email: '',
  location: '',
  profilePhoto: '',
  skillsOffered: [],
  skillsWanted: [],
  availability: [],
  isPublic: true,
  rating: 0,
  totalRatings: 0,
  bio: ''
};

export const SwapRequestType = {
  id: '',
  fromUserId: '',
  toUserId: '',
  fromUser: null,
  toUser: null,
  skillOffered: '',
  skillWanted: '',
  status: 'pending', // 'pending' | 'accepted' | 'rejected' | 'completed'
  message: '',
  rejectionReason: '',
  createdAt: new Date(),
  rating: 0,
  feedback: ''
};

export const AuthContextType = {
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  updateProfile: () => {},
  forgotPassword: () => {},
  resetPassword: () => {}
};