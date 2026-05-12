import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/NavBar/Navbar";
import { TimerComponent } from "./components/Timer/Timer";
import { TaskList } from "./components/TaskList/TaskList";
import { CalendarEvents } from "./components/CalendarEvents/CalendarEvents";
import { GoogleCalendar } from "./components/CalendarEvents/GoogleCalendar";

function App() {
  const [activeTab, setActiveTab] = useState("timer");

  return (
    <div className="h-screen bg-[#F0F4EF] font-sans text-gray-700 flex flex-col items-center overflow-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main com flex-1 e justify-center garante a centralização vertical e horizontal */}
      <main className="flex-1 w-full max-w-md flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {activeTab === "timer" && <TimerComponent key="timer" />}

          {activeTab === "tasks" && <TaskList key="tasks" />}

          {activeTab === "calendar" && (
            <div
              key="calendar"
              className="w-full h-full overflow-y-auto custom-scrollbar"
            >
              <CalendarEvents />
            </div>
          )}
          {activeTab === "google" && (
            <div key="google" style={{ width: "100%", height: "100%" }}>
              <GoogleCalendar />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
