FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    git \
    unzip \
    python3 \
    python3-pip \
    curl \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

# Install Amass
RUN wget https://github.com/owasp-amass/amass/releases/download/v4.2.0/amass_Linux_amd64.zip \
    && unzip amass_Linux_amd64.zip \
    && mv amass_Linux_amd64/amass /usr/local/bin/ \
    && rm -rf amass_Linux_amd64*

# Install Python dependencies
RUN pip3 install --no-cache-dir requests python-whois

# Verify installations
RUN python3 --version

# Set working directory
WORKDIR /app

CMD ["tail", "-f", "/dev/null"]