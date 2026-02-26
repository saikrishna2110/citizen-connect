import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Firebase configuration (you'll need to replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted user on app load
    const persistedUser = localStorage.getItem('currentUser');
    if (persistedUser) {
      try {
        const userData = JSON.parse(persistedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing persisted user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Also listen for Firebase auth changes (for future real auth)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && !user) {
        // Get user role from localStorage or user claims
        const userRole = localStorage.getItem(`userRole_${firebaseUser.uid}`) || 'Citizen';
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userRole,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email.split('@')[0])}&background=6a47f2&color=fff&size=120`,
          authenticated: true
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const registerWithEmail = async (email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Store user role
      localStorage.setItem(`userRole_${result.user.uid}`, userData.role);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const loginAsDeveloper = async (employeeId, password) => {
    // For demo purposes - in real app, verify against employee database
    const validDevelopers = {
      'DEV001': {
        name: 'Sai Krishna',
        department: 'Frontend Development',
        designation: 'Senior Software Engineer',
        email: 'sai.krishna@citizensconnect.gov'
      },
      'DEV002': {
        name: 'Dilip Sai',
        department: 'Backend Development',
        designation: 'Full Stack Developer',
        email: 'dilip.sai@citizensconnect.gov'
      },
      'DEV003': {
        name: 'Yaswanth Reddy',
        department: 'DevOps',
        designation: 'System Administrator',
        email: 'yaswanth.reddy@citizensconnect.gov'
      },
      'DEV004': {
        name: 'Anita Singh',
        department: 'Data Science',
        designation: 'Data Analyst',
        email: 'anita.singh@citizensconnect.gov'
      },
      'DEV005': {
        name: 'Vikram Rao',
        department: 'Mobile Development',
        designation: 'React Native Developer',
        email: 'vikram.rao@citizensconnect.gov'
      },
      'DEV006': {
        name: 'Sneha Gupta',
        department: 'Quality Assurance',
        designation: 'QA Engineer',
        email: 'sneha.gupta@citizensconnect.gov'
      },
      'DEV007': {
        name: 'Karan Jain',
        department: 'Security',
        designation: 'Security Analyst',
        email: 'karan.jain@citizensconnect.gov'
      },
      'DEV008': {
        name: 'Meera Iyer',
        department: 'UI/UX Design',
        designation: 'UX Designer',
        email: 'meera.iyer@citizensconnect.gov'
      }
    };

    if (validDevelopers[employeeId] && password === 'developer123') {
      const developer = validDevelopers[employeeId];
      const mockUser = {
        uid: 'dev_' + employeeId,
        email: developer.email,
        role: 'Developer',
        name: developer.name,
        employeeId,
        department: developer.department,
        designation: developer.designation,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name)}&background=22c55e&color=fff&size=120`,
        authenticated: true
      };
      setUser(mockUser);
      localStorage.setItem(`userRole_${mockUser.uid}`, 'Developer');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error('Invalid developer credentials');
  };

  const loginAsPolitician = async (identifier, password) => {
    // For demo purposes - in real app, verify against politician database
    const validPoliticians = {
      // Andhra Pradesh & Telangana
      'NCBNaidu': {
        name: 'N. Chandrababu Naidu',
        party: 'TDP',
        constituency: 'Kuppam, Andhra Pradesh',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/N._Chandrababu_Naidu.jpg/300px-N._Chandrababu_Naidu.jpg'
      },
      'YSJagan': {
        name: 'Y. S. Jagan Mohan Reddy',
        party: 'YSRCP',
        constituency: 'Pulivendla, Andhra Pradesh',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Y._S._Jaganmohan_Reddy.jpg/300px-Y._S._Jaganmohan_Reddy.jpg'
      },
      'RevanthReddy': {
        name: 'Anumula Revanth Reddy',
        party: 'INC',
        constituency: 'Kodangal, Telangana',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Anumula_Revanth_Reddy.jpg/300px-Anumula_Revanth_Reddy.jpg'
      },

      // National Leaders
      'NarendraModi': {
        name: 'Narendra Modi',
        party: 'BJP',
        constituency: 'Varanasi, Uttar Pradesh',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Narendra_Modi_official_portrait.jpg/300px-Narendra_Modi_official_portrait.jpg'
      },
      'RahulGandhi': {
        name: 'Rahul Gandhi',
        party: 'INC',
        constituency: 'Rae Bareli, Uttar Pradesh',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Rahul_Gandhi_2023.jpg/300px-Rahul_Gandhi_2023.jpg'
      },
      'AmitShah': {
        name: 'Amit Shah',
        party: 'BJP',
        constituency: 'Gandhinagar, Gujarat',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Amit_Shah_official_portrait.jpg/300px-Amit_Shah_official_portrait.jpg'
      },

      // State Chief Ministers
      'MamataBanerjee': {
        name: 'Mamata Banerjee',
        party: 'TMC',
        constituency: 'Nandigram, West Bengal',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mamata_Banerjee.jpg/300px-Mamata_Banerjee.jpg'
      },
      'ArvindKejriwal': {
        name: 'Arvind Kejriwal',
        party: 'AAP',
        constituency: 'New Delhi',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Arvind_Kejriwal.jpg/300px-Arvind_Kejriwal.jpg'
      },
      'YogiAdityanath': {
        name: 'Yogi Adityanath',
        party: 'BJP',
        constituency: 'Gorakhpur, Uttar Pradesh',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Yogi_Adityanath.jpg/300px-Yogi_Adityanath.jpg'
      },
      'BhagwantMann': {
        name: 'Bhagwant Mann',
        party: 'AAP',
        constituency: 'Sangrur, Punjab',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bhagwant_Mann.jpg/300px-Bhagwant_Mann.jpg'
      },
      'MKStalin': {
        name: 'M. K. Stalin',
        party: 'DMK',
        constituency: 'Kolathur, Tamil Nadu',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/M._K._Stalin.jpg/300px-M._K._Stalin.jpg'
      },

      // Opposition Leaders
      'TejaswiYadav': {
        name: 'Tejaswi Yadav',
        party: 'RJD',
        constituency: 'Madhepura, Bihar',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Tejaswi_Yadav.jpg/300px-Tejaswi_Yadav.jpg'
      },
      'KTRBRS': {
        name: 'K. T. Rama Rao',
        party: 'BRS',
        constituency: 'Siddipet, Telangana',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/K._T._Rama_Rao.jpg/300px-K._T._Rama_Rao.jpg'
      },
      'MKAzhagiri': {
        name: 'M. K. Azhagiri',
        party: 'DMK',
        constituency: 'Mayiladuturai, Tamil Nadu',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/M._K._Azhagiri.jpg/300px-M._K._Azhagiri.jpg'
      },

      // Other Prominent Leaders
      'SoniaGandhi': {
        name: 'Sonia Gandhi',
        party: 'INC',
        constituency: 'Rae Bareli, Uttar Pradesh',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sonia_Gandhi.jpg/300px-Sonia_Gandhi.jpg'
      },
      'SharadPawar': {
        name: 'Sharad Pawar',
        party: 'NCP',
        constituency: 'Baramati, Maharashtra',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sharad_Pawar.jpg/300px-Sharad_Pawar.jpg'
      },
      'Mayawati': {
        name: 'Mayawati',
        party: 'BSP',
        constituency: 'Akbarpur, Uttar Pradesh',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mayawati.jpg/300px-Mayawati.jpg'
      }
    };

    if (validPoliticians[identifier] && password === 'politician123') {
      const politician = validPoliticians[identifier];
      const mockUser = {
        uid: 'pol_' + identifier,
        email: `${identifier}@politician.gov`,
        role: 'Politician',
        name: politician.name,
        party: politician.party,
        constituency: politician.constituency,
        profileImage: politician.profileImage,
        authenticated: true
      };
      setUser(mockUser);
      localStorage.setItem(`userRole_${mockUser.uid}`, 'Politician');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error('Invalid politician credentials');
  };

  const loginWithAadhar = async (aadharNumber, otp) => {
    // For demo purposes - in real app, integrate with Aadhar API
    if (aadharNumber.length === 12 && otp === '123456') {
      const mockUser = {
        uid: 'aadhar_' + aadharNumber,
        email: `citizen_${aadharNumber}@aadhar.gov`,
        role: 'Citizen',
        name: `Citizen ${aadharNumber.slice(-4)}`,
        aadharNumber,
        profileImage: `https://ui-avatars.com/api/?name=Citizen+${aadharNumber.slice(-4)}&background=6a47f2&color=fff&size=120`,
        authenticated: true
      };
      setUser(mockUser);
      localStorage.setItem(`userRole_${mockUser.uid}`, 'Citizen');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error('Invalid Aadhar number or OTP');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('currentUser');
      // Clear all user roles
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('userRole_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginAsDeveloper,
    loginAsPolitician,
    loginWithAadhar,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
