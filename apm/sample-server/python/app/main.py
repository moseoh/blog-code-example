from fastapi import FastAPI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.semconv.resource import ResourceAttributes
import os
import grpc

# OpenTelemetry 설정
resource = Resource.create({
    ResourceAttributes.SERVICE_NAME: "sample-python-server",
})

# TracerProvider 설정
tracer = TracerProvider(resource=resource)
trace.set_tracer_provider(tracer)

# OTLP exporter 설정
otlp_endpoint = os.getenv("OTEL_ENDPOINT", "http://localhost:4317")
credentials = grpc.ChannelCredentials(None)  # insecure channel
options = [
    ("grpc.keepalive_time_ms", 30000),  # 30 seconds
    ("grpc.keepalive_timeout_ms", 5000),  # 5 seconds
]

otlp_exporter = OTLPSpanExporter(
    endpoint=otlp_endpoint,
    credentials=credentials,
    channel_options=options
)

# BatchSpanProcessor 설정 최적화
processor = BatchSpanProcessor(
    otlp_exporter,
    max_export_batch_size=512,
    schedule_delay_millis=5000
)
tracer.add_span_processor(processor)

from app.routers import board

app = FastAPI()

app.include_router(board.router)

FastAPIInstrumentor.instrument_app(app)

@app.get("/")
def read_root():
    return {"message": "Sample FastAPI server is running"} 