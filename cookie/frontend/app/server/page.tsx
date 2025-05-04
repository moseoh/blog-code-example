'use client';

import { useState } from 'react';

interface CookieRequest {
  key: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httponly: boolean;
  samesite: string;
}

export default function ServerRequest() {
  const [response, setResponse] = useState<string>('');
  const [formData, setFormData] = useState<CookieRequest>({
    key: 'server-session',
    value: 'server-session-value',
    domain: 'localhost',
    path: '/',
    secure: false,
    httponly: true,
    samesite: 'lax'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // API 라우트를 통해 서버 사이드에서 쿠키 요청을 보냄
      const response = await fetch('/api/set-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
        // 서버 사이드 요청은 credentials: 'include'가 필요 없음
      });
      
      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch {
      setResponse(JSON.stringify({ error: '요청 중 오류가 발생했습니다.' }, null, 2));
    }
  };

  return (
    <div className="container">
      <h1>서버 사이드 요청 테스트</h1>
      <p>서버 사이드에서 API를 호출하여 쿠키를 설정합니다. NextJS API 라우트를 통해 요청합니다.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="key">쿠키 키</label>
          <input
            type="text"
            id="key"
            name="key"
            value={formData.key}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="value">쿠키 값</label>
          <input
            type="text"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="domain">도메인</label>
          <input
            type="text"
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="path">경로</label>
          <input
            type="text"
            id="path"
            name="path"
            value={formData.path}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="secure"
              checked={formData.secure}
              onChange={handleChange}
              style={{ width: 'auto', marginRight: '8px' }}
            />
            Secure (HTTPS 전용)
          </label>
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="httponly"
              checked={formData.httponly}
              onChange={handleChange}
              style={{ width: 'auto', marginRight: '8px' }}
            />
            HttpOnly (자바스크립트에서 접근 불가)
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="samesite">SameSite</label>
          <select
            id="samesite"
            name="samesite"
            value={formData.samesite}
            onChange={handleChange}
          >
            <option value="lax">Lax</option>
            <option value="strict">Strict</option>
            <option value="none">None</option>
          </select>
        </div>
        
        <button type="submit">쿠키 설정</button>
      </form>
      
      {response && (
        <div className="response">
          <h3>응답:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
} 