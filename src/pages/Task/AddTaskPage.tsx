import TaskModal from "../../components/Tasks/TaskModal";
import { useNavigate } from "react-router-dom";

const AddTaskPage = () => {
  const navigate = useNavigate();

  return (
    <TaskModal
      isOpen={true}
      onClose={() => navigate("/dashboard")}
      onSuccess={() => navigate("/dashboard")}
    />
  );
};

export default AddTaskPage;
