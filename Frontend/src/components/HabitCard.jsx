/* eslint-disable react/prop-types */
import  { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Calendar, Clock } from 'lucide-react'

export default function HabitCard({ habit, onProgressUpdate }) {
  const [isHovered, setIsHovered] = useState(false)

  
  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500 dark:bg-green-600"
    if (progress >= 75) return "bg-blue-500 dark:bg-blue-600"
    if (progress >= 50) return "bg-yellow-500 dark:bg-yellow-600"
    if (progress >= 25) return "bg-orange-500 dark:bg-orange-600"
    return "bg-red-500 dark:bg-red-600"
  }

  const latestProgress = habit.progressLog.length > 0 
    ? habit.progressLog[habit.progressLog.length - 1].progress 
    : 0;

  const formattedUpdatedAt = new Date(habit.updatedAt).toLocaleString()

  return (
    <div 
      className={`w-full relative max-w-md rounded-md ring-1 ring-blue-500 dark:ring-blue-500 transition-all duration-300 ease-in-out hover:shadow-lg dark:text-gray-100 hover:shadow-blue-500 shadow-white`}
      
    >
     
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{habit.name}</h3>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-semibold rounded-full">
            {habit.category || 'General'}
          </span>
        </div>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className={`h-2 rounded-full ${getProgressColor(latestProgress)}`} 
              style={{ width: `${latestProgress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(habit.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formattedUpdatedAt}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
        <div className="w-full flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <Zap className="h-4 w-4 mr-1" />
            Streak: {habit.streak}
          </span>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
          >
            {latestProgress === 100 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white dark:bg-green-600">
                Completed!
              </span>
            )}
          </motion.div>
        </div>
        
        {/* Quick Actions inside Card */}
        <div className="flex justify-between items-center mt-2 relative z-20">
          {[0, 25, 50, 75, 100].map((progress) => (
            <button
              key={progress}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onProgressUpdate && !habit.completed) {
                  onProgressUpdate(habit.id || habit._id, progress, habit.name);
                }
              }}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                latestProgress === progress || habit.completed
                  ? 'bg-indigo-600 text-white cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
              disabled={habit.completed}
            >
              {progress}%
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
