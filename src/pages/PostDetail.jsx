import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PostDetail = () => {
  const { slug } = useParams();
  const { t, tText } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Like
  const [likesCount, setLikesCount] = useState(0);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ playerName: '', email: '', content: '' });
  const [replyTo, setReplyTo] = useState(null); // parentId
  const [commentMsg, setCommentMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${slug}`);
        setPost(res.data);
        setLikesCount(res.data.likesCount || 0);
      } catch (error) {
        console.error('Failed to fetch post', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Fetch comments when post loads
  useEffect(() => {
    if (!post) return;
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/post/${post._id}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch {}
    };
    fetchComments();
  }, [post]);

  const handleLike = async () => {
    if (!post) return;
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.playerName.trim() || !commentForm.content.trim()) return;
    setSubmitting(true);
    setCommentMsg('');
    try {
      await api.post('/comments', {
        postId: post._id,
        playerName: commentForm.playerName.trim(),
        email: commentForm.email.trim() || undefined,
        content: commentForm.content.trim(),
        parentId: replyTo || undefined,
      });
      setCommentMsg(t('msg_comment_pending', 'Your comment is pending approval.'));
      setCommentForm({ playerName: '', email: '', content: '' });
      setReplyTo(null);
    } catch (err) {
      setCommentMsg(t('msg_comment_failed', 'Failed to submit comment.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">{t('lbl_loading', 'Loading...')}</div>;
  if (!post) return <div className="text-center py-20 text-apple-grayNeutral">{t('post_not_found', 'Post not found')}</div>;

  // Build nested comment tree
  const topLevel = comments.filter(c => !c.parentId);
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

  const CommentItem = ({ comment, depth = 0 }) => {
    const replies = getReplies(comment._id);
    return (
      <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-purple-500/10' : ''}`}>
        <div className="py-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-apple-grayNeutral">
            <span className="font-semibold text-apple-ink dark:text-apple-white">{comment.playerName}</span>
            <span>•</span>
            <time>{format(new Date(comment.createdAt), 'MMM d, yyyy')}</time>
          </div>
          <p className="text-sm text-apple-ink dark:text-apple-white leading-relaxed">{comment.content}</p>
          <button
            onClick={() => setReplyTo(comment._id)}
            className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
          >
            {t('btn_reply', 'Reply')}
          </button>
        </div>
        {replies.map(r => <CommentItem key={r._id} comment={r} depth={depth + 1} />)}
      </div>
    );
  };

  return (
    <article className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center text-sm text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-colors">
        <ArrowLeftIcon className="w-4 h-4 mr-2" /> {t('btn_back_to_blog', 'Back to blog')}
      </Link>

      <header className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">{tText(post.title)}</h1>
        <div className="flex items-center gap-4 text-apple-grayNeutral">
          <time>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-red-500 transition-colors group/like"
          >
            <Heart className="w-4 h-4 group-hover/like:fill-red-500 group-hover/like:text-red-500 transition-colors" />
            <span className="text-sm font-medium">{likesCount} {t('lbl_likes', 'likes')}</span>
          </button>
        </div>
      </header>

      {post.coverImage && (
        <div className="rounded-xl overflow-hidden bg-apple-grayPale dark:bg-apple-graphiteA">
          <img src={post.coverImage} alt={tText(post.title)} className="w-full h-auto object-cover" />
        </div>
      )}

      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-a:text-apple-blueLink"
        dangerouslySetInnerHTML={{ __html: tText(post.content) }}
      />

      {/* ─── Comments Section ─────────────────────────────────────────── */}
      <section className="space-y-6 pt-8 border-t border-apple-grayBorderSoft dark:border-white/[0.06]">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          {t('lbl_comments', 'Comments')} ({comments.length})
        </h2>

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-apple-grayNeutral text-sm">{t('lbl_no_comments', 'No comments yet.')}</p>
        ) : (
          <div className="divide-y divide-apple-grayBorderSoft/50 dark:divide-white/[0.04]">
            {topLevel.map(c => <CommentItem key={c._id} comment={c} />)}
          </div>
        )}

        {/* Comment form */}
        <div className="space-y-4 bg-white/60 dark:bg-white/[0.02] p-5 rounded-2xl border border-apple-grayBorderSoft dark:border-white/[0.06]">
          <h3 className="text-sm font-semibold text-apple-ink dark:text-apple-white">
            {replyTo ? t('replying_to_comment', '↳ Replying to comment...') : t('lbl_leave_comment', 'Leave a comment')}
            {replyTo && (
              <button onClick={() => setReplyTo(null)} className="ml-2 text-xs text-red-500 hover:underline">{t('btn_cancel', 'Cancel')}</button>
            )}
          </h3>
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={t('lbl_name', 'Name') + ' *'}
                value={commentForm.playerName}
                onChange={e => setCommentForm(p => ({ ...p, playerName: e.target.value }))}
                required
                className="px-4 py-2.5 rounded-xl border border-apple-grayBorderMid bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-apple-ink dark:text-apple-white placeholder-apple-grayNeutral"
              />
              <input
                type="email"
                placeholder={t('lbl_email', 'Email') + ' (' + t('lbl_optional', 'optional') + ')'}
                value={commentForm.email}
                onChange={e => setCommentForm(p => ({ ...p, email: e.target.value }))}
                className="px-4 py-2.5 rounded-xl border border-apple-grayBorderMid bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-apple-ink dark:text-apple-white placeholder-apple-grayNeutral"
              />
            </div>
            <textarea
              placeholder={t('lbl_message', 'Message') + ' *'}
              rows={3}
              value={commentForm.content}
              onChange={e => setCommentForm(p => ({ ...p, content: e.target.value }))}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-apple-grayBorderMid bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none text-apple-ink dark:text-apple-white placeholder-apple-grayNeutral"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? '...' : t('btn_submit', 'Submit')}
              </button>
              {commentMsg && <p className="text-xs text-purple-600 dark:text-purple-400">{commentMsg}</p>}
            </div>
          </form>
        </div>
      </section>
    </article>
  );
};

export default PostDetail;
