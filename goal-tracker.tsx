"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { format, differenceInDays } from "date-fns"

// Types
type User = {
  id: string
  name: string
  avatar: string
  role: string
}

type Milestone = {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
}

type Goal = {
  id: string
  title: string
  description: string
  category: "personal" | "team" | "work" | "health" | "finance" | "education"
  type: "personal" | "team"
  progress: number
  target: number
  startDate: Date
  dueDate: Date
  createdBy: string
  assignedTo: string[]
  milestones: Milestone[]
  progressHistory: { date: Date; value: number }[]
}

// Mock data
const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Product Manager",
  },
  {
    id: "user2",
    name: "Sarah Williams",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Designer",
  },
  {
    id: "user3",
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    role: "Developer",
  },
  {
    id: "user4",
    name: "Emily Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    role: "Marketing",
  },
  {
    id: "currentUser",
    name: "You",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Team Lead",
  },
]

const initialGoals: Goal[] = [
  {
    id: "goal1",
    title: "Launch New Website",
    description: "Complete the redesign and launch of the company website with improved UX and mobile responsiveness.",
    category: "work",
    type: "team",
    progress: 65,
    target: 100,
    startDate: new Date(2025, 0, 15),
    dueDate: new Date(2025, 5, 30),
    createdBy: "currentUser",
    assignedTo: ["user1", "user2", "user3"],
    milestones: [
      {
        id: "m1-1",
        title: "Complete wireframes",
        description: "Finalize all wireframes for key pages",
        dueDate: new Date(2025, 1, 15),
        completed: true,
      },
      {
        id: "m1-2",
        title: "Design approval",
        description: "Get stakeholder approval on designs",
        dueDate: new Date(2025, 2, 30),
        completed: true,
      },
      {
        id: "m1-3",
        title: "Development",
        description: "Build the website based on approved designs",
        dueDate: new Date(2025, 4, 15),
        completed: false,
      },
      {
        id: "m1-4",
        title: "Testing & Launch",
        description: "Final testing and website launch",
        dueDate: new Date(2025, 5, 25),
        completed: false,
      },
    ],
    progressHistory: [
      { date: new Date(2025, 0, 15), value: 0 },
      { date: new Date(2025, 1, 15), value: 20 },
      { date: new Date(2025, 2, 15), value: 35 },
      { date: new Date(2025, 3, 15), value: 50 },
      { date: new Date(2025, 4, 15), value: 65 },
    ],
  },
  {
    id: "goal2",
    title: "Run Half Marathon",
    description: "Train for and complete a half marathon (21.1 km) with a target time under 2 hours.",
    category: "health",
    type: "personal",
    progress: 40,
    target: 100,
    startDate: new Date(2025, 1, 1),
    dueDate: new Date(2025, 7, 15),
    createdBy: "currentUser",
    assignedTo: ["currentUser"],
    milestones: [
      {
        id: "m2-1",
        title: "5K run",
        description: "Complete 5K run under 30 minutes",
        dueDate: new Date(2025, 2, 15),
        completed: true,
      },
      {
        id: "m2-2",
        title: "10K run",
        description: "Complete 10K run under 60 minutes",
        dueDate: new Date(2025, 4, 1),
        completed: false,
      },
      {
        id: "m2-3",
        title: "15K run",
        description: "Complete 15K run under 90 minutes",
        dueDate: new Date(2025, 6, 1),
        completed: false,
      },
      {
        id: "m2-4",
        title: "Half marathon",
        description: "Complete half marathon under 2 hours",
        dueDate: new Date(2025, 7, 15),
        completed: false,
      },
    ],
    progressHistory: [
      { date: new Date(2025, 1, 1), value: 0 },
      { date: new Date(2025, 2, 1), value: 15 },
      { date: new Date(2025, 3, 1), value: 25 },
      { date: new Date(2025, 4, 1), value: 40 },
    ],
  },
  {
    id: "goal3",
    title: "Increase Monthly Sales",
    description: "Increase monthly sales by 30% through improved marketing strategies and customer engagement.",
    category: "work",
    type: "team",
    progress: 80,
    target: 100,
    startDate: new Date(2025, 0, 1),
    dueDate: new Date(2025, 5, 30),
    createdBy: "user1",
    assignedTo: ["user1", "user4", "currentUser"],
    milestones: [
      {
        id: "m3-1",
        title: "Market research",
        description: "Complete market research and competitor analysis",
        dueDate: new Date(2025, 1, 15),
        completed: true,
      },
      {
        id: "m3-2",
        title: "Strategy development",
        description: "Develop new marketing and sales strategies",
        dueDate: new Date(2025, 2, 15),
        completed: true,
      },
      {
        id: "m3-3",
        title: "Implementation",
        description: "Implement new strategies across all channels",
        dueDate: new Date(2025, 3, 30),
        completed: true,
      },
      {
        id: "m3-4",
        title: "Evaluation",
        description: "Evaluate results and adjust strategies",
        dueDate: new Date(2025, 5, 15),
        completed: false,
      },
    ],
    progressHistory: [
      { date: new Date(2025, 0, 1), value: 0 },
      { date: new Date(2025, 1, 1), value: 20 },
      { date: new Date(2025, 2, 1), value: 45 },
      { date: new Date(2025, 3, 1), value: 65 },
      { date: new Date(2025, 4, 1), value: 80 },
    ],
  },
  {
    id: "goal4",
    title: "Learn Spanish",
    description: "Achieve conversational fluency in Spanish through daily practice and structured learning.",
    category: "education",
    type: "personal",
    progress: 25,
    target: 100,
    startDate: new Date(2025, 0, 1),
    dueDate: new Date(2025, 11, 31),
    createdBy: "currentUser",
    assignedTo: ["currentUser"],
    milestones: [
      {
        id: "m4-1",
        title: "Basic vocabulary",
        description: "Learn 500 common words and phrases",
        dueDate: new Date(2025, 2, 31),
        completed: true,
      },
      {
        id: "m4-2",
        title: "Simple conversations",
        description: "Hold basic conversations on common topics",
        dueDate: new Date(2025, 5, 30),
        completed: false,
      },
      {
        id: "m4-3",
        title: "Intermediate grammar",
        description: "Master intermediate grammar concepts",
        dueDate: new Date(2025, 8, 30),
        completed: false,
      },
      {
        id: "m4-4",
        title: "Fluent conversation",
        description: "Hold fluent conversations on various topics",
        dueDate: new Date(2025, 11, 31),
        completed: false,
      },
    ],
    progressHistory: [
      { date: new Date(2025, 0, 1), value: 0 },
      { date: new Date(2025, 1, 1), value: 10 },
      { date: new Date(2025, 2, 1), value: 20 },
      { date: new Date(2025, 3, 1), value: 25 },
    ],
  },
  {
    id: "goal5",
    title: "Save for Down Payment",
    description: "Save $50,000 for a house down payment through monthly contributions and investment growth.",
    category: "finance",
    type: "personal",
    progress: 30,
    target: 100,
    startDate: new Date(2024, 6, 1),
    dueDate: new Date(2026, 6, 1),
    createdBy: "currentUser",
    assignedTo: ["currentUser"],
    milestones: [
      {
        id: "m5-1",
        title: "Initial $10,000",
        description: "Save first $10,000 through monthly contributions",
        dueDate: new Date(2024, 11, 31),
        completed: true,
      },
      {
        id: "m5-2",
        title: "Reach $25,000",
        description: "Continue saving and reach $25,000",
        dueDate: new Date(2025, 6, 30),
        completed: false,
      },
      {
        id: "m5-3",
        title: "Reach $40,000",
        description: "Continue saving and reach $40,000",
        dueDate: new Date(2026, 0, 31),
        completed: false,
      },
      {
        id: "m5-4",
        title: "Reach $50,000",
        description: "Reach final goal of $50,000",
        dueDate: new Date(2026, 6, 1),
        completed: false,
      },
    ],
    progressHistory: [
      { date: new Date(2024, 6, 1), value: 0 },
      { date: new Date(2024, 9, 1), value: 15 },
      { date: new Date(2024, 12, 1), value: 20 },
      { date: new Date(2025, 3, 1), value: 30 },
    ],
  },
]

// Helper functions
const formatDate = (date: Date): string => {
  return format(date, "MMM d, yyyy")
}

const calculateDaysRemaining = (dueDate: Date): number => {
  return differenceInDays(dueDate, new Date())
}

const getUserById = (id: string): User => {
  return users.find((user) => user.id === id) || users[0]
}

const getProgressColor = (progress: number): string => {
  if (progress < 30) return "bg-red-500"
  if (progress < 70) return "bg-yellow-500"
  return "bg-green-500"
}

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [filter, setFilter] = useState<"all" | "personal" | "team">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("")
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("")
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState("")
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "work",
    type: "personal",
    dueDate: "",
  })

  // Filter goals based on selected filters
  const filteredGoals = goals.filter((goal) => {
    if (filter !== "all" && goal.type !== filter) return false
    if (categoryFilter !== "all" && goal.category !== categoryFilter) return false
    return true
  })

  // Calculate overall progress
  const overallProgress =
    goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0

  // Prepare data for charts
  const categoryData = goals.reduce(
    (acc, goal) => {
      const existingCategory = acc.find((item) => item.name === goal.category)
      if (existingCategory) {
        existingCategory.value += 1
      } else {
        acc.push({ name: goal.category, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

  // Handle milestone completion toggle
  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            return { ...milestone, completed: !milestone.completed }
          }
          return milestone
        })

        // Calculate new progress based on completed milestones
        const completedMilestones = updatedMilestones.filter((m) => m.completed).length
        const newProgress = Math.round((completedMilestones / updatedMilestones.length) * 100)

        // Add new progress history entry
        const newProgressHistory = [...goal.progressHistory, { date: new Date(), value: newProgress }]

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: newProgress,
          progressHistory: newProgressHistory,
        }
      }
      return goal
    })

    setGoals(updatedGoals)

    // Update selected goal if it's the one being modified
    if (selectedGoal && selectedGoal.id === goalId) {
      setSelectedGoal(updatedGoals.find((g) => g.id === goalId) || null)
    }
  }

  // Add new milestone to a goal
  const addMilestone = (goalId: string) => {
    if (!newMilestoneTitle || !newMilestoneDescription || !newMilestoneDueDate) return

    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const newMilestone: Milestone = {
          id: `m-${Date.now()}`,
          title: newMilestoneTitle,
          description: newMilestoneDescription,
          dueDate: new Date(newMilestoneDueDate),
          completed: false,
        }

        return {
          ...goal,
          milestones: [...goal.milestones, newMilestone],
        }
      }
      return goal
    })

    setGoals(updatedGoals)
    setSelectedGoal(updatedGoals.find((g) => g.id === goalId) || null)

    // Reset form
    setNewMilestoneTitle("")
    setNewMilestoneDescription("")
    setNewMilestoneDueDate("")
  }

  // Create a new goal
  const createNewGoal = () => {
    if (!newGoal.title || !newGoal.description || !newGoal.dueDate) return

    const newGoalObj: Goal = {
      id: `goal${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category as any,
      type: newGoal.type as "personal" | "team",
      progress: 0,
      target: 100,
      startDate: new Date(),
      dueDate: new Date(newGoal.dueDate),
      createdBy: "currentUser",
      assignedTo: ["currentUser"],
      milestones: [],
      progressHistory: [{ date: new Date(), value: 0 }],
    }

    setGoals([...goals, newGoalObj])
    setShowNewGoalForm(false)

    // Reset form
    setNewGoal({
      title: "",
      description: "",
      category: "work",
      type: "personal",
      dueDate: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-gray-900">GoalTracker</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Welcome, {getUserById("currentUser").name}</span>
            <img
              src={getUserById("currentUser").avatar || "/placeholder.svg"}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <button
              onClick={() => setShowNewGoalForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Progress Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Progress</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                  <motion.div
                    className="bg-indigo-600 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{overallProgress}%</span>
              </div>
            </div>

            {/* Goals by Category */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Goals by Category</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Goals Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Goals Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">On Track</span>
                    <span className="text-sm font-medium text-gray-700">
                      {goals.filter((g) => g.progress >= 70).length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(goals.filter((g) => g.progress >= 70).length / goals.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">In Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                      {goals.filter((g) => g.progress >= 30 && g.progress < 70).length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(goals.filter((g) => g.progress >= 30 && g.progress < 70).length / goals.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">At Risk</span>
                    <span className="text-sm font-medium text-gray-700">
                      {goals.filter((g) => g.progress < 30).length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(goals.filter((g) => g.progress < 30).length / goals.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
            <div className="flex space-x-4">
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Goals</option>
                  <option value="personal">Personal</option>
                  <option value="team">Team</option>
                </select>
              </div>
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedGoal(goal)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{goal.title}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          goal.type === "personal" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{goal.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={getProgressColor(goal.progress)}
                          style={{ width: `${goal.progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Due: </span>
                        <span>{formatDate(goal.dueDate)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Days left: </span>
                        <span>{calculateDaysRemaining(goal.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={getUserById(goal.createdBy).avatar || "/placeholder.svg"}
                        alt={getUserById(goal.createdBy).name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="ml-2 text-xs text-gray-600">{getUserById(goal.createdBy).name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-600">
                        {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} milestones
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedGoal.title}</h2>
                <button onClick={() => setSelectedGoal(null)} className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedGoal.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-sm text-gray-600">{selectedGoal.category}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-sm text-gray-600">{selectedGoal.type}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Start Date:</span>
                    <span className="ml-2 text-sm text-gray-600">{formatDate(selectedGoal.startDate)}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Due Date:</span>
                    <span className="ml-2 text-sm text-gray-600">{formatDate(selectedGoal.dueDate)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{selectedGoal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={getProgressColor(selectedGoal.progress)}
                      style={{ width: `${selectedGoal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Progress History</h3>
                  <div className="h-64 bg-gray-50 p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={selectedGoal.progressHistory.map((item) => ({
                          date: format(item.date, "MMM dd"),
                          value: item.value,
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {selectedGoal.type === "team" && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGoal.assignedTo.map((userId) => (
                      <div key={userId} className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                        <img
                          src={getUserById(userId).avatar || "/placeholder.svg"}
                          alt={getUserById(userId).name}
                          className="h-6 w-6 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm text-gray-700">{getUserById(userId).name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
                  <span className="text-sm text-gray-600">
                    {selectedGoal.milestones.filter((m) => m.completed).length}/{selectedGoal.milestones.length}{" "}
                    completed
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  {selectedGoal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="flex-shrink-0 mr-3">
                        <button
                          onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                          className={`h-5 w-5 rounded border ${
                            milestone.completed
                              ? "bg-indigo-600 border-indigo-600 flex items-center justify-center"
                              : "border-gray-300"
                          }`}
                        >
                          {milestone.completed && (
                            <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4
                            className={`text-sm font-medium ${milestone.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                          >
                            {milestone.title}
                          </h4>
                          <span className="text-xs text-gray-500">{formatDate(milestone.dueDate)}</span>
                        </div>
                        <p className={`text-xs mt-1 ${milestone.completed ? "text-gray-400" : "text-gray-600"}`}>
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Milestone */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Add New Milestone</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      placeholder="Milestone title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <textarea
                      value={newMilestoneDescription}
                      onChange={(e) => setNewMilestoneDescription(e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={2}
                    />
                    <input
                      type="date"
                      value={newMilestoneDueDate}
                      onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      onClick={() => addMilestone(selectedGoal.id)}
                      disabled={!newMilestoneTitle || !newMilestoneDescription || !newMilestoneDueDate}
                      className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Milestone
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* New Goal Modal */}
      {showNewGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
          >
            <div className="p-6 border-b">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Goal</h2>
                <button onClick={() => setShowNewGoalForm(false)} className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter goal title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={3}
                    placeholder="Describe your goal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="type"
                      value={newGoal.type}
                      onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="personal">Personal</option>
                      <option value="team">Team</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewGoalForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewGoal}
                  disabled={!newGoal.title || !newGoal.description || !newGoal.dueDate}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default GoalTracker
