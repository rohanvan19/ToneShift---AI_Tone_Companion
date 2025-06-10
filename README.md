# ToneShift---AI_Tone_Companion
ToneShift is an AI-powered tool that helps you analyze, modify, and enhance audio tones with precision and creativity. Whether you're a musician, podcaster, content creator, or developer working with sound, ToneShift empowers you to achieve the perfect tone effortlessly.

Usage Instructions

Build and start the containers:
- docker-compose up -d

Initialize the database (first time only):
The database will be created automatically through the docker-compose
You can use the init-db.js script if needed
- docker-compose exec backend node init-db.js

Pull the Gemma model (first time only):
- docker-compose exec ollama ollama pull gemma3:4b

Access the API: The API will be available at http://localhost:5000

Stop the containers:
- docker-compose down

This setup containerizes your entire application stack, making it easy to deploy anywhere Docker is available.
