#! /usr/bin/make -f

# Project variables.
VERSION := $(shell git describe --tags 2>/dev/null || git describe --all)
BUILD := $(shell git rev-parse --short HEAD)
PROJECT_NAME := $(shell basename "$(PWD)")
BUILD_TARGETS := $(shell find cmd -name \*main.go | awk -F'/' '{print $$0}')

# Use linker flags to provide version/build settings
LDFLAGS=-ldflags "-X=main.Version=$(VERSION) -X=main.Build=$(BUILD)"

# Make is verbose in Linux. Make it silent.
MAKEFLAGS += --silent

# Go files.
GOFMT_FILES?=$$(find . -name '*.go' | grep -v vendor)

# Common commands.
all: fmt lint test

build:
	@echo "  >  Building main.go to bin/assets"
	go build $(LDFLAGS) -o bin/assets ./cmd

test:
	@echo "  >  Running unit tests"
	go test -cover -race -coverprofile=coverage.txt -covermode=atomic -v ./...

fmt:
	@echo "  >  Format all go files"
	gofmt -w ${GOFMT_FILES}

lint-install:
ifeq (,$(wildcard test -f bin/golangci-lint))
	@echo "  >  Installing golint"
	curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- v1.50.1
endif

lint: lint-install
	@echo "  >  Running golint"
	bin/golangci-lint run --timeout=2m

# Assets commands.
check: build
	bin/assets check

fix: build
	bin/assets fix

update-auto: build
	bin/assets update-auto

# Helper commands.
add-token: build
	bin/assets add-token $(asset_id)

add-tokenlist: build
	bin/assets add-tokenlist $(asset_id)

add-tokenlist-extended: build
	bin/assets add-tokenlist-extended $(asset_id)
