#!/bin/bash

# Script para construir y subir la imagen Docker a Docker Hub
# Uso: ./build-and-push.sh <username>

if [ -z "$1" ]; then
    echo "Uso: ./build-and-push.sh <docker-hub-username>"
    exit 1
fi

DOCKER_USERNAME=$1
IMAGE_NAME="petcare-backend"
TAG="latest"

echo "🐳 Construyendo imagen Docker..."
docker build -f Dockerfile -t $DOCKER_USERNAME/$IMAGE_NAME:$TAG -t $DOCKER_USERNAME/$IMAGE_NAME:v1.0.0 .

if [ $? -eq 0 ]; then
    echo "✅ Imagen construida exitosamente"
    echo ""
    echo "📤 Subiendo imagen a Docker Hub..."
    echo "Por favor, asegúrate de haber ejecutado: docker login"
    echo ""
    docker push $DOCKER_USERNAME/$IMAGE_NAME:$TAG
    docker push $DOCKER_USERNAME/$IMAGE_NAME:v1.0.0
    
    if [ $? -eq 0 ]; then
        echo "✅ Imagen subida exitosamente a Docker Hub"
        echo ""
        echo "🚀 Imagen disponible en:"
        echo "   - $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
        echo "   - $DOCKER_USERNAME/$IMAGE_NAME:v1.0.0"
        echo ""
        echo "📝 Usa esta URL de imagen en Render:"
        echo "   $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
    else
        echo "❌ Error al subir la imagen"
        exit 1
    fi
else
    echo "❌ Error al construir la imagen"
    exit 1
fi
