import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { format } from 'date-fns';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data.filter(p => p.published));
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-12 max-w-3xl mx-auto">
      <div className="space-y-4 border-b border-apple-grayBorderSoft dark:border-apple-graphiteA pb-8">
        <h1 className="text-4xl font-display font-semibold tracking-tight">Writing</h1>
        <p className="text-lg text-apple-grayNeutral">Thoughts on software engineering, design, and life.</p>
      </div>

      <div className="space-y-10">
        {posts.map((post) => (
          <article key={post._id} className="group">
            <Link to={`/blog/${post.slug}`} className="block space-y-3">
              <time className="text-sm text-apple-grayNeutral">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </time>
              <h2 className="text-2xl font-semibold tracking-tight group-hover:text-apple-blueAction transition-colors">
                {post.title}
              </h2>
              <p className="text-apple-grayNeutral leading-relaxed">
                {post.excerpt}
              </p>
              <div className="text-apple-blueAction text-sm font-medium">Read more &rarr;</div>
            </Link>
          </article>
        ))}
        {posts.length === 0 && <p className="text-apple-grayNeutral">No posts published yet.</p>}
      </div>
    </div>
  );
};

export default Blog;
