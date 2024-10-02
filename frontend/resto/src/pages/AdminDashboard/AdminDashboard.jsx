import { useState } from "react";
import CreateMenuItem from "../../components/CreateMenuItem/CreateMenuItem ";
import DeleteMenuItem from "../../components/DeleteMenuItem/DeleteMenuItem ";
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard";
import "../../pages/AdminDashboard/AdminDashboard .css";

const AdminServicePage = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "create":
        return <CreateMenuItem />;
      case "dashboard":
        return <AdminDashboard />;
      case "delete":
        return <DeleteMenuItem />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-service-page">
      <div className="admin-buttons">
        <button onClick={() => setActiveComponent("create")}>
          Create Menu Item
        </button>
        <button onClick={() => setActiveComponent("dashboard")}>
          Admin Dashboard
        </button>
        <button onClick={() => setActiveComponent("delete")}>
          Delete Menu Item
        </button>
      </div>
      <div className="admin-content-cadre">{renderComponent()}</div>
    </div>
  );
};

export default AdminServicePage;
