#!/bin/sh
set -e

# Start rpcbind. The -w flag tells it not to exit on configuration errors.
echo "Starting rpcbind..."
rpcbind -w

# It is important that rpcbind is running before starting NFS services.
# A short sleep gives it a moment to initialize properly.
sleep 1

# Start NFS services. In Alpine/sh, these daemonize by default.
echo "Starting NFS services..."
rpc.nfsd
rpc.mountd
# rpc.statd is often started automatically with nfsd, but starting it explicitly is safer.
rpc.statd

# Export the shares according to /etc/exports
echo "Exporting shares..."
exportfs -ra

# Keep the container running in the foreground.
echo "NFS server is running. Press Ctrl+C to stop."
tail -f /dev/null
