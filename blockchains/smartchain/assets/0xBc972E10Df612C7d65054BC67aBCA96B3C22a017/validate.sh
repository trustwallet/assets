#!/bin/bash

echo "🔍 Validando assets para Trust Wallet..."

# Verificar se info.json existe
if [ ! -f "info.json" ]; then
    echo "❌ info.json não encontrado"
    exit 1
fi

# Verificar se logo.png existe
if [ ! -f "logo.png" ]; then
    echo "❌ logo.png não encontrado"
    exit 1
fi

# Verificar formato do logo
file logo.png | grep -q "PNG image data"
if [ $? -ne 0 ]; then
    echo "❌ logo.png não é um arquivo PNG válido"
    exit 1
fi

# Verificar tamanho do logo (aproximado)
size=$(identify -format "%wx%h" logo.png 2>/dev/null)
if [ "$size" != "256x256" ]; then
    echo "⚠️ Logo não tem 256x256 pixels (atual: $size)"
fi

# Validar JSON
if ! jq empty info.json 2>/dev/null; then
    echo "❌ info.json não é um JSON válido"
    exit 1
fi

echo "✅ Validação concluída com sucesso!"
echo "📁 Diretório pronto para submissão ao Trust Wallet"
