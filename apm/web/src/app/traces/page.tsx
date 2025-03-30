export default function TracesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">트레이스 추적</h2>
        <p className="text-muted-foreground">
          요청 흐름을 추적하고 병목 현상을 식별합니다.
        </p>
      </div>

      <div className="border rounded-lg p-8 flex items-center justify-center h-64 bg-muted/20">
        <p className="text-muted-foreground">
          트레이스 데이터가 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
