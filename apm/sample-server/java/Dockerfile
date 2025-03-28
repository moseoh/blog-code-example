FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test

FROM amazoncorretto:17-alpine

WORKDIR /app
# Download OpenTelemetry Java agent
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v1.32.1/opentelemetry-javaagent.jar .
COPY --from=build /app/build/libs/*.jar app.jar

ARG OTEL_ENDPOINT
ENV OTEL_ENDPOINT=${OTEL_ENDPOINT:-http://apm-otel-collector:4317}

ENV JAVA_TOOL_OPTIONS="-javaagent:/app/opentelemetry-javaagent.jar \
    -Dotel.service.name=sample-java-service \
    -Dotel.traces.exporter=otlp \
    -Dotel.metrics.exporter=none \
    -Dotel.logs.exporter=none \
    -Dotel.exporter.otlp.endpoint=${OTEL_ENDPOINT}"

ENTRYPOINT ["java", "-jar", "app.jar"]