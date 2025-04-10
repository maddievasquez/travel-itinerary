// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Loader, 
//   AlertCircle, 
//   User, 
//   Mail, 
//   MapPin,
//   Save,
//   Grid,
//   Bell,
//   Moon,
//   Sun,
//   Check,
//   Shield
// } from 'lucide-react';
// import { fetchProfile, updateProfile, fetchSettings, updateSettings, fetchUserItineraries } from '../../services/auth';
// import ItineraryCard from '../../components/itinerary/ItineraryCard';

// export default function ProfilePage() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('profile');
  
//   // Separate state objects for profile and settings
//   const [profileData, setProfileData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     location: ''
//   });
  
//   const [settingsData, setSettingsData] = useState({
//     notifications_enabled: true,
//     email_updates: true,
//     privacy_level: 'public',
//     theme: 'light'
//   });
  
//   // Track whether form fields have been modified
//   const [profileModified, setProfileModified] = useState(false);
//   const [settingsModified, setSettingsModified] = useState(false);
  
//   // Itineraries state
//   const [itineraries, setItineraries] = useState([]);
  
//   // Loading and error states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [profileSuccess, setProfileSuccess] = useState(false);
//   const [settingsSuccess, setSettingsSuccess] = useState(false);
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [savingSettings, setSavingSettings] = useState(false);
  
//   // Fetch all user data on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const [profile, settings, itinerariesData] = await Promise.all([
//           fetchProfile(),
//           fetchSettings(),
//           fetchUserItineraries()
//         ]);
        
//         setProfileData({
//           first_name: profile.first_name || '',
//           last_name: profile.last_name || '',
//           email: profile.email || '',
//           location: profile.location || ''
//         });
        
//         setSettingsData({
//           notifications_enabled: settings.notifications_enabled,
//           email_updates: settings.email_updates,
//           privacy_level: settings.privacy_level || 'public',
//           theme: settings.theme || 'light'
//         });
        
//         setItineraries(Array.isArray(itinerariesData) ? itinerariesData : []);
//       } catch (err) {
//         console.error("Failed to fetch user data:", err);
//         setError(err.message || "Failed to load user data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchUserData();
//   }, []);
  
//   // Handle profile form changes
//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setProfileModified(true);
//   };
  
//   // Handle settings form changes
//   const handleSettingsChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettingsData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     setSettingsModified(true);
//   };
  
//   // Handle toggle switch changes
//   const handleToggleChange = (name) => {
//     setSettingsData(prev => ({
//       ...prev,
//       [name]: !prev[name]
//     }));
//     setSettingsModified(true);
//   };
  
//   // Handle profile save
//   const handleProfileSave = async (e) => {
//     if (e) e.preventDefault();
//     setSavingProfile(true);
//     setError(null);
    
//     try {
//       await updateProfile(profileData);
//       setProfileSuccess(true);
//       setProfileModified(false);
//       setTimeout(() => setProfileSuccess(false), 3000);
//       return true;
//     } catch (err) {
//       console.error("Failed to update profile:", err);
      
//       let errorMessage = "Failed to update profile. Please try again.";
//       if (err.response) {
//         if (err.response.status === 405) {
//           errorMessage = "Update method not allowed. Please contact support.";
//         } else if (err.response.data && err.response.data.detail) {
//           errorMessage = err.response.data.detail;
//         }
//       }
      
//       setError(errorMessage);
//       return false;
//     } finally {
//       setSavingProfile(false);
//     }
//   };
  
//   // Handle settings save
//   const handleSettingsSave = async (e) => {
//     if (e) e.preventDefault();
//     setSavingSettings(true);
//     setError(null);
    
//     try {
//       await updateSettings(settingsData);
//       setSettingsSuccess(true);
//       setSettingsModified(false);
//       setTimeout(() => setSettingsSuccess(false), 3000);
//       return true;
//     } catch (err) {
//       console.error("Failed to update settings:", err);
      
//       let errorMessage = "Failed to update settings. Please try again.";
//       if (err.response && err.response.data && err.response.data.detail) {
//         errorMessage = err.response.data.detail;
//       }
      
//       setError(errorMessage);
//       return false;
//     } finally {
//       setSavingSettings(false);
//     }
//   };
  
//   const viewItinerary = (id) => {
//     navigate(`/itinerary/${id}`);
//   };
  
//   const createItinerary = () => {
//     navigate('/create-itinerary');
//   };

//   // Start a new itinerary with basic info before navigating to full form
//   const startNewItinerary = () => {
//     // Show a quick modal or form to collect basic info
//     // For demonstration, we'll just navigate
//     navigate('/create-itinerary');
//   };
  
//   if (loading && !profileData.email) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader className="animate-spin h-12 w-12 text-teal-600" />
//       </div>
//     );
//   }
  
//   // Helper function for toggle switches
//   const ToggleSwitch = ({ label, name, checked, onChange, icon }) => (
//     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
//       <div className="flex items-center space-x-3">
//         {icon}
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//       </div>
//       <button
//         type="button"
//         onClick={() => onChange(name)}
//         className={`relative inline-flex h-6 w-11 items-center rounded-full ${
//           checked ? 'bg-teal-600' : 'bg-gray-200'
//         } transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
//       >
//         <span
//           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//             checked ? 'translate-x-6' : 'translate-x-1'
//           }`}
//         />
//       </button>
//     </div>
//   );
  
//   // Privacy level option
//   const PrivacyOption = ({ value, label, description, currentValue, onChange }) => (
//     <div
//       onClick={() => onChange({ target: { name: 'privacy_level', value } })}
//       className={`p-4 mb-3 rounded-xl border-2 cursor-pointer transition-all ${
//         currentValue === value
//           ? 'border-teal-500 bg-teal-50'
//           : 'border-gray-200 hover:border-gray-300'
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <h4 className="font-medium">{label}</h4>
//           <p className="text-sm text-gray-500 mt-1">{description}</p>
//         </div>
//         {currentValue === value && (
//           <div className="bg-teal-500 rounded-full p-1 text-white">
//             <Check size={16} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
  
//   // Success notification component
//   const SuccessNotification = ({ message }) => (
//     <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
//       <p className="text-green-700">{message}</p>
//     </div>
//   );
  
//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
        
//         {error && (
//           <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//               <h3 className="text-lg font-medium text-red-800">Error</h3>
//             </div>
//             <p className="mt-2 text-sm text-red-700">{error}</p>
//           </div>
//         )}
        
//         <div className="mt-6 border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => setActiveTab('profile')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'profile'
//                   ? 'border-teal-500 text-teal-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               <User className="h-4 w-4 inline-block mr-2" />
//               Your Information
//             </button>
            
//             <button
//               onClick={() => setActiveTab('itineraries')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'itineraries'
//                   ? 'border-teal-500 text-teal-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               <Grid className="h-4 w-4 inline-block mr-2" />
//               My Itineraries
//             </button>
//           </nav>
//         </div>
//       </header>
      
//       <div className="min-h-[50vh]">
//         {/* Profile & Settings Tab */}
//         {activeTab === 'profile' && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Left Column - Personal Information */}
//             <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
//               <h2 className="text-xl font-semibold mb-6 flex items-center">
//                 <User className="h-5 w-5 mr-2 text-teal-600" />
//                 Personal Information
//               </h2>
              
//               {profileSuccess && (
//                 <SuccessNotification message="Profile updated successfully!" />
//               )}
              
//               <form onSubmit={handleProfileSave} className="space-y-5">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
//                       First Name
//                     </label>
//                     <div className="relative rounded-xl overflow-hidden">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <User className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         name="first_name"
//                         id="first_name"
//                         value={profileData.first_name}
//                         onChange={handleProfileChange}
//                         className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
//                       Last Name
//                     </label>
//                     <div className="relative rounded-xl overflow-hidden">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <User className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         name="last_name"
//                         id="last_name"
//                         value={profileData.last_name}
//                         onChange={handleProfileChange}
//                         className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <div className="relative rounded-xl overflow-hidden">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <input
//                       type="email"
//                       name="email"
//                       id="email"
//                       value={profileData.email}
//                       onChange={handleProfileChange}
//                       className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
//                     Location
//                   </label>
//                   <div className="relative rounded-xl overflow-hidden">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <MapPin className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       name="location"
//                       id="location"
//                       value={profileData.location}
//                       onChange={handleProfileChange}
//                       className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={savingProfile || !profileModified}
//                     className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
//                       profileModified ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     {savingProfile ? (
//                       <Loader className="animate-spin h-4 w-4 mr-2" />
//                     ) : (
//                       <Save className="h-4 w-4 mr-2" />
//                     )}
//                     Save Profile Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
            
//             {/* Right Column - Settings */}
//             <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
//               <h2 className="text-xl font-semibold mb-6 flex items-center">
//                 <Bell className="h-5 w-5 mr-2 text-teal-600" />
//                 Preferences & Settings
//               </h2>
              
//               {settingsSuccess && (
//                 <SuccessNotification message="Settings updated successfully!" />
//               )}
              
//               <form onSubmit={handleSettingsSave} className="space-y-5">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Notifications</h3>
                  
//                   <ToggleSwitch
//                     label="Enable notifications"
//                     name="notifications_enabled"
//                     checked={settingsData.notifications_enabled}
//                     onChange={handleToggleChange}
//                     icon={<Bell size={18} className="text-gray-500" />}
//                   />
                  
//                   <ToggleSwitch
//                     label="Receive email updates"
//                     name="email_updates"
//                     checked={settingsData.email_updates}
//                     onChange={handleToggleChange}
//                     icon={<Mail size={18} className="text-gray-500" />}
//                   />
//                 </div>
                
//                 <div className="pt-4">
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Theme Preference</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div
//                       onClick={() => handleSettingsChange({ target: { name: 'theme', value: 'light' } })}
//                       className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all ${
//                         settingsData.theme === 'light'
//                           ? 'bg-teal-50 border-2 border-teal-500'
//                           : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <Sun size={24} className={settingsData.theme === 'light' ? 'text-teal-600' : 'text-gray-500'} />
//                       <span className="mt-2 text-sm font-medium">Light</span>
//                     </div>
                    
//                     <div
//                       onClick={() => handleSettingsChange({ target: { name: 'theme', value: 'dark' } })}
//                       className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all ${
//                         settingsData.theme === 'dark'
//                           ? 'bg-teal-50 border-2 border-teal-500'
//                           : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <Moon size={24} className={settingsData.theme === 'dark' ? 'text-teal-600' : 'text-gray-500'} />
//                       <span className="mt-2 text-sm font-medium">Dark</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="pt-4">
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Privacy Settings</h3>
                  
//                   <PrivacyOption
//                     value="public"
//                     label="Public"
//                     description="Anyone can see your itineraries and profile"
//                     currentValue={settingsData.privacy_level}
//                     onChange={handleSettingsChange}
//                   />
                  
//                   <PrivacyOption
//                     value="friends"
//                     label="Friends Only"
//                     description="Only people you connect with can see your content"
//                     currentValue={settingsData.privacy_level}
//                     onChange={handleSettingsChange}
//                   />
                  
//                   <PrivacyOption
//                     value="private"
//                     label="Private"
//                     description="Your profile and itineraries are visible only to you"
//                     currentValue={settingsData.privacy_level}
//                     onChange={handleSettingsChange}
//                   />
//                 </div>
                
//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={savingSettings || !settingsModified}
//                     className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
//                       settingsModified ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     {savingSettings ? (
//                       <Loader className="animate-spin h-4 w-4 mr-2" />
//                     ) : (
//                       <Save className="h-4 w-4 mr-2" />
//                     )}
//                     Save Settings Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
        
//         {/* Itineraries Tab */}
//         {activeTab === 'itineraries' && (
//           <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold flex items-center">
//                 <Grid className="h-5 w-5 mr-2 text-teal-600" />
//                 My Itineraries
//               </h2>
              
//               <button
//                 onClick={createItinerary}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
//               >
//                 Create New Itinerary
//               </button>
//             </div>
            
//             {!Array.isArray(itineraries) || itineraries.length === 0 ? (
//               <div className="text-center py-12 bg-gray-50 rounded-xl">
//                 <p className="text-gray-500">You haven't created any itineraries yet.</p>
//                 <button
//                   onClick={createItinerary}
//                   className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
//                 >
//                   Create Your First Itinerary
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {itineraries.map((itinerary) => (
//                   <ItineraryCard
//                     key={itinerary.id}
//                     itinerary={itinerary}
//                     onClick={() => viewItinerary(itinerary.id)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader, 
  AlertCircle, 
  User, 
  Mail, 
  MapPin,
  Save,
  Grid,
  Bell,
  Moon,
  Sun,
  Check,
  Shield,
  Plus
} from 'lucide-react';
import { fetchProfile, updateProfile, fetchSettings, updateSettings, fetchUserItineraries } from '../../services/auth';
import { 
  LoadingState,
  EmptyState
} from '../itinerary/display/ItineraryEmptyStates';
import ItineraryGrid from '../../components/itinerary/display/ItineraryGrid';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Separate state objects for profile and settings
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location: ''
  });
  
  const [settingsData, setSettingsData] = useState({
    notifications_enabled: true,
    email_updates: true,
    privacy_level: 'public',
    theme: 'light'
  });
  
  // Track whether form fields have been modified
  const [profileModified, setProfileModified] = useState(false);
  const [settingsModified, setSettingsModified] = useState(false);
  
  // Itineraries state
  const [itineraries, setItineraries] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Fetch all user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [profile, settings, itinerariesData] = await Promise.all([
          fetchProfile(),
          fetchSettings(),
          fetchUserItineraries()
        ]);
        
        setProfileData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          location: profile.location || ''
        });
        
        setSettingsData({
          notifications_enabled: settings.notifications_enabled,
          email_updates: settings.email_updates,
          privacy_level: settings.privacy_level || 'public',
          theme: settings.theme || 'light'
        });
        
        setItineraries(Array.isArray(itinerariesData) ? itinerariesData : []);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err.message || "Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setProfileModified(true);
  };
  
  // Handle settings form changes
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettingsData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSettingsModified(true);
  };
  
  // Handle toggle switch changes
  const handleToggleChange = (name) => {
    setSettingsData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
    setSettingsModified(true);
  };
  
  // Handle profile save
  const handleProfileSave = async (e) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    setError(null);
    
    try {
      await updateProfile(profileData);
      setProfileSuccess(true);
      setProfileModified(false);
      setTimeout(() => setProfileSuccess(false), 3000);
      return true;
    } catch (err) {
      console.error("Failed to update profile:", err);
      
      let errorMessage = "Failed to update profile. Please try again.";
      if (err.response) {
        if (err.response.status === 405) {
          errorMessage = "Update method not allowed. Please contact support.";
        } else if (err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setSavingProfile(false);
    }
  };
  
  // Handle settings save
  const handleSettingsSave = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    setError(null);
    
    try {
      await updateSettings(settingsData);
      setSettingsSuccess(true);
      setSettingsModified(false);
      setTimeout(() => setSettingsSuccess(false), 3000);
      return true;
    } catch (err) {
      console.error("Failed to update settings:", err);
      
      let errorMessage = "Failed to update settings. Please try again.";
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setSavingSettings(false);
    }
  };
  
  const viewItinerary = (id) => {
    navigate(`/itinerary/${id}`);
  };
  
  const createItinerary = () => {
    navigate('/itinerary/new');
  };

  if (loading && !profileData.email) {
    return <LoadingState />;
  }
  
  // Helper function for toggle switches
  const ToggleSwitch = ({ label, name, checked, onChange, icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(name)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          checked ? 'bg-teal-600' : 'bg-gray-200'
        } transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
  
  // Privacy level option
  const PrivacyOption = ({ value, label, description, currentValue, onChange }) => (
    <div
      onClick={() => onChange({ target: { name: 'privacy_level', value } })}
      className={`p-4 mb-3 rounded-xl border-2 cursor-pointer transition-all ${
        currentValue === value
          ? 'border-teal-500 bg-teal-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {currentValue === value && (
          <div className="bg-teal-500 rounded-full p-1 text-white">
            <Check size={16} />
          </div>
        )}
      </div>
    </div>
  );
  
  // Success notification component
  const SuccessNotification = ({ message }) => (
    <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
      <p className="text-green-700">{message}</p>
    </div>
  );
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800">Error</h3>
            </div>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-4 w-4 inline-block mr-2" />
              Your Information
            </button>
            
            <button
              onClick={() => setActiveTab('itineraries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'itineraries'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Grid className="h-4 w-4 inline-block mr-2" />
              My Itineraries
            </button>
          </nav>
        </div>
      </header>
      
      <div className="min-h-[50vh]">
        {/* Profile & Settings Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Personal Information */}
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-teal-600" />
                Personal Information
              </h2>
              
              {profileSuccess && (
                <SuccessNotification message="Profile updated successfully!" />
              )}
              
              <form onSubmit={handleProfileSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={profileData.first_name}
                        onChange={handleProfileChange}
                        className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={profileData.last_name}
                        onChange={handleProfileChange}
                        className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-xl py-3"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={savingProfile || !profileModified}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
                      profileModified ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {savingProfile ? (
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
            
            {/* Right Column - Settings */}
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-teal-600" />
                Preferences & Settings
              </h2>
              
              {settingsSuccess && (
                <SuccessNotification message="Settings updated successfully!" />
              )}
              
              <form onSubmit={handleSettingsSave} className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Notifications</h3>
                  
                  <ToggleSwitch
                    label="Enable notifications"
                    name="notifications_enabled"
                    checked={settingsData.notifications_enabled}
                    onChange={handleToggleChange}
                    icon={<Bell size={18} className="text-gray-500" />}
                  />
                  
                  <ToggleSwitch
                    label="Receive email updates"
                    name="email_updates"
                    checked={settingsData.email_updates}
                    onChange={handleToggleChange}
                    icon={<Mail size={18} className="text-gray-500" />}
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Theme Preference</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => handleSettingsChange({ target: { name: 'theme', value: 'light' } })}
                      className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all ${
                        settingsData.theme === 'light'
                          ? 'bg-teal-50 border-2 border-teal-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Sun size={24} className={settingsData.theme === 'light' ? 'text-teal-600' : 'text-gray-500'} />
                      <span className="mt-2 text-sm font-medium">Light</span>
                    </div>
                    
                    <div
                      onClick={() => handleSettingsChange({ target: { name: 'theme', value: 'dark' } })}
                      className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all ${
                        settingsData.theme === 'dark'
                          ? 'bg-teal-50 border-2 border-teal-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Moon size={24} className={settingsData.theme === 'dark' ? 'text-teal-600' : 'text-gray-500'} />
                      <span className="mt-2 text-sm font-medium">Dark</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Privacy Settings</h3>
                  
                  <PrivacyOption
                    value="public"
                    label="Public"
                    description="Anyone can see your itineraries and profile"
                    currentValue={settingsData.privacy_level}
                    onChange={handleSettingsChange}
                  />
                  
                  <PrivacyOption
                    value="friends"
                    label="Friends Only"
                    description="Only people you connect with can see your content"
                    currentValue={settingsData.privacy_level}
                    onChange={handleSettingsChange}
                  />
                  
                  <PrivacyOption
                    value="private"
                    label="Private"
                    description="Your profile and itineraries are visible only to you"
                    currentValue={settingsData.privacy_level}
                    onChange={handleSettingsChange}
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={savingSettings || !settingsModified}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
                      settingsModified ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {savingSettings ? (
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Settings Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Itineraries Tab */}
        {activeTab === 'itineraries' && (
          <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Grid className="h-5 w-5 mr-2 text-teal-600" />
                My Itineraries
              </h2>
              
              <button
                onClick={createItinerary}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <Plus size={18} className="mr-1" />
                Create New Itinerary
              </button>
            </div>
            
            <ItineraryGrid
              itineraries={itineraries}
              onEdit={viewItinerary}
              emptyState={
                <EmptyState 
                  onCreateNew={createItinerary}
                  message="You haven't created any itineraries yet"
                  actionText="Create Your First Itinerary"
                />
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}