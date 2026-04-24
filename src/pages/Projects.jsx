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
          <div key={project._id} className="group bg-white dark:bg-apple-graphiteA rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid overflow-hidden transition-shadow hover:shadow-xl flex flex-col">
            {project.imageUrl && (
              <div className="aspect-video overflow-hidden bg-apple-grayPale dark:bg-apple-graphiteB">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 space-y-4 flex flex-col flex-grow">
              {/* Type badge */}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  project.projectType === 'mobile'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {project.projectType === 'mobile' ? '📱 Mobile App' : '🌐 Web'}
                </span>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
              <p className="text-apple-grayNeutral line-clamp-3">{project.description}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies?.map(tech => (
                  <span key={tech} className="text-xs px-2.5 py-1 bg-apple-grayPale dark:bg-apple-graphiteB rounded-md font-medium">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-4 mt-auto">
                {/* Demo button — show for both web and mobile if demoUrl exists */}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-apple-blueAction hover:bg-apple-blueLuminance text-white text-sm font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Demo
                  </a>
                )}

                {/* Download APK — only for mobile with apkUrl */}
                {project.projectType === 'mobile' && project.apkUrl && (
                  <a
                    href={project.apkUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-apple-grayBorderMid hover:border-apple-ink dark:hover:border-apple-white bg-transparent text-apple-ink dark:text-apple-white text-sm font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Tải APK
                  </a>
                )}

                {/* For web: if no demoUrl but has projectUrl, show Visit */}
                {project.projectType !== 'mobile' && !project.demoUrl && project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-apple-blueAction hover:text-apple-blueLuminance text-sm font-medium flex items-center gap-1"
                  >
                    Visit Project →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-apple-grayNeutral">No projects found.</p>}
      </div>
    </div>
  );
};

export default Projects;
