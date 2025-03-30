export default function MetricsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">메트릭 대시보드</h2>
        <p className="text-muted-foreground">
          핵심 성능 지표를 시각화하고 모니터링합니다.
        </p>
      </div>

      <div className="border rounded-lg p-8 flex items-center justify-center h-64 bg-muted/20">
        <p className="text-muted-foreground">
          메트릭 차트가 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
