// 공통 캐시 설정
const CACHE_REVALIDATE_TIME = 1; // 10초

async function fetchPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: CACHE_REVALIDATE_TIME }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

async function fetchUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: CACHE_REVALIDATE_TIME }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
}

async function fetchComments() {
  const res = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=5', {
    next: { revalidate: CACHE_REVALIDATE_TIME }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json();
}

export default async function DataFetchingPage() {
  const startTime = Date.now();
  
  const [posts, users, comments] = await Promise.all([
    fetchPosts(),
    fetchUsers(),
    fetchComments()
  ]);
  
  const loadTime = Date.now() - startTime;

  return (
    <div>
      <h1>SSR Data Fetching Test Page</h1>
      <p>This page tests data fetching and caching with revalidate: {CACHE_REVALIDATE_TIME}s</p>
      <p><strong>Page load time: {loadTime}ms</strong></p>
      
      <div style={{ marginTop: "20px" }}>
        <h2>Posts</h2>
        <div style={{ 
          display: "grid", 
          gap: "16px", 
          marginTop: "10px",
          gridTemplateColumns: "1fr"
        }}>
          {posts.slice(0, 3).map((post: any) => (
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
          {users.slice(0, 4).map((user: any) => (
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
          {comments.map((comment: any) => (
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

// 페이지 레벨 revalidate 설정
export const revalidate = CACHE_REVALIDATE_TIME; 