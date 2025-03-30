export default function MorePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">더보기</h2>
        <p className="text-muted-foreground">추가 기능 및 설정에 접근합니다.</p>
      </div>

      <div className="border rounded-lg p-8 flex items-center justify-center h-64 bg-muted/20">
        <p className="text-muted-foreground">추가 기능이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}
