# Multi-stage build for MemoryVerse AI with MusicGen support
# Includes Node.js + Python + MusicGen

# ============================================
# Stage 1: Base with Python and Node.js
# ============================================
FROM node:20-bookworm AS base

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Stage 2: Install Node.js dependencies
# ============================================
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY patches ./patches
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# ============================================
# Stage 3: Install Python dependencies (MusicGen)
# ============================================
FROM base AS python-deps
WORKDIR /app

# Create virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install PyTorch CPU (lighter, no GPU needed)
RUN pip3 install --no-cache-dir \
    torch torchvision torchaudio \
    --index-url https://download.pytorch.org/whl/cpu

# Install AudioCraft (MusicGen)
RUN pip3 install --no-cache-dir audiocraft

# Pre-download MusicGen model to avoid download during runtime
RUN python3 -c "from audiocraft.models import MusicGen; MusicGen.get_pretrained('small')"

# ============================================
# Stage 4: Build application
# ============================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the project
RUN npm run build

# ============================================
# Stage 5: Production runtime
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PATH="/opt/venv/bin:$PATH"

# Copy Python virtual environment
COPY --from=python-deps /opt/venv /opt/venv

# Copy Node.js application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Copy Python scripts
COPY --from=builder /app/server/scripts ./server/scripts

# Create uploads directory
RUN mkdir -p /app/uploads/{videos,music,images,podcasts,thumbnails,temp}

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nodejs

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "run", "start"]
