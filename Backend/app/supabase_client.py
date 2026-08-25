"""Supabase client initialization.

This module provides a singleton ``supabase`` client that can be imported
by other parts of the application. It reads the ``SUPABASE_URL`` and
``SUPABASE_KEY`` environment variables from the ``.env`` file using
``python-dotenv``.

The client is created lazily on first import to avoid unnecessary network
activity during module import.  The ``get_client`` function returns the
client instance.
"""

from __future__ import annotations

import os
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client

# Load environment variables from .env in the project root.
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

_client: Optional[object] = None
_service_client: Optional[object] = None

def get_client() -> object:
    """Return a singleton Supabase client.

    The function lazily creates the client on first call and caches it in the
    module-level ``_client`` variable.
    """
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
        _client = create_client(url, key)
    return _client

def get_service_client() -> object:
    """Return a singleton Supabase client using the secret/service_role key.

    Bypasses RLS — only use for trusted backend-internal operations.
    """
    global _service_client
    if _service_client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
        _service_client = create_client(url, key)
    return _service_client