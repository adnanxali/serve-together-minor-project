'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Project {
  id: string;
  title: string;
  description: string;
  duration: string;
  location: {
    label: string;
    latitude: number;
    longitude: number;
  };
}

export default function VolunteerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  

  useEffect(() => {
    const volId = localStorage.getItem('volunteerId');
    if(!volId){
      router.replace('/vol/login')
    }

    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects', {
          headers: { volunteerId: volId }
        });
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-10">Volunteering Opportunities</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
              {/* Updated location display */}
              <p className="mt-2 text-sm text-gray-500">📍 {project.location.label}</p>
              {project.location.latitude && project.location.longitude && (
                <p className="text-sm text-gray-500">
                  ⏳ {project.duration}
                </p>
              )}
            </div>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-sm"
              onClick={() => router.push(`/vol/projects/${project.id}`)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
