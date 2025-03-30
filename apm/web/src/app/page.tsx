import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">대시보드</h2>
        <p className="text-muted-foreground">
          애플리케이션 성능 모니터링 대시보드에 오신 것을 환영합니다
        </p>
      </div>

      {/* 주요 메트릭 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center p-6">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  평균 응답 시간
                </p>
                <p className="text-2xl font-semibold">235ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center p-6">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  성공한 요청
                </p>
                <p className="text-2xl font-semibold">98.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center p-6">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  오류
                </p>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 둘러보기 섹션 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">둘러보기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 카드 1 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <CardTitle>로그 분석</CardTitle>
              <CardDescription>
                애플리케이션 로그를 실시간으로 검색하고 분석합니다.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/logs">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 카드 2 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle>트레이스 추적</CardTitle>
              <CardDescription>
                요청 흐름을 추적하고 병목 현상을 식별합니다.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/traces">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 카드 3 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <CardTitle>메트릭 대시보드</CardTitle>
              <CardDescription>
                핵심 성능 지표를 시각화하고 모니터링합니다.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/metrics">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 둘러보기 섹션 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">둘러보기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 카드 1 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <CardTitle>로그 분석</CardTitle>
              <CardDescription>
                애플리케이션 로그를 실시간으로 검색하고 분석합니다.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/logs">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 카드 2 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle>트레이스 추적</CardTitle>
              <CardDescription>
                요청 흐름을 추적하고 병목 현상을 식별합니다.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/traces">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 카드 3 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <CardTitle>메트릭 대시보드</CardTitle>
              <CardDescription>
                핵심 성능 지표를 시각화하고 모니터링합니다.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/metrics">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 둘러보기 섹션 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">둘러보기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 카드 1 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <CardTitle>로그 분석</CardTitle>
              <CardDescription>
                애플리케이션 로그를 실시간으로 검색하고 분석합니다.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/logs">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 카드 2 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle>트레이스 추적</CardTitle>
              <CardDescription>
                요청 흐름을 추적하고 병목 현상을 식별합니다.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/traces">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 카드 3 */}
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <CardTitle>메트릭 대시보드</CardTitle>
              <CardDescription>
                핵심 성능 지표를 시각화하고 모니터링합니다.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/metrics">바로가기</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 도움말 및 리소스 섹션 */}
      <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
        <CardHeader>
          <CardTitle>도움말 및 리소스</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="bg-card justify-start">
              <Link href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                문서
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-card justify-start">
              <Link href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                FAQ
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-card justify-start">
              <Link href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
                지원
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
