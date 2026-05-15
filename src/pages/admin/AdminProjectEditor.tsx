import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { ProjectEditorEngine } from "../../components/admin/ProjectEditorEngine";

export default function AdminProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <AdminLayout>
      <div className="h-[85vh] bg-white rounded-[28px] overflow-hidden border border-black/5 shadow-2xl">
        <ProjectEditorEngine 
          projectId={id} 
          onClose={() => navigate('/admin/projects')} 
        />
      </div>
    </AdminLayout>
  );
}
