import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    location: 'New York, NY',
    skillsOffered: ['React', 'JavaScript', 'UI/UX Design'],
    skillsWanted: ['Python', 'Data Analysis', 'Photography'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.8,
    totalRatings: 12,
    bio: 'Frontend developer passionate about creating beautiful user experiences. I love teaching React and JavaScript to beginners and helping them build their first projects.'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    location: 'San Francisco, CA',
    skillsOffered: ['Python', 'Machine Learning', 'Data Science'],
    skillsWanted: ['React', 'Web Development', 'Graphic Design'],
    availability: ['Weekdays', 'Evenings'],
    isPublic: true,
    rating: 4.6,
    totalRatings: 8,
    bio: 'Data scientist looking to expand into web development. I have 5 years of experience in Python and machine learning.'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    location: 'Austin, TX',
    skillsOffered: ['Photography', 'Video Editing', 'Adobe Creative Suite'],
    skillsWanted: ['Marketing', 'Social Media', 'Content Writing'],
    availability: ['Weekends'],
    isPublic: true,
    rating: 4.9,
    totalRatings: 15,
    bio: 'Creative professional specializing in visual storytelling. I love capturing moments and turning them into compelling narratives.'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    location: 'Seattle, WA',
    skillsOffered: ['Node.js', 'MongoDB', 'API Development'],
    skillsWanted: ['DevOps', 'AWS', 'Docker'],
    availability: ['Evenings', 'Weekends'],
    isPublic: true,
    rating: 4.7,
    totalRatings: 10,
    bio: 'Backend developer with expertise in Node.js and database design. Always eager to learn new technologies.'
  },
  {
    id: '5',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    location: 'Boston, MA',
    skillsOffered: ['Digital Marketing', 'SEO', 'Content Strategy'],
    skillsWanted: ['Web Analytics', 'Graphic Design', 'Video Editing'],
    availability: ['Weekdays', 'Mornings'],
    isPublic: true,
    rating: 4.5,
    totalRatings: 7,
    bio: 'Marketing professional with a passion for digital strategies and content creation. Love helping businesses grow online.'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    const guestMode = localStorage.getItem('guestMode');
    
    if (savedUser && validateToken()) {
      setUser(JSON.parse(savedUser));
    } else if (guestMode) {
      setIsGuest(true);
    } else {
      // Clear invalid session
      clearAuth();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Create user object from API response
      const userInfo = {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        location: data.data.user.location || '',
        skillsOffered: data.data.user.skillsOffered || [],
        skillsWanted: data.data.user.skillsWanted || [],
        availability: data.data.user.availability || [],
        isPublic: true,
        rating: data.data.user.rating || 0,
        totalRatings: data.data.user.totalRatings || 0,
        bio: data.data.user.bio || '',
        emailVerified: data.data.user.emailVerified,
        otpVerified: data.data.user.otpVerified,
        isAdmin: data?.data?.user?.isAdmin
      };

      // Set user state and localStorage
      setUser(userInfo);
      setIsGuest(false);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      localStorage.setItem('token', data.data.token);
      localStorage.removeItem('guestMode');

      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Basic token validation - check if it exists and has valid format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;
      
      // You can add more validation here if needed
      return true;
    } catch (error) {
      return false;
    }
  };

  const clearAuth = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
  };

  const sendOTP = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOTPAndRegister = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/verify-otp-register', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email: userData.email,
          otp: userData.otp,
          name: userData.name,
          password: userData.password,
          location: userData.location,
          bio: userData.bio,
          skillsOffered: userData.skillsOffered || [],
          skillsWanted: userData.skillsWanted || [],
          availability: userData.availability || []
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Set user data and token
      const userInfo = {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        location: userData.location,
        skillsOffered: userData.skillsOffered || [],
        skillsWanted: userData.skillsWanted || [],
        availability: userData.availability || [],
        isPublic: true,
        rating: 0,
        totalRatings: 0,
        bio: userData.bio,
        emailVerified: data.data.user.emailVerified,
        otpVerified: data.data.user.otpVerified,
        isAdmin: data.data.user.isAdmin // Add isAdmin to userInfo
      };

      setUsers(prev => [...prev, userInfo]);
      setUser(userInfo);
      setIsGuest(false);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      localStorage.setItem('token', data.data.token);
      localStorage.removeItem('guestMode');
      // Redirect will be handled by PublicRoute component

      return data;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const register = async (userData) => {
    // This function is now deprecated in favor of the OTP-based registration
    // Keeping for backward compatibility
    const newUser = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      location: userData.location,
      skillsOffered: userData.skillsOffered || [],
      skillsWanted: userData.skillsWanted || [],
      availability: userData.availability || [],
      isPublic: true,
      rating: 0,
      totalRatings: 0,
      bio: userData.bio
    };
    
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setIsGuest(false);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.removeItem('guestMode');
  };

  const logout = () => {
    clearAuth();
  };

  const enterGuestMode = () => {
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const forgotPassword = async (email) => {
    // Mock forgot password - in real app, this would send an email
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      // Simulate sending email
      return { success: true, message: 'Password reset email sent to ' + email };
    } else {
      throw new Error('Email not found');
    }
  };

  const resetPassword = async (token, newPassword) => {
    // Mock password reset - in real app, this would verify token and update password
    return { success: true, message: 'Password reset successfully' };
  };

  const getAllUsers = () => {
    return users.filter(u => u.isPublic);
  };

  // Legacy function - keeping for backward compatibility
  const getUserByIdMock = (id) => {
    return users.find(u => u.id === id);
  };

  const getUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/profile/me', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // Update local user state with fresh profile data
      const profileData = data.data.user;
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        profilePhoto: profileData.profilePhoto,
        skillsOffered: profileData.skillsOffered || [],
        skillsWanted: profileData.skillsWanted || [],
        availability: profileData.availability || [],
        isPublic: profileData.isPublic,
        emailVerified: profileData.emailVerified,
        otpVerified: profileData.otpVerified,
        totalSwaps: profileData.totalSwaps,
        completedSwaps: profileData.completedSwaps,
        averageRating: profileData.averageRating,
        totalRatings: profileData.totalRatings,
        joinDate: profileData.joinDate,
        lastActive: profileData.lastActive
      };

      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Return the user data from the API response
      return profileData;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/profile/update', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: profileData.name,
          bio: profileData.bio,
          location: profileData.location,
          skillsOffered: profileData.skillsOffered || [],
          skillsWanted: profileData.skillsWanted || [],
          availability: profileData.availability || [],
          isPublic: profileData.isPublic !== undefined ? profileData.isPublic : true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local user state with new profile data
      if (user) {
        const updatedUser = {
          ...user,
          name: data.data.name,
          bio: data.data.bio,
          location: data.data.location,
          skillsOffered: data.data.skillsOffered || [],
          skillsWanted: data.data.skillsWanted || [],
          availability: data.data.availability || [],
          isPublic: data.data.isPublic
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const getAllPublicUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      // Return the users array from the response
      return data.data.users;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  };

  const getUserById = async (userId) => {
    try {
      // Get all users and find the specific user by _id
      const response = await fetch('http://localhost:8000/api/v1/users', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      
      // Find the specific user from the users list by _id
      const user = data.data.users.find(u => u._id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  };

  const getMySkills = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/my-skills', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch skills');
      }

      return data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch skills');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      setUser,
      setIsGuest,
      login,
      register,
      sendOTP,
      verifyOTPAndRegister,
      logout,
      enterGuestMode,
      updateProfile,
      forgotPassword,
      resetPassword,
      getAllUsers,
      getUserById: getUserByIdMock, // Legacy function
      getAllPublicUsers,
      getUserByIdAPI: getUserById, // New API function
      validateToken,
      clearAuth,
      getUserProfile,
      updateUserProfile,
      getMySkills,
      getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { mockUsers };