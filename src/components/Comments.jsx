import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabaseClient';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();

    const subscription = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.COMMENTS },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchComments() {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from(TABLES.COMMENTS)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.message || 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }

  function getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const avatarColors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-indigo-500',
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Customer Comments</h3>
        <p className="text-sm text-gray-500">Review feedback from your customers</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="ml-3 text-sm text-gray-500">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h4 className="text-base font-medium text-gray-700 mb-1">No comments yet</h4>
            <p className="text-sm text-gray-500">Customer comments will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {comments.map((comment, idx) => (
              <li key={comment.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold ${
                      avatarColors[idx % avatarColors.length]
                    }`}
                  >
                    {getInitials(comment.user_name || comment.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.user_name || comment.name || 'Anonymous'}
                      </p>
                      {comment.rating && (
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < comment.rating ? 'fill-current' : 'fill-gray-200'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {comment.product_name && (
                      <p className="text-xs text-emerald-600 font-medium mb-1">
                        Re: {comment.product_name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {comment.comment_text || comment.text || comment.content || ''}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
