# M365 AgentOps Backend - PowerShell 7 + Node.js
# Supports: Exchange Online, Microsoft Graph, Teams, SharePoint, Intune, etc.

FROM mcr.microsoft.com/powershell:7.5-ubuntu-24.04

LABEL maintainer="M365 AgentOps"
LABEL description="M365 Tenant Guard with PowerShell 7 + Node.js backend"

# Install Node.js 20.x (LTS)
RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    unzip \
    ca-certificates \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Microsoft 365 PowerShell modules
RUN pwsh -Command \
    "Set-PSRepository PSGallery -InstallationPolicy Trusted; \
    Install-Module ExchangeOnlineManagement -Scope AllUsers -Force -AcceptLicense; \
    Install-Module Microsoft.Graph -Scope AllUsers -Force -AcceptLicense; \
    Install-Module MicrosoftTeams -Scope AllUsers -Force -AcceptLicense; \
    Install-Module PnP.PowerShell -Scope AllUsers -Force -AcceptLicense; \
    Install-Module Microsoft.Online.SharePoint.PowerShell -Scope AllUsers -Force -AcceptLicense"

# Verify installations
RUN pwsh -Command \
    "Write-Host 'PowerShell Version:' (Get-Host).Version; \
    Write-Host 'Exchange Online Module:' (Get-Module ExchangeOnlineManagement -ListAvailable).Version; \
    Write-Host 'Microsoft Graph Module:' (Get-Module Microsoft.Graph -ListAvailable).Version"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application code (includes data directory)
COPY . .

# Create non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start Node.js backend
CMD ["node", "server.js"]
