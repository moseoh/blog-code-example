export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">로그 분석</h2>
        <p className="text-muted-foreground">
          애플리케이션 로그를 실시간으로 검색하고 분석합니다.
        </p>
      </div>

      <div className="border rounded-lg p-8 flex items-center justify-center h-64 bg-muted/20">
        <p className="text-muted-foreground">
          로그 데이터가 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
