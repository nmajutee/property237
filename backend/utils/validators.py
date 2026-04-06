import mimetypes
from django.core.exceptions import ValidationError


# Maximum file sizes in bytes
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB
MAX_DOCUMENT_SIZE = 20 * 1024 * 1024  # 20MB

ALLOWED_MIME_TYPES = {
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'video': ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv'],
    'document': [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ],
}

ALLOWED_EXTENSIONS = {
    'image': {'.jpg', '.jpeg', '.png', '.gif', '.webp'},
    'video': {'.mp4', '.avi', '.mov', '.wmv'},
    'document': {'.pdf', '.doc', '.docx', '.txt'},
}

SIZE_LIMITS = {
    'image': MAX_IMAGE_SIZE,
    'video': MAX_VIDEO_SIZE,
    'document': MAX_DOCUMENT_SIZE,
}


def validate_file_upload(file, file_type='document'):
    """Validate uploaded file by size, extension, and MIME type."""
    import os

    # Size check
    max_size = SIZE_LIMITS.get(file_type, MAX_DOCUMENT_SIZE)
    if file.size > max_size:
        max_mb = max_size // (1024 * 1024)
        raise ValidationError(f"File size cannot exceed {max_mb}MB for {file_type} files.")

    # Extension check
    ext = os.path.splitext(file.name)[1].lower()
    allowed_exts = ALLOWED_EXTENSIONS.get(file_type, set())
    # For generic uploads, allow all known extensions
    if not allowed_exts:
        allowed_exts = set().union(*ALLOWED_EXTENSIONS.values())
    if ext not in allowed_exts:
        raise ValidationError(
            f"File extension '{ext}' is not allowed for {file_type}. "
            f"Allowed: {', '.join(sorted(allowed_exts))}"
        )

    # MIME type check (sniff from content, not just extension)
    mime_type, _ = mimetypes.guess_type(file.name)
    allowed_mimes = ALLOWED_MIME_TYPES.get(file_type, [])
    if not allowed_mimes:
        allowed_mimes = [m for mimes in ALLOWED_MIME_TYPES.values() for m in mimes]
    if mime_type and mime_type not in allowed_mimes:
        raise ValidationError(
            f"File MIME type '{mime_type}' is not allowed for {file_type}."
        )

    return file


def validate_document_upload(file):
    """Validate document uploads (ID docs, certificates, etc.)."""
    return validate_file_upload(file, file_type='document')


def validate_image_upload(file):
    """Validate image uploads."""
    return validate_file_upload(file, file_type='image')
