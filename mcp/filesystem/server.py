from typing import Any, List, Dict, Optional
import os
import json
import asyncio
from pathlib import Path
from dataclasses import dataclass
from mcp.server.fastmcp import FastMCP
import PyPDF2

# Initialize FastMCP server
mcp = FastMCP("filesystem")

# Global variables
allowed_directories: List[str] = []

def validate_path(file_path: str) -> str:
    """Validate if the given path is within allowed directories."""
    abs_path = os.path.abspath(file_path)
    
    for allowed_dir in allowed_directories:
        if os.path.commonpath([abs_path, allowed_dir]) == allowed_dir:
            return abs_path
    
    raise ValueError(f"Access denied: {file_path} is not in allowed directories")

async def get_file_stats(file_path: str) -> Dict[str, Any]:
    """Get file statistics."""
    stats = os.stat(file_path)
    return {
        "size": stats.st_size,
        "created": stats.st_ctime,
        "modified": stats.st_mtime,
        "permissions": oct(stats.st_mode)[-3:],
        "type": "directory" if os.path.isdir(file_path) else "file"
    }

async def search_files(directory: str, pattern: str, exclude_patterns: Optional[List[str]] = None) -> List[str]:
    """Search for files matching the pattern in the directory."""
    results = []
    exclude_patterns = exclude_patterns or []
    
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Skip excluded patterns
            if any(os.path.fnmatch.fnmatch(file_path, pat) for pat in exclude_patterns):
                continue
                
            if os.path.fnmatch.fnmatch(file_path, pattern):
                results.append(file_path)
    
    return results

def extract_text_from_pdf(pdf_file) -> str:
    """Extract text content from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Failed to extract text from PDF: {str(e)}")
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")

@mcp.tool()
async def read_local_pdf(path: str) -> Dict[str, Any]:
    """Read text content from a local PDF file."""
    try:
        with open(path, 'rb') as file:
            text = extract_text_from_pdf(file)
            return {
                "success": True,
                "data": {
                    "text": text
                }
            }
    except FileNotFoundError:
        print(f"PDF file not found: {path}")
        return {
            "success": False,
            "error": f"PDF file not found: {path}"
        }
    except Exception as e:
        print(str(e))
        return {
            "success": False,
            "error": str(e)
        }

@mcp.tool()
async def read_file(path: str) -> str:
    """Read contents of a file.
    
    Args:
        path: Path to the file to read
    """
    valid_path = validate_path(path)
    try:
        with open(valid_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

@mcp.tool()
async def write_file(path: str, content: str) -> str:
    """Write content to a file.
    
    Args:
        path: Path to the file to write
        content: Content to write to the file
    """
    valid_path = validate_path(path)
    try:
        with open(valid_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return f"Successfully wrote to {path}"
    except Exception as e:
        return f"Error writing file: {str(e)}"

@mcp.tool()
async def list_directory(path: str) -> str:
    """List contents of a directory.
    
    Args:
        path: Path to the directory to list
    """
    valid_path = validate_path(path)
    try:
        entries = []
        with os.scandir(valid_path) as it:
            for entry in it:
                entry_type = "[DIR]" if entry.is_dir() else "[FILE]"
                entries.append(f"{entry_type} {entry.name}")
        return "\n".join(entries)
    except Exception as e:
        return f"Error listing directory: {str(e)}"

@mcp.tool()
async def create_directory(path: str) -> str:
    """Create a new directory.
    
    Args:
        path: Path to the directory to create
    """
    valid_path = validate_path(path)
    try:
        os.makedirs(valid_path, exist_ok=True)
        return f"Successfully created directory {path}"
    except Exception as e:
        return f"Error creating directory: {str(e)}"

@mcp.tool()
async def move_file(source: str, destination: str) -> str:
    """Move a file from source to destination.
    
    Args:
        source: Source file path
        destination: Destination file path
    """
    valid_source = validate_path(source)
    valid_dest = validate_path(destination)
    try:
        os.rename(valid_source, valid_dest)
        return f"Successfully moved {source} to {destination}"
    except Exception as e:
        return f"Error moving file: {str(e)}"

@mcp.tool()
async def get_file_info(path: str) -> str:
    """Get information about a file.
    
    Args:
        path: Path to the file
    """
    valid_path = validate_path(path)
    try:
        info = await get_file_stats(valid_path)
        return "\n".join(f"{key}: {value}" for key, value in info.items())
    except Exception as e:
        return f"Error getting file info: {str(e)}"

@mcp.tool()
async def list_allowed_directories() -> str:
    """List all allowed directories."""
    return "Allowed directories:\n" + "\n".join(allowed_directories)

if __name__ == "__main__":
    # Get allowed directories from command line arguments
    import sys
    if len(sys.argv) < 2:
        print("Usage: python server.py <allowed-directory> [additional-directories...]")
        sys.exit(1)
        
    allowed_directories = [os.path.abspath(dir_path) for dir_path in sys.argv[1:]]
    
    # Initialize and run the server
    mcp.run(transport='stdio')
