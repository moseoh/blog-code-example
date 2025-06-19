FROM alpine:latest

# Install NFS server and dependencies
RUN apk update && \
    apk --no-cache add nfs-utils

# Create the directory to be exported
RUN mkdir -p /nfs_share && \
    chmod 777 /nfs_share

# Expose NFS ports
EXPOSE 111/tcp 111/udp
EXPOSE 2049/tcp 2049/udp
EXPOSE 32765/tcp 32765/udp
EXPOSE 32766/tcp 32766/udp
EXPOSE 32767/tcp 32767/udp

# Entrypoint script to start services
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Start the services
ENTRYPOINT ["/entrypoint.sh"]
