// import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import useUserItineraries from "../hooks/useUserItineraries";
// import { Calendar, MapPin, Plus, Search, Filter, Trash2 } from "lucide-react";
// import { format } from "date-fns";
// import Card from "../components/ui/card";
// import Cookie from '../components/cookies';

// const ItineraryCard = ({ itinerary, onDelete }) => {
//   const navigate = useNavigate();
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
//   const handleCardClick = (e) => {
//     // Prevent navigation if clicking the delete button
//     if (e.target.closest('.delete-btn')) return;
//     // Make sure to use a consistent path format with the rest of the application
//     navigate(`/itineraries/${itinerary.id}`);
//   };
  
//   const handleDeleteClick = (e) => {
//     e.stopPropagation();
//     setShowDeleteConfirm(true);
//   };
  
//   const confirmDelete = (e) => {
//     e.stopPropagation();
//     onDelete(itinerary.id);
//     setShowDeleteConfirm(false);
//   };
  
//   const cancelDelete = (e) => {
//     e.stopPropagation();
//     setShowDeleteConfirm(false);
//   };
  
//   return (
//     <Card
//       key={itinerary.id}
//       className="cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition"
//       onClick={handleCardClick}
//     >
//       <div className="p-5">
//         <div className="flex justify-between items-start">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//             <MapPin className="mr-2 text-blue-600 h-5 w-5" /> 
//             {itinerary.city}
//           </h3>
          
//           {!showDeleteConfirm && (
//             <button 
//               onClick={handleDeleteClick}
//               className="delete-btn text-gray-400 hover:text-red-500 transition-colors"
//             >
//               <Trash2 size={18} />
//             </button>
//           )}
//         </div>
        
//         <div className="mt-3 flex items-center text-sm text-gray-600">
//           <Calendar className="mr-2 h-4 w-4 text-blue-600" />
//           {format(new Date(itinerary.start_date), "MMM d")} - {format(new Date(itinerary.end_date), "MMM d, yyyy")}
//         </div>
        
//         {itinerary.description && (
//           <p className="mt-2 text-sm text-gray-600 line-clamp-2">{itinerary.description}</p>
//         )}
        
//         {showDeleteConfirm && (
//           <div className="mt-4 bg-red-50 p-3 rounded-md border border-red-200">
//             <p className="text-sm text-red-700">Delete this itinerary?</p>
//             <div className="mt-2 flex space-x-2">
//               <button 
//                 onClick={confirmDelete}
//                 className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 Delete
//               </button>
//               <button 
//                 onClick={cancelDelete}
//                 className="text-xs px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// const MyItineraries = () => {
//   const navigate = useNavigate();
//   const { itineraries, loading, error } = useUserItineraries();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState(false);
  
//   const handleDelete = async (itineraryId) => {
//     try {
//       const token = Cookie.getCookie("access") || localStorage.getItem("userToken");
//       if (!token) throw new Error("Unauthorized: No valid token");
      
//       const response = await fetch(`http://127.0.0.1:8000/api/itineraries/${itineraryId}/`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to delete: ${response.statusText}`);
//       }
      
//       // Update UI by filtering out the deleted itinerary
//       // Note: In a real app, you might want to use a state management solution
//       // or refetch the itineraries instead
//       window.location.reload();
//     } catch (err) {
//       console.error("Error deleting itinerary:", err);
//       alert("Failed to delete itinerary. Please try again.");
//     }
//   };
  
//   const filteredItineraries = itineraries.filter(itinerary => 
//     itinerary.city.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
//           <p className="font-bold">Error</p>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">My Travel Itineraries</h1>
        
//         <div className="flex space-x-2 w-full sm:w-auto">
//           <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
//             <input
//               type="text"
//               placeholder="Search by city..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           </div>
          
//           <button 
//             onClick={() => setFilterActive(!filterActive)}
//             className={`p-2 rounded-md ${filterActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//           >
//             <Filter size={18} />
//           </button>
          
//           <button 
//             onClick={() => navigate('/')}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
//           >
//             <Plus size={18} className="mr-1" /> New
//           </button>
//         </div>
//       </div>
      
//       {itineraries.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//             <MapPin size={32} className="text-gray-400" />
//           </div>
//           <h3 className="text-xl font-medium text-gray-700">No itineraries yet</h3>
//           <p className="text-gray-500 mt-2 mb-6">Start planning your next adventure!</p>
//           <button 
//             onClick={() => navigate('/')}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//           >
//             Create New Itinerary
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredItineraries.map((itinerary) => (
//               <ItineraryCard 
//                 key={itinerary.id} 
//                 itinerary={itinerary} 
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>
          
//           {filteredItineraries.length === 0 && (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No itineraries match your search.</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default MyItineraries;

import { useNavigate } from "react-router-dom";
import useUserItineraries from "../hooks/useUserItineraries";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function MyItineraries() {
  const navigate = useNavigate();
  const { itineraries, loading, error } = useUserItineraries();

  if (loading) return <p className="text-center">Loading your itineraries...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">My Itineraries</h1>

      {itineraries.length === 0 ? (
        <p className="text-center">You have no saved itineraries.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <Card
              key={itinerary.id}
              className="cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition"
              onClick={() => navigate(`/itinerary/${itinerary.id}`)} // ✅ Navigate to unique itinerary
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" /> {itinerary.city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(itinerary.start_date), "MMM d")} - {format(new Date(itinerary.end_date), "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}