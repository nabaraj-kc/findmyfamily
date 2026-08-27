'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import styles from './Community.module.css';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp?: string;
}

interface Post {
  id: string;
  author: string;
  authorRole: 'Citizen' | 'Official' | 'Volunteer';
  content: string;
  image?: string;
  timestamp?: string;
  likes: number;
  comments: Comment[];
}

export const CommunityClient: React.FC = () => {
  const t = useTranslations('community');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const fetchCommunityPosts = async () => {
    try {
      const res = await fetch('/api/community', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.warn('Failed to load community posts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: {
            author: 'You',
            authorRole: 'Citizen',
            content: newPostContent
          }
        })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => [data.post, ...prev]);
        setNewPostContent('');
      }
    } catch (err) {
      console.error('Failed to submit post:', err);
    } finally {
      setIsPosting(false);
    }
  };


  const handleReplySubmit = async (postId: string) => {
    const text = replyText[postId];
    if (!text?.trim()) return;

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_comment',
          comment: {
            postId: Number(postId),
            author: 'You',
            text
          }
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: [...p.comments, data.comment] };
          }
          return p;
        }));
        setReplyText({ ...replyText, [postId]: '' });
      }
    } catch (err) {
      console.error('Failed to submit reply:', err);
    }
  };

  return (
    <Section padding="lg">
      <Container size="sm">
        <div className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* Create Post */}
        <div className={styles.createPostCard}>
          <textarea 
            className={styles.textarea} 
            placeholder={t('postPlaceholder')}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <div className={styles.createActions}>
            <Button variant="ghost" size="sm" icon={<Icon name="Image" size={18} />}>Photo</Button>
            <div style={{ flex: 1 }} />
            <Button variant="primary" onClick={handlePostSubmit} loading={isPosting}>
              {t('postBtn')}
            </Button>
          </div>
        </div>

        {/* Feed */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: '#71717a' }}>
            <Icon name="Loader2" size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            <p>Loading community updates...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-12)',
            backgroundColor: '#111113',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed #27272a',
            color: '#71717a'
          }}>
            <Icon name="MessageSquare" size={36} style={{ margin: '0 auto 10px', color: '#52525b' }} />
            <p style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff' }}>No community updates</p>
            <p style={{ fontSize: 'var(--text-xs)' }}>Be the first to share an emergency update or request rescue assistance above.</p>
          </div>
        ) : (
          <div className={styles.feed}>
            {posts.map(post => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={styles.avatar}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.authorName}>
                        {post.author}
                        {post.authorRole === 'Official' && (
                          <Icon name="ShieldCheck" size={14} className={styles.officialBadge} />
                        )}
                      </div>
                      <div className={styles.timestamp}>{post.timestamp || 'Recent'}</div>
                    </div>
                  </div>

                </div>
                
                <p className={styles.postContent}>{post.content}</p>
                
                <div className={styles.postActions}>
                  <button className={styles.actionBtn}>
                    <Icon name="Heart" size={18} />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className={styles.actionBtn}>
                    <Icon name="MessageCircle" size={18} />
                    <span>{post.comments ? post.comments.length : 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className={styles.commentsSection}>
                  {post.comments && post.comments.map(comment => (
                    <div key={comment.id} className={styles.comment} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className={styles.commentAuthor}>{comment.author}:</span>
                        <span className={styles.commentText}>{comment.text}</span>
                      </div>

                    </div>
                  ))}
                  
                  <div className={styles.replyInputWrapper}>
                    <input 
                      type="text" 
                      className={styles.replyInput} 
                      placeholder="Write a reply..."
                      value={replyText[post.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(post.id)}
                    />
                    <button className={styles.sendBtn} onClick={() => handleReplySubmit(post.id)}>
                      <Icon name="Send" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
};
