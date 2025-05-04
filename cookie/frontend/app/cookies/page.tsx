'use client';

import { useState, useEffect } from 'react';

export default function CookiesView() {
  const [browserCookies, setBrowserCookies] = useState<string>('');
  const [frontendServerCookies, setFrontendServerCookies] = useState<string>('');
  const [backendServerCookies, setBackendServerCookies] = useState<string>('');
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [isLoadingFrontend, setIsLoadingFrontend] = useState(true);

  // 브라우저 쿠키 읽기
  useEffect(() => {
    refreshBrowserCookies();
  }, []);

  // 백엔드 서버에서 쿠키 읽기 (브라우저 요청 방식)
  useEffect(() => {
    fetchBackendCookies();
  }, []);

  // 프론트엔드 서버에서 쿠키 읽기 (서버 사이드 요청 방식)
  useEffect(() => {
    fetchFrontendCookies();
  }, []);

  // 브라우저에서 직접 쿠키 조회
  const refreshBrowserCookies = () => {
    setBrowserCookies(document.cookie);
  };

  // 브라우저에서 백엔드로 직접 요청하여 쿠키 조회
  const fetchBackendCookies = async () => {
    setIsLoadingBackend(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-cookies`, {
        credentials: 'include', // 중요: 쿠키를 포함하도록 설정
      });
      
      const data = await response.json();
      setBackendServerCookies(JSON.stringify(data, null, 2));
    } catch {
      setBackendServerCookies(JSON.stringify({ error: '백엔드 쿠키 조회 중 오류가 발생했습니다.' }, null, 2));
    } finally {
      setIsLoadingBackend(false);
    }
  };

  // 프론트엔드 서버를 통해 백엔드 쿠키 조회
  const fetchFrontendCookies = async () => {
    setIsLoadingFrontend(true);
    
    try {
      const response = await fetch('/api/get-cookies', {
        credentials: 'include',
      });
      
      const data = await response.json();
      setFrontendServerCookies(JSON.stringify(data, null, 2));
    } catch {
      setFrontendServerCookies(JSON.stringify({ error: '프론트엔드 서버 쿠키 조회 중 오류가 발생했습니다.' }, null, 2));
    } finally {
      setIsLoadingFrontend(false);
    }
  };

  return (
    <div className="container">
      <h1>쿠키 조회</h1>
      <p>현재 설정된 쿠키 정보를 확인합니다.</p>
      
      <div className="controller">
        <div className="button-group">
          <button onClick={refreshBrowserCookies}>
            브라우저 쿠키 새로고침
          </button>
          <button onClick={fetchBackendCookies} disabled={isLoadingBackend}>
            {isLoadingBackend ? '불러오는 중...' : '브라우저 요청으로 백엔드 쿠키 조회'}
          </button>
          <button onClick={fetchFrontendCookies} disabled={isLoadingFrontend}>
            {isLoadingFrontend ? '불러오는 중...' : '프론트 서버 요청으로 쿠키 조회'}
          </button>
        </div>
      </div>
      
      <div className="cookies-container">
        <div className="cookie-section">
          <h2>브라우저에서 조회한 쿠키</h2>
          <div className="response">
            <pre>{browserCookies || '브라우저 쿠키가 없습니다.'}</pre>
          </div>
        </div>
        
        <div className="cookie-section">
          <h2>프론트 서버에서 조회한 쿠키</h2>
          <div className="response">
            {isLoadingFrontend ? (
              <p>프론트 서버에서 쿠키를 불러오는 중...</p>
            ) : (
              <pre>{frontendServerCookies || '프론트 서버에서 조회한 쿠키가 없습니다.'}</pre>
            )}
          </div>
        </div>
        
        <div className="cookie-section">
          <h2>백엔드 서버에서 조회한 쿠키</h2>
          <div className="response">
            {isLoadingBackend ? (
              <p>백엔드 서버에서 쿠키를 불러오는 중...</p>
            ) : (
              <pre>{backendServerCookies || '백엔드 서버에서 조회한 쿠키가 없습니다.'}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 