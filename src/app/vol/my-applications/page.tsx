"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  id: string;
  title: string;
  description: string;
  skillsReq: string[];
  duration: string;
  location: {
    label: string;
    latitude: number;
    longitude: number;
  };
}

export default function MyApplicationsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedProjects = async () => {
      try {
        const volunteerId = localStorage.getItem("volunteerId");
        if (!volunteerId) {
          setError("Volunteer ID not found.");
          return;
        }

        const volRes = await axios.get(`/api/vol/${volunteerId}`);
        const appliedProjectIds = volRes.data.data.appliedProjects;

        if (!appliedProjectIds.length) {
          setProjects([]);
          return;
        }

        const projectPromises = appliedProjectIds.map((id: string) =>
          axios.get(`/api/projects/${id}`).then((res) => res.data.data)
        );

        const fetchedProjects = await Promise.all(projectPromises);
        setProjects(fetchedProjects);
      } catch (err) {
        console.error(err);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedProjects();
  }, []);

  const handleWithdraw = async (projectId: string) => {
    // const volunteerId = localStorage.getItem("volunteerId");
    // if (!volunteerId) return;

    // try {
    //   await axios.delete("/api/vol/withdraw", {
    //     data: { volunteerId, projectId },
    //   });
    //   setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
    //   alert("Application withdrawn.");
    // } catch (err) {
    //   console.error("Withdraw failed", err);
    //   alert("Could not withdraw. Try again.");
    // }
    alert("Not implemented");
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;
  if (projects.length === 0)
    return <p className="p-10">You haven’t applied to any projects yet.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-28 px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">My Applications</h1>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-800">{project.title}</h2>
              {/* Updated location display */}
              <p className="text-sm text-gray-600">
                {project.location.label} · {project.duration}
              </p>
            </div>

            <p className="text-sm text-gray-700 mb-2">{project.description}</p>

            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Skills:</span> {project.skillsReq.join(", ")}
            </p>

            <button
              onClick={() => handleWithdraw(project.id)}
              className="text-sm px-4 py-2 bg-black text-white rounded-md hover:opacity-90 transition"
            >
              Withdraw
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
