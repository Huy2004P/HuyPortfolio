import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${slug}`);
        setPost(res.data);
      } catch (error) {
        console.error('Failed to fetch post', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!post) return <div className="text-center py-20 text-apple-grayNeutral">Post not found</div>;

  return (
    <article className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center text-sm text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-colors">
        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to blog
      </Link>

      <header className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">{post.title}</h1>
        <div className="text-apple-grayNeutral">
          <time>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
        </div>
      </header>

      {post.coverImage && (
        <div className="rounded-xl overflow-hidden bg-apple-grayPale dark:bg-apple-graphiteA">
          <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover" />
        </div>
      )}

      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-a:text-apple-blueLink"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default PostDetail;
