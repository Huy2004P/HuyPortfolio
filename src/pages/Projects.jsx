import { useState, useEffect } from 'react';
import api from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-display font-semibold tracking-tight">Projects</h1>
        <p className="text-lg text-apple-grayNeutral">A collection of my recent work and side projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div key={project._id} className="group bg-white dark:bg-apple-graphiteA rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid overflow-hidden transition-shadow hover:shadow-xl">
            {project.imageUrl && (
              <div className="aspect-video overflow-hidden bg-apple-grayPale dark:bg-apple-graphiteB">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
              <p className="text-apple-grayNeutral line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies?.map(tech => (
                  <span key={tech} className="text-xs px-2.5 py-1 bg-apple-grayPale dark:bg-apple-graphiteB rounded-md font-medium">
                    {tech}
                  </span>
                ))}
              </div>

              {project.projectUrl && (
                <div className="pt-4">
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-apple-blueAction hover:text-apple-blueLuminance text-sm font-medium flex items-center gap-1">
                    Visit Project &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-apple-grayNeutral">No projects found.</p>}
      </div>
    </div>
  );
};

export default Projects;
