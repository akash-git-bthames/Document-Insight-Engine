from pydantic import BaseModel
from typing import Optional

class DocumentUpload(BaseModel):
    filename: str
    file_type: str

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    s3_url: str
    parsed_content: Optional[str]
     