'use client';

import { useEffect, useState } from 'react';

// 공통 캐시 설정
const CACHE_REVALIDATE_TIME = 1; // 1초

interface Post {
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

export default function CsrPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  };

  const fetchUsers = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  };

  const fetchComments = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=5');
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  };

  useEffect(() => {
    const loadData = async () => {
      const startTime = Date.now();
      setLoading(true);

      try {
        const [postsData, usersData, commentsData] = await Promise.all([
          fetchPosts(),
          fetchUsers(),
          fetchComments()
        ]);

        setPosts(postsData);
        setUsers(usersData);
        setComments(commentsData);

        const endTime = Date.now();
        setLoadTime(endTime - startTime);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>CSR Test Page</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>CSR Data Fetching Test Page</h1>
      <p>This page tests client-side data fetching and browser caching.</p>
      <p><strong>Page load time: {loadTime}ms</strong></p>
      
      <div style={{ marginTop: "20px" }}>
        <h2>Posts</h2>
        <div style={{ 
          display: "grid", 
          gap: "16px", 
          marginTop: "10px",
          gridTemplateColumns: "1fr"
        }}>
          {posts.slice(0, 3).map((post) => (
            <div 
              key={post.id} 
              style={{ 
                border: "1px solid #ddd", 
                padding: "16px", 
                borderRadius: "8px" 
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Users</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px", 
          marginTop: "10px"
        }}>
          {users.slice(0, 4).map((user) => (
            <div 
              key={user.id} 
              style={{ 
                border: "1px solid #ddd", 
                padding: "16px", 
                borderRadius: "8px" 
              }}
            >
              <h4>{user.name}</h4>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Comments</h2>
        <div style={{ 
          display: "grid", 
          gap: "16px", 
          marginTop: "10px"
        }}>
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              style={{ 
                border: "1px solid #ddd", 
                padding: "16px", 
                borderRadius: "8px" 
              }}
            >
              <h4>Comment #{comment.id}</h4>
              <p><strong>Name:</strong> {comment.name}</p>
              <p><strong>Email:</strong> {comment.email}</p>
              <p>{comment.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 