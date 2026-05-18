import EventModal from "../../components/Events/EventModal";
import { useNavigate } from "react-router-dom";

const AddEventPage = () => {
  const navigate = useNavigate();

  return (
    <EventModal
      isOpen={true}
      onClose={() => navigate("/dashboard")}
      onSuccess={() => navigate("/dashboard")}
    />
  );
};

export default AddEventPage;
