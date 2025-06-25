FROM alpine:latest

# Install NFS server and required packages
RUN apk update && \
    apk --no-cache add \
        nfs-utils \
        rpcbind \
        bash && \
    rm -rf /var/cache/apk/*

# Create NFS export directory with proper permissions
RUN mkdir -p /nfs_share && \
    chmod 755 /nfs_share && \
    chown nobody:nobody /nfs_share

# Create required directories for NFS services
RUN mkdir -p /var/lib/nfs/rpc_pipefs && \
    mkdir -p /var/lib/nfs/v4recovery && \
    mkdir -p /var/lib/nfs/statd && \
    mkdir -p /run/rpcbind

# Copy configuration files
COPY exports.txt /etc/exports
COPY entrypoint.sh /entrypoint.sh

# Make entrypoint executable
RUN chmod +x /entrypoint.sh

# Expose NFS and RPC ports
EXPOSE 111/tcp 111/udp 2049/tcp 2049/udp
EXPOSE 32765-32767/tcp 32765-32767/udp

# Set volume for persistent data
VOLUME ["/nfs_share"]

# Use entrypoint script
ENTRYPOINT ["/entrypoint.sh"]