FROM golang:1.24-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /bin/brtserver ./cmd/brtserver

FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=builder /bin/brtserver /app/brtserver
COPY internal/brtserver/data/latest.json /app/state.json
ENV LISTEN_ADDR=:8080
ENV DATA_PATH=/app/state.json
ENV RELOAD_INTERVAL=30s
EXPOSE 8080
ENTRYPOINT ["/app/brtserver"]
