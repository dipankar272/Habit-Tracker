import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHabits, deleteHabit, updateHabit } from '../api';
import HabitCard from '../components/HabitCard';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useMemo } from 'react';

const AnimatedBackground = () => {
  const { theme } = useTheme();
  
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {theme === 'light' ? (
        <>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const CATEGORIES = ['All', 'Learning', 'Health', 'Fitness', 'Work', 'General'];
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    loadHabits();
  }, []);
  //useEffe(()=>{
    //console.log(parent)
    //})

    
  const loadHabits = async () => {
    setIsLoading(true);
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      toast.error('Failed to load habits');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = async (id, progress, name) => {
    try {
      await updateHabit(id, { name, progress, completed: progress === 100 });
      // Update local state without fetching all again
      setHabits(prevHabits => 
        prevHabits.map(h => {
          const habitId = h.id || h._id;
          if (habitId === id) {
            const newProgressEntry = {
              date: new Date().toISOString().split('T')[0],
              progress: progress
            };
            return {
              ...h,
              progress,
              completed: progress === 100,
              progressLog: [...(h.progressLog || []), newProgressEntry],
              streak: progress === 100 ? (h.streak || 0) + 1 : h.streak
            };
          }
          return h;
        })
      );
      toast.success('Progress updated!');
    } catch (error) {
      toast.error('Failed to update progress');
      console.error(error);
    }
  };


  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100'
    }`}>
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-12 text-center"
        >
          <h1 className="md:text-5xl text-2xl  font-bold text-gray-900 dark:text-white mb-2">Habits Tracker</h1>
          <p className="md:text-xl text-lg text-gray-600 dark:text-gray-300">Track your daily progress and build better habits</p>
        </motion.div>

        {/* Category Filter Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex overflow-x-auto space-x-2 md:space-x-4 mb-8 pb-2 scrollbar-hide justify-start md:justify-center"
        >
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
       
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {(() => {
                const filteredHabits = selectedCategory === 'All' 
                  ? habits 
                  : habits.filter(habit => (habit.category || 'General') === selectedCategory);
                  
                return filteredHabits.length > 0 ? filteredHabits.map((habit) => {
                  const habitId = habit.id || habit._id;
                  return (
                  <motion.div
                    key={habitId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/habits/${habitId}`} className="block relative">
                      <HabitCard habit={habit} onProgressUpdate={handleProgressUpdate} />
                    </Link>
                  </motion.div>
                  );
                }) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={()=>navigate('/add-habit')}
                    className="col-span-full text-center cursor-pointer  text-gray-600 dark:text-gray-300 flex flex-col items-center justify-center bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-lg p-8 backdrop-filter backdrop-blur-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-xl">No habits found in this category.</p>
                  </motion.div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}