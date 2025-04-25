"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const orgId = localStorage.getItem("organizationId");
        if (!orgId) {
          setError("Organization ID missing from localStorage.");
          return;
        }

        const res = await axios.get(`http://localhost:3000/api/org/project/${id}`, {
          headers: { orgId },
        });

        const projectData = res.data?.data;
        if (!projectData) {
          setError("Project not found.");
          return;
        }

        setProject(projectData);

        // Fetch volunteer details
        const vols = await Promise.all(
          projectData.appliedVolunteers?.map(async (volId: string) => {
            try {
              const volRes = await axios.get(`/api/vol/${volId}`);
              return volRes.data?.data;
            } catch (err) {
              console.warn(`Failed to fetch volunteer ${volId}`);
              return null;
            }
          }) || []
        );

        // Filter out null responses
        setVolunteers(vols.filter(Boolean));
      } catch (err) {
        console.error(err);
        setError("Failed to load project details.");
      }
    };

    fetchProject();
  }, [id]);

  if (error) return <div className="p-10 text-red-600">{error}</div>;
  if (!project) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen p-10 bg-white">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 mb-2">{project.description}</p>

      {/* Updated Location Display */}
      <p>
        <strong>Location:</strong> {project.location?.label}
      </p>

      <p><strong>Duration:</strong> {project.duration}</p>
      <p><strong>Skills Required:</strong> {project.skillsReq.join(", ")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Applied Volunteers</h2>
      {volunteers.length === 0 ? (
        <p>No volunteers applied yet.</p>
      ) : (
        <ul className="space-y-4">
          {volunteers.map((vol, idx) => (
            <li key={idx} className="border p-4 rounded bg-gray-50">
              <p><strong>Name:</strong> {vol.name}</p>
              <p><strong>Email:</strong> {vol.email}</p>
              <p><strong>Skills:</strong> {vol.skills.join(", ")}</p>
              <p><strong>Interest:</strong> {vol.interest}</p>

              {/* Updated Volunteer Location */}
              <p>
                <strong>Location:</strong> {vol.location?.label}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
