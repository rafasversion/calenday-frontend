import React, { useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Calendar from "../../components/Calendar/Calendar";
import TasksTable from "../../components/Tasks/TasksTable";
import Status from "../../components/Status/Status";
import Kanban from "../../components/Kanban/Kanban";
import CalendarHeader from "../../components/Calendar/CalendarHeader";

import { taskService } from "../../services/taskService";
import { eventService } from "../../services/eventService";

import { CalendarViewMode } from "../../components/Calendar/Calendar";

import ViewTaskModal from "../../components/Tasks/ViewTaskModal";
import ViewEventModal from "../../components/Events/ViewEventModal";
import TaskModal from "../../components/Tasks/TaskModal";
import EventModal from "../../components/Events/EventModal";

const Dashboard = () => {
  const [calViewMode, setCalViewMode] = useState<CalendarViewMode>("month");

  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [taskViewOpen, setTaskViewOpen] = useState(false);
  const [eventViewOpen, setEventViewOpen] = useState(false);

  const [taskEditOpen, setTaskEditOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);

  const loadTasks = useCallback(async (filters = {}) => {
    const data = await taskService.getAll(filters);
    if (data) setTasks(data as any[]);
  }, []);

  const loadEvents = useCallback(async () => {
    const data = await eventService.getAll();
    if (data) setEvents(data as any[]);
  }, []);

  useEffect(() => {
    loadTasks();
    loadEvents();
  }, [loadTasks, loadEvents]);

  return (
    <>
      <CalendarHeader
        calViewMode={calViewMode}
        setCalViewMode={setCalViewMode}
        onCreateEvent={() => {
          setSelectedEvent(null);
          setEventEditOpen(true);
        }}
        onCreateTask={() => {
          setSelectedTask(null);
          setTaskEditOpen(true);
        }}
      />

      <Routes>
        <Route index element={<Navigate to="calendar" replace />} />

        <Route
          path="calendar"
          element={
            <Calendar
              tasks={tasks}
              events={events}
              calViewMode={calViewMode}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setTaskViewOpen(true);
              }}
              onEventClick={(event) => {
                setSelectedEvent(event);
                setEventViewOpen(true);
              }}
            />
          }
        />

        <Route
          path="kanban"
          element={<Kanban tasks={tasks} onStatusChange={loadTasks} />}
        />

        <Route
          path="tasks"
          element={
            <>
              <Status tasks={tasks} />
              <TasksTable
                tasks={tasks}
                onFilterUpdate={loadTasks}
                onAddTask={() => {
                  setSelectedTask(null);
                  setTaskEditOpen(true);
                }}
                onEditTask={(task) => {
                  setSelectedTask(task);
                  setTaskEditOpen(true);
                }}
                onDeleteTask={loadTasks}
              />
            </>
          }
        />
      </Routes>

      <ViewTaskModal
        isOpen={taskViewOpen}
        onClose={() => setTaskViewOpen(false)}
        task={selectedTask}
        onEdit={(task) => {
          setSelectedTask(task);
          setTaskViewOpen(false);
          setTaskEditOpen(true);
        }}
        onDeleteSuccess={loadTasks}
      />

      <ViewEventModal
        isOpen={eventViewOpen}
        onClose={() => setEventViewOpen(false)}
        event={selectedEvent}
        onEdit={(event) => {
          setSelectedEvent(event);
          setEventViewOpen(false);
          setEventEditOpen(true);
        }}
        onDeleteSuccess={loadEvents}
      />

      <TaskModal
        isOpen={taskEditOpen}
        onClose={() => setTaskEditOpen(false)}
        onSuccess={loadTasks}
        taskToEdit={selectedTask}
      />

      <EventModal
        isOpen={eventEditOpen}
        onClose={() => setEventEditOpen(false)}
        onSuccess={loadEvents}
        eventToEdit={selectedEvent}
      />
    </>
  );
};

export default Dashboard;
